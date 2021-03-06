import pdb
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions, renderers, status
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from .models import Wall, Board, Card
from .permissions import IsOwnerOrReadOnly
from .renderers import CustomJSONRenderer, EmberJSONRenderer
from .serializers import WallSerializer, BoardSerializer, CardSerializer

@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'walls':reverse('wall-list', request=request, format=format),
        'boards':reverse('board-list', request=request, format=format),
        'cards':reverse('single-card-list', request=request, format=format),
    })

class WallList(generics.ListCreateAPIView):
    model = Wall
    serializer_class = WallSerializer
    # permissions_classes = (permissions.IsAuthenticatedOrReadOnly,)
    
    ''' def get_queryset(self):
        user = self.request.user
        return Wall.objects.filter(owner=user)'''

class WallDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Wall
    serializer_class = WallSerializer
    # permissions_classes = (permissions.IsAuthenticatedOrReadOnly,)

class BoardList(generics.ListCreateAPIView):
    model = Board
    serializer_class = BoardSerializer
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    #renderer_classes = (EmberJSONRenderer,)

    #def get_queryset(self):
    #    user = self.request.user
    #    path = self.request.get_full_path()
    #    return Board.objects.filter(wall__owner=user)

    def pre_save(self, obj):
        obj.owner_id = self.request.user.id

class BoardDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Board
    serializer_class = BoardSerializer
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    renderer_classes = (CustomJSONRenderer,)

    def pre_save(self, obj):
        obj.owner_id = self.request.user.id

class CardList(generics.ListCreateAPIView):
    model = Card
    serializer_class = CardSerializer
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        user = self.request.user
        try:
            board = self.kwargs['board_pk']
            return Card.objects.filter(board__wall__owner=user, board__pk=board)
        except:
            pass
        return Card.objects.filter(board__wall__owner=user)

class CardDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Card
    serializer_class = CardSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly)

class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

# @permission_classes(permissions.IsAuthenticatedOrReadOnly,)
# @renderer_classes((CustomJSONRenderer,))
def boards_relative_to_parent_detail(request, wall_pk):
    try:
        boards = Wall.objects.get(pk=wall_pk).boards.all()
    except Wall.DoesNotExist:
        return HttpResponse('A wall with that id does not exist',status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BoardSerializer(boards)
        return JSONResponse(serializer.data)

# Function based view that finds all cards associated
# with a particular board
@permission_classes(permissions.IsAuthenticatedOrReadOnly,)
@renderer_classes((CustomJSONRenderer,))
def card_relative_to_parent_detail(request, board_pk, card_pk):
    if board_pk and card_pk:
        try:
            cards = Board.objects.get(pk=board_pk).cards.get(pk=card_pk)
        except Board.DoesNotExist:
            return HttpResponse('A board with that id does not exist',status=status.HTTP_404_NOT_FOUND)
        except Card.DoesNotExist:
            return HttpResponse('A card with that id does not exist',status=status.HTTP_404_NOT_FOUND)
    else:
        try:
            cards = Board.objects.get(pk=board_pk).cards.all()
        except Board.DoesNotExist:
            return HttpResponse('A board with that id does not exist',status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CardSerializer(cards)
        return JSONResponse(serializer.data)
