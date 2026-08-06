import threading
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

from .models import NewsletterSubscriber
from .serializers import NewsletterSubscribeSerializer, NewsletterSubscriberSerializer


class NewsletterSubscribeView(APIView):
    """Subscribe to newsletter"""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = NewsletterSubscribeSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Check if already subscribed
            subscriber, created = NewsletterSubscriber.objects.get_or_create(
                email=email,
                defaults={'is_active': True}
            )
            
            if not created and subscriber.is_active:
                threading.Thread(target=self.send_welcome_email, args=(email,), daemon=True).start()
                return Response(
                    {
                        'message': 'Welcome email resent! Check your inbox.',
                        'subscriber': NewsletterSubscriberSerializer(subscriber).data
                    },
                    status=status.HTTP_200_OK
                )
            
            # Reactivate if was inactive
            if not subscriber.is_active:
                subscriber.is_active = True
                subscriber.save()
            
            # Set 24-day trial period
            subscriber.set_trial_period(24)
            
            # Send welcome email (non-blocking)
            threading.Thread(target=self.send_welcome_email, args=(email,), daemon=True).start()
            
            return Response(
                {
                    'message': 'Successfully subscribed to newsletter',
                    'subscriber': NewsletterSubscriberSerializer(subscriber).data
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def send_welcome_email(self, email):
        """Send welcome email with premium Mind Matrix HTML template"""
        
        subject = 'Welcome to Mind Matrix Digest ✦'
        
        upgrade_url = f"{settings.FRONTEND_URL}/pricing"
        explore_url = f"{settings.FRONTEND_URL}/creators"
        
        try:
            # Premium Dark Glassmorphism HTML Email Template
            html_message = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Mind Matrix</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #060608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #060608; padding: 40px 10px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #0d0d14; border: 1px solid rgba(200, 181, 255, 0.2); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
                                
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 36px 32px 24px 32px; background: linear-gradient(135deg, rgba(106, 233, 193, 0.1), rgba(200, 181, 255, 0.1)); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                                        <div style="display: inline-block; padding: 6px 16px; border-radius: 20px; background: rgba(106, 233, 193, 0.15); color: #67e5d4; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 12px; text-transform: uppercase;">
                                            ✦ Official Transmission
                                        </div>
                                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #ffffff 30%, #c8b5ff); -webkit-background-clip: text; color: #ffffff;">
                                            Mind Matrix
                                        </h1>
                                        <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">
                                            Built for writers who choreograph feelings with every paragraph.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding: 32px;">
                                        <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #67e5d4; font-weight: 700;">
                                            Welcome to the Matrix! 🎉
                                        </h2>
                                        <p style="margin: 0 0 20px 0; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                                            Hello <strong style="color: #ffffff;">{email}</strong>,<br/>
                                            Thank you for subscribing to the Mind Matrix Newsletter. You're now part of a creative network of writers, thinkers, and digital creators.
                                        </p>

                                        <!-- Feature Box -->
                                        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; margin-bottom: 28px;">
                                            <h3 style="margin: 0 0 14px 0; font-size: 15px; color: #c8b5ff; text-transform: uppercase; letter-spacing: 0.5px;">What you can do next:</h3>
                                            
                                            <div style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                                                <span style="font-size: 18px; margin-right: 10px;">✍️</span>
                                                <div>
                                                    <strong style="color: #ffffff; font-size: 14px;">Craft & Publish:</strong>
                                                    <div style="color: #94a3b8; font-size: 13px;">Write blogs, journals, and series using our markdown & AI tools.</div>
                                                </div>
                                            </div>

                                            <div style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                                                <span style="font-size: 18px; margin-right: 10px;">🆔</span>
                                                <div>
                                                    <strong style="color: #ffffff; font-size: 14px;">Unique UIDs:</strong>
                                                    <div style="color: #94a3b8; font-size: 13px;">Find and follow your favorite creators using unique creator UIDs.</div>
                                                </div>
                                            </div>

                                            <div style="display: flex; align-items: flex-start;">
                                                <span style="font-size: 18px; margin-right: 10px;">🚀</span>
                                                <div>
                                                    <strong style="color: #ffffff; font-size: 14px;">Flexible Creator Plans:</strong>
                                                    <div style="color: #94a3b8; font-size: 13px;">Choose Creator ($9/mo), Studio ($19/mo), or Enterprise ($39/mo).</div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- CTA Button -->
                                        <div style="text-align: center; margin: 32px 0 24px 0;">
                                            <a href="{explore_url}" style="display: inline-block; padding: 14px 32px; border-radius: 12px; background: linear-gradient(135deg, #67e5d4, #c8b5ff); color: #000000; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 10px 25px rgba(106, 233, 193, 0.25);">
                                                ✦ Explore Creators & Network
                                            </a>
                                        </div>

                                        <p style="margin: 0; color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.5;">
                                            Need assistance or plan upgrades? Reach out via WhatsApp at <strong style="color: #67e5d4;">+91 7009812679</strong> or email <strong style="color: #67e5d4;">singhaladitya611@gmail.com</strong>.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px 32px; background-color: #08080d; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; color: #64748b; font-size: 12px;">
                                        <p style="margin: 0 0 6px 0;">© 2026 Mind Matrix. All rights reserved.</p>
                                        <p style="margin: 0;">You received this transmission because you subscribed to the Mind Matrix Newsletter.</p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            
            # Send email with clean plain text fallback
            plain_text = f"Welcome to Mind Matrix!\n\nHello {email},\nThank you for subscribing to Mind Matrix Newsletter.\nExplore creators at: {explore_url}\nContact support: singhaladitya611@gmail.com / +91 7009812679"
            
            send_mail(
                subject=subject,
                message=plain_text,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=True,
            )
            
            print(f"Welcome email sent to {email}")
            
        except Exception as e:
            print(f"Error sending email to {email}: {str(e)}")

    def send_new_publication_broadcast(self, email):
        """Send automated new publication announcement"""
        subject = '✨ New Featured Publications on Mind Matrix ✦'
        explore_url = f"{settings.FRONTEND_URL}/blogs"
        html_message = f"""
        <!DOCTYPE html>
        <html lang="en">
        <body style="margin: 0; padding: 0; background-color: #060608; font-family: sans-serif; color: #ffffff;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #060608; padding: 40px 10px;">
                <tr><td align="center">
                    <table width="100%" style="max-width: 580px; background: #0d0d14; border: 1px solid rgba(106,233,193,0.3); border-radius: 20px; padding: 32px; color: #fff;">
                        <h2 style="color: #67e5d4; margin-top: 0;">✨ New Featured Publications</h2>
                        <p style="color: #cbd5e1; line-height: 1.6;">Hello <strong>{email}</strong>,<br/>Fresh blogs and journals have just been published on Mind Matrix by top creators!</p>
                        <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 12px; margin: 20px 0;">
                            <h4 style="margin: 0 0 8px 0; color: #c8b5ff;">✦ Read Trending Stories</h4>
                            <p style="margin: 0; color: #94a3b8; font-size: 13px;">Explore the latest essays, motion presets, and series created by our writing community.</p>
                        </div>
                        <div style="text-align: center; margin-top: 24px;">
                            <a href="{explore_url}" style="display: inline-block; padding: 14px 28px; border-radius: 12px; background: linear-gradient(135deg, #67e5d4, #c8b5ff); color: #000; font-weight: 800; text-decoration: none;">Explore New Publications →</a>
                        </div>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
        """
        try:
            send_mail(subject, f"New Publications on Mind Matrix: {explore_url}", settings.DEFAULT_FROM_EMAIL, [email], html_message=html_message, fail_silently=True)
            print(f"Publication email sent to {email}")
        except Exception as e:
            print(f"Error: {e}")

    def send_plan_offer_broadcast(self, email):
        """Send automated 20% OFF promotional offer email"""
        subject = '🔥 Limited Offer: 20% OFF Creator & Studio Plans on Mind Matrix!'
        pricing_url = f"{settings.FRONTEND_URL}/pricing"
        wa_url = "https://wa.me/917009812679?text=Hi!%20I%20want%20to%20claim%20the%2020%25%20discount%20on%20Mind%20Matrix%20plans."
        html_message = f"""
        <!DOCTYPE html>
        <html lang="en">
        <body style="margin: 0; padding: 0; background-color: #060608; font-family: sans-serif; color: #ffffff;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #060608; padding: 40px 10px;">
                <tr><td align="center">
                    <table width="100%" style="max-width: 580px; background: #0d0d14; border: 1px solid rgba(200,181,255,0.3); border-radius: 20px; padding: 32px; color: #fff;">
                        <div style="display: inline-block; padding: 4px 12px; border-radius: 12px; background: rgba(255, 177, 71, 0.2); color: #ffb147; font-size: 12px; font-weight: 700;">🔥 SPECIAL PROMOTION</div>
                        <h2 style="color: #ffffff; margin: 12px 0;">Upgrade & Save 20% Today</h2>
                        <p style="color: #cbd5e1; line-height: 1.6;">Hello <strong>{email}</strong>,<br/>For a limited time, get <strong>20% OFF</strong> all Mind Matrix plans to unlock higher publishing limits & creator badges!</p>
                        
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 18px; margin: 20px 0;">
                            <p style="margin: 6px 0; color: #67e5d4; font-weight: 700;">⚡ Creator Plan: <span style="text-decoration: line-through; color: #94a3b8;">$9</span> $7 /month (10 blogs/mo)</p>
                            <p style="margin: 6px 0; color: #c8b5ff; font-weight: 700;">🚀 Studio Plan: <span style="text-decoration: line-through; color: #94a3b8;">$19</span> $15 /month (25 blogs/mo)</p>
                            <p style="margin: 6px 0; color: #ffb147; font-weight: 700;">👑 Enterprise Plan: <span style="text-decoration: line-through; color: #94a3b8;">$39</span> $31 /month (30 blogs/mo)</p>
                        </div>

                        <div style="text-align: center; margin-top: 24px;">
                            <a href="{wa_url}" style="display: inline-block; padding: 14px 28px; border-radius: 12px; background: linear-gradient(135deg, #25D366, #128C7E); color: #fff; font-weight: 800; text-decoration: none;">💬 Claim 20% Discount via WhatsApp</a>
                        </div>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
        """
        try:
            send_mail(subject, f"20% OFF Mind Matrix Plans: {pricing_url}", settings.DEFAULT_FROM_EMAIL, [email], html_message=html_message, fail_silently=True)
            print(f"Offer email sent to {email}")
        except Exception as e:
            print(f"Error: {e}")

    def send_upgrade_reminder_broadcast(self, email):
        """Send automated plan upgrade reminder"""
        subject = '🚀 Unlock Higher Publishing Quotas & Creator Badges on Mind Matrix'
        pricing_url = f"{settings.FRONTEND_URL}/pricing"
        html_message = f"""
        <!DOCTYPE html>
        <html lang="en">
        <body style="margin: 0; padding: 0; background-color: #060608; font-family: sans-serif; color: #ffffff;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #060608; padding: 40px 10px;">
                <tr><td align="center">
                    <table width="100%" style="max-width: 580px; background: #0d0d14; border: 1px solid rgba(106,233,193,0.3); border-radius: 20px; padding: 32px; color: #fff;">
                        <h2 style="color: #67e5d4; margin-top: 0;">🚀 Ready to Upgrade Your Craft?</h2>
                        <p style="color: #cbd5e1; line-height: 1.6;">Hello <strong>{email}</strong>,<br/>Expand your reach, publish more blogs every week, and get an official verified badge on your profile!</p>
                        <div style="text-align: center; margin-top: 24px;">
                            <a href="{pricing_url}" style="display: inline-block; padding: 14px 28px; border-radius: 12px; background: linear-gradient(135deg, #67e5d4, #c8b5ff); color: #000; font-weight: 800; text-decoration: none;">View Pricing & Upgrade →</a>
                        </div>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
        """
        try:
            send_mail(subject, f"Upgrade Your Plan: {pricing_url}", settings.DEFAULT_FROM_EMAIL, [email], html_message=html_message, fail_silently=True)
            print(f"Upgrade reminder email sent to {email}")
        except Exception as e:
            print(f"Error: {e}")
