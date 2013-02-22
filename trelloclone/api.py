from django.contrib.auth.models import User
from tastypie.api import Api
from tastypie.resources import ModelResource
from trelloclone.models import Board, Card

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'

class CardResource(ModelResource):
    class Meta:
        queryset = Card.objects.all()
        resource_name = 'card'

class BoardResource(ModelResource):
    class Meta:
        queryset = Board.objects.all()
        resource_name = 'board'
