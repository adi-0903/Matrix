from rest_framework import viewsets, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Bookmark, ReadingProgress, ReadingEntry
from .serializers import BookmarkSerializer, ReadingProgressSerializer, ReadingEntrySerializer
from blog.models import Post

class BookmarkViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BookmarkSerializer
    
    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        post_id = request.data.get('post_id')
        if not post_id:
            return Response({'error': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        post = get_object_or_404(Post, id=post_id)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, post=post)
        
        serializer = self.get_serializer(bookmark)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        # We override destroy to delete by post_id since frontend sends DELETE /bookmarks/<post_id>/
        post_id = self.kwargs.get('pk')
        try:
            bookmark = Bookmark.objects.get(user=request.user, post_id=post_id)
            bookmark.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Bookmark.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ReadingProgressView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        progress, created = ReadingProgress.objects.get_or_create(user=request.user, post=post)
        serializer = ReadingProgressSerializer(progress)
        return Response(serializer.data)

    def patch(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        progress, created = ReadingProgress.objects.get_or_create(user=request.user, post=post)
        
        if 'progress_percentage' in request.data:
            progress.progress_percentage = request.data['progress_percentage']
        if 'notes' in request.data:
            progress.notes = request.data['notes']
            
        progress.save()
        serializer = ReadingProgressSerializer(progress)
        return Response(serializer.data)


class ReadingEntryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReadingEntrySerializer

    def get_queryset(self):
        return ReadingEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
