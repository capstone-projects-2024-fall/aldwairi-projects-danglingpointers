from datetime import timezone
from .models import UserMetaData, Game, Item, SecurityQuestion
from .serializers import UserSerializer, UserMetaDataSerializer, GameSerializer, ItemSerializer, SecurityQuestionSerializer
from cryptography.fernet import Fernet
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import F
from django.db.models.functions import Greatest
import os
from rest_framework import generics, pagination, status, viewsets
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

            return Response(
                {
                    'accessToken': access_token,
                    'refreshToken': refresh_token,
                    'user_id': user.id,
                    'username': user.username
                },
                status=status.HTTP_200_OK)

        username = request.data.get('username')
        password = request.data.get('password')

        # Create an account if user not found in database
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
        else:
            user = User.objects.create_user(
                username=username,
                password=password,
            )
            user.save()

        return user_login(user)


class CreateUserMetaDataView(generics.GenericAPIView):
    def post(self, request):
        '''
        This method handles requests POSTed to this view by creating a new
        UserMetaData entry with the user id, and security question and answer
        credentials passed from the frontend. This method responds with JSON
        objects with user settings, items, and points to be stored in sessionStorage.
        '''

        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)


        if UserMetaData.objects.filter(user=user).exists():
            userMetaData = UserMetaData.objects.get(user=user)
            settings = request.data.get('settings')
            user_points = request.data.get('user_points')

            userMetaData.settings = settings
            userMetaData.user_points = user_points if user_points is not None else 0
            userMetaData.save()

            return Response({"success": "success"}, status=status.HTTP_200_OK)
        else:
            security_question_id = request.data.get('security_question')
            security_question = SecurityQuestion.objects.get(
                id=security_question_id)
            security_answer = request.data.get('security_answer')

            items = Item.objects.all()
            settings = {
                "garbageCollectorColor": "#0022ff",
                "moveLeft": "ArrowLeft",
                "moveRight": "ArrowRight",
                "toggleNextItem": "Tab",
                "useItem": "Enter",
            }

            userMetaData = UserMetaData.objects.create(
                user=user,
                security_question=security_question,
                security_answer=security_answer,
                settings=settings,
            )
            userMetaData.items.add(*items)
            userMetaData.save()

            user_points = 0

            return Response(
                {
                    'settings': settings,
                    'user_points': user_points,
                },
                status=status.HTTP_200_OK)


class UpdateUserMetaDataView(generics.GenericAPIView):
    def post(self, request):
        '''
        This method updates existing UserMetaData when a user navigates
        between pages. This method returns a success message.
        '''

        user_id = request.data.get('user_id')
        user_points = request.data.get('user_points')
        settings = request.data.get('settings')

        user = User.objects.get(id=user_id)
        userMetaData = UserMetaData.objects.get(user=user)

        userMetaData.user_points = user_points
        userMetaData.settings = settings

        userMetaData.save()

        return Response(
            {
                'success': 'success',
            },
            status=status.HTTP_200_OK)


class UserCountView(generics.GenericAPIView):
    def get(self, request):
        user_count = User.objects.count()
        return Response({'user_count': user_count})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = self.queryset

        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(id=user_id)

        username = self.request.query_params.get('username')

        # Query only usernames for autocomplete search
        if username:
            queryset = queryset.filter(username__contains=username)

        return queryset


class UserMetaDataViewSet(viewsets.ModelViewSet):
    queryset = UserMetaData.objects
    serializer_class = UserMetaDataSerializer

    def get_queryset(self):
        queryset = self.queryset

        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(username=username)

        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user__id=user_id)

        solo_games_played = self.request.query_params.get('solo_games_played')
        if solo_games_played:
            queryset = queryset.filter(
                solo_games_played__gte=solo_games_played)

        versus_games_played = self.request.query_params.get(
            'versus_games_played')
        if versus_games_played:
            queryset = queryset.filter(
                versus_games_played__gte=versus_games_played)

        total_games_played = self.request.query_params.get(
            'total_games_played')
        if total_games_played:
            queryset = queryset.filter(
                total_games_played__gte=total_games_played)

        solo_high_score = self.request.query_params.get('solo_high_score')
        if solo_high_score:
            queryset = queryset.filter(solo_high_score__gte=solo_high_score)

        solo_high_time = self.request.query_params.get('solo_high_time')
        if solo_high_time:
            queryset = queryset.filter(solo_high_time__gte=solo_high_time)

        versus_high_score = self.request.query_params.get('versus_high_score')
        if versus_high_score:
            queryset = queryset.filter(
                versus_high_score__gte=versus_high_score)

        versus_high_time = self.request.query_params.get('versus_high_time')
        if versus_high_time:
            queryset = queryset.filter(versus_high_time__gte=versus_high_time)

        versus_wins = self.request.query_params.get('versus_wins')
        if versus_wins:
            queryset = queryset.filter(versus_wins__gte=versus_wins)

        versus_losses = self.request.query_params.get('versus_losses')
        if versus_losses:
            queryset = queryset.filter(versus_losses__lte=versus_losses)

        success_rate = self.request.query_params.get('success_rate')
        if success_rate:
            queryset = queryset.filter(success_rate__gte=success_rate)

        failure_rate = self.request.query_params.get('failure_rate')
        if failure_rate:
            queryset = queryset.filter(failure_rate__gte=failure_rate)

        return queryset


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects
    serializer_class = GameSerializer

    def get_queryset(self):
        queryset = self.queryset
        query_params = self.request.query_params

        if 'watch' in query_params:
            if 'preview' in query_params:
                return queryset.filter(status='Active').order_by('-date')[:10]
            return queryset.filter(status='Active').order_by('-date')

        if 'lobby' in query_params:
            if 'preview' in query_params:
                return queryset.filter(mode='Versus', status='Pending').order_by('-date')[:10]
            return queryset.filter(mode='Versus', status='Pending').order_by('-date')

        if 'leaderboards_solo' in query_params:
            queryset = queryset.filter(
                mode='Solo', status='Complete').order_by('-player_one_score')
            if 'preview' in query_params:
                return queryset[:10]
            return queryset[:20]

        if 'leaderboards_versus' in query_params:
            queryset = queryset.filter(mode='Versus').annotate(max_score=Greatest(
                F('player_one_score'), F('player_two_score'))).order_by('-max_score')
            if 'preview' in query_params:
                return queryset[:10]
            return queryset[:20]

        if 'longest_games' in query_params:
            return queryset.order_by('-game_length')[:20]

        # Query for recently played games on the profile
        if 'recent_games' in query_params:
            return queryset.filter(player_one__id=query_params.get('user_id')).order_by('-date')

        return queryset


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class SecurityQuestionViewSet(viewsets.ModelViewSet):
    queryset = SecurityQuestion.objects.all()
    serializer_class = SecurityQuestionSerializer
