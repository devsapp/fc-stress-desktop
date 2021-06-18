# -*- coding: utf-8 -*-
import logging
import time, json
import email
from locust import HttpUser, task, between
from locust.contrib.fasthttp import FastHttpUser
from itertools import chain
import os

url = os.environ.get("FC_URL", "")
method = os.environ.get("FC_METHOD", "")
body = os.environ.get("FC_PAYLOAD", b"")

class QuickstartHttpTriggerUser(HttpUser):
    # wait_time = between(1, 2.5)
    @task
    def hello_world(self):
      global url, method, body
      r = self.client.request(method, url, data=body)
      if r.headers.get('x-fc-error-type', ''):
        print("failed, headers = {}, content = {}".format(r.headers, r.content))
      # else:
      #   print("succ, resp = {}".format(r.content))

    def on_start(self):
      global url, method, body
      print("{} {} {} {} load test started...".format(self.host, url, method, body))

    def on_stop(self):
      global url, method, body
      print("{} {} {} {} load test stoped!".format(self.host, url, method, body))