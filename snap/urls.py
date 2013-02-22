from trelloclone.api import BoardResource, CardResource, UserResource
from django.conf.urls import patterns, include, url
from django.contrib import admin
from tastypie.api import Api
admin.autodiscover()

v1_api = Api(api_name="v1")
v1_api.register(UserResource())
v1_api.register(BoardResource())
v1_api.register(CardResource())

urlpatterns = patterns('',
     url(r'^admin/', include(admin.site.urls)),
     url(r'^api/', include(v1_api.urls)),
)
