# http://stackoverflow.com/questions/11076396/tastypie-list-related-resources-keys-instead-of-urls
def many_to_many_to_ids(bundle, field_name):
    field_ids = getattr(bundle.obj, field_name).values_list('id', flat=True)
    field_ids = map(int, field_ids)
    return field_ids

def foreign_key_to_id(bundle, field_name):
    field = getattr(bundle.obj, field_name)
    field_id = getattr(field, 'id', None)
    return field_id
