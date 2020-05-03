from __future__ import absolute_import, print_function

import tweepy
import http
import json

from api_accounts import API_ACCOUNTS
from ThreadPoolManager import ThreadPoolManager

def authenticate():
    if len(API_ACCOUNTS) < 2:
        print("Need more accounts")
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

def start_streaming():
    try:
        (auths, apis) = authenticate()
        # Streaming
        thread_manager = ThreadPoolManager(apis[1:])
        l = StdOutListener(apis[0], thread_manager)
        stream = tweepy.Stream(auths[0], l)
        #stream.filter(locations = [-180,-90,180,90])
        stream.filter(locations=[114,-43,152,-10])
        # stream.filter(locations=[114,-43,152,-10], 
        #     track=['covid19','Covid19','COVID19','coronavirus','COVID-19','covid 19','COVID 19','Covid 19'],
        #     languages=['en'])
        
    except:
        print("=================================error")
        exit()

class StdOutListener(tweepy.StreamListener):
    def __init__(self, api, thread_manager):
        self.api = api
        self.me = api.me()
        self.tm = thread_manager
    def on_data(self, data):
        tweet = json.loads(data)
        user_id = ""
        #country_code = "" 
        # country = ""
        try:
            user_id = tweet["user"]["screen_name"]
            country_code = tweet["place"]["country_code"]
            # country = tweet["place"]["country"]
            #coordinates = tweet["place"]["coordinates"]
        except:
            return True
        print(user_id + ":" + country_code)
        #print(user_id + ":" + country_code + "@" + str(coordinates[0]) + "," + str(coordinates[1]))
        self.tm.add_job(user_id)
        return True
    def on_error(self, status):
        print(status)
    def on_limit(self,track):
        print("======================================limit")

if __name__ == '__main__':
    start_streaming()
