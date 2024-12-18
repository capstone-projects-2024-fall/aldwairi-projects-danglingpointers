from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'date_joined', 'last_login')


class UserMetaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMetaData
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class SecurityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityQuestion
        fields = '__all__'


class FriendshipSerializer(serializers.ModelSerializer):
    friend_username = serializers.ReadOnlyField()  # Include the friend_username property
    user_username = serializers.ReadOnlyField()    # Include the user_username property

    class Meta: 
        model = Friendship
        fields = '__all__'  # Include all fields from the model
        extra_fields = ['friend_username', 'user_username']  # Add custom fields

        

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ChatMessage
        fields = '__all__'
        
        
class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'username', 'comment', 'comment_type', 'content_id', 'date']