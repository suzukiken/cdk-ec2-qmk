import os
import json
import urllib.request

EC2_PRIVATE_URL = os.environ.get('EC2_PRIVATE_URL')
BUCKET_NAME = os.environ.get('BUCKET_NAME')
KEY_PREFIX = os.environ.get('KEY_PREFIX')

data = {
    's3bucket': BUCKET_NAME,
    's3keyprefix': KEY_PREFIX,
    'keyboard': '2key2crawl',
    'keymap': 'default'
}

req = urllib.request.Request(
    url=EC2_PRIVATE_URL + '/genbys3/',
    data=json.dumps(data).encode('utf-8'),
    method='GET'
)

response = urllib.request.urlopen(req)
print(response.read().decode('utf-8'))
