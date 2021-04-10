from django.forms import ModelForm
from .models import *
from django import forms

class PostingForm(ModelForm):
    content = forms.CharField(widget=forms.Textarea(attrs={'cols': 60, 'rows': 7}))
 
    class Meta:
        model = Posts
        fields="__all__"