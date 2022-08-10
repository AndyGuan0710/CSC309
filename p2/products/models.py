from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import SET_NULL, CASCADE
from accounts.models import User


def action_validator(value):
    if value not in ['like', 'dislike', None]:
        raise ValidationError(value + ' is not a correct action')


def action_validator_feed(value):
    if value not in ['add', 'delete']:
        raise ValidationError(value + ' is not a correct feed action')


class Restaurant(models.Model):
    belongs = models.ForeignKey(to=User, on_delete=CASCADE, null=True, related_name='restaurant')
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    post_code = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    rating = models.IntegerField(default=0)
    phone_number = models.CharField(max_length=15)
    logo = models.ImageField(upload_to='restaurant_images/')
    background_image = models.ImageField(upload_to='restaurant_images/', null=True)
    like = models.IntegerField(default=0)
    dislike = models.IntegerField(default=0)
    followers = models.IntegerField(default=0)

    def __str__(self):
        return self.name + " " + str(self.id)

class Menu(models.Model):
    belong = models.ForeignKey(to=Restaurant, on_delete=CASCADE, null=True, related_name='menus')
    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    menu_image = models.ImageField(upload_to='menu_images/', default='menu_images/6.jpg')
    description = models.CharField(max_length=1000)

    def __str__(self):
        return self.belong.name + ' ' + self.name + " " + str(self.id)


class Comment(models.Model):
    belong = models.ForeignKey(to=Restaurant, on_delete=CASCADE, null=True, related_name='comments')
    author = models.ForeignKey(to=User, on_delete=CASCADE, null=True, related_name='author')
    like = models.IntegerField(default=0)
    dislike = models.IntegerField(default=0)
    comment_body = models.CharField(max_length=500)
    comment_image = models.ImageField(upload_to='comment_images/', null=True, blank=True,  default='comment_images/new3.jfif')
    comment_time = models.DateTimeField()
    rating = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self):
        return str(self.belong.name) + "'s comment " + str(self.id)


class Blog(models.Model):
    like = models.IntegerField(default=0)
    dislike = models.IntegerField(default=0)
    belong = models.ForeignKey(to=Restaurant, on_delete=CASCADE, null=True, related_name='blogs')
    create_time = models.DateTimeField()
    blog_image = models.ImageField(upload_to='blog_images/', null=True, blank=True, default='blog_images/601.jpg')
    blog_body = models.CharField(max_length=5000)
    blog_title = models.CharField(max_length=200)

    def __str__(self):
        return str(self.blog_title) + " id:" + str(self.id)


class Blog_ld(models.Model):
    user = models.ForeignKey(to=User, on_delete=CASCADE, null=True, related_name='ld_blogs')
    action = models.CharField(validators=[action_validator], null=True, blank=True, max_length=7)
    blog = models.ForeignKey(to=Blog, on_delete=CASCADE, null=True, related_name='lds')

    def __str__(self):
        action = self.action
        if self.action is None:
            action = 'None'
        return str(self.user.get_full_name()) + ' ' + action + ' ' + str(self.blog) + ' ' + str(self.id)


class Comment_ld(models.Model):
    user = models.ForeignKey(to=User, on_delete=CASCADE, null=True, related_name='ld_comments')
    action = models.CharField(validators=[action_validator], null=True, blank=True, max_length=7)
    comment = models.ForeignKey(to=Comment, on_delete=CASCADE, null=True, related_name='lds')

    def __str__(self):
        action = self.action
        if self.action is None:
            action = 'None'
        return str(self.user.get_full_name()) + ' ' + action + ' ' + str(self.comment) + ' ' + str(self.id)


class Feed(models.Model):
    user = models.ForeignKey(to=User, on_delete=CASCADE, null=True, related_name='feeds')
    restaurant = models.ForeignKey(to=Restaurant, on_delete=CASCADE, null=True, related_name='feed_by')

    def __str__(self):
        return str(self.user) + ' feed ' + str(self.restaurant)


class Restaurant_image(models.Model):
    image = models.ImageField(upload_to='restaurant_images/', default='blog_images/556.jpg')
    restaurant = models.ForeignKey(to=Restaurant, on_delete=CASCADE, null=True, related_name='images')
    def __str__(self):
        return str(self.restaurant) + "'s image " + str(self.id)
#
# class Restaurant_images(models.Model):
#     image = models.ImageField(upload_to='restaurant_images/')
#     restaurant = models.ForeignKey(to=Restaurant, on_delete=CASCADE, null=True, related_name='image')
#
#     def __str__(self):
#         return str(self.restaurant) + "'s image " + str(self.id)


class Notification(models.Model):
    receiver = models.ForeignKey(to=User, on_delete=CASCADE, related_name = "receiver")
    sender = models.ForeignKey(to=User, on_delete=CASCADE, related_name = "sender")
    content = models.CharField(max_length=200)
    read = models.BooleanField(default=False)
    create_time = models.DateTimeField()
    image = models.ImageField(upload_to='notify_images/', null=True, blank=True)


class Restaurant_ld(models.Model):
    user = models.ForeignKey(to=User, on_delete=CASCADE, null=True, related_name='ld_restaurant')
    action = models.CharField(validators=[action_validator], null=True, blank=True, max_length=7)
    restaurant = models.ForeignKey(to=Restaurant, on_delete=CASCADE, null=True, related_name='lds')

    def __str__(self):
        action = self.action
        if self.action is None:
            action = 'None'
        return str(self.user.get_full_name()) + ' ' + action + ' ' + str(self.restaurant) + ' ' + str(self.id)

