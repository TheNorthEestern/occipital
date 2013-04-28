from rest_framework.renderers import JSONRenderer

class EmberJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response_data = {}
        resource = getattr(renderer_context.get('view').get_serializer().Meta, 'resource_name', 'objects')

        response_data[resource] = data

        response = super(EmberJSONRenderer, self).render(response_data, accepted_media_type, renderer_context)

        return response

class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response_data = {}
        resource = getattr(renderer_context.get('view').get_serializer().Meta, 'resource_name', 'objects')

        if data.get('paginated_results'):
            response.data['meta'] = data.get('meta')
            response.data[resource] = data.get('paginated_results')
        else:
            response_data[resource] = data

        response = super(CustomJSONRenderer, self).render(response_data, accepted_media_type, renderer_context)

        return response
