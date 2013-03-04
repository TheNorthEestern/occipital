from django.forms import widgets
from rest_framework import serializers
from .models import Board, Card

class BoardSerializer(serializers.ModelSerializer):
    creator = serializers.Field(source='owner.username')
    cards = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Board
        fields = ('creator', 'title', 'cards')

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
