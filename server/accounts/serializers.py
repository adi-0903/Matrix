from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    full_name = serializers.ReadOnlyField()
    is_following = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'uid', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'bio', 'avatar', 'location', 'website',
            'twitter', 'github', 'subscription_plan', 
            'subscription_start_date', 'subscription_end_date',
            'followers_count', 'following_count', 'is_following',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'uid', 'created_at', 'updated_at', 'followers_count', 'following_count']

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            from .models import Follow
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer with user data"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'bio', 'avatar',
            'location', 'website', 'twitter', 'github'
        ]
