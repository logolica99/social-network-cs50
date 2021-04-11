from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse

from .models import *


def index(request):
    return render(request, "network/index.html")


def all_posts(request):
    posts_all = Posts.objects.all()
    posts_all = posts_all.order_by("-created_at").all()
    return JsonResponse([post.serialize() for post in posts_all],safe=False)
    

def following(request):
    following_id = []
    for follower in Follower_model.objects.all():
        if follower.following == User.objects.get(id=request.user.id):
            following_id.append(follower.user.id)

    
    following_posts = []
    for i in following_id:
      
        postss = Posts.objects.filter(user=User.objects.get(id=i))
        for post in postss:

            following_posts.append(post.serialize())

    following_posts = sorted(following_posts, key=lambda k:k['created_at'],reverse=True)
   
    return JsonResponse(following_posts,safe=False)
    # following_posts= set()
    # for i in following_id:
    #     following_posts.add(Posts.objects.get(user=User.objects.get(id=i)))
    # following_posts = following_posts.order_by("-created_at").all()
    # return JsonResponse([post.serialize() for post in following_posts],safe=False)

def user_info(request,user_id):
    context = {'user_info':User.objects.get(id=user_id)}
    return render(request,"network/user-profile.html",context)
    

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
