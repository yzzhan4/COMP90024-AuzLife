import couchdb
import json
import tweepy

from api_accounts import API_ACCOUNTS

consumer_key = API_ACCOUNTS[0][0]
consumer_secret = API_ACCOUNTS[0][1]
access_token = API_ACCOUNTS[0][2]
access_token_secret = API_ACCOUNTS[0][3]
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)

localcouch = couchdb.Server("http://admin:yosoro@127.0.0.1:5984")
localcouch.resource.credentials = ("admin", "yosoro")
DB_COMBINIED = "ass2/combined"
dbc = localcouch[DB_COMBINIED]
users = dbc.get("users")["users"]
userids = []
for user in users:
    userid = ""
    for item in tweepy.Cursor(api.user_timeline, id=user).items():
        userid = item._json["user"]["id"]
        break
    userids.append(userid)
print(userids)
