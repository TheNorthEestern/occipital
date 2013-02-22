from tastypie.resources import ModelResource
from trelloclone.models import Board

class BoardResource(ModelResource):
    class Meta:
        queryset = Board.objects.all()
        resource_name = 'board'
