import couchdb
import json

localcouch = couchdb.Server("http://admin:yosoro@127.0.0.1:5984")
localcouch.resource.credentials = ("admin", "yosoro")

DB2 = "assignment2/tweets2"
DB3 = "assignment2/tweets3"
DB_COMBINIED = "ass2/combined"
DB_TEST = "test"

if DB_COMBINIED not in localcouch:
    localcouch.create(DB_COMBINIED)
dbc = localcouch[DB_COMBINIED]
users = dbc.get("users")["users"]

if DB_TEST not in localcouch:
    localcouch.create(DB_TEST)
db = localcouch[DB_TEST]

# local json
# with open('db.json') as f:
#     data = json.load(f)
# for doc in data.get("rows"):
#     obj = doc.get('doc')
#     obj.pop("_id", None)
#     obj.pop("_rev", None)
#     dbc.save(obj)

# assignment2/tweets3
# with open('db2.json') as f:
#     data = json.load(f)
# for doc in data.get("rows"):
#     obj = doc.get('doc')
#     obj.pop("_id", None)
#     obj.pop("_rev", None)
#     dbc.save(obj)

# assignment2/tweets2
new_users = []
with open('db1.json') as f:
    data = json.load(f)
for doc in data.get("rows"):
    obj = doc.get('doc')
    new_user = obj["user"]["screen_name"]
    if not new_user in users and not new_user in new_users:
        new_users.append(new_user)
    #dbc.save(obj)
print(new_users)

from datetime import datetime, date, time, timedelta
import tweepy
import http
import threading
import time
from keywords import KEYWORDS
from api_accounts import API_ACCOUNTS

threads = []
apis = []
for key in API_ACCOUNTS:
    consumer_key = key[0]
    consumer_secret = key[1]
    access_token = key[2]
    access_token_secret = key[3]
    # Authentication
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    apis.append(tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True))

lock = threading.Lock()
def next_user():
    with lock:
        if len(new_users) != 0:
            user = new_users[0]
            new_users.remove(user)
            return user
        else:
            return None

class MyThread(threading.Thread):
    def __init__(self, api):
        threading.Thread.__init__(self)
        self.api = api
    def find_related_tweets(self, user_id):
        try:
            print(self.name + " looking for related tweets for " + user_id)
            count = 0
            for tweet in tweepy.Cursor(self.api.user_timeline, id=user_id).items():
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
            next_usr = next_user()
            if next_usr != None:
                self.find_related_tweets(next_usr)
        print(self.name + " exited threading")

for api in apis:
    myThread = MyThread(api)
    myThread.start()
    threads.append(myThread)