from .models import UserMetaData, Game, Item
from .serializers import UserSerializer, UserMetaDataSerializer, GameSerializer, ItemSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
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
                    'user_id': user.id
                },
                status=status.HTTP_200_OK)

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


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
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
    queryset = UserMetaData.objects.all()
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
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def get_queryset(self):
        queryset = self.queryset
        query_params = self.request.query_params

        # Query for top active public games 'PATH/api/games?watch=true'
        if 'watch' in query_params:
            return queryset.filter(status='Active').order_by('-date')[:10]

        # Query for lobby
        if 'lobby' in query_params:
            return queryset.filter(mode='Versus', status='Pending', player_two__isnull=True)

        if 'leaderboards_solo' in query_params:
            return queryset.filter(mode='Solo', status='Complete').order_by('-player_one_score')[:10]

        if 'leaderboards_versus' in query_params:
            return queryset.filter(mode='Versus', status='Complete').order_by('-player_one_score', '-player_two_score')[:10]

        # Query for recently played games on the profile
        if 'recent_games' in query_params:
            return queryset.filter(player_one__id=query_params.get('user_id')).order_by('-date')


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
