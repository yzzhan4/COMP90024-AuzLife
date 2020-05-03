from datetime import datetime, date, time, timedelta
import tweepy
import couchdb
import http
import threading
import json
import time

from keywords import KEYWORDS

# Couchdb
# couch = couchdb.Server("http://admin:90024@172.26.132.216:5984")
# couch.resource.credentials = ("admin", "90024")
# if "assignment2/tweets" not in couch:
#     couch.create("assignment2/tweets")
# db = couch["assignment2/tweets"]

localcouch = couchdb.Server("http://admin:yosoro@127.0.0.1:5984")
localcouch.resource.credentials = ("admin", "yosoro")
if "assignment2/tweets" not in localcouch:
    localcouch.create("assignment2/tweets")
db = localcouch["assignment2/tweets"]


class ThreadPoolManager():
    def __init__(self, apis):
        self.lock = threading.Lock()
        self.apis = apis
        self.users = []
        self.threads = []
        for api in apis:
            myThread = MyThread(self, api)
            myThread.start()
            self.threads.append(myThread)
    def add_job(self, user_id):
        print("ThreadManager added [" + user_id + "]")
        self.users.append(user_id)
    def next_user(self):
        with self.lock:
            if len(self.users) != 0:
                user = self.users[0]
                self.users.remove(user)
                return user
            else:
                return None

class MyThread(threading.Thread):
    def __init__(self, tm, api):
        threading.Thread.__init__(self)
        self.tm = tm
        self.api = api
    def find_related_tweets(self, user_id):
        try:
            print(self.name + " looking for related tweets for " + user_id)
            count = 0
            for tweet in tweepy.Cursor(self.api.user_timeline, id=user_id).items():
                create_date = tweet.created_at
                age_days = (datetime.utcnow() - create_date).days
                if age_days > 60 :
                    break
                if tweet.lang != "en":
                    continue
                for keyword in KEYWORDS:
                    if keyword in tweet.text:
                        db.save(tweet._json)
                        count += 1
                        break
            print(self.name + " saved [" + str(count) + "] tweets from [" + user_id + "]")
        except http.client.IncompleteRead:
            print('===ERROR=== IncompleteRead in find_related_tweets')
            exit()
    def run(self):
        print(self.name + " started threading")
        while(True):
            next_user = self.tm.next_user()
            if next_user != None:
                self.find_related_tweets(next_user)
        print(self.name + " exited threading")