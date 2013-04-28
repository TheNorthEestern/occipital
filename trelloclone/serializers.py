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
    owner = serializers.Field(source='owner.username')
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
        fields = ('owner','id', 'title', 'cards',)
