from abc import ABC
from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
from rest_framework.response import Response

from products.models import Restaurant, Blog, Menu, Comment, Feed, Comment_ld, action_validator, Blog_ld, \
    action_validator_feed, Restaurant_image, Notification, Restaurant_ld


class RestaurantCreateSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'address', 'post_code', 'description',
                  'phone_number', 'logo', 'background_image']

    def create(self, validated_data):
        belongs = self.context['request'].user
        if len(belongs.restaurant.all()) >= 1:
            raise PermissionDenied("You already have a restaurant.")

        return super().create(validated_data | {'belongs': belongs})


class RestaurantEditSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False)
    background_image = serializers.ImageField(required=False)
    id = serializers.ReadOnlyField()

    class Meta:
        model = Restaurant

        fields = ['id', 'name', 'address', 'post_code', 'description',
                  'phone_number', 'logo', 'background_image']
        optional_fields = ['logo', 'background_image']

        # def __init__(self, *args, **kwargs):
        #     super(RestaurantEditSerializer, self).__init__(*args, **kwargs)
        #     self.fields['address'].required = False

    def update(self, instance, validated_data):

        restaurant = self.context['request'].user.restaurant.all()
        if len(restaurant) == 0:
            raise NotFound
        restaurant = restaurant[0]
        if restaurant.belongs.id != self.context['request'].user.id:
            raise PermissionDenied("403 FORBIDDEN")

        if validated_data.get('logo'):
            restaurant.logo.delete(save=True)

        if validated_data.get('background_image'):
            restaurant.background_image.delete(save=True)

        # if validated_data.get('restaurant_image1'):
        #     restaurant.restaurant_image1.delete(save=True)
        #
        # if not validated_data.get('restaurant_image2'):
        #     validated_data.pop('restaurant_image2')
        # else:
        #     restaurant.restaurant_image2.delete(save=True)
        #
        # if not validated_data.get('restaurant_image3'):
        #     validated_data.pop('restaurant_image3')
        # else:
        #     restaurant.restaurant_image3.delete(save=True)

        instance = super(RestaurantEditSerializer, self).update(instance, validated_data)
        return instance


class BlogCreateSerializer(serializers.ModelSerializer):
    # belongs = serializers.CharField(source='belongs.get_full_name', read_only=True)
    id = serializers.ReadOnlyField()
    create_time = serializers.ReadOnlyField()

    class Meta:
        model = Blog
        fields = ['id', 'create_time', 'blog_title', 'blog_body', 'blog_image']

    def create(self, validated_data):
        if len(self.context['request'].user.restaurant.all()) == 0:
            raise NotFound('You do not have any restaurant')
        like = 0
        dislike = 0
        create_time = datetime.now()
        restaurant = self.context['request'].user.restaurant.all()[0]
        feeds = Feed.objects.filter(restaurant=restaurant)
        for feed in feeds:
            user = feed.user
            content = NotifNewBlog(restaurant, validated_data.get('blog_title'))
            Notification.objects.create(sender=self.context['request'].user,
                                        receiver=user,
                                        content=content,
                                        create_time=datetime.now(),
                                        image=restaurant.logo)

        return super().create(validated_data | {'like': like, 'dislike': dislike,
                                                'create_time': create_time, 'belong': restaurant})


class MenuCreateSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Menu
        fields = ['id', 'name', 'price', 'menu_image', 'description']

    def create(self, validated_data):
        if len(self.context['request'].user.restaurant.all()) == 0:
            raise NotFound('You do not have any restaurant')
        restaurant = self.context['request'].user.restaurant.all()[0]
        feeds = Feed.objects.filter(restaurant=restaurant)
        for feed in feeds:
            user = feed.user
            content = NotifNewMenu(restaurant)
            Notification.objects.create(sender=self.context['request'].user,
                                        receiver=user,
                                        content=content,
                                        create_time=datetime.now(),
                                        image=restaurant.logo)
        return super().create(validated_data | {'belong': restaurant})


class MenuEditSerializer(serializers.ModelSerializer):
    belong = serializers.CharField(source='belong.name', read_only=True)
    menu_image = serializers.ImageField(required=False)
    id = serializers.ReadOnlyField()

    class Meta:
        model = Menu
        fields = ['id', 'name', 'price', 'menu_image', 'description', 'belong']

    def update(self, instance, validated_data):
        if len(self.context['request'].user.restaurant.all()) == 0:
            raise NotFound('You do not have any restaurant')
        if self.context['request'].user.restaurant.all()[0].id != instance.belong.id:
            raise PermissionDenied("403 FORBIDDEN")

        if validated_data.get('menu_image'):
            instance.menu_image.delete(save=True)

        instance = super(MenuEditSerializer, self).update(instance, validated_data)
        restaurant = self.context['request'].user.restaurant.all()[0]
        feeds = Feed.objects.filter(restaurant=restaurant)
        for feed in feeds:
            user = feed.user
            content = NotifNewMenu(restaurant)
            Notification.objects.create(sender=self.context['request'].user,
                                        receiver=user,
                                        content=content,
                                        create_time=datetime.now(),
                                        image=restaurant.logo)
        return instance


class CommentCreateSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = ['id', 'comment_body', 'comment_image', 'rating']

    def create(self, validated_data):
        restaurant_id = self.context["restaurant_id"]
        belong = Restaurant.objects.get(id=restaurant_id)
        dislike = 0
        like = 0
        author = self.context['user']
        comment_time = datetime.now()
        current_restaurant = get_object_or_404(Restaurant, id=restaurant_id)

        text = NotifComment(author, current_restaurant, validated_data.get('comment_body'))
        Notification.objects.create(sender=author,
                                    receiver=current_restaurant.belongs,
                                    content=text,
                                    create_time=datetime.now(),
                                    image=author.avatar)
        print(validated_data)
        return super().create(validated_data | {'belong': belong, 'dislike': dislike, 'like': like,
                                                'author': author, 'comment_time': comment_time})


class CommentDetailSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.get_full_name', read_only=True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = ['id', 'comment_body', 'comment_image', 'rating', 'dislike', 'like', 'author', 'comment_time']


class RestaurantDetailSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'address', 'post_code', 'rating', 'description',
                  'phone_number', 'logo', 'background_image', 'like', 'dislike', 'followers', 'belongs']


class BlogDetailSerializer(serializers.ModelSerializer):
    belong = serializers.CharField(read_only=True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = Blog
        fields = ['id', 'blog_title', 'blog_body', 'blog_image', 'dislike', 'like', 'create_time', 'belong']


class MenuDetailSerializer(serializers.ModelSerializer):
    belong = serializers.CharField(read_only=True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = Menu
        fields = ['id', 'name', 'price', 'menu_image', 'description', 'belong']


class FeedDetailSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.CharField(source='user.get_full_name', read_only=True)
    restaurant = serializers.CharField(source='restaurant.id', read_only=True)

    class Meta:
        model = Feed
        fields = ['id', 'user', 'restaurant']


class CommentLDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment_ld
        fields = ['action']

    def update(self, instance, validated_data):
        current_comment = get_object_or_404(Comment, id=self.context.get('comment_id'))
        current_user = self.context['user']
        print(current_user)
        # print("\n\n\n\n\n\n\n\n\n\n\n\n\n")
        current_action = validated_data.get('action')
        action_validator(current_action)

        if current_action == 'like' and instance.action == current_action:
            instance.action = None
        elif current_action == 'dislike' and instance.action == current_action:
            instance.action = None
        else:
            instance.action = current_action
            if current_action == 'like':
                text = NotiflikeComment(current_comment.author, current_comment.belong)
                Notification.objects.create(sender=current_user,
                                            receiver=current_comment.author,
                                            content=text,
                                            create_time=datetime.now(),
                                            image=current_user.avatar)
        instance.save()

        like = 0
        dislike = 0
        for ld in current_comment.lds.all():
            if ld.action == 'like':
                like += 1
            elif ld.action == 'dislike':
                dislike += 1

        current_comment.like = like
        current_comment.dislike = dislike
        current_comment.save()

        instance = super(CommentLDSerializer, self).update(instance, {})
        return instance


class BlogLDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog_ld
        fields = ['action']

    def update(self, instance, validated_data):
        current_blog = get_object_or_404(Blog, id=self.context['blog_id'])
        current_user = self.context['user']
        current_action = validated_data.get('action')
        action_validator(current_action)
        blog_owner = current_blog.belong.belongs

        if current_action == 'like' and instance.action == current_action:
            instance.action = None
        elif current_action == 'dislike' and instance.action == current_action:
            instance.action = None
        else:
            instance.action = current_action
            if current_action == 'like':
                text = NotifLikeBlog(current_user, current_blog)
                Notification.objects.create(sender=current_user,
                                            receiver=blog_owner,
                                            content=text,
                                            create_time=datetime.now(),
                                            image=current_user.avatar)
        instance.save()
        like = 0
        dislike = 0
        for ld in current_blog.lds.all():
            if ld.action == 'like':
                like += 1
            elif ld.action == 'dislike':
                dislike += 1

        current_blog.like = like
        current_blog.dislike = dislike
        current_blog.save()

        instance = super(BlogLDSerializer, self).update(instance, {})
        return instance


class FeedADSerializer(serializers.Serializer):
    action = serializers.CharField(validators=[action_validator_feed])

    def create(self, validated_data):
        if validated_data.get('action') not in ['add', 'delete']:
            raise serializers.ValidationError(validated_data.get('action') + ' is not a correct feed action')
        return None


class RestaurantImageSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Restaurant_image
        fields = ['id', 'image']

    def create(self, validated_data):
        restaurant = self.context['request'].user.restaurant.all()
        if len(self.context['request'].user.restaurant.all()) == 0:
            raise NotFound
        restaurant = restaurant[0]
        return super().create(validated_data | {'restaurant': restaurant})


class RestaurantImageDetailSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Restaurant_image
        fields = ['image', 'id']


class RestaurantLDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant_ld
        fields = ['action']

    def update(self, instance, validated_data):

        current_restaurant = get_object_or_404(Restaurant, id=self.context['restaurant_id'])
        current_user = self.context['user']
        current_action = validated_data.get('action')
        action_validator(current_action)

        if current_action == 'like' and instance.action == current_action:
            instance.action = None
        elif current_action == 'dislike' and instance.action == current_action:
            instance.action = None
        else:
            instance.action = current_action
            if current_action == 'like':
                text = NotifLikeRestaurant(current_user, current_restaurant)
                Notification.objects.create(sender=current_user,
                                            receiver=current_restaurant.belongs,
                                            content=text,
                                            create_time=datetime.now(),
                                            image=current_user.avatar)
        instance.save()

        like = 0
        dislike = 0
        for ld in current_restaurant.lds.all():
            if ld.action == 'like':
                like += 1
            elif ld.action == 'dislike':
                dislike += 1

        current_restaurant.like = like
        current_restaurant.dislike = dislike
        current_restaurant.save()

        instance = super(RestaurantLDSerializer, self).update(instance, {})
        return instance


class NotifSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Notification
        fields = ['content', "id", "receiver", "sender", "create_time", "image"]


#### Helper -- Notification
def NotifLikeBlog(user, blog):
    return user.username + " liked your blog " + blog.blog_title + "."


def NotifLikeRestaurant(user, restaurant):
    return user.username + " liked your restaurant " + restaurant.name + "."


def NotifComment(user, restaurant, content):
    return user.username + " commented on your restaurant " + restaurant.name + ":" \
           + content + "."


def NotifNewBlog(restaurant, blog):
    return restaurant.name + " posted a new blog " + blog + "."


def NotifNewMenu(restaurant):
    return restaurant.name + " updated its menu."


def NotiflikeComment(user, restaurant):
    return user.username + " liked your comment of " + restaurant.name + '.'
