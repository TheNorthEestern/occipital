from django.contrib.auth.models import User
from tastypie.api import Api
from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from trelloclone.models import Board, Card

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'

class BoardResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'owner')
    cards = fields.ToManyField("trelloclone.api.CardResource", 'cards', full=True)
    
    class Meta:
        queryset = Board.objects.all()
        resource_name = 'board'

class CardResource(ModelResource):
    parent_board = fields.ForeignKey(BoardResource, 'parent_board')

    class Meta:
        queryset = Card.objects.all()
        resource_name = 'card'
