from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import UserViewSet, UserMetaDataViewSet, GameViewSet, ItemViewSet, CreateOrLoginView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'user-metadata', UserMetaDataViewSet)
router.register(r'games', GameViewSet)
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', CreateOrLoginView.as_view()),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('token/verify/', TokenVerifyView.as_view()),
]
