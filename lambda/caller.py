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
  
  '''
  event
  {
    "keyboard": "2key2crawl/info.json",
    "keymap": "default"
  }
  '''
  
  print(os.environ)
  
  req = urllib.request.Request(QMK_URL, data=json.dumps({}).encode("utf-8"), method='GET')
  f = urllib.request.urlopen(req)
  
  print(f.read().decode('utf-8'))
  
  client = boto3.client('s3')
  
  response = client.get_object(
    Bucket=BUCKET_NAME,
    Key=KEY_PREFIX + '/' + event.get('keyboard', '2key2crawl')
  )
  
  print(response['Body'].read().decode('utf-8'))