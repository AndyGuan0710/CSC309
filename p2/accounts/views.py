from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import status, authentication, exceptions
from rest_framework.generics import RetrieveAPIView, get_object_or_404, UpdateAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from accounts.serializers import ProfileSerializer, \
    CreateUserSerializer
from accounts.serializers import ProfileEditSerializer
from products.models import Menu, Comment, Restaurant_image


class ExampleAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        username = request.META.get('HTTP_X_USERNAME')
        if not username:
            return None

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        return (user, None)


class SignUpView(CreateAPIView):
    serializer_class = CreateUserSerializer

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProfileDetailView(RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # return get_object_or_404(User, id=self.kwargs['user_id'])
        return self.request.user


class ProfileEditView(RetrieveAPIView, UpdateAPIView):
    serializer_class = ProfileEditSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LoginView(APIView):
    # serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        if not request.data.get("username") or not request.data.get("password"):
            return Response({'response': 'Please enter your username and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=request.data.get("username"), password=request.data.get("password"))

        if user:
            login(request, user)

        else:
            user = User.objects.filter(username=request.data['username'])

            if len(user) != 0 and user[0].password2 == request.data['password']:
                login(request, user[0])
            else:
                return Response({'response': 'Username or password is invalid'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'response': 'Login!'}, status=status.HTTP_202_ACCEPTED)

    # def post(self, request, *args, **kwargs):
    #     if not request.data.get("username") or not request.data.get("password"):
    #         return Response({'response': 'Please enter your username and password'}, status=status.HTTP_400_BAD_REQUEST)
    #     user = User.objects.filter(username=request.data['username'])
    #     if user and user.password == request.data['password']:
    #         login(request, user)
    #     else:
    #         return Response({'response': 'Username or password is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    #     return Response({'response': 'Login!'}, status=status.HTTP_202_ACCEPTED)

class LogoutView(APIView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            logout(request)
            return Response({'response': 'Logout !'}, status=status.HTTP_202_ACCEPTED)
        return Response({'response': 'You need to login first'}, status=status.HTTP_400_BAD_REQUEST)


class DeleteUserView(APIView):
    def get(self, request, *args, **kwargs):
        # for i in range(10, 15):
        #     user = get_object_or_404(User, username="User" + str(i))
        #     user.delete()
        images = Restaurant_image.objects.all()
        for i in images:
            if i.id >= 9:
                i.delete()
        return Response({'deleted'}, status=status.HTTP_202_ACCEPTED)