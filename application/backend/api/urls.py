from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import *

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'user-metadata', UserMetaDataViewSet)
router.register(r'games', GameViewSet)
router.register(r'items', ItemViewSet)
router.register(r'security-questions', SecurityQuestionViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'chat-messages', ChatMessageViewSet)
router.register(r'friendship', FriendshipViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('login/', CreateOrLoginView.as_view()),
    path('create-user-metadata/', CreateUserMetaDataView.as_view()),
    path('update-user-metadata/', UpdateUserMetaDataView.as_view()),
    path('user-count/', UserCountView.as_view()),
    path('friendships/', ManageFriendship.as_view()),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('token/verify/', TokenVerifyView.as_view()),
]
