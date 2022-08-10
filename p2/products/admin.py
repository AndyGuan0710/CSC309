from django.contrib import admin

from products.models import Restaurant, Menu, Comment, Blog, Blog_ld, Comment_ld, Feed, Restaurant_image

admin.site.register(Restaurant)
admin.site.register(Menu)
admin.site.register(Comment)
admin.site.register(Blog)
admin.site.register(Blog_ld)
admin.site.register(Comment_ld)
admin.site.register(Feed)
# admin.site.register(Restaurant_images)
admin.site.register(Restaurant_image)