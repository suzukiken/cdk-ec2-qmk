import tornado.ioloop
import tornado.web
from tornado.log import enable_pretty_logging, app_log, access_log, gen_log
import logging
import os
import boto3
import json
import subprocess

client = boto3.client('s3')

port = int(os.environ.get('PORT', '80'))
log_file = os.environ.get('LOG_FILE')
qmk_dir = os.environ.get('QMK_DIR')

if log_file:
    handler = logging.FileHandler(log_file)
    enable_pretty_logging()
    app_log.addHandler(handler)
    access_log.addHandler(handler)
    gen_log.addHandler(handler)

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, I am Tornado.")

class GenHandler(tornado.web.RequestHandler):
    def get(self):

        #    client.put_object(
        #        Bucket='static.figment-research.com',
        #        Key='index.html.copy',
        #        Body=response['Body'].read()
        #    )

        body = json.loads(self.request.body)
        
        response = client.get_object(
            Bucket=body['s3bucket'],
            Key=body['s3keyprefix'] + '/' + body['keyboard'] + '/rules.mk'
        )
        
        app_log.warning("rules.mk:", response['Body'].read().decode('utf-8'))
        
        result = subprocess.run(
            ["make", "2key2crawl:default"],
            capture_output=True,
            text=True,
            shell=True,
        )
        
        app_log.info(result.stdout)
        app_log.info(result.stderr)
        
        filename = '2key2crawl_default.hex'
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', 'attachment; filename=' + filename)
        self.write(open(filename, 'rb').read())
        
def make_app():
    return tornado.web.Application([
        (r"/", IndexHandler),
        (r"/gen/", GenHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(port)
    tornado.ioloop.IOLoop.current().start()