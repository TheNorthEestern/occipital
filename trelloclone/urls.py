# from trelloclone.api import BoardResource, CardResource, UserResource
from django.conf.urls import patterns, include, url
from django.views.generic.simple import direct_to_template

urlpatterns = patterns('trelloclone.views',
        url(r'^$', direct_to_template, {'template':'index/index.html'} ),
)
