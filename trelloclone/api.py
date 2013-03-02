import copy
from functools import partial
from django.contrib.auth.models import User
from tastypie.api import Api
from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from .models import Board, Card
from .api_utils import foreign_key_to_id, many_to_many_to_ids
from .serializers import EmberJSONSerializer

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'

class BoardResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'owner')
    card_ids = fields.ToManyField("trelloclone.api.CardResource", 'cards',full=True)
    
    class Meta:
        detail_allowed_methods = ['get', 'post', 'put', 'delete']
        queryset = Board.objects.all()
        excludes = ['cards',]
        resource_name = 'board'
        collection_name = 'boards'
        always_return_data = True
        authorization = Authorization()

    dehydrate_card_ids = partial(many_to_many_to_ids, field_name="cards")

class CardResource(ModelResource):
    board_id  = fields.ForeignKey(BoardResource, 'parent_board', related_name='board_id', null=True)

    class Meta:
        field_list_to_remove = ['content']
        detail_allowed_methods = ['get', 'post', 'put', 'delete']
        queryset = Card.objects.all()
        resource_name = 'card'
        collection_name = 'cards'
        always_return_data = True
        authorization = Authorization()

    #dehydrate_board_id = partial(foreign_key_to_id, field_name="parent_board")
