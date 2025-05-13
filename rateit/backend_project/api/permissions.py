from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user.role, 'name', '') == "System Administrator"

class IsStoreOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user.role, 'name', '') == "Store Owner"

class IsNormalUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user.role, 'name', '') == "Normal User"
