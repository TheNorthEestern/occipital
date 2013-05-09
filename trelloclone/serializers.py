from django.forms import widgets
from rest_framework import serializers
from .models import Board, Card

class CardSerializer(serializers.ModelSerializer):
    board = serializers.PrimaryKeyRelatedField(read_only=False, source='board')
    class Meta:
        model = Card
        resource_name = 'card'
        fields = ('id', 'board', 'title', 'content',)

class BoardSerializer(serializers.ModelSerializer):
    wall = serializers.Field(source='wall.title')
    cards = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='cards', widget=widgets.Textarea)
    # cards = CardSerializer(many=True)
    """
        Currently, cards are sideloaded (In other words, a request is made
        for each card belonging to a particular board)
        add this line to have whole cards nested in response
        
        cards = CardSerializer(many=True)
        and in the Meta class, add 'cards' to the fields tuple.
        
        See this Stack Overflow post on getting ember-data to utilize
        this structure (for revision 11):
        http://stackoverflow.com/questions/14539088/ember-data-mappings-for-sideloading-revision-11
    """
    class Meta:
        model = Board
        resource_name = 'boards'
        fields = ('wall','id', 'title', 'cards',)
