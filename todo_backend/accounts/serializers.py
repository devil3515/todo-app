from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password_confirm']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')  # Remove before creation
        return CustomUser.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            try:
                user_obj = CustomUser.objects.get(username=username)
                email = user_obj.email
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError("Invalid username or password.")

            user = authenticate(
                request=self.context.get('request'),
                email=email,
                password=password
            )

            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is disabled.")
                return {'user': user}

            raise serializers.ValidationError("Invalid username or password.")
        raise serializers.ValidationError("Must include 'username' and 'password'.")
