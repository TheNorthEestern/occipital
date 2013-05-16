from django.forms import widgets
from rest_framework import serializers
from .models import Wall, Board, Card

class CardSerializer(serializers.ModelSerializer):
    board = serializers.PrimaryKeyRelatedField(read_only=False, source='board')
    class Meta:
        model = Card
        resource_name = 'card'
        fields = ('id', 'board', 'title', 'content',)

class BoardSerializer(serializers.ModelSerializer):
    wall = serializers.Field(source='wall.title')
    cards = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='cards', widget=widgets.Textarea)

    class Meta:
        model = Board
        resource_name = 'boards'
        fields = ('wall', 'id', 'title', 'cards',)

class WallSerializer(serializers.ModelSerializer):
    owner = serializers.Field(source='owner.username')
    boards = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='boards')

    class Meta:
        model = Wall
        resource_name = 'walls'
        fields = ('id', 'owner', 'title', 'boards',)
