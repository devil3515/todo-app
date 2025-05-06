from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from .serializers import UserSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

class RegisterAPI(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            token = Token.objects.create(user=user)
            
            # Using UserSerializer to return user data in a consistent way
            return Response({
                "user": UserSerializer(user).data,
                "token": token.key
            }, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            return Response(
                {"errors": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        except IntegrityError:
            return Response(
                {"errors": {"email": ["This email is already registered."]}},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"errors": {"non_field_errors": [str(e)]}},
                status=status.HTTP_400_BAD_REQUEST
            )

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                },
                "token": token.key
            }, status=status.HTTP_200_OK)
            
        except serializers.ValidationError as e:
            return Response(
                e.detail,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"non_field_errors": ["An error occurred during login."]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LogoutAPI(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        try:
            # Get the token from the Authorization header
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Token '):
                token_key = auth_header.split(' ')[1]
                token = Token.objects.get(key=token_key)
                token.delete()
            
            logout(request)
            return Response(
                {"detail": "Successfully logged out."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
