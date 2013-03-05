from rest_framework import pagination, serializers

class CustomMetaSerializer(serializers.Serializer):
    next_page = pagination.NextPageField(source="*")
    prev_page = pagination.PreviousPageField(source="*")
    record_cout = serializers.Field(source='paginator.count')

class CustomPaginationSerializer(pagination.BasePaginationSerializer):
    meta = CustomMetaSerializer(source="*")
    results_field = 'paginated_results'
