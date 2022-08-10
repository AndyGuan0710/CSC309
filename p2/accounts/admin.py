from django.contrib import admin

# Register your models here.
from accounts.models import User
from products.models import Restaurant_image, Notification, Restaurant_ld

admin.site.register(User)

admin.site.register(Notification)
admin.site.register(Restaurant_ld)
