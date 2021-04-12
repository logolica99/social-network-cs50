from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime

class User(AbstractUser):
    
    def serialize(self):
        return{
            "id":self.id,
            "username":self.username,
            "email":self.email,
       
            
            

        }



class Posts(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.TextField(blank=True)

  

        
    def serialize(self):
        return{
            "id":self.id,
            "username":self.user.username,
            "created_at":self.created_at.strftime("%b %d %Y, %I:%M %p"),
            "content":self.content,
            "likes":self.likes.count(),
    }
  
class Likes(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Liked_post")
    post = models.ForeignKey(Posts, on_delete=models.CASCADE,related_name="likes")

class Follower_model(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    following = models.ForeignKey(User,on_delete=models.CASCADE,related_name="following")
    