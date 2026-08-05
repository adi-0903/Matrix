from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


import random
import string


def generate_unique_uid():
    prefix = 'MM-'
    chars = string.ascii_uppercase + string.digits
    for _ in range(100):
        code = prefix + ''.join(random.choices(chars, k=6))
        if not User.objects.filter(uid=code).exists():
            return code
    return prefix + ''.join(random.choices(chars, k=8))


class User(AbstractUser):
    """Custom User model with additional fields"""
    
    uid = models.CharField(max_length=20, unique=True, blank=True, null=True, db_index=True)
    email = models.EmailField(_('email address'), unique=True)
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(max_length=200, blank=True)
    twitter = models.CharField(max_length=100, blank=True)
    github = models.CharField(max_length=100, blank=True)
    
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('creator', 'Creator'),
        ('studio', 'Studio'),
        ('enterprise', 'Enterprise'),
    ]
    subscription_plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    subscription_start_date = models.DateTimeField(null=True, blank=True)
    subscription_end_date = models.DateTimeField(null=True, blank=True)
    
    # Stats
    followers_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = generate_unique_uid()
        super().save(*args, **kwargs)
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username


class Follow(models.Model):
    """Model for user following relationships"""
    
    follower = models.ForeignKey(
        User,
        related_name='following',
        on_delete=models.CASCADE
    )
    following = models.ForeignKey(
        User,
        related_name='followers',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"
