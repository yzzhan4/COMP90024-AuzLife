from __future__ import absolute_import, print_function

from datetime import datetime, date, time, timedelta
from api_accounts import API_ACCOUNTS

import tweepy
import couchdb
import json
import threading
import http

couch = couchdb.Server("http://admin:yosoro@127.0.0.1:5984")
couch.resource.credentials = ("admin", "yosoro")
# Create db
if "test/testdb" not in couch:
    couch.create("test/testdb")
db = couch["test/testdb"]

def start_streaming(account_name):
    consumer_key = API_ACCOUNTS[account_name][0]
    consumer_secret = API_ACCOUNTS[account_name][1]
    access_token = API_ACCOUNTS[account_name][2]
    access_token_secret = API_ACCOUNTS[account_name][3]
    # Authentication
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    # Create API
    api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    #api = tweepy.API(auth)
    # Streaming
    l = StdOutListener(api)
    stream = tweepy.Stream(auth, l)
    #stream.filter(track=['covid19','Covid19','COVID19','coronavirus','COVID-19','covid 19','COVID 19','Covid 19'])
    #stream.filter(languages = ['en'])
    stream.filter(locations = [114,-43,152,-10])
    #stream.filter(locations = [-180,-90,180,90])

def find_related_tweets(user_id, api):
    try:
        for tweet in tweepy.Cursor(api.user_timeline, id = user_id).items():
            create_date = tweet.created_at
            age_days = (datetime.utcnow() - create_date).days
            if age_days > 7 :
                break
            if tweet.lang != "en":
                continue
            # hashtag = ""
            # if hashtag not in tweet.text:
            #     continue
            print(f"{tweet.user.name}:{tweet.text}")
            print(age_days)
            db.save(json.loads(json.dumps(tweet._json)))
    except http.client.IncompleteRead:
        print('=============================error')
        exit()
        

class myThread (threading.Thread):
    def __init__(self, user_id, api):
        threading.Thread.__init__(self)
        self.user_id = user_id
        self.api = api
    def run(self):
        print ("start threading：" + self.name)
        find_related_tweets(self.user_id, self.api)
        print ("exit threading：" + self.name)

class StdOutListener(tweepy.StreamListener):
    def __init__(self, api):
        self.api = api
        self.me = api.me()
    def on_data(self, data):
        tweet = json.loads(data)
        user_id = ""
        country_code = "" 
        country = ""
        try:
            user_id = tweet["user"]["screen_name"]
            country_code = tweet["place"]["country_code"]
            country = tweet["place"]["country"]
        except:
            return True
        print(user_id + ":" + country_code)
        # if country == "Australia":
        #     print(user_id + ":" + country_code)
        thread1 = myThread(user_id, self.api)
        thread1.start()
        return True
    def on_error(self, status):
        print(status)

    def on_limit(self,track):
        print("======================================limit")


#TODO: retweets

if __name__ == '__main__':
    # # Authentication
    # auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    # auth.set_access_token(access_token, access_token_secret)

    # # Create API
    # api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    
    # l = StdOutListener(api)
    # stream = tweepy.Stream(auth, l)
    # #stream.filter(track=['covid19','Covid19','COVID19','coronavirus','COVID-19','covid 19','COVID 19','Covid 19'])
    # #stream.filter(track=["a"])
    # stream.filter(locations = [114,-43,152,-10])
    start_streaming('1')
