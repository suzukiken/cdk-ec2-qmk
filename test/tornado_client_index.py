import os
import urllib.request

EC2_PRIVATE_URL = os.environ.get('EC2_PRIVATE_URL')

req = urllib.request.Request(
    url=EC2_PRIVATE_URL + '/',
    method='GET'
)

response = urllib.request.urlopen(req)
print(response.read().decode('utf-8'))