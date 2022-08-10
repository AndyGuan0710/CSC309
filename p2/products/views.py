from datetime import datetime

from django.core.paginator import InvalidPage
from django.http import Http404
from django.shortcuts import render
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import status, pagination, authentication, exceptions
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from rest_framework.generics import RetrieveAPIView, get_object_or_404, UpdateAPIView, CreateAPIView, ListAPIView, \
    DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from accounts.models import User
from accounts.serializers import ProfileSerializer
from accounts.serializers import ProfileEditSerializer
from products.models import Restaurant, Menu, Blog, action_validator, Blog_ld, Comment_ld, Comment, \
    action_validator_feed, Feed, Restaurant_ld, Notification, Restaurant_image
from products.serializers import BlogCreateSerializer, RestaurantCreateSerializer, RestaurantEditSerializer, \
    MenuCreateSerializer, MenuEditSerializer, CommentCreateSerializer, CommentDetailSerializer, \
    RestaurantDetailSerializer, BlogDetailSerializer, MenuDetailSerializer, FeedDetailSerializer, CommentLDSerializer, \
    BlogLDSerializer, FeedADSerializer, RestaurantImageSerializer, RestaurantImageDetailSerializer, \
    RestaurantLDSerializer, \
    NotifSerializer


class RestaurantPagination(pagination.LimitOffsetPagination):
    pass


def get_popularity(restaurant):
    return len(restaurant.comments.all())


class RestaurantCreateView(CreateAPIView):
    serializer_class = RestaurantCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        self.request.user.is_owner = True
        self.request.user.save()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        user = self.request.user
        user.is_owner = True
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class RestaurantEditView(UpdateAPIView, RetrieveAPIView):
    serializer_class = RestaurantEditSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        restaurant = self.request.user.restaurant.all()
        if len(restaurant) == 0:
            raise NotFound
        restaurant = restaurant[0]
        if restaurant.belongs.id != self.request.user.id:
            raise PermissionDenied("403 FORBIDDEN")

        return self.request.user.restaurant.all()[0]

    def retrieve(self, request, *args, **kwargs):
        restaurant = self.request.user.restaurant.all()
        if len(restaurant) == 0:
            raise NotFound
        restaurant = restaurant[0]
        if restaurant.belongs.id != self.request.user.id:
            raise PermissionDenied("403 FORBIDDEN")
        restaurant_serializer = RestaurantDetailSerializer(restaurant)
        data = restaurant_serializer.data
        images = restaurant.images.all()
        image_serializer = RestaurantImageDetailSerializer(images, many=True)
        data['images'] = image_serializer.data

        return Response(data)


class RestaurantImageDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        image = get_object_or_404(Restaurant_image, id=self.kwargs['image_id'])

        if len(self.request.user.restaurant.all()) == 0 or image.restaurant.id != self.request.user.restaurant.all()[
            0].id:
            raise PermissionDenied("403 FORBIDDEN")
        return image


class CreateRestaurantImageView(CreateAPIView):
    serializer_class = RestaurantImageSerializer
    permission_classes = [IsAuthenticated]


# class BlogCreateView(APIView):
#     def get(self, request, *args, **kwargs):
#         restaurant_id = self.kwargs.get('restaurant_id')
#         restaurant = Restaurant.objects.filter(id=restaurant_id)
#         if len(restaurant) == 0:
#             raise Http404("Restaurant id not found")
#         restaurant = restaurant[0]
#         blogs = restaurant.blog.all()
#         serializer = BlogSerializer(blogs, many=True)
#         return Response(serializer.data)
#
#     def post(self, request, *args, **kwargs):
#         print(request.data)
#         serializer = BlogSerializer(data=request.date, many=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlogCreateView(CreateAPIView):
    serializer_class = BlogCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if len(self.request.user.restaurant.all()) == 0:
            raise NotFound('You do not have any restaurant')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = serializer.data
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MenuCreateView(CreateAPIView):
    serializer_class = MenuCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if len(self.request.user.restaurant.all()) == 0:
            raise NotFound('You do not have any restaurant')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MenuEditView(UpdateAPIView, RetrieveAPIView):
    serializer_class = MenuEditSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        menu = get_object_or_404(Menu, id=self.kwargs['menu_id'])
        if len(self.request.user.restaurant.all()) == 0:
            raise NotFound('You do not have any restaurant')
        if self.request.user.restaurant.all()[0].id != menu.belong.id:
            raise PermissionDenied("403 FORBIDDEN")
        return menu


class CommentCreateView(CreateAPIView):
    serializer_class = CommentCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"restaurant_id": self.kwargs['restaurant_id'], 'user': self.request.user}


class RestaurantDetailView(ListAPIView, CreateAPIView):
    serializer_class = CommentCreateSerializer
    pagination_class = RestaurantPagination

    def get_queryset(self):
        restaurant = Restaurant.objects.get(id=self.kwargs['restaurant_id'])
        menus = restaurant.menus.all()
        comments = restaurant.comments.all()
        return [restaurant]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        restaurant = queryset[0]

        comments = restaurant.comments.all()

        rating = 0
        for i in comments:
            rating += i.rating
        if len(comments) > 0:
            print(len(comments) > 0)
            rating = rating / len(comments)
        restaurant.rating = round(rating)
        restaurant.save()
        images = restaurant.images.all()
        images_page = self.paginate_queryset(images)
        # self.pagination_class = RestaurantPagination
        restaurant_serializer = RestaurantDetailSerializer(restaurant)

        data = {'restaurant': restaurant_serializer.data}

        if images_page is not None:
            image_serializer = RestaurantImageDetailSerializer(images_page, many=True)
            data['images'] = image_serializer.data

            return self.get_paginated_response(data)
        return Response(data)

    def get_serializer_context(self):
        return {"restaurant_id": self.kwargs['restaurant_id'], 'user': self.request.user}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return self.get(self, request, *args, **kwargs)


# class RestaurantDetailView(RetrieveAPIView, CreateAPIView):
#     serializer_class = CommentCreateSerializer
#
#     def retrieve(self, request, *args, **kwargs):
#         restaurant = Restaurant.objects.get(id=self.kwargs['restaurant_id'])
#         menus = restaurant.menus.all()
#         comments = restaurant.comments.all()
#
#         rating = 0
#         for i in comments:
#             rating += i.rating
#         if len(comments) >= 0:
#             rating = rating / len(comments)
#         restaurant.rating = round(rating)
#         restaurant.save()
#
#         restaurant_serializer = RestaurantDetailSerializer(restaurant)
#         data = {'restaurant': restaurant_serializer.data}
#         menu_serializer = MenuCreateSerializer(menus, many=True)
#         data['menus'] = menu_serializer.data
#         comment_serializer = CommentDetailSerializer(comments, many=True)
#         data['comments'] = comment_serializer.data
#
#         return Response(data)
#
#     def get_serializer_context(self):
#         return {"restaurant_id": self.kwargs['restaurant_id'], 'user': self.request.user}
#
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         # return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
#         return self.retrieve(self, request, *args, **kwargs)


# class BlogListView(RetrieveAPIView):
#     serializer_class = BlogDetailSerializer
#
#     def retrieve(self, request, *args, **kwargs):
#         restaurant = Restaurant.objects.get(id=self.kwargs['restaurant_id'])
#         blogs = restaurant.blogs.all()
#
#         blog_serializer = BlogDetailSerializer(blogs, many=True)
#         data = {'blogs': blog_serializer.data}
#         return Response(data)

class BlogPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 1000


class BlogListView(ListAPIView):
    serializer_class = BlogDetailSerializer
    pagination_class = BlogPagination

    def get_queryset(self):
        restaurant = Restaurant.objects.get(id=self.kwargs['restaurant_id'])
        blogs = list(restaurant.blogs.all())
        blogs.sort(key=lambda x: x.create_time, reverse=True)
        return blogs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            current_user = self.request.user
            if not current_user.is_authenticated:
                for i in range(len(page)):
                    data[i].update({'current_user_action': None})
                return self.get_paginated_response(data)
            else:
                for i in range(len(page)):
                    blog = page[i]
                    lds = blog.lds.filter(user=current_user, blog=blog)
                    if len(lds) == 0:
                        data[i].update({'current_user_action': None})
                    else:
                        data[i].update({'current_user_action': lds[0].action})
                return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class BlogDetailView(RetrieveAPIView):
    serializer_class = BlogDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])

        blog_serializer = BlogDetailSerializer(blog)
        data = blog_serializer.data
        return Response(data)


class SearchPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 1000


class SearchResultView(ListAPIView):
    serializer_class = RestaurantDetailSerializer
    pagination_class = SearchPagination

    def get_queryset(self):
        search_input = self.kwargs['input']
        if search_input == "all":
            restaurant_result = []
            for restaurant in Restaurant.objects.all():
                restaurant_result.append(restaurant)
            restaurant_result.sort(key=get_popularity, reverse=True)
            return restaurant_result
        restaurants = Restaurant.objects.all()
        menus = Menu.objects.all()
        restaurant_result = []
        menu_result = []

        for restaurant in restaurants:
            if search_input.lower() in restaurant.name.lower() or search_input.lower() in restaurant.address.lower():
                restaurant_result.append(restaurant)

        for menu in menus:
            if search_input.lower() in menu.name.lower():
                menu_result.append(menu)
        # if len(menu_result) != 0:
        #     menu_serializer = MenuDetailSerializer(menu_result, many=True)
        #     data['menu'] = menu_serializer.data
        for menu in menu_result:
            if menu.belong not in restaurant_result:
                restaurant_result.append(menu.belong)

        restaurant_result.sort(key=get_popularity, reverse=True)
        return restaurant_result

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            current_user = self.request.user
            if not current_user.is_authenticated:
                for i in range(len(page)):
                    data[i].update({'current_user_action': None})
                return self.get_paginated_response(data)
            else:
                feeds = current_user.feeds.all()
                feeds_restaurant_ids = []
                for feed in feeds:
                    feeds_restaurant_ids.append(feed.restaurant.id)
                for i in range(len(page)):
                    restaurant = page[i]
                    lds = restaurant.lds.filter(user=current_user, restaurant=restaurant)
                    if len(lds) == 0:
                        data[i].update({'current_user_action': None})
                    else:
                        data[i].update({'current_user_action': lds[0].action})
                    if restaurant.id in feeds_restaurant_ids:
                        data[i].update({'follow': "true"})
                    else:
                        data[i].update({'follow': None})

                return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# class SearchResultView(RetrieveAPIView):
#     serializer_class = RestaurantDetailSerializer
#     queryset = Restaurant.objects.all()
#     def retrieve(self, request, *args, **kwargs):
#         search_input = self.kwargs['input']
#         restaurants = Restaurant.objects.all()
#         menus = Menu.objects.all()
#         restaurant_result = []
#         menu_result = []
#         data = {}
#         for restaurant in restaurants:
#             if search_input in restaurant.name:
#                 restaurant_result.append(restaurant)
#
#         for menu in menus:
#             if search_input in menu.name:
#                 menu_result.append(menu)
#         # if len(menu_result) != 0:
#         #     menu_serializer = MenuDetailSerializer(menu_result, many=True)
#         #     data['menu'] = menu_serializer.data
#         for menu in menu_result:
#             if menu.belong not in restaurant_result:
#                 restaurant_result.append(menu.belong)
#
#         if len(restaurant_result) != 0:
#             restaurant_result.sort(key=get_popularity, reverse=True)
#             restaurant_serializer = RestaurantDetailSerializer(restaurant_result, many=True)
#             data = restaurant_serializer.data
#
#         return Response(data)

class RestaurantLDView(RetrieveAPIView, UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RestaurantLDSerializer

    def get_queryset(self):
        return Restaurant_ld.objects.all()

    def retrieve(self, request, *args, **kwargs):
        current_restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        current_user_id = self.request.user.id
        current_user = User.objects.get(id=current_user_id)

        lds = current_restaurant.lds.filter(user=current_user, restaurant=current_restaurant)
        if len(lds) == 0:
            lds = [Restaurant_ld.objects.create(user=current_user, restaurant=current_restaurant)]
        restaurant_serializer = RestaurantDetailSerializer(current_restaurant)
        data = restaurant_serializer.data
        data['current_user_action'] = lds[0].action
        return Response(data)

    def get_serializer_context(self):
        return {"restaurant_id": self.kwargs['restaurant_id'], 'user': self.request.user}

    def get_object(self):
        current_restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        current_user = self.request.user
        lds = current_restaurant.lds.filter(user=current_user, restaurant=current_restaurant)

        if len(lds) == 0:
            Restaurant_ld.objects.create(user=current_user, restaurant=current_restaurant)
            lds = current_restaurant.lds.filter(user=current_user, restaurant=current_restaurant)
        # print(lds[0], '\n\n\n\n\n\n\n\n\n\n\n\n')
        return lds[0]


class BlogLDView(RetrieveAPIView, UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogLDSerializer

    def retrieve(self, request, *args, **kwargs):
        current_blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])
        current_user = self.request.user
        lds = current_blog.lds.filter(user=current_user, blog=current_blog)
        if len(lds) == 0:
            lds = [Blog_ld.objects.create(user=current_user, blog=current_blog)]
        blog_serializer = BlogDetailSerializer(current_blog)
        data = blog_serializer.data
        data['current_user_action'] = lds[0].action
        return Response(data)

    def get_serializer_context(self):
        return {"blog_id": self.kwargs['blog_id'], 'user': self.request.user}

    def get_object(self):
        current_blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])
        current_user = self.request.user
        lds = current_blog.lds.filter(user=current_user, blog=current_blog)
        if len(lds) == 0:
            Blog_ld.objects.create(user=current_user, blog=current_blog)
            lds = current_blog.lds.filter(user=current_user, blog=current_blog)
        return lds[0]


class CommentLDView(RetrieveAPIView, UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentLDSerializer

    def retrieve(self, request, *args, **kwargs):

        current_comment = get_object_or_404(Comment, id=self.kwargs['comment_id'])
        current_user = self.request.user
        lds = current_comment.lds.filter(user=current_user, comment=current_comment)
        if len(lds) == 0:
            lds = [Comment_ld.objects.create(user=current_user, comment=current_comment)]
        comment_serializer = CommentDetailSerializer(current_comment)
        data = comment_serializer.data
        data['current_user_action'] = lds[0].action
        return Response(data)

    def get_serializer_context(self):
        return {"comment_id": self.kwargs['comment_id'], 'user': self.request.user}

    def get_object(self):
        current_comment = get_object_or_404(Comment, id=self.kwargs['comment_id'])
        current_user = self.request.user

        lds = current_comment.lds.filter(user=current_user, comment=current_comment)
        if len(lds) == 0:
            Comment_ld.objects.create(user=current_user, comment=current_comment)
            lds = current_comment.lds.filter(user=current_user, comment=current_comment)
        return lds[0]


def NotifFollow(user, restaurant):
    return user.username + " followed your restaurant " + restaurant.name \
           + "."


class ADFeedView(CreateAPIView):
    serializer_class = FeedADSerializer
    permission_classes = [IsAuthenticated]
    queryset = Feed.objects.all()

    def get_serializer_context(self):
        return {"restaurant_id": self.kwargs['restaurant_id'], 'user': self.request.user}

    def create(self, request, *args, **kwargs):
        current_restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        current_user = self.request.user
        current_action = self.request.data['action']
        if current_action not in ['add', 'delete']:
            raise ValidationError(current_action + ' is not a correct feed action')
        feeds = Feed.objects.filter(user=current_user, restaurant=current_restaurant)
        if len(feeds) == 0 and current_action == 'delete':
            return Response({'response': '400 feed not found'}, status=status.HTTP_400_BAD_REQUEST)
        elif len(feeds) != 0 and current_action == 'add':
            return Response({'response': '400 feed already exist'}, status=status.HTTP_400_BAD_REQUEST)
        if current_action == 'add':
            feed = Feed.objects.create(user=current_user, restaurant=current_restaurant)
            feed_serializer = FeedDetailSerializer(feed)
            data = feed_serializer.data
            text = NotifFollow(current_user, current_restaurant)
            Notification.objects.create(sender=current_user,
                                        receiver=current_restaurant.belongs,
                                        content=text,
                                        image=current_user.avatar,
                                        create_time=datetime.now())

            current_restaurant.followers = len(current_restaurant.feed_by.all())
            current_restaurant.save()

            return Response({'response': 'created', 'feed': data}, status=status.HTTP_200_OK)
        elif current_action == 'delete':
            feeds[0].delete()
            current_restaurant.followers = len(current_restaurant.feed_by.all())
            current_restaurant.save()
            return Response({'response': 'deleted'}, status=status.HTTP_200_OK)
        return Response({'response': 'unknown error'}, status=status.HTTP_400_BAD_REQUEST)


class FeedPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 1000


class FeedBlogsPagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 1000


class AllFeedBlogsView(ListAPIView):
    serializer_class = BlogDetailSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = FeedBlogsPagination

    def get_queryset(self):
        current_user = self.request.user
        feeds = current_user.feeds.all()
        blogs = []
        for feed in feeds:
            for j in feed.restaurant.blogs.all():
                blogs.insert(0, j)
        blogs.sort(key=lambda x: x.create_time, reverse=True)
        return blogs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            current_user = self.request.user
            if not current_user.is_authenticated:
                for i in range(len(page)):
                    data[i].update({'current_user_action': None})
                return self.get_paginated_response(data)
            else:

                for i in range(len(page)):
                    blog = page[i]
                    lds = blog.lds.filter(user=current_user, blog=blog)
                    if len(lds) == 0:
                        data[i].update({'current_user_action': None})
                    else:
                        data[i].update({'current_user_action': lds[0].action})
                return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class AllFeedRestaurantPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 1000


class AllFeedView(ListAPIView):
    serializer_class = RestaurantDetailSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = AllFeedRestaurantPagination

    def get_queryset(self):
        current_user = self.request.user
        feeds = current_user.feeds.all()
        restaurants = []
        for i in feeds:
            restaurants.append(i.restaurant)
        restaurants.sort(key=get_popularity, reverse=True)
        return restaurants

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            current_user = self.request.user
            if not current_user.is_authenticated:
                for i in range(len(page)):
                    data[i].update({'current_user_action': None})
                return self.get_paginated_response(data)
            else:

                for i in range(len(page)):
                    restaurant = page[i]
                    lds = restaurant.lds.filter(user=current_user, restaurant=restaurant)
                    if len(lds) == 0:
                        data[i].update({'current_user_action': None})
                    else:
                        data[i].update({'current_user_action': lds[0].action})


                return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DeleteBlogView(DestroyAPIView):
    serializer_class = BlogDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])

        if len(self.request.user.restaurant.all()) == 0 or blog.belong.id != self.request.user.restaurant.all()[0].id:
            # return HttpResponse('User is not the bank owner', status=403)
            raise PermissionDenied("403 FORBIDDEN")
        return blog


class DeleteMenuView(DestroyAPIView):
    serializer_class = MenuDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        menu = get_object_or_404(Menu, id=self.kwargs['menu_id'])

        if len(self.request.user.restaurant.all()) == 0 or menu.belong.id != self.request.user.restaurant.all()[0].id:
            # return HttpResponse('User is not the bank owner', status=403)
            raise PermissionDenied("403 FORBIDDEN")
        return menu


class RestaurantDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])

        if self.request.user.id != restaurant.belongs.id:
            # return HttpResponse('User is not the bank owner', status=403)
            raise PermissionDenied("403 FORBIDDEN")
        self.request.user.is_owner = False
        self.request.user.save()
        return restaurant


class MyRestaurantDetailView(ListAPIView, CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentCreateSerializer
    pagination_class = RestaurantPagination

    def get_queryset(self):
        restaurant = self.request.user.restaurant.all()
        if len(restaurant) == 0:
            raise NotFound
        restaurant = restaurant[0]
        if restaurant.belongs.id != self.request.user.id:
            raise PermissionDenied("403 FORBIDDEN")
        menus = restaurant.menus.all()
        comments = restaurant.comments.all()
        return [restaurant]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        restaurant = queryset[0]
        comments = restaurant.comments.all()
        rating = 0
        for i in comments:
            rating += i.rating
        if len(comments) > 0:
            print(len(comments) > 0)
            rating = rating / len(comments)
        restaurant.rating = round(rating)
        restaurant.save()
        images = restaurant.images.all()
        images_page = self.paginate_queryset(images)
        # self.pagination_class = RestaurantPagination
        restaurant_serializer = RestaurantDetailSerializer(restaurant)

        data = {'restaurant': restaurant_serializer.data}

        if images_page is not None:
            image_serializer = RestaurantImageDetailSerializer(images_page, many=True)
            data['images'] = image_serializer.data

            return self.get_paginated_response(data)
        return Response(data)

    def get_serializer_context(self):
        return {"restaurant_id": self.request.user.restaurant.all()[0].id, 'user': self.request.user}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return self.get(self, request, *args, **kwargs)


class MyRestaurantShortView(RetrieveAPIView):
    serializer_class = RestaurantDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if len(self.request.user.restaurant.all()) == 0:
            raise NotFound
        return self.request.user.restaurant.all()[0]


class ImagesPagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 1000


class MyRestaurantImagesView(ListAPIView):
    serializer_class = RestaurantImageDetailSerializer
    pagination_class = ImagesPagination

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        images = restaurant.images.all()
        return images


class NotifPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'


class NotificationView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotifSerializer
    pagination_class = NotifPagination

    def get_queryset(self):
        current_user = self.request.user
        notifs = current_user.receiver.all()
        notifs = list(notifs)
        notifs.sort(key=lambda x: x.create_time, reverse=True)
        return notifs


class MenuPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 1000


class RestaurantMenusDetailView(ListAPIView):
    serializer_class = MenuDetailSerializer
    pagination_class = MenuPagination

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        menus = restaurant.menus.all()
        return menus


class CommentPagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 1000


class RestaurantCommentsDetailView(ListAPIView):
    serializer_class = CommentDetailSerializer
    pagination_class = CommentPagination

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        comments = list(restaurant.comments.all())
        comments.sort(key=lambda x: x.comment_time, reverse=True)
        return comments

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            current_user = self.request.user
            if not current_user.is_authenticated:
                for i in range(len(page)):
                    data[i].update({'current_user_action': None})
                return self.get_paginated_response(data)
            else:
                for i in range(len(page)):
                    comment = page[i]
                    lds = comment.lds.filter(user=current_user, comment=comment)
                    if len(lds) == 0:
                        data[i].update({'current_user_action': None})
                    else:
                        data[i].update({'current_user_action': lds[0].action})
                return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)
