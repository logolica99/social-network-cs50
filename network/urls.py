
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("user/<str:username>",views.user_page,name="user_page"),
    path("all_posts",views.all_posts),
    path("user/<int:user_id>",views.user_info),
    path("following",views.following)
]
