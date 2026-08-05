from django.contrib import admin
from .models import NewsletterSubscriber


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'subscribed_at', 'is_active', 'is_trial_active', 'has_upgraded']
    list_filter = ['is_active', 'has_upgraded', 'subscribed_at']
    search_fields = ['email']
    readonly_fields = ['subscribed_at']
    actions = [
        'resend_newsletter_update',
        'send_new_publication_alert',
        'send_20_percent_offer',
        'send_plan_upgrade_reminder'
    ]
    
    def is_trial_active(self, obj):
        return obj.is_trial_active()
    is_trial_active.short_description = 'Trial Active'
    is_trial_active.boolean = True

    @admin.action(description="📢 Send Newsletter Welcome Digest (Selected)")
    def resend_newsletter_update(self, request, queryset):
        from .views import NewsletterSubscribeView
        view = NewsletterSubscribeView()
        count = sum(1 for sub in queryset if sub.email and sub.is_active and not view.send_welcome_email(sub.email))
        self.message_user(request, f"Successfully sent welcome digest to {queryset.count()} subscriber(s)!")

    @admin.action(description="✨ Send New Publications Announcement (Selected)")
    def send_new_publication_alert(self, request, queryset):
        from .views import NewsletterSubscribeView
        view = NewsletterSubscribeView()
        for sub in queryset:
            if sub.email and sub.is_active:
                view.send_new_publication_broadcast(sub.email)
        self.message_user(request, f"Successfully sent New Publication Announcement to {queryset.count()} subscriber(s)!")

    @admin.action(description="🔥 Send 20%% OFF Special Offer (Selected)")
    def send_20_percent_offer(self, request, queryset):
        from .views import NewsletterSubscribeView
        view = NewsletterSubscribeView()
        for sub in queryset:
            if sub.email and sub.is_active:
                view.send_plan_offer_broadcast(sub.email)
        self.message_user(request, f"Successfully sent 20%% OFF Special Offer to {queryset.count()} subscriber(s)!")

    @admin.action(description="🚀 Send Plan Upgrade Reminder (Selected)")
    def send_plan_upgrade_reminder(self, request, queryset):
        from .views import NewsletterSubscribeView
        view = NewsletterSubscribeView()
        for sub in queryset:
            if sub.email and sub.is_active:
                view.send_upgrade_reminder_broadcast(sub.email)
        self.message_user(request, f"Successfully sent Plan Upgrade Reminder to {queryset.count()} subscriber(s)!")
