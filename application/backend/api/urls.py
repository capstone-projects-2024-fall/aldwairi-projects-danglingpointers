from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DjangoUserViewSet

router = DefaultRouter()
router.register(r'users', DjangoUserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
