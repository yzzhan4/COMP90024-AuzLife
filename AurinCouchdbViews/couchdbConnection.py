"""
Team 46
Haoyue Xie 1003068 @Melbourne
Jiayu Li 713551 @Melbourne
Ruqi Li 1008342 @Melbourne
Yi Zhang 1032768 @Melbourne
Zimeng Jia 978322 @Hebei, China
"""
from couchdb import *


def authenticatedConnection(user,password,address):
    return Server("http://%s:%s@%s/" % (user, password,address))

#select a database, if the database is not exist, create a new one
def selectDatabase(name,couchserver):
    if name in couchserver:
        db = couchserver[name]
    else:
        db = couchserver.create(name)
    return db

#update docs into database
def updateDocs(db,docs):
    for (success, doc_id, revision_or_exception) in db.update(docs):
        print(success, doc_id, revision_or_exception)

#delete a database
def deleteDatabase(dbname,couchserver):
    del couchserver[dbname]

#create views of Income
def ViewsIncome(db):
    viewTryReduce = {
    "getdata":{
        "map":"function(doc){ emit(doc.sa4_code16, 1);}",
    },
    "sumByCity":{
        "map":"function(doc){ emit(doc.city, doc.median_tot_prsnl_inc_weekly);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "numOfCity":{
        "reduce": "function (keys, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}}",
        "map": "function (doc) {emit(doc.city, doc.median_tot_prsnl_inc_weekly);}"
    },
    "sumByState":{
        "map":"function(doc){ emit(doc.state, doc.median_tot_prsnl_inc_weekly);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "numOfState":{
        "reduce": "function (keys, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}}",
        "map": "function (doc) {emit(doc.state, doc.median_tot_prsnl_inc_weekly);}"
    }
    }
    db['_design/DesignDoc'] = dict(language='javascript', views=viewTryReduce)

#create views of Age
def ViewsAge(db):
    viewCityReduce = {
    "numOfCity":{
        "reduce": "function (keys, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}}",
        "map": "function (doc) {emit(doc.city, 1);}"
    },
    "sumByCity_0_4":{
        "map":"function(doc){ emit(doc.city, doc.age_0_4_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_5_9":{
        "map":"function(doc){ emit(doc.city, doc.age_5_9_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_10_14":{
        "map":"function(doc){ emit(doc.city, doc.age_10_14_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_15_19":{
        "map":"function(doc){ emit(doc.city, doc.age_15_19_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_20_24":{
        "map":"function(doc){ emit(doc.city, doc.age_20_24_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_25_29":{
        "map":"function(doc){ emit(doc.city, doc.age_25_29_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_30_34":{
        "map":"function(doc){ emit(doc.city, doc.age_30_34_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_35_39":{
        "map":"function(doc){ emit(doc.city, doc.age_35_39_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_40_44":{
        "map":"function(doc){ emit(doc.city, doc.age_40_44_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_45_49":{
        "map":"function(doc){ emit(doc.city, doc.age_45_49_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_50_54":{
        "map":"function(doc){ emit(doc.city, doc.age_50_54_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_All":{
        "map": "function (doc) {emit(doc.city,[doc.age_0_4_p,doc.age_5_9_p,doc.age_10_14_p,doc.age_15_19_p,doc.age_20_24_p,doc.age_25_29_p,doc.age_30_34_p,doc.age_35_39_p,doc.age_40_44_p,doc.age_45_49_p,doc.age_50_54_p]);}",
        "reduce": "_sum"
    }
    }
    db['_design/DesignCity'] = dict(language='javascript', views=viewCityReduce)

    viewStateReduce = {
    "numOfState":{
        "reduce": "function (keys, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}}",
        "map": "function (doc) {emit(doc.state, 1);}"
    },
    "sumByState_0_4":{
        "map":"function(doc){ emit(doc.state, doc.age_0_4_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_5_9":{
        "map":"function(doc){ emit(doc.state, doc.age_5_9_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_10_14":{
        "map":"function(doc){ emit(doc.state, doc.age_10_14_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_15_19":{
        "map":"function(doc){ emit(doc.state, doc.age_15_19_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_20_24":{
        "map":"function(doc){ emit(doc.state, doc.age_20_24_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_25_29":{
        "map":"function(doc){ emit(doc.state, doc.age_25_29_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_30_34":{
        "map":"function(doc){ emit(doc.state, doc.age_30_34_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_35_39":{
        "map":"function(doc){ emit(doc.state, doc.age_35_39_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_40_44":{
        "map":"function(doc){ emit(doc.state, doc.age_40_44_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_45_49":{
        "map":"function(doc){ emit(doc.state, doc.age_45_49_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_50_54":{
        "map":"function(doc){ emit(doc.state, doc.age_50_54_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_All":{
        "map": "function (doc) {emit(doc.state,[doc.age_0_4_p,doc.age_5_9_p,doc.age_10_14_p,doc.age_15_19_p,doc.age_20_24_p,doc.age_25_29_p,doc.age_30_34_p,doc.age_35_39_p,doc.age_40_44_p,doc.age_45_49_p,doc.age_50_54_p] );}",
        "reduce": "_sum"
    }
    }
    db['_design/DesignState'] = dict(language='javascript', views=viewStateReduce)

    viewGetData = {
    "getdata":{
        "map":"function(doc){ emit(doc.sa4_code16, 1);}",
    }
    }
    db['_design/DesignData'] = dict(language='javascript', views=viewGetData)

#create views of Education
def ViewsEdu(db):
    viewEduReduce = {
    "getdata":{
        "map":"function(doc){ emit(doc.sa4_code16, 1);}"
    },
    "numOfCity":{
        "reduce": "function (keys, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}}",
        "map": "function (doc) {emit(doc.city, 1);}"
    },
    "numOfState":{
        "reduce": "function (keys, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}}",
        "map": "function (doc) {emit(doc.state, 1);}"
    },

    "sumByCity_secondary":{
        "map":"function(doc){ emit(doc.city, doc.secondary_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_secondary":{
        "map":"function(doc){ emit(doc.state, doc.secondary_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },

    "sumByCity_uni_other_tert_instit":{
        "map":"function(doc){ emit(doc.city, doc.uni_other_tert_instit_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_uni_other_tert_instit":{
        "map":"function(doc){ emit(doc.state, doc.uni_other_tert_instit_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },

    "sumByCity_tec_furt_educ_inst":{
        "map":"function(doc){ emit(doc.city, doc.tec_furt_educ_inst_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_tec_furt_educ_inst":{
        "map":"function(doc){ emit(doc.state, doc.tec_furt_educ_inst_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },

    "sumByCity_tot_p":{
        "map":"function(doc){ emit(doc.city, doc.tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_tot_p":{
        "map":"function(doc){ emit(doc.state, doc.tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },

    "sumByCity_infants_primary":{
        "map":"function(doc){ emit(doc.city, doc.infants_primary_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_infants_primary":{
        "map":"function(doc){ emit(doc.state, doc.infants_primary_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },

    "sumByCity_other_type_educ_instit":{
        "map":"function(doc){ emit(doc.city, doc.other_type_educ_instit_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByState_other_type_educ_instit_tot_p":{
        "map":"function(doc){ emit(doc.state, doc.other_type_educ_instit_tot_p);}",
        "reduce": "function (key, values, rereduce) {return sum(values);} "
    },
    "sumByCity_All":{
        "map": "function (doc) {emit(doc.city,[doc.secondary_tot_p,doc.uni_other_tert_instit_tot_p,doc.tec_furt_educ_inst_tot_p,doc.infants_primary_tot_p,doc.other_type_educ_instit_tot_p,doc.tot_p]);}",
        "reduce": "_sum"
    },
    "sumByState_All":{
        "map": "function (doc) {emit(doc.state,[doc.secondary_tot_p,doc.uni_other_tert_instit_tot_p,doc.tec_furt_educ_inst_tot_p,doc.infants_primary_tot_p,doc.other_type_educ_instit_tot_p,doc.tot_p] );}",
        "reduce": "_sum"
    }
    }
    db['_design/DesignDoc'] = dict(language='javascript', views=viewEduReduce)


#create views of Tweets
def ViewsTweets(db):
    viewTweets = {
    "getdata":{
        "map":"function(doc){ emit(doc._id, 1);}",
    },
    "countByCity":{
        "map":"function(doc){ emit([doc.isRelated,doc.region_code], 1);}",
        "reduce": "function (key, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}} "
    },
    "countByState":{
        "map":"function(doc){ emit([doc.isRelated,doc.state_name], 1);}",
        "reduce": "function (key, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}} "
    }

    }
    db['_design/DesignDoc'] = dict(language='javascript', views=viewTweets)


#create views of with languate feature to geo-tweets
def ViewsGeoTweets(db):
    viewTweets = {
    "getdata":{
        "map":"function(doc){ emit(doc._id, 1);}",
    },
    "countLangCity":{
        "map":"function(doc){ emit([doc.region_code, doc.lang], 1);}",
        "reduce":  "function (key, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}} "
    },
    "countLangState":{
        "map":"function(doc){ emit([doc.state_name, doc.lang], 1);}",
        "reduce": "function (key, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}} "
    },
    "countByCity":{
        "map":"function(doc){ emit([doc.isRelated,doc.region_code], 1);}",
        "reduce": "function (key, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}} "
    },
    "countByState":{
        "map":"function(doc){ emit([doc.isRelated,doc.state_name], 1);}",
        "reduce": "function (key, values, rereduce) {if (rereduce) {return sum(values);} else {return values.length;}} "
    }

    }
    db['_design/DesignDoc'] = dict(language='javascript', views=viewTweets)