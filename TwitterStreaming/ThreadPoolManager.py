from datetime import datetime, date, time, timedelta
import tweepy
import couchdb
import http
import threading
import json
import time
import sys

from keywords import KEYWORDS

USER_ID_DB = "streaming-userids"
SAVE_TO_DB = "streaming-tweets"

# Couchdb
couch = couchdb.Server("http://admin:90024@172.26.131.147:5984")
couch.resource.credentials = ("admin", "90024")
# if "assignment2/tweets" not in couch:
#     couch.create("assignment2/tweets")
# db = couch["assignment2/tweets"]
# couch = couchdb.Server("http://admin:yosoro@127.0.0.1:5984")
# couch.resource.credentials = ("admin", "yosoro")

if SAVE_TO_DB not in couch:
    couch.create(SAVE_TO_DB)
db = couch[SAVE_TO_DB]
if USER_ID_DB not in couch:
    couch.create(USER_ID_DB)
iddb = couch[USER_ID_DB]

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
            dbusers = iddb["users"].get("users")
            if dbusers is None:
                iddb["users"] = {"users":[]}
            else:
                self.users = dbusers
        except couchdb.http.ResourceNotFound:
            # Create db for user ids if not exists
            iddb["users"] = {"users":[]}
    def save_user_id_to_db(self, user_id):
        # iddb["users"] should exist at this stage
        current_doc = iddb["users"]
        if current_doc["users"] is not None:
            # update users
            current_users = current_doc["users"]
            current_doc["users"] = current_users + [user_id]
            iddb["users"] = current_doc
        else:
            current_doc["users"] = [user_id]
            iddb["users"] = current_doc
    def add_job(self, api, user_sn, user_id, tweet_id):
        try:
            if user_id not in self.users: # new user
                # append to job list
                self.jobs.append((user_sn,user_id))
                self.users.append(user_id)
                # add to db
                self.save_user_id_to_db(user_id)
                sys.stdout.write("ThreadManager added [" + user_sn + " (" + user_id + ")]\n")
            else: # already processed user
                tweet = api.get_status(tweet_id)
                db.save(tweet._json) # save the latest tweet
                sys.stdout.write("Saved the latest tweet from [" + user_sn + " (" + user_id + ")]\n")
                sys.stdout.write("ThreadManager did not add [" + user_sn + " (" + user_id + ")] (already exists)\n")
        except Exception as err:
            sys.stdout.write(err)
    def next_user(self):
        with self.lock:
            if len(self.jobs) != 0:
                user = self.jobs[0]
                self.jobs.remove(user)
                return user[0]
            else:
                return None

class MyThread(threading.Thread):
    def __init__(self, tm, api):
        threading.Thread.__init__(self)
        self.tm = tm
        self.api = api
    def find_related_tweets(self, user_id):
        try:
            sys.stdout.write(self.name + " looking for related tweets for " + user_id + "\n")
            count = 0
            for tweet in tweepy.Cursor(self.api.user_timeline, id=user_id).items():
                #sys.stdout.write(tweet.text+ " " + tweet.lang)
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
            sys.stdout.write(self.name + " saved [" + str(count) + "] tweets from [" + user_id + "]\n")
        except http.client.IncompleteRead:
            sys.stdout.write('===ERROR=== IncompleteRead in find_related_tweets\n')
            exit()
    def run(self):
        sys.stdout.write(self.name + " started threading\n")
        while(True):
            next_user = self.tm.next_user()
            if next_user != None:
                self.find_related_tweets(next_user)
        sys.stdout.write(self.name + " exited threading\n")