from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime

class User(AbstractUser):
    pass


# class User_profile(models.Model):
#     user_info = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_profile")
#     posts = models.ForeignKey(Posts,on_delete=models.CASCADE,related_name="user_profile")
#     Following_info = models.ForeignKey(Follower_model,on_delete=models.CASCADE,related_name="User_profile")

class Posts(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content = models.TextField(blank=True)
  
class Likes(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Liked_post")
    post = models.ForeignKey(Posts, on_delete=models.CASCADE,related_name="likes")

class Follower_model(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    following = models.ForeignKey(User,on_delete=models.CASCADE,related_name="following")
    