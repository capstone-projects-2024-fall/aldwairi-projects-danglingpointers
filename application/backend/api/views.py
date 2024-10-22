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
