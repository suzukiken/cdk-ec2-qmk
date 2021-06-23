import tornado.ioloop
import tornado.web
from tornado.log import enable_pretty_logging, app_log, access_log, gen_log
import logging
import os
import boto3
import json
import subprocess
import zipfile
import shutil
from pathlib import Path

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

class GenByZipHandler(tornado.web.RequestHandler):
    def get(self):
        
        app_log.info(self.request.body)
        
        zip_filepath = '/tmp/upload.zip'
        target_dirpath = 'keyboards'
        build_dirpath = '.build'
        keyboard_name = None
        
        with open(zip_filepath, 'wb') as zip_ref:
            zip_ref.write(self.request.body)

        with zipfile.ZipFile(zip_filepath, 'r') as zip_ref:
            app_log.info(zip_ref.namelist()) # ['suzuki/', 'suzuki/config.h', ....]
            keyboard_name = zip_ref.namelist()[0].replace('/', '')
            app_log.info(keyboard_name)
            zip_ref.extractall(target_dirpath)
        
        if not keyboard_name:
            self.write('no name')
            
        make_result = subprocess.run(
            ['make {}:default'.format(keyboard_name)],
            capture_output=True,
            text=True,
            shell=True,
        )
        
        app_log.info(make_result.stdout)
        app_log.info(make_result.stderr)
        
        filename = '{}_default.hex'.format(keyboard_name)
        
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', 'attachment; filename=' + filename)
        self.write(open(filename, 'rb').read())
        
        os.remove(filename)
        shutil.rmtree(os.path.join(target_dirpath, keyboard_name), ignore_errors=True)
        for path in Path(build_dirpath).glob('*'):
            if path.is_file():
                path.unlink()
            elif path.is_dir():
                shutil.rmtree(path)

def make_app():
    return tornado.web.Application([
        (r"/", IndexHandler),
        (r"/genbyzip/", GenByZipHandler)
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(port)
    tornado.ioloop.IOLoop.current().start()