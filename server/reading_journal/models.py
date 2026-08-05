from django.db import models
from django.contrib.auth import get_user_model
from blog.models import Post

User = get_user_model()


class Bookmark(models.Model):
    """Bookmark model for tracking saved posts"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} bookmarked {self.post.title}"


class ReadingProgress(models.Model):
    """Reading progress and notes for a specific post"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reading_progress')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reading_progress')
    progress_percentage = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'post')
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username} progress on {self.post.title}"


class ReadingEntry(models.Model):
    """Generic journal entries for reading notes (if used)"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reading_entries')
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Reading Entries'

    def __str__(self):
        return self.title
