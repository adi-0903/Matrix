from rest_framework import serializers
from .models import Bookmark, ReadingProgress, ReadingEntry

class BookmarkSerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField(source='post.id', read_only=True)
    post_type = serializers.CharField(source='post.post_type', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'post_id', 'post_type', 'created_at']


class ReadingProgressSerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField(source='post.id', read_only=True)

    class Meta:
        model = ReadingProgress
        fields = ['id', 'post_id', 'progress_percentage', 'notes', 'updated_at']


class ReadingEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingEntry
        fields = ['id', 'title', 'content', 'created_at', 'updated_at']
