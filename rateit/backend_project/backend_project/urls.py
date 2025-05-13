# backend_project/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ExecuteQueryView, RatingViewSet, RegisterUserView, RoleViewSet, StoreViewSet, UserViewSet, get_current_user
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'execute-query',ExecuteQueryView ,basename='execute-query')
router.register(r'users', UserViewSet, basename='user')
router.register(r'stores', StoreViewSet, basename='store')
router.register(r'ratings', RatingViewSet, basename='rating')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', RegisterUserView.as_view(), name='register'),

]

urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', get_current_user),

]