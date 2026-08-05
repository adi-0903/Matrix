from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags

def send_plan_activation_email(user, plan_name, days):
    """Send beautiful plan activation confirmation email to user"""
    if not user or not user.email:
        return

    plan_upper = plan_name.upper()
    plan_title = plan_name.title()

    quota_map = {
        'creator': '10 blogs per month',
        'studio': '25 blogs per month',
        'enterprise': '30 blogs per month',
        'free': '3 blogs total'
    }
    quota_text = quota_map.get(plan_name.lower(), 'Standard Quota')

    start_date_str = user.subscription_start_date.strftime('%B %d, %Y') if user.subscription_start_date else 'Today'
    end_date_str = user.subscription_end_date.strftime('%B %d, %Y') if user.subscription_end_date else f'{days} days from now'

    subject = f"🎉 Plan Activated: {plan_title} Plan on Mind Matrix!"
    explore_url = f"{settings.FRONTEND_URL}/blogs/new"

    html_message = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Activated</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #060608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #060608; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #0d0d14; border: 1px solid rgba(106, 233, 193, 0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="padding: 36px 32px 24px 32px; background: linear-gradient(135deg, rgba(106, 233, 193, 0.15), rgba(200, 181, 255, 0.15)); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                                <div style="display: inline-block; padding: 6px 16px; border-radius: 20px; background: rgba(106, 233, 193, 0.2); color: #67e5d4; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 12px; text-transform: uppercase;">
                                    ✦ SUBSCRIPTION CONFIRMED
                                </div>
                                <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff;">
                                    {plan_title} Plan Activated
                                </h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 32px;">
                                <p style="margin: 0 0 20px 0; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                                    Hello <strong style="color: #ffffff;">{user.full_name or user.username}</strong>,<br/>
                                    Great news! Your <strong>{plan_title} Plan</strong> subscription has been successfully activated on Mind Matrix.
                                </p>

                                <!-- Details Box -->
                                <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(200, 181, 255, 0.2); border-radius: 16px; padding: 20px; margin-bottom: 28px;">
                                    <h3 style="margin: 0 0 16px 0; font-size: 14px; color: #c8b5ff; text-transform: uppercase; letter-spacing: 0.5px;">Subscription Receipt Details</h3>
                                    
                                    <table width="100%" cellspacing="0" cellpadding="6" border="0" style="color: #cbd5e1; font-size: 14px;">
                                        <tr>
                                            <td style="color: #94a3b8;">Account Email:</td>
                                            <td align="right" style="color: #ffffff; font-weight: 600;">{user.email}</td>
                                        </tr>
                                        <tr>
                                            <td style="color: #94a3b8;">Unique UID:</td>
                                            <td align="right" style="color: #67e5d4; font-weight: 700;">{user.uid or 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style="color: #94a3b8;">Active Plan:</td>
                                            <td align="right" style="color: #c8b5ff; font-weight: 700;">{plan_title}</td>
                                        </tr>
                                        <tr>
                                            <td style="color: #94a3b8;">Publishing Limit:</td>
                                            <td align="right" style="color: #ffffff; font-weight: 600;">{quota_text}</td>
                                        </tr>
                                        <tr>
                                            <td style="color: #94a3b8;">Activation Date:</td>
                                            <td align="right" style="color: #ffffff;">{start_date_str}</td>
                                        </tr>
                                        <tr>
                                            <td style="color: #94a3b8;">Expiration Date:</td>
                                            <td align="right" style="color: #67e5d4; font-weight: 700;">{end_date_str}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- CTA Button -->
                                <div style="text-align: center; margin: 32px 0 24px 0;">
                                    <a href="{explore_url}" style="display: inline-block; padding: 14px 32px; border-radius: 12px; background: linear-gradient(135deg, #67e5d4, #c8b5ff); color: #000000; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 10px 25px rgba(106, 233, 193, 0.25);">
                                        🚀 Start Publishing Now
                                    </a>
                                </div>

                                <p style="margin: 0; color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.5;">
                                    Questions or renewal requests? Contact support at <strong style="color: #67e5d4;">singhaladitya611@gmail.com</strong> or WhatsApp <strong style="color: #67e5d4;">+91 7009812679</strong>.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px 32px; background-color: #08080d; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; color: #64748b; font-size: 12px;">
                                <p style="margin: 0 0 6px 0;">© 2026 Mind Matrix. All rights reserved.</p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    plain_text = f"Plan Activated: {plan_title} Plan\n\nHello {user.full_name or user.username},\nYour {plan_title} plan has been activated until {end_date_str}.\nUID: {user.uid}\nPublishing Quota: {quota_text}\nStart writing at: {explore_url}"

    try:
        send_mail(
            subject=subject,
            message=plain_text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=True,
        )
        print(f"Plan activation email sent to {user.email}")
    except Exception as e:
        print(f"Error sending activation email to {user.email}: {e}")


def send_user_welcome_email(user):
    """Send welcome email to newly registered user with their Unique UID"""
    if not user or not user.email:
        return

    subject = f"Welcome to Mind Matrix ✦ Your UID is {user.uid}"
    explore_url = f"{settings.FRONTEND_URL}/creators"

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
                                    ✦ Account Registration
                                </div>
                                <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff;">
                                    Welcome, {user.full_name or user.username}!
                                </h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 32px;">
                                <p style="margin: 0 0 20px 0; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                                    Your Mind Matrix account has been successfully created.
                                </p>

                                <!-- Unique UID Box -->
                                <div style="background: rgba(106, 233, 193, 0.08); border: 1px solid rgba(106, 233, 193, 0.3); border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 28px;">
                                    <span style="display: block; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Your Unique Creator UID</span>
                                    <span style="font-size: 24px; font-weight: 800; color: #67e5d4; letter-spacing: 2px;">{user.uid}</span>
                                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;">Share this UID with friends so they can easily find and follow you!</p>
                                </div>

                                <!-- CTA Button -->
                                <div style="text-align: center; margin: 32px 0 24px 0;">
                                    <a href="{explore_url}" style="display: inline-block; padding: 14px 32px; border-radius: 12px; background: linear-gradient(135deg, #67e5d4, #c8b5ff); color: #000000; font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 10px 25px rgba(106, 233, 193, 0.25);">
                                        ✦ Discover Creators & Connect
                                    </a>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px 32px; background-color: #08080d; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; color: #64748b; font-size: 12px;">
                                <p style="margin: 0;">© 2026 Mind Matrix. All rights reserved.</p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    plain_text = f"Welcome to Mind Matrix!\n\nHi {user.full_name or user.username},\nYour account has been created successfully.\nYour Unique Creator UID is: {user.uid}\nDiscover creators at: {explore_url}"

    try:
        send_mail(
            subject=subject,
            message=plain_text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=True,
        )
        print(f"Welcome email sent to {user.email}")
    except Exception as e:
        print(f"Error sending registration email to {user.email}: {e}")
