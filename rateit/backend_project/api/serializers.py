from rest_framework import serializers
from .models import Rating, Role, Store, User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'address', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            address=validated_data['address'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = "__all__"
