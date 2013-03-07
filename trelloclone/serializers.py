from django.forms import widgets
from rest_framework import serializers
from .models import Board, Card

class CardSerializer(serializers.ModelSerializer):
    board_id = serializers.PrimaryKeyRelatedField(read_only=False, source='board')
    class Meta:
        model = Card
        resource_name = 'card'
        fields = ('id', 'board_id', 'title', 'content',)

class BoardSerializer(serializers.ModelSerializer):
    # owner_id = serializers.PrimaryKeyRelatedField(source='owner')
    card_ids = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='cards', widget=widgets.Textarea)
    cards = CardSerializer(many=True)
    class Meta:
        model = Board
        resource_name = 'board'
        fields = ('id', 'title', 'card_ids','cards',)
