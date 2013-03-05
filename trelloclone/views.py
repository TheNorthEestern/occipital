from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import permissions
from rest_framework import renderers 
from rest_framework import status 
from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .models import Board, Card
from .permissions import IsOwnerOrReadOnly
from .renderers import CustomJSONRenderer
from .serializers import BoardSerializer, CardSerializer

@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'boards':reverse('board-list', request=request, format=format),
        'cards':reverse('card-list', request=request, format=format),
    })

class BoardList(generics.ListAPIView):
    model = Board
    serializer_class = BoardSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    
    def pre_save(self, obj):
        obj.user = self.request.user

class BoardDetail(generics.RetrieveAPIView):
    model = Board
    serializer_class = BoardSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly,)
    renderer_classes = (CustomJSONRenderer,)

    def pre_save(self, obj):
        obj.user = self.request.user

class CardList(generics.ListAPIView):
    model = Card
    serializer_class = CardSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def pre_save(self, obj):
        obj.board = self.request.board


class CardDetail(generics.RetrieveAPIView):
    model = Card
    serializer_class = CardSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly)
    renderer_classes = (CustomJSONRenderer,)

    def pre_save(self, obj):
        obj.board = self.request.board

# Function based view that finds all card associated
# with a particular board
def card_relative_to_parent_detail(request, pk):
    try:
        board = Board.objects.get(pk=pk).cards.all()
    except Board.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BoardSerializer(board)
        return Response(serializer.data)
