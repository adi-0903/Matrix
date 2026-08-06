from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Follow
from .emails import send_plan_activation_email


from django.utils import timezone
from django.utils.html import format_html
from django.urls import reverse, path
from django.http import HttpResponseRedirect
from datetime import timedelta

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        'uid', 'email', 'username', 'subscription_plan', 'quick_activate',
        'subscription_start_date', 'subscription_end_date',
        'is_staff', 'created_at'
    ]
    list_filter = ['subscription_plan', 'is_staff', 'is_superuser', 'is_active', 'created_at']
    search_fields = ['uid', 'email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    actions = [
        'activate_creator_30_days',
        'activate_studio_30_days',
        'activate_enterprise_30_days',
        'deactivate_subscription'
    ]
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Unique Identifier', {
            'fields': ('uid',)
        }),
        ('Subscription Info', {
            'fields': ('subscription_plan', 'subscription_start_date', 'subscription_end_date')
        }),
        ('Additional Info', {
            'fields': ('bio', 'avatar', 'location', 'website', 'twitter', 'github', 
                      'followers_count', 'following_count')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('email', 'bio', 'avatar')
        }),
    )

    def quick_activate(self, obj):
        creator_url = reverse('admin:activate_user_plan_days', args=[obj.pk, 'creator', 30])
        studio_url = reverse('admin:activate_user_plan_days', args=[obj.pk, 'studio', 30])
        custom_url = reverse('admin:activate_user_plan_custom', args=[obj.pk])
        reset_url = reverse('admin:activate_user_plan_days', args=[obj.pk, 'free', 0])

        return format_html(
            '<div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">'
            '<a class="button" style="background:#28a745; color:white; padding:4px 8px; border-radius:4px; font-size:11px; text-decoration:none; font-weight:600;" href="{}">⚡ Creator (1m)</a>'
            '<a class="button" style="background:#007bff; color:white; padding:4px 8px; border-radius:4px; font-size:11px; text-decoration:none; font-weight:600;" href="{}">🚀 Studio (1m)</a>'
            '<form method="GET" action="{}" style="display:inline-flex; align-items:center; gap:4px; margin:0; padding:2px 6px; background:rgba(111, 66, 193, 0.15); border:1px solid rgba(111, 66, 193, 0.4); border-radius:4px;">'
            '<input type="hidden" name="plan" value="enterprise" />'
            '<span style="font-size:11px; color:#e0cffc; font-weight:600;">👑 Ent:</span>'
            '<input type="number" name="months" value="1" min="1" max="60" style="width:42px; padding:2px 4px; font-size:11px; border-radius:3px; border:1px solid #6f42c1; background:#120c1f; color:#fff; text-align:center; font-weight:bold;" />'
            '<span style="font-size:11px; color:#e0cffc;">mo</span>'
            '<button type="submit" style="background:#6f42c1; color:white; padding:3px 8px; border:none; border-radius:3px; font-size:11px; cursor:pointer; font-weight:600;">Activate</button>'
            '</form>'
            '<a class="button" style="background:#6c757d; color:white; padding:4px 8px; border-radius:4px; font-size:11px; text-decoration:none;" href="{}">❌ Reset</a>'
            '</div>',
            creator_url, studio_url, custom_url, reset_url
        )
    quick_activate.short_description = 'Direct Activation Buttons'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:user_id>/activate/<str:plan>/',
                self.admin_site.admin_view(self.process_activate_plan),
                name='activate_user_plan',
            ),
            path(
                '<int:user_id>/activate/<str:plan>/<int:days>/',
                self.admin_site.admin_view(self.process_activate_plan),
                name='activate_user_plan_days',
            ),
            path(
                '<int:user_id>/activate_custom/',
                self.admin_site.admin_view(self.process_activate_custom),
                name='activate_user_plan_custom',
            ),
        ]
        return custom_urls + urls

    def process_activate_custom(self, request, user_id):
        user = self.get_object(request, user_id)
        plan = request.GET.get('plan', 'enterprise')
        try:
            months = int(request.GET.get('months', 1))
        except ValueError:
            months = 1
        
        if user:
            now = timezone.now()
            days = months * 30
            user.subscription_plan = plan
            user.subscription_start_date = now
            user.subscription_end_date = now + timedelta(days=days)
            user.save()
            send_plan_activation_email(user, plan, days)
            self.message_user(request, f"Activated {plan.title()} plan for {user.email} for {months} month(s) ({days} days) & sent email!")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', reverse('admin:accounts_user_changelist')))

    def process_activate_plan(self, request, user_id, plan, days=30):
        user = self.get_object(request, user_id)
        if user:
            now = timezone.now()
            if plan == 'free':
                user.subscription_plan = 'free'
                user.subscription_start_date = None
                user.subscription_end_date = None
            else:
                user.subscription_plan = plan
                user.subscription_start_date = now
                user.subscription_end_date = now + timedelta(days=days)
                send_plan_activation_email(user, plan, days)
            user.save()
            self.message_user(request, f"Activated {plan.title()} plan ({days} days) for {user.email} & sent email!")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', reverse('admin:accounts_user_changelist')))

    @admin.action(description="⚡ Activate Creator Plan (30 Days)")
    def activate_creator_30_days(self, request, queryset):
        now = timezone.now()
        count = 0
        for user in queryset:
            user.subscription_plan = 'creator'
            user.subscription_start_date = now
            user.subscription_end_date = now + timedelta(days=30)
            user.save()
            send_plan_activation_email(user, 'creator', 30)
            count += 1
        self.message_user(request, f"Successfully activated Creator plan for {count} user(s).")

    @admin.action(description="🚀 Activate Studio Plan (30 Days)")
    def activate_studio_30_days(self, request, queryset):
        now = timezone.now()
        count = 0
        for user in queryset:
            user.subscription_plan = 'studio'
            user.subscription_start_date = now
            user.subscription_end_date = now + timedelta(days=30)
            user.save()
            send_plan_activation_email(user, 'studio', 30)
            count += 1
        self.message_user(request, f"Successfully activated Studio plan for {count} user(s).")

    @admin.action(description="👑 Activate Enterprise Plan (30 Days)")
    def activate_enterprise_30_days(self, request, queryset):
        now = timezone.now()
        count = 0
        for user in queryset:
            user.subscription_plan = 'enterprise'
            user.subscription_start_date = now
            user.subscription_end_date = now + timedelta(days=30)
            user.save()
            send_plan_activation_email(user, 'enterprise', 30)
            count += 1
        self.message_user(request, f"Successfully activated Enterprise plan for {count} user(s).")

    @admin.action(description="❌ Reset / Deactivate to Free Plan")
    def deactivate_subscription(self, request, queryset):
        updated = queryset.update(
            subscription_plan='free',
            subscription_start_date=None,
            subscription_end_date=None
        )
        self.message_user(request, f"Reset subscription to Free for {updated} user(s).")


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ['follower', 'following', 'created_at']
    list_filter = ['created_at']
    search_fields = ['follower__username', 'following__username']
    ordering = ['-created_at']
