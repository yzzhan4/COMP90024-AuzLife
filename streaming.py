from __future__ import absolute_import, print_function

import tweepy
import http
import json

from api_accounts import API_ACCOUNTS
from keywords import KEYWORDS
from ThreadPoolManager import ThreadPoolManager

def authenticate():
    if len(API_ACCOUNTS) < 2:
        print("Need more api accounts")
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
    except:
        print("===ERROR=== An error has occured in start_streaming")
        my_stream.disconnect()
        #exit()
        start_streaming(my_stream)

class StdOutListener(tweepy.StreamListener):
    def __init__(self, api, thread_manager):
        self.api = api
        self.me = api.me()
        self.tm = thread_manager
    def on_data(self, data):
        tweet = json.loads(data)
        user_id = ""
        text = ""
        #country_code = "" 
        #country = ""
        #coordinates = []
        try:
            user_id = tweet["user"]["screen_name"]
            text = tweet["text"]
            for keyword in KEYWORDS:
                if keyword in text.lower():
                    self.tm.add_job(user_id)
                    break
            #country_code = tweet["place"]["country_code"]
            #country = tweet["place"]["country"]
            #coordinates = tweet["coordinates"]["coordinates"]
            #print(user_id + ":" + country_code)
            #print(user_id + ":" + country_code + "@" + str(coordinates[0]) + "," + str(coordinates[1]))
        except:
            print("===ERROR=== streaming: Attributes not found")
            return False
    def on_error(self, status):
        print(status)
        if status == 420:
            return False
    def on_limit(self,track):
        print("===ERROR=== streaming: reached limit")
        return False

if __name__ == '__main__':
    (auths, apis) = authenticate()
    thread_manager = ThreadPoolManager(apis[1:])
    l = StdOutListener(apis[0], thread_manager)
    my_stream = tweepy.Stream(auths[0], l)
    start_streaming(my_stream)
