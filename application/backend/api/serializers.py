from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Game, Item, UserMetaData


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
