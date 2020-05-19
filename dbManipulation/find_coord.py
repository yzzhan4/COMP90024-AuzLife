import couchdb
import json

localcouch = couchdb.Server("http://admin:yosoro@127.0.0.1:5984")
localcouch.resource.credentials = ("admin", "yosoro")

DB = "ass2/combined"
db = localcouch[DB]

count = 0
for docid in db.view("_all_docs"):
    coord = db.get(docid.id).get("coordinates")
    if coord is not None:
        count += 1
        print(coord)
print(count)



