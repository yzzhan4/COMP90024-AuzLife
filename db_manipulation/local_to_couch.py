import couchdb
import json


USER_ID_DB = "streaming-userids"
SAVE_TO_DB = "streaming-tweets"

# localcouch = couchdb.Server("http://admin:yosoro@127.0.0.1:5984")
# localcouch.resource.credentials = ("admin", "yosoro")
couch = couchdb.Server("http://admin:yosoro@172.26.131.147:5984")
couch.resource.credentials = ("admin", "90024")

# if USER_ID_DB not in couch:
#     exit()
# iddb = couch[USER_ID_DB]
# with open('./data/user_ids.json') as f:
#     data = json.load(f)
#     iddb["users"] = {"users": data}

if SAVE_TO_DB not in couch:
    exit()
db = couch[SAVE_TO_DB]
with open('./data/combined_tweets.json') as f:
    tweets = json.load(f)
    for tweet in tweets:
        p_tweet = tweet
        p_tweet.pop("_id", None)
        p_tweet.pop("_rev", None)
        db.save(p_tweet)


