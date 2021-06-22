import os
import urllib.request

EC2_PRIVATE_URL = os.environ.get('EC2_PRIVATE_URL')

zipfile_path = os.path.join(os.path.dirname(__file__), 'suzuki.zip')
f = open(zipfile_path, 'rb')

req = urllib.request.Request(
    url=EC2_PRIVATE_URL + '/genbyzip/',
    data=f,
    method='GET'
)

response = urllib.request.urlopen(req)
print(response.read().decode('utf-8'))