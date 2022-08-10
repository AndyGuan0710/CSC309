from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    avatar = models.ImageField(upload_to='user_avatars/', default='user_avatars/default.png')
    phone_number = models.CharField(null=True, blank=True, max_length=30)
    is_owner = models.BooleanField(default=False)
    address = models.CharField(null=True, blank=True, max_length=100)
    password2 = models.CharField(null=True, blank=True, max_length=100)
