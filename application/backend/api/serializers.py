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
    class Meta: 
        model = Friendship
        fields = '__all__'

class UserFriendListSerializer(serializers.ModelSerializer):
    class Meta: 
        model = UserFriendList
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ChatMessage
        fields = '__all__'
        
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Comment
        fields = '__all__'