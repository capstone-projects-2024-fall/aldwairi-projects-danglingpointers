from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class CreateOrLoginView(generics.GenericAPIView):
    def post(self, request):
        '''
        This method handles requests POSTed to this view by authenticating
        the username and password. If the username and password are not found
        in the database a new user is created. All credential validation is
        handled in the frontend, including redirection to the Dashboard to
        set a security question/answer.
        '''

        def user_login(user):
            '''
            This method handles creating an access token and a refresh token
            for the browser to save to sessionStorage
            '''
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({'accessToken': access_token,
                             'refreshToken': refresh_token}, status=status.HTTP_200_OK)
        
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
    
        # Create an account if user not found in database
        if user is None:
            user = User.objects.create_user(
                username=username,
                password=password,
            )
            user.save()

        return user_login(user)
    
# New Viewsets
from .models import UserMetaData, Game, Item, LeaderboardVersus, LeaderboardSolo
import redis
from django.conf import settings
from rest_framework import viewsets


# Viewset for DjangoUsers
class DjangoUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_queryset(self):
        query_params = self.request.query_params

        # Query only usernames for autocomplete search
        if 'username' in query_params:
            return User.objects.filter(username__icontains=query_params.get('username')).values('username')

        # Query only date_joined for profiles
        if 'profile' in query_params:
            return User.objects.filter(id=query_params.get('user_id')).values('username', 'date_joined')

        return super().get_queryset()

    def list(self, request):
        queryset = self.get_queryset()
        return Response(queryset)

# Viewset for UserMetaData
class UserMetaDataViewSet(viewsets.ModelViewSet):
    queryset = UserMetaData.objects.all()

    def get_queryset(self):
        query_params = self.request.query_params

        # Query security question and answer for password recovery
        if 'security_question' in query_params:
            return UserMetaData.objects.filter(user__id=query_params.get('user_id')).values('security_question', 'security_answer')

        # Query stats for profile
        if 'profile_stats' in query_params:
            return UserMetaData.objects.filter(user__id=query_params.get('user_id')).values(
                'solo_games_played', 'solo_high_score', 'solo_high_time',
                'versus_games_played', 'versus_wins', 'versus_losses',
                'total_games', 'versus_high_score', 'versus_high_time'
            )

        return super().get_queryset()

    def list(self, request):
        queryset = self.get_queryset()
        return Response(queryset)

# Viewset for Games
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()

    def get_queryset(self):
        query_params = self.request.query_params

        # Query for opponent's score during the game
        if 'opponent_score' in query_params:
            return Game.objects.filter(id=query_params.get('game_id')).values('game_length', 'player_one_score', 'player_two_score')

        # Query for top active public games
        if 'top_games' in query_params:
            return Game.objects.filter(public=True, status='active').order_by('-player_one_score', '-player_two_score')[:10]

        # Query for recently played games on the profile
        if 'recent_games' in query_params:
            return Game.objects.filter(player_one__id=query_params.get('user_id')).order_by('-date').values(
                'game_length', 'player_one_score', 'player_two_score', 'status', 'date', 'mode', 'link', 'winner'
            )

        # Query for lobby
        if 'lobby' in query_params:
            return Game.objects.filter(public=True, player_two__isnull=True).values('mode', 'link', 'player_one', 'public')

        return super().get_queryset()

    def list(self, request):
        queryset = self.get_queryset()
        return Response(queryset)

# Viewset for Items
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()

    def list(self, request):
        queryset = Item.objects.all()
        return Response(queryset)

# Viewset for LeaderboardVersus
class LeaderboardVersusViewSet(viewsets.ModelViewSet):
    queryset = LeaderboardVersus.objects.all()

# Viewset for LeaderboardSolo
class LeaderboardSoloViewSet(viewsets.ModelViewSet):
    queryset = LeaderboardSolo.objects.all()



class RedisUserDataView(generics.GenericAPIView):

    def get(self, request):
        user_id = request.query_params.get('user_id')

        # Query friends, friend requests, and online friends
        friends = redis_client.smembers(f"user:{user_id}:friends")
        friend_requests = redis_client.smembers(f"user:{user_id}:friend_requests")
        online_friends = redis_client.smembers(f"user:{user_id}:online")

        return Response({
            'friends': list(friends),
            'friend_requests': list(friend_requests),
            'online_friends': list(online_friends)
        })
