import time
from django.utils import simplejson
from django.core.serializers import json
from tastypie.serializers import Serializer

class EmberJSONSerializer(Serializer):
    def to_json(self, data, options=None):
        options = options or {}

        data = self.to_simple(data, options)

        #Add in the current time.
        data['requested_time'] = time.time()

        return simplejson.dumps(data, cls=json.DjangoJSONEncoder, sort_keys=True)
