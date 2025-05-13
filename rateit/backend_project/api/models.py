from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models
from django.contrib.auth.models import User as AuthUser
from psycopg2 import Date

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_by = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='%(class)s_created_by', null=True, blank=True)
    updated_by = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='%(class)s_updated_by', null=True, blank=True)

    class Meta:
        abstract = True


class Role(BaseModel):
    name = models.CharField(max_length=20, unique=True)

class User(BaseModel):
    auth_user = models.OneToOneField(AuthUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # optional; avoid duplicating
    address = models.TextField(max_length=400)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Store(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(null=True, blank=True)
    address = models.TextField(max_length=400)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role__name': 'Store Owner'})

class Rating(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])


    class Meta:
        unique_together = ('user', 'store')