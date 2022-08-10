from django.urls import path

from products.views import BlogCreateView, RestaurantCreateView, RestaurantEditView, MenuCreateView, MenuEditView, \
    CommentCreateView, RestaurantDetailView, BlogListView, BlogDetailView, SearchResultView, BlogLDView, CommentLDView, \
    AllFeedView, DeleteBlogView, ADFeedView, DeleteMenuView, RestaurantDeleteView, CreateRestaurantImageView, \
    RestaurantLDView, \
    NotificationView, RestaurantImageDeleteView, MyRestaurantDetailView, MyRestaurantImagesView, AllFeedBlogsView, \
    MyRestaurantShortView, RestaurantMenusDetailView, RestaurantCommentsDetailView

app_name = 'restaurant'

urlpatterns = [
    path('add/', RestaurantCreateView.as_view(), name='add_restaurant'),
    path('edit/', RestaurantEditView.as_view(), name='edit_restaurant'),
    path('<str:restaurant_id>/', RestaurantDetailView.as_view(), name='restaurant'),
    path('my/short/', MyRestaurantShortView.as_view(), name='my_restaurant_short'),
    path('own/restaurant/', MyRestaurantDetailView.as_view(), name='own_restaurant'),
    path('delete/<str:restaurant_id>/', RestaurantDeleteView.as_view(), name='delete_restaurant'),
    path('image/add/', CreateRestaurantImageView.as_view(), name='restaurant_image_add'),
    path('image/delete/<str:image_id>/', RestaurantImageDeleteView.as_view(), name='restaurant_image_delete'),
    path('<str:restaurant_id>/image/all/', MyRestaurantImagesView.as_view(), name='restaurant_images'),
    path('ld/<str:restaurant_id>/', RestaurantLDView.as_view(), name='restaurant_ld'),
    path('menu/add/', MenuCreateView.as_view(), name='add_menu'),
    path('menu/edit/<str:menu_id>/', MenuEditView.as_view(), name='edit_menu'),
    path('menu/delete/<str:menu_id>/', DeleteMenuView.as_view(), name='delete_menu'),
    path('blog/add/', BlogCreateView.as_view(), name='add_blog'),
    path('blog/delete/<str:blog_id>/', DeleteBlogView.as_view(), name='delete_blog'),
    path('blog/<str:blog_id>/', BlogDetailView.as_view(), name='blog'),
    path('blog/ld/<str:blog_id>/', BlogLDView.as_view(), name='blog_ld'),
    path('<str:restaurant_id>/blog/all/', BlogListView.as_view(), name='all_blog'),
    path('<str:restaurant_id>/comment/add/', CommentCreateView.as_view(), name='add_comment'),
    path('comment/ld/<str:comment_id>/', CommentLDView.as_view(), name='comment_ld'),
    path('search/result/<str:input>/', SearchResultView.as_view(), name='search_result'),
    path('feed/add/<str:restaurant_id>/', ADFeedView.as_view(), name='feed_ad'),
    path('<str:restaurant_id>/menus/all/', RestaurantMenusDetailView().as_view(), name='all_menus'),
    path('<str:restaurant_id>/comments/all/', RestaurantCommentsDetailView().as_view(), name='all_comments'),
    path('feed/all/', AllFeedView.as_view(), name='feed_all'),
    path('feed/blogs/all/', AllFeedBlogsView.as_view(), name='feed_blog'),
    path('notif/all/', NotificationView.as_view(), name="notifs")
]
