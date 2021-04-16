
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("user/<str:username>",views.user_page,name="user_page"),
    path("followings",views.following_posts,name="following_posts"),
    path("all_posts",views.all_posts),
    path("user/users/<int:user_id>",views.user_info),
    path("user/users/posts/<str:username>",views.user_posts),
    path("following",views.following)
]
