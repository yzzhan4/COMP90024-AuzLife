"""
Team 46
Haoyue Xie 1003068 @Melbourne
Jiayu Li 713551 @Melbourne
Ruqi Li 1008342 @Melbourne
Yi Zhang 1032768 @Melbourne
Zimeng Jia 978322 @Hebei, China
"""

from __future__ import absolute_import, print_function

import tweepy
import http
import json
import atexit
import sys
import couchdb
from datetime import datetime

from api_accounts import API_ACCOUNTS
from keywords import KEYWORDS
from ThreadPoolManager import ThreadPoolManager

SAVE_TO_DB = "temporary-tweets"
SAVE_TO_AGGREGATE_DB = "gathering-tweets"

couch = couchdb.Server("http://admin:90024@172.26.131.147:5984")
couch.resource.credentials = ("admin", "90024")
# couch = couchdb.Server("http://admin:yosoro@127.0.0.1:5984")
# couch.resource.credentials = ("admin", "yosoro")

if SAVE_TO_DB not in couch:
    couch.create(SAVE_TO_DB)
db = couch[SAVE_TO_DB]
if SAVE_TO_AGGREGATE_DB not in couch:
    couch.create(SAVE_TO_AGGREGATE_DB)
agdb = couch[SAVE_TO_AGGREGATE_DB]

def authenticate():
    if len(API_ACCOUNTS) < 2:
        sys.stdout.write("Need more api accounts\n")
        exit()
    auths = []
    apis = []
    for key in API_ACCOUNTS:
        consumer_key = key[0]
        consumer_secret = key[1]
        access_token = key[2]
        access_token_secret = key[3]
        # Authentication
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        auths.append(auth)
        apis.append(tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True))
    return (auths, apis)

def start_streaming(my_stream):
    try:
        #my_stream.filter(locations = [-180,-90,180,90])
        my_stream.filter(locations=[114,-43,154,-12])
        # my_stream.filter(track=KEYWORDS)
        # my_stream.filter(languages=['en'])
    except KeyboardInterrupt:
        my_stream.disconnect()
        exit()
    except Exception as e:
        sys.stdout.write(str(e))
        sys.stdout.write("===ERROR=== An error has occured in start_streaming\n")
        my_stream.disconnect()
        #exit()
        sys.stdout.write("Restarted streaming\n")
        start_streaming(my_stream)

class StdOutListener(tweepy.StreamListener):
    def __init__(self, api, thread_manager):
        self.api = api
        self.me = api.me()
        self.tm = thread_manager
    def on_data(self, data):
        tweet = json.loads(data)
        user_sn = ""
        user_id = ""
        tweet_id = ""
        text = ""
        #country_code = "" 
        #country = ""
        #coordinates = []
        try:
            user_sn = tweet["user"]["screen_name"]
        except:
            sys.stdout.write("===ERROR=== streaming: User screen name not found\n")
        try:
            user_id = tweet["user"]["id_str"]
        except:
            sys.stdout.write("===ERROR=== streaming: User id not found\n")
        try:
            tweet_id = tweet["id"]
        except:
            sys.stdout.write("===ERROR=== streaming: Tweet id not found\n")
        try:
            text = tweet["text"]
        except:
            sys.stdout.write("===ERROR=== streaming: Tweet text not found\n")
        try:
            is_related = False
            for keyword in KEYWORDS:
                if keyword in text.lower():
                    is_related = True
                    self.tm.add_job(self.api, user_sn, user_id, tweet_id)
                    break
            if not is_related:
                # print(tweet)
                db.save(tweet)              
                tweet["isRelated"] = 0
                tweet["state_name"] = "OTHERS"
                tweet["region_code"] = 99
                tweet.pop("_id")
                tweet.pop("_rev")
                # print(tweet)
                # new_tweet = {tweet, "isRelated":0, "state_name":"OTHERS","region_code":99}
                agdb.save(tweet)
            #country_code = tweet["place"]["country_code"]
            #country = tweet["place"]["country"]
            #coordinates = tweet["coordinates"]["coordinates"]
            #sys.stdout.write(user_id + ":" + country_code + "@" + str(coordinates[0]) + "," + str(coordinates[1]))
        except Exception as e:
            sys.stdout.write(str(e))
            sys.stdout.write("===ERROR=== An error has occured when adding job to thread pool\n")
            return False
    def on_error(self, status):
        sys.stdout.write(str(status))
        sys.stdout.write("\n")
        if status == 420:
            return False
    def on_limit(self,track):
        sys.stdout.write("===ERROR=== streaming: reached limit\n")
        return False



def exit_handler():
    sys.stdout.write("[" + datetime.now().strftime("%H:%M:%S") + "] Program interrupted\n")
    sys.stdout.write("=================================================================\n")


if __name__ == '__main__':
    atexit.register(exit_handler)

    (auths, apis) = authenticate()
    thread_manager = ThreadPoolManager(apis[1:])
    l = StdOutListener(apis[0], thread_manager)
    my_stream = tweepy.Stream(auths[0], l)
    start_streaming(my_stream)
