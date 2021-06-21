# -*- coding: utf-8 -*-


import boto3
import json
import os
from botocore.config import Config
import urllib.request

'''
このpythonが行うこと

Qmkのコンパイラが必要とするキーボードの情報を生成してS3バケットに置く
Qmkのコンパイラが乗っているEC2のインスタンスにhttp経由でコンパイルを要求する
この要求の際にS3に置いたデータのキーをhttpのペイロードに付加する。
EC2はコンパイル結果をS3に置き、コンパイルが完了したこと通知するレスポンスを返す。
'''

BUCKET_NAME = os.environ.get('BUCKET_NAME')
KEY_PREFIX = os.environ.get('KEY_PREFIX')
QMK_URL = os.environ.get('QMK_URL')

def lambda_handler(event, context):
  
  print(event)
  
  data = {
    's3bucket': BUCKET_NAME,
    's3keyprefix': KEY_PREFIX,
    'keyboard': '2key2crawl',
    'keymap': 'default'
  }
  
  req = urllib.request.Request(QMK_URL, data=json.dumps(data).encode("utf-8"), method='GET')
  f = urllib.request.urlopen(req)
  
  print(f.read().decode('utf-8'))
  