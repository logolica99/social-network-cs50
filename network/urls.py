
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("all_posts",views.all_posts),
    path("<int:user_id>",views.user_info,name="user"),
    path("following",views.following)
]
