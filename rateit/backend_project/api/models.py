from django.db import models

# Create your models here.
# -- coding: utf-8 --
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models

class Role(models.Model):
    name = models.CharField(max_length=20, unique=True)

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # hashed
    address = models.TextField(max_length=400)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Store(models.Model):
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(null=True, blank=True)
    address = models.TextField(max_length=400)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role__name': 'Store Owner'})
    created_at = models.DateTimeField(auto_now_add=True)

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'store')