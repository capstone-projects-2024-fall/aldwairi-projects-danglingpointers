from .models import *
from .serializers import *
from django.contrib.auth.models import User
from django.db.models import F
from django.db.models.functions import Greatest
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView


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

            items = {
                0: 1,
                1: 1,
                2: 1,
                3: 1,
                4: 1,
            }

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
                items=items,
                settings=settings,
                is_online=True,
            )
            userMetaData.save()

            user_points = 0

            return Response(
                {
                    'settings': settings,
                    'user_points': user_points,
                    'items': items,
                },
                status=status.HTTP_200_OK)


class UpdateUserMetaDataView(generics.GenericAPIView):
    def post(self, request):
        '''
        This method updates existing UserMetaData when a user navigates
        between pages. This method returns a success message.
        '''

        user_id = request.data.get('user_id')
        user_points = request.data.get('user_points', 0)
        settings = request.data.get('settings')
        logout = request.data.get('logout')

        user = User.objects.get(id=user_id)
        userMetaData = UserMetaData.objects.get(user=user)

        if 'profile_picture' in request.data:
            userMetaData.profile_picture = request.data.get('profile_picture')

        userMetaData.user_points = user_points
        userMetaData.settings = settings
        userMetaData.is_online = False if logout else True

        userMetaData.save()

        return Response(
            {
                'success': 'success',
            },
            status=status.HTTP_200_OK)


class LogoutUserMetaDataView(generics.GenericAPIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        userMetaData = UserMetaData.objects.get(user=user)

        userMetaData.is_online = False
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

        profile_picture = self.request.query_params.get('profile_picture')

        return queryset


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects
    serializer_class = GameSerializer

    def get_queryset(self):
        queryset = self.queryset
        query_params = self.request.query_params

        game_id = self.request.query_params.get('game_id')
        if game_id:
            queryset = queryset.filter(id=game_id)

        if 'watch' in query_params:
            queryset = queryset.filter(status='Active')
            if 'preview' in query_params:
                return queryset.order_by('-date')[:10]
            if 'solo' in query_params:
                return queryset.filter(mode='Solo').order_by('-date')
            if 'versus' in query_params:
                return queryset.filter(mode='Versus').order_by('-date')
            if 'high_score' in query_params:
                return queryset.annotate(max_score=Greatest(
                    F('player_one_score'), F('player_two_score'))).order_by('-max_score')
            return queryset.order_by('-date')

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
            queryset = queryset.filter(mode='Versus', status='Complete').annotate(max_score=Greatest(
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


class FriendsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """
        Return a list of friends for the logged-in user.
        If authentication is removed, user ID must be provided in the query.
        """
        user_id = request.query_params.get('user_id')

        if not user_id:
            return Response(
                {"error": "User ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch all accepted friendships involving the user
        friendships = Friendship.objects.filter(
            (models.Q(user__id=user_id) | models.Q(
                friend__id=user_id)) & models.Q(status="Accepted")
        )

        # Serialize the data
        friends_data = []
        for friendship in friendships:
            friend = friendship.friend if str(
                friendship.user.id) == user_id else friendship.user
            friends_data.append({
                "id": friend.id,
                "username": friend.username,
            })

        return Response(friends_data, status=status.HTTP_200_OK)


class FriendshipViewSet(viewsets.ModelViewSet):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        status_filter = self.request.query_params.get("status")
        exclude_requestor = self.request.query_params.get(
            "exclude_requestor") == "true"

        queryset = self.queryset

        if user_id:
            if status_filter == "Pending":
                # Fetch pending requests where the user is the recipient
                queryset = queryset.filter(
                    friend__id=user_id, status="Pending")
                if exclude_requestor:
                    queryset = queryset.exclude(requestor_id=user_id)

            elif status_filter == "Accepted":
                # Fetch accepted friendships involving the user
                queryset = queryset.filter(
                    models.Q(user__id=user_id) | models.Q(friend__id=user_id),
                    status="Accepted"
                )
            else:
                # General filter for friendships where the user is the requestor
                queryset = queryset.filter(user__id=user_id)

        return queryset

    def update(self, request, *args, **kwargs):
        """Handle PATCH requests for updating the friendship status."""
        try:
            friendship = self.get_object()  # Get the specific friendship instance
            # Avoid shadowing 'status' module
            new_status = request.data.get("status")

            if new_status not in ["Pending", "Accepted", "Inactive"]:
                return Response(
                    {"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST
                )

            friendship.status = new_status
            friendship.save()
            return Response(
                self.serializer_class(
                    friendship).data, status=status.HTTP_200_OK
            )
        except Friendship.DoesNotExist:
            return Response(
                {"error": "Friendship not found."}, status=status.HTTP_404_NOT_FOUND
            )


class ManageFriendship(generics.GenericAPIView):
    serializer_class = FriendshipSerializer

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"error": "User ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Filter friendships where the logged-in user is the recipient
        friendships = Friendship.objects.filter(
            friend__id=user_id, status="Pending")
        serializer = self.serializer_class(friendships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        friendship_id = kwargs.get("pk")
        status = request.data.get("status")

        if status not in ["Pending", "Accepted", "Inactive"]:
            return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friendship = Friendship.objects.get(id=friendship_id)
            friendship.status = status
            friendship.save()
            return Response(FriendshipSerializer(friendship).data, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({"error": "Friendship not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        user_id = request.data.get("user_id")
        friend_id = request.data.get("friend_id")

        if not user_id or not friend_id:
            return Response(
                {"error": "Both user_id and friend_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
            friend = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid user_id or friend_id provided."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check for existing friendships
        friendship = Friendship.objects.filter(
            models.Q(user=user, friend=friend) | models.Q(
                user=friend, friend=user)
        ).first()

        if friendship:
            if friendship.status == "Inactive":
                # Reactivate friendship and set to Pending
                friendship.status = "Pending"
                friendship.requestor = user  # Update the requestor to the current user
                friendship.save()
                return Response(
                    {"success": "Friendship reactivated and set to Pending."},
                    status=status.HTTP_200_OK,
                )
            elif friendship.status == "Pending":
                return Response(
                    {"error": "Friendship is already pending approval."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                return Response(
                    {"error": "Friendship already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Create a new friendship if none exists
        Friendship.objects.create(
            user=user, friend=friend, requestor=user, status="Pending")
        return Response(
            {"success": "Friendship request sent."},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request):
        # Handle friendship status update
        instance = self.get_object()
        status = request.data.get('status')
        if status not in ['Pending', 'Accepted', 'Inactive']:
            return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        instance.status = status
        instance.save()
        return Response(FriendshipSerializer(instance).data)

    def get_queryset(self):
        queryset = self.queryset

        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user__id=user_id)

            username = self.request.query_params.get('username')
            # TODO: Pending, Active

            if username:
                queryset = queryset.filter(friend__username=username)

        return queryset


class ManageFriendship(generics.GenericAPIView):

    def post(self, request):
        user_id = request.data.get("user_id")
        friend_id = request.data.get("friend_id")

        user = User.objects.get(id=user_id)
        friend = User.objects.get(id=friend_id)

        if not friend_id:
            return Response(
                {"error": "Friend ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            friend = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Friend does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check for duplicate friendship or create a new one
        friendship, created = Friendship.objects.get_or_create(
            user=user, friend=friend, defaults={"status": "Pending"}
        )
        if not created:
            return Response(
                {"error": "Friendship already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            FriendshipSerializer(
                friendship).data, status=status.HTTP_201_CREATED
        )

    def update(self, request):
        # Handle friendship status update
        instance = self.get_object()
        status = request.data.get('status')
        if status not in ['Pending', 'Accepted', 'Inactive']:
            return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        instance.status = status
        instance.save()
        return Response(FriendshipSerializer(instance).data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = self.queryset

        content_id = self.request.query_params.get('content_id')
        if content_id:
            queryset = queryset.filter(content_id=content_id)

            game = self.request.query_params.get('game')
            user = self.request.query_params.get('user')

            if user:
                queryset = queryset.filter(comment_type='User')
            elif game:
                queryset = queryset.filter(comment_type='Game')

        return queryset.order_by('-date')

    def create(self, request, *args, **kwargs):
        # Fetch user_id from request data
        user_id = request.data.get('user_id')
        text = request.data.get('text')
        # The profile ID the comment is for
        content_id = request.data.get('content_id')

        # Validate required fields
        if not user_id or not text or not content_id:
            return Response(
                {"error": "user_id, text, and content_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Fetch the user instance using the provided user_id
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": f"User with id {user_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Create the comment
        comment = Comment.objects.create(
            user=user,
            comment=text,
            comment_type="User",
            content_id=content_id,
        )

        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        queryset = self.queryset

        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user__id=user_id)

            recipient = self.request.query_params.get('friend')
            if recipient:
                queryset = queryset.filter(recipient__username=recipient)

        return queryset.order_by('-date')
