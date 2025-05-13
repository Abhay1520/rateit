from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction, connection
from django.db.models import Avg
from rest_framework.viewsets import ViewSet, ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes

from .permissions import IsAdmin, IsStoreOwner, IsNormalUser
from .models import Rating, Role, Store, User
from .serializers import RatingSerializer, RegisterSerializer, RoleSerializer, StoreSerializer, UserSerializer

from django.contrib.auth.models import User as AuthUser

class RegisterUserView(APIView):
    def post(self, request):
        data = request.data
        try:
            auth_user = AuthUser.objects.create_user(
                username=data['email'],  # or any unique field
                email=data['email'],
                password=data['password']
            )

            role = Role.objects.get(name=data['role'])  # Ensure this exists
            user = User.objects.create(
                auth_user=auth_user,
                name=data['name'],
                email=data['email'],
                address=data['address'],
                role=role,
                password=auth_user.password  # optional to store hashed copy
            )

            return Response({
                "user_id": user.id,
                "username": auth_user.username,
                "role": user.role.name
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ExecuteQueryView(ViewSet):
    def retrieve(self, request, pk=None):
        with connection.cursor() as cursor:
            try:
                if pk == '1':
                    cursor.execute("SELECT id, name FROM api_role")
                elif pk == '2':
                    cursor.execute("SELECT id, email FROM api_user")
                else:
                    return Response({"detail": "Invalid query id."}, status=status.HTTP_400_BAD_REQUEST)

                results = dictfetchall(cursor)
                return Response(results)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RatingViewSet(ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        try:
            with transaction.atomic():
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StoreViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        try:
            with transaction.atomic():
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RoleViewSet(ViewSet):
    def create(self, request):
        serializer = RoleSerializer(data=request.data)
        try:
            with transaction.atomic():
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            role = get_object_or_404(Role, pk=pk)
            serializer = RoleSerializer(role, data=request.data)
            with transaction.atomic():
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request):
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        role = get_object_or_404(Role, pk=pk)
        serializer = RoleSerializer(role)
        return Response(serializer.data)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        try:
            with transaction.atomic():
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        try:
            total_users = User.objects.count()
            total_stores = Store.objects.count()
            total_ratings = Rating.objects.count()

            return Response({
                "total_users": total_users,
                "total_stores": total_stores,
                "total_ratings": total_ratings
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StoreOwnerDashboard(APIView):
    permission_classes = [IsStoreOwner]

    def get(self, request):
        try:
            store = Store.objects.get(owner=request.user)
            ratings = Rating.objects.filter(store=store)
            avg_rating = ratings.aggregate(Avg('rating'))["rating__avg"]

            return Response({
                "store_name": store.name,
                "average_rating": avg_rating,
                "ratings": RatingSerializer(ratings, many=True).data
            })
        except ObjectDoesNotExist:
            return Response({"error": "Store not found for this owner."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    try:
        user = User.objects.get(auth_user=request.user)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)