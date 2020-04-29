from __future__ import absolute_import, print_function

import tweepy
import json
import threading

consumer_key="sHklTJfVUWus0MsJE6N8xhzvK"
consumer_secret="48bzy2KDHf2raZGh3841uuOWnz3smqpTY40TNMh6ivcYUOIzok"
access_token="1252023612896247808-ZLCFvfCXyu7xFJkNmcpQi2dITUliwa"
access_token_secret="49sL9SigkSIoIw36WYgfPpeIXvNRnYtsucJKtFiFPwV6W"


def write_tweet(tweet, filename):
    with open(filename, 'a') as f:
        json.dump(tweet._json,f)
        f.write('\n')  

# def get_user_id(tweet):
#     user_id = json.loads(tweet)["user"]["id"]
#     return user_id

# def find_related_tweets(user_id, api):



# class myThread (threading.Thread):
#     def __init__(self, user_id, api):
#         threading.Thread.__init__(self)
#         self.user_id = user_id
#         self.api = api
#     def run(self):
#         print ("start threading：" + self.name)
#         find_related_tweets(user_id, self.api)
#         print ("exit threading：" + self.name)

class StdOutListener(tweepy.StreamListener):
    """ A listener handles tweets that are received from the stream.
    This is a basic listener that just prints received tweets to stdout.
    """
    def __init__(self, api):
        self.api = api
        self.me = api.me()

    def on_data(self, data):
        tweet = json.loads(data)
        user_id = ""
        user_name = ""
        country_code = "" 
        country = ""
        
        try:
            user_id = tweet["user"]["screen_name"]
            user_name = tweet["user"]["name"]
            country_code = tweet["place"]["country_code"]
            country = tweet["place"]["country"]
            
        except:
            return True
        # if tweet["user"] != None:
        #     user_id = tweet["user"]["id"]
        #     user_name = tweet["user"]["name"]
        # if tweet["place"] != None:
        #     country_code = tweet["place"]["country_code"]
        #     country = tweet["place"]["country"]
        #     print(country + " " + user_name)
        
        if country == "Australia":
             print(user_id + ":" + country_code)

        #thread1 = myThread(user_id, self.api)
        
        return True

    def on_error(self, status):
        print(status)

#TODO: retweets

if __name__ == '__main__':
    # Authentication
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    # Creat API
    api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    # places = api.geo_search(query="Australia",granularity="country")
    # place_id = places[0].id
    # search_terms = ('place:%s AND #covid19' % place_id)
    # for tweet in tweepy.Cursor(api.search, q=search_terms, lang="en").items():

    #                    since='2020-04-27', until='2020-04-28',
    #                    count=10,
    #                    result_type='recent',
    #                    include_entities=True,
    #                    monitor_rate_limit=True, 
    #                    wait_on_rate_limit=True,

    #    print(f"//////////////{tweet.user.name}: {tweet.text}")
    #    write_tweet(tweet, "tweets.json")
  
    l = StdOutListener(api)
    stream = tweepy.Stream(auth, l)
    stream.filter(track=['covid19','Covid19','COVID19','coronavirus','COVID-19','covid 19','COVID 19','Covid 19'])