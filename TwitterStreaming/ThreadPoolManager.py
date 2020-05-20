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
if "ass2/combined" not in localcouch:
    localcouch.create("ass2/combined")
db = localcouch["ass2/combined"]
# if "test/testdb" not in localcouch:
#     localcouch.create("test/testdb")
# db = localcouch["test/testdb"]

class ThreadPoolManager():
    def __init__(self, apis):
        self.lock = threading.Lock()
        self.apis = apis
        self.users = []
        self.jobs = []
        self.threads = []
        for api in apis:
            myThread = MyThread(self, api)
            myThread.start()
            self.threads.append(myThread)
        try:
            dbusers = db["users"].get("users")
            if dbusers is None:
                db["users"] = {"users":[]}
            else:
                self.users = dbusers
        except couchdb.http.ResourceNotFound:
            db["users"] = {"users":[]}
    def add_job(self, api, user_id, tweet_id):
        try:
            if user_id not in self.users:
                # append to job list
                self.jobs.append(user_id)
                self.users.append(user_id)
                # add to db
                current_doc = db["users"]
                if current_doc["users"] is not None:
                    current_users = current_doc["users"]
                    current_doc["users"] = current_users + [user_id]
                    db["users"] = current_doc
                    print("ThreadManager added [" + user_id + "]")
                else:
                    current_doc["users"] = [user_id]
                    db["users"] = current_doc
            else:
                tweet = api.get_status(tweet_id)
                db.save(tweet._json)
                print("Saved the latest tweet from [" + user_id + "]")
                print("ThreadManager did not add [" + user_id + "] (already existed)")
        except Exception as err:
            print(err)
    def next_user(self):
        with self.lock:
            if len(self.jobs) != 0:
                user = self.jobs[0]
                self.jobs.remove(user)
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
                #print(tweet.text+ " " + tweet.lang)
                create_date = tweet.created_at
                age_days = (datetime.utcnow() - create_date).days
                if age_days > 100 :
                    break
                if tweet.lang != "en":
                    continue
                for keyword in KEYWORDS:
                    if keyword in tweet.text.lower():
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