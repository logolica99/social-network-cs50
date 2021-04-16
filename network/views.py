from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
import json
from django.core.paginator import Paginator,EmptyPage
import math

from .models import *
from .forms import *


def index(request):
    
    page_num = int(request.GET.get('page',1))
    num_of_posts = Posts.objects.all().count()
    
    min_page_num = 1
    max_page_num = math.ceil(num_of_posts/10)
    has_previous = False
    if page_num > 1:
        has_previous = True
    has_next = False
    if page_num < max_page_num:
        has_next = True
    print(has_previous, has_next)
    next_page = page_num + 1
    prev_page = page_num -1
    

    context = {'has_previous':has_previous,'has_next':has_next,'next_page':next_page,'prev_page':prev_page}
    return render(request, "network/index.html",context)
   

@csrf_exempt
def all_posts(request):
    posts_all = Posts.objects.all()
    posts_all = posts_all.order_by("-created_at").all()
    reply = []
    for post in posts_all:
        data = post.serialize()
        liked = True
        
        try:
            Likes.objects.get(user=User.objects.get(id=request.user.id),post=Posts.objects.get(id=data['id']))
        except:
            liked = False
   
        data['liked']=liked
        reply.append(data)

    if request.method=="POST":
        data = json.loads(request.body)
        print(data)
        f = Posts(user=User.objects.get(id=request.user.id),content=data['content'])
        f.save()
    
    
    
    if request.method=="PUT":
        data = json.loads(request.body)
        print(data)
        if 'like' in data:
            if data["like"]==True:
                a = Likes(user=User.objects.get(id=request.user.id),post=Posts.objects.get(id=data['post_id']))
                a.save()
            elif data["like"]==False:
                a = Likes.objects.get(user=User.objects.get(id=request.user.id),post=Posts.objects.get(id=data['post_id']))
                a.delete()
        if 'content' in data:
            f=Posts.objects.get(id=data['post_id'])
            f.content = data['content']
            f.save()
    
    
    if request.GET.get('page')=="null":
        page_num = 1

    else:
        page_num = int(request.GET.get('page',1))
    
    number_posts_per_page = 10
    max__page_num = math.ceil(len(reply)/number_posts_per_page)
    if page_num > max__page_num:
        page_num=1
    start = (page_num-1)*number_posts_per_page
    end  =  (page_num-1)*number_posts_per_page+number_posts_per_page
    if page_num == max__page_num:
        end = len(reply)
   
    data_reply = [reply[i] for i in range(start,end)]
  
    return JsonResponse(data_reply,safe=False)
    

def following(request):

    following_id = []
    for follower in Follower_model.objects.all():
        if follower.following == User.objects.get(id=request.user.id):
            following_id.append(follower.user.id)

    
    following_posts = []
    for i in following_id:
      
        postss = Posts.objects.filter(user=User.objects.get(id=i))
        for post in postss:
            data = post.serialize()
            liked = True
        
            try:
                Likes.objects.get(user=User.objects.get(id=request.user.id),post=Posts.objects.get(id=data['id']))
            except:
                liked = False
    
            data['liked']=liked

            following_posts.append(data)

    following_posts = sorted(following_posts, key=lambda k:k['created_at'],reverse=True)
    if request.method=="PUT":
        data = json.loads(request.body)
        print(data)
        if data["like"]==True:
            a = Likes(user=User.objects.get(id=request.user.id),post=Posts.objects.get(id=data['post_id']))
            a.save()
        elif data["like"]==False:
            a = Likes.objects.get(user=User.objects.get(id=request.user.id),post=Posts.objects.get(id=data['post_id']))
            a.delete()
    
    
    if request.GET.get('page')=="null":
        page_num = 1

    else:
        page_num = int(request.GET.get('page',1))
    
    number_posts_per_page = 10
    max__page_num = math.ceil(len(following_posts)/number_posts_per_page)
    if page_num > max__page_num:
        page_num=1
    start = (page_num-1)*number_posts_per_page
    end  =  (page_num-1)*number_posts_per_page+number_posts_per_page
    if page_num == max__page_num:
        end = len(following_posts)
   
    data_reply = [following_posts[i] for i in range(start,end)]
    return JsonResponse(data_reply,safe=False)
    # following_posts= set()
    # for i in following_id:
    #     following_posts.add(Posts.objects.get(user=User.objects.get(id=i)))
    # following_posts = following_posts.order_by("-created_at").all()
    # return JsonResponse([post.serialize() for post in following_posts],safe=False)

def following_posts(request):
    following_id = []
    for follower in Follower_model.objects.all():
        if follower.following == User.objects.get(id=request.user.id):
            following_id.append(follower.user.id)

    
    following_posts = []
    for i in following_id:
      
        postss = Posts.objects.filter(user=User.objects.get(id=i))
        for post in postss:
            data = post.serialize()
            liked = True
        
            try:
                Likes.objects.get(user=User.objects.get(id=request.user.id),post=Posts.objects.get(id=data['id']))
            except:
                liked = False
    
            data['liked']=liked

            following_posts.append(data)

    page_num = int(request.GET.get('page',1))
    num_of_posts = len(following_posts)
    
    min_page_num = 1
    max_page_num = math.ceil(num_of_posts/10)
    has_previous = False
    if page_num > 1:
        has_previous = True
    has_next = False
    if page_num < max_page_num:
        has_next = True
    print(has_previous, has_next)
    next_page = page_num + 1
    prev_page = page_num -1
    

    context = {'has_previous':has_previous,'has_next':has_next,'next_page':next_page,'prev_page':prev_page}
    return render(request,'network/following.html',context)

@csrf_exempt
def user_info(request,user_id):
    user_profile = User.objects.get(id=user_id)
    logged_in = User.objects.get(id=request.user.id)


    can_follow = True
    if request.user.id == user_profile.id:
        can_follow = False


    already_following = True
    if len(Follower_model.objects.filter(user=user_profile,following=logged_in))==0:
        already_following = False
    data = user_profile.serialize()
    data['can_follow'] = can_follow
    data['already_following'] = already_following
    data['follower']=Follower_model.objects.filter(user=user_profile).count()
    data['following'] = user_profile.following.count()
    reply = [data]
    return JsonResponse(reply,safe=False)
    

    # if request.method == "POST":
 
    #     data = json.loads(request.body)
    #     print(data)
    #     if data['following'] == True:
           
    #         hello = Follower_model(user=user_profile,following=logged_in)
    #         hello.save()
            
    #     elif data['following'] == False:
    #         hello = Follower_model.objects.get(user=user_profile,following=logged_in)
    #         hello.delete()
    #     return HttpResponseRedirect(reverse('user',args=(user_profile.username)))
        
        
        
        
    
    # context = {
    #             'user_info': user_profile,
    #             'follower': Follower_model.objects.filter(user=user_profile).count, 
    #             'posts':Posts.objects.filter(user=user_profile),
    #             'can_follow':can_follow,
    #             'already_following':already_following
    #             }
    # return render(request,"network/user-profile.html",context)


@csrf_exempt
def user_page(request,username):
    

    if  request.method == "PUT":
        data = json.loads(request.body)
        print(data)
        if data['follow']==False:
            f = Follower_model.objects.get(user=User.objects.get(username=data['username']), following=User.objects.get(id=request.user.id))
            f.delete()
        else:
            f = Follower_model(user=User.objects.get(username=data['username']), following=User.objects.get(id=request.user.id))
            f.save()
       
    page_num = int(request.GET.get('page',1))
    num_of_posts = Posts.objects.filter(user = User.objects.get(username=username)).count()
    
    min_page_num = 1
    max_page_num = math.ceil(num_of_posts/10)
    has_previous = False
    if page_num > 1:
        has_previous = True
    has_next = False
    if page_num < max_page_num:
        has_next = True
    print(has_previous, has_next)
    next_page = page_num + 1
    prev_page = page_num -1
    

    context = {'user_id':User.objects.get(username=username).id,'username':username,'has_previous':has_previous,'has_next':has_next,'next_page':next_page,'prev_page':prev_page}
    return render(request,"network/user-profile.html",context)


def user_posts(request,username):
    posts_all = Posts.objects.filter(user = User.objects.get(username=username))
    posts_all = posts_all.order_by("-created_at").all()
    reply = []
    for post in posts_all:
        data = post.serialize()
        liked = True
        
        try:
            Likes.objects.get(user=User.objects.get(id=request.user.id),post=Posts.objects.get(id=data['id']))
        except:
            liked = False
   
        data['liked']=liked
        reply.append(data)
    if request.GET.get('page')=="null":
        page_num = 1

    else:
        page_num = int(request.GET.get('page',1))
    
    number_posts_per_page = 10
    max__page_num = math.ceil(len(reply)/number_posts_per_page)
    if page_num > max__page_num:
        page_num=1
    start = (page_num-1)*number_posts_per_page
    end  =  (page_num-1)*number_posts_per_page+number_posts_per_page
    if page_num == max__page_num:
        end = len(reply)
   
    data_reply = [reply[i] for i in range(start,end)]
  
    return JsonResponse(data_reply,safe=False)



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
