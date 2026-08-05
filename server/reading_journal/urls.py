from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookmarkViewSet, ReadingProgressView, ReadingEntryViewSet

router = DefaultRouter()
router.register(r'bookmarks', BookmarkViewSet, basename='bookmark')
router.register(r'entries', ReadingEntryViewSet, basename='readingentry')

urlpatterns = [
    path('', include(router.urls)),
    path('progress/<int:post_id>/', ReadingProgressView.as_view(), name='reading_progress'),
]
