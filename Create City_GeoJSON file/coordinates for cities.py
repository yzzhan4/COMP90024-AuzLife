"""
Team 46
Haoyue Xie 1003068 @Melbourne
Jiayu Li 713551 @Melbourne
Ruqi Li 1008342 @Melbourne
Yi Zhang 1032768 @Melbourne
Zimeng Jia 978322 @Hebei, China
"""

import json

path  = "E:/Unimelb/2020semester1/COPM90024 Cluster and Cloud Computing/assignment2/code/"
filename = path + 'SA4_2016_AUST.json'
 
with open(filename, 'r') as f:
    jsonfile = json.load(f)    #jsonfile is a dict
    print("---------------reading json file done--------------------------------------")

print(jsonfile.keys())  #dict_keys(['type', 'features'])
features = jsonfile['features']

'''
print("type of features:",type(features))  #features is a list
print(len(features))
print("type of features[0]:",type(features[0]))  #each feature is a dict
feature = features[0]
print("keys of feature:",feature.keys())  #dict_keys(['type', 'geometry', 'properties'])
properities = feature['properties']
geometry = feature['geometry']
print("type of properities:",type(properities))
print("keys of properities:",properities.keys())  #dict_keys(['SA4_CODE', 'SA4_CODE16', 'SA4_NAME', 'STATE_CODE', 'STATE_NAME', 'AREA_SQKM'])
print("type of geometry:",type(geometry)) #<class 'dict'>
print("keys of geometry:",geometry.keys()) #dict_keys(['type', 'coordinates'])
coordinates = geometry['coordinates'] 
print("type of coordinates",type(coordinates)) #<class 'list'>
print(len(coordinates)) # len=1
'''

coordinates_Melbourne = []
coordinates_Sydney = []
coordinates_Brisbane = []
coordinates_GoldCoast = []
coordinates_Adelaide = []
coordinates_Perth = []
coordinates_Canberra = []
coordinates_ACT = []
coordinates_NSW = []
coordinates_NT = []
coordinates_QLD = []
coordinates_SA = []
coordinates_TAS = []
coordinates_VIC = []
coordinates_WA = []

area_sqkm_Sydney = 0
area_sqkm_Melbourne = 0
area_sqkm_Brisbane = 0
area_sqkm_GoldCoast = 0
area_sqkm_Adelaide = 0
area_sqkm_Perth = 0
area_sqkm_Canberra = 0
area_sqkm_NT = 0
area_sqkm_WA = 0
area_sqkm_TAS = 0
area_sqkm_SA = 0
area_sqkm_QLD = 0
area_sqkm_VIC = 0
area_sqkm_NSW = 0
area_sqkm_ACT = 0

for feature in features:
    properities = feature['properties']
    sa4_code16 = properities['SA4_CODE16']
    print("+++++++++++++++"+sa4_code16+"++++++++++++")
    geometry = feature['geometry']  #geometry has two keys: "tpye" and "coordinates"
    print(properities)
    if(int(sa4_code16)>=115 and int(sa4_code16)<=128): #-------------------------------merge for Sydney---------------------
        if(geometry !=None):  #some coordinates are None
            coordinates = geometry['coordinates'] 
            #print(properities['SA4_NAME'],geometry['type'],len(coordinates))
            if (geometry["type"]=="Polygon"):
                coordinates_Sydney.append(coordinates)
            else:
                for coordinate in coordinates:
                    coordinates_Sydney.append(coordinate)
            area_sqkm_Sydney += properities['AREA_SQKM']
    elif(int(sa4_code16)>=206 and int(sa4_code16)<=213): #-----------------------------merge for Melbourne-----------------------------------
        if(geometry !=None):  #some coordinates are None
            coordinates = geometry['coordinates'] 
            if (geometry["type"]=="Polygon"):
                coordinates_Melbourne.append(coordinates)
            else:
                for coordinate in coordinates:
                    coordinates_Melbourne.append(coordinate)
            area_sqkm_Melbourne += properities['AREA_SQKM']
    elif(int(sa4_code16)>=401 and int(sa4_code16)<=404): #-----------------------------merge for Adelaide-------------------------------------
        if(geometry !=None):  #some coordinates are None
            coordinates = geometry['coordinates'] 
            if (geometry["type"]=="Polygon"):
                coordinates_Adelaide.append(coordinates)
            else:
                for coordinate in coordinates:
                    coordinates_Adelaide.append(coordinate)
            area_sqkm_Adelaide += properities['AREA_SQKM']
    elif(int(sa4_code16)>=301 and int(sa4_code16)<=305): #-----------------------------merge for Brisbane-------------------------------------
        if(geometry !=None):  #some coordinates are None
            coordinates = geometry['coordinates'] 
            if (geometry["type"]=="Polygon"):
                coordinates_Brisbane.append(coordinates)
            else:
                for coordinate in coordinates:
                    coordinates_Brisbane.append(coordinate)
            area_sqkm_Brisbane += properities['AREA_SQKM']
    elif(int(sa4_code16)==801): #------------------------------------------------------merge for Canberra-------------------------------------
        if(geometry !=None):  #some coordinates are None
            geometry_Canberra = geometry  #Canberraonly have one region
            #coordinates = geometry['coordinates'] 
            #if (geometry["type"]=="Polygon"):
            #    coordinates_Canberra.append(coordinates)
            #else:
            #    for coordinate in coordinates:
            #        coordinates_Canberra.append(coordinate)
            area_sqkm_Canberra += properities['AREA_SQKM']
    elif(int(sa4_code16)==309): #------------------------------------------------------merge for Gold Coast-------------------------------------
        if(geometry !=None):  #some coordinates are None
            coordinates = geometry['coordinates']
            if (geometry["type"]=="Polygon"):
                coordinates_GoldCoast.append(coordinates)
            else:
                for coordinate in coordinates:
                    coordinates_GoldCoast.append(coordinate)
            area_sqkm_GoldCoast += properities['AREA_SQKM']
    elif(int(sa4_code16)>=503 and int(sa4_code16)<=507): #-----------------------------merge for Perth-------------------------------------
        if(geometry !=None):  #some coordinates are None
            coordinates = geometry['coordinates'] 
            if (geometry["type"]=="Polygon"):
                coordinates_Perth.append(coordinates)
            else:
                for coordinate in coordinates:
                    coordinates_Perth.append(coordinate)
            area_sqkm_Perth += properities['AREA_SQKM']

    else:  #other regions for each state
        if(geometry !=None):
            if(properities['STATE_CODE']=="8"): #---------------------------------------merge for ACT
                coordinates = geometry['coordinates'] 
                if (geometry["type"]=="Polygon"):
                    coordinates_ACT.append(coordinates)
                else:
                    for coordinate in coordinates:
                        coordinates_ACT.append(coordinate)
                area_sqkm_ACT += properities['AREA_SQKM']
            elif(properities['STATE_CODE']=="1"): #---------------------------------------merge for NSW
                coordinates = geometry['coordinates'] 
                if (geometry["type"]=="Polygon"):
                    coordinates_NSW.append(coordinates)
                else:
                    for coordinate in coordinates:
                        coordinates_NSW.append(coordinate)
                area_sqkm_NSW += properities['AREA_SQKM']
            elif(properities['STATE_CODE']=="7"): #---------------------------------------merge for NT
                coordinates = geometry['coordinates'] 
                if (geometry["type"]=="Polygon"):
                    coordinates_NT.append(coordinates)
                else:
                    for coordinate in coordinates:
                        coordinates_NT.append(coordinate)
                area_sqkm_NT += properities['AREA_SQKM']
            elif(properities['STATE_CODE']=="3"): #---------------------------------------merge for QLD
                coordinates = geometry['coordinates']
                if (geometry["type"]=="Polygon"):
                    coordinates_QLD.append(coordinates)
                else: 
                    for coordinate in coordinates:
                        coordinates_QLD.append(coordinate)
                area_sqkm_QLD += properities['AREA_SQKM']
            elif(properities['STATE_CODE']=="4"): #---------------------------------------merge for SA
                coordinates = geometry['coordinates'] 
                if (geometry["type"]=="Polygon"):
                    coordinates_SA.append(coordinates)
                else:
                    for coordinate in coordinates:
                        coordinates_SA.append(coordinate)
                area_sqkm_SA += properities['AREA_SQKM']
            elif(properities['STATE_CODE']=="6"): #---------------------------------------merge for TAS
                coordinates = geometry['coordinates'] 
                if (geometry["type"]=="Polygon"):
                    coordinates_TAS.append(coordinates)
                else:
                    for coordinate in coordinates:
                        coordinates_TAS.append(coordinate)
                area_sqkm_TAS += properities['AREA_SQKM']
            elif(properities['STATE_CODE']=="2"): #---------------------------------------merge for VIC
                coordinates = geometry['coordinates']
                if (geometry["type"]=="Polygon"):
                    coordinates_VIC.append(coordinates)
                else: 
                    for coordinate in coordinates:
                        coordinates_VIC.append(coordinate)
                area_sqkm_VIC += properities['AREA_SQKM']
            elif(properities['STATE_CODE']=="5"): #---------------------------------------merge for WA
                coordinates = geometry['coordinates'] 
                if (geometry["type"]=="Polygon"):
                    coordinates_WA.append(coordinates)
                else: 
                    for coordinate in coordinates:
                        coordinates_WA.append(coordinate)
                area_sqkm_WA += properities['AREA_SQKM']





    #create a new ragion code

#===============================properties,geometry, feature of each region=========================
#----------------------Melbourne--------------------------
properties_Melbbourne = {}
properties_Melbbourne["REGION_CODE"]="01"
properties_Melbbourne["AREA_SQKM"] = area_sqkm_Melbourne
properties_Melbbourne["STATE_CODE"]="2"
properties_Melbbourne["STATE_NAME"]="VIC"
properties_Melbbourne["CITY_NAME"]="Melbourne"

geometry_Melbourne = {}
geometry_Melbourne["type"] = "MultiPolygon"
geometry_Melbourne["coordinates"] = coordinates_Melbourne

feature_Melbbourne = {}
feature_Melbbourne["type"]="Feature"
feature_Melbbourne["geometry"] = geometry_Melbourne
feature_Melbbourne["properties"] = properties_Melbbourne

#----------------------Sydney-------------------------------
properties_Sydney = {}
properties_Sydney["REGION_CODE"]="02"
properties_Sydney["AREA_SQKM"] = area_sqkm_Sydney
properties_Sydney["STATE_CODE"]="1"
properties_Sydney["STATE_NAME"]="NSW"
properties_Sydney["CITY_NAME"]="Sydney"

geometry_Sydney = {}
geometry_Sydney["type"] = "MultiPolygon"
geometry_Sydney["coordinates"] = coordinates_Sydney

feature_Sydney = {}
feature_Sydney["type"]="Feature"
feature_Sydney["geometry"] = geometry_Sydney
feature_Sydney["properties"] = properties_Sydney

#----------------------Brisbane-------------------------------
properties_Brisbane = {}
#properties_Brisbane["type"]="Feature"
properties_Brisbane["REGION_CODE"]="03"
properties_Brisbane["AREA_SQKM"] = area_sqkm_Brisbane
properties_Brisbane["STATE_CODE"]="3"
properties_Brisbane["STATE_NAME"]="QLD"
properties_Brisbane["CITY_NAME"]="Brisbane"

geometry_Brisbane = {}
geometry_Brisbane["type"] = "MultiPolygon"
geometry_Brisbane["coordinates"] = coordinates_Brisbane

feature_Brisbane = {}
feature_Brisbane["type"]="Feature"
feature_Brisbane["geometry"] = geometry_Brisbane
feature_Brisbane["properties"] = properties_Brisbane

#----------------------GoldCoast-------------------------------
properties_GoldCoast = {}
#properties_GoldCoast["type"]="Feature"
properties_GoldCoast["REGION_CODE"]="04"
properties_GoldCoast["AREA_SQKM"] = area_sqkm_GoldCoast
properties_GoldCoast["STATE_CODE"]="3"
properties_GoldCoast["STATE_NAME"]="QLD"
properties_GoldCoast["CITY_NAME"]="Gold Coast"

geometry_GoldCoast = {}
geometry_GoldCoast["type"] = "MultiPolygon"
geometry_GoldCoast["coordinates"] = coordinates_GoldCoast

feature_GoldCoast = {}
feature_GoldCoast["type"]="Feature"
feature_GoldCoast["geometry"] = geometry_GoldCoast
feature_GoldCoast["properties"] = properties_GoldCoast

#----------------------Adelaide-------------------------------
properties_Adelaide = {}
#properties_Adelaide["type"]="Feature"
properties_Adelaide["REGION_CODE"]="05"
properties_Adelaide["AREA_SQKM"] = area_sqkm_Adelaide
properties_Adelaide["STATE_CODE"]="4"
properties_Adelaide["STATE_NAME"]="SA"
properties_Adelaide["CITY_NAME"]="Adelaide"

geometry_Adelaide = {}
geometry_Adelaide["type"] = "MultiPolygon"
geometry_Adelaide["coordinates"] = coordinates_Adelaide

feature_Adelaide = {}
feature_Adelaide["type"]="Feature"
feature_Adelaide["geometry"] = geometry_Adelaide
feature_Adelaide["properties"] = properties_Adelaide

#----------------------Perth-------------------------------
properties_Perth = {}
#properties_Perth["type"]="Feature"
properties_Perth["REGION_CODE"]="06"
properties_Perth["AREA_SQKM"] = area_sqkm_Perth
properties_Perth["STATE_CODE"]="5"
properties_Perth["STATE_NAME"]="WA"
properties_Perth["CITY_NAME"]="Perth"

geometry_Perth = {}
geometry_Perth["type"] = "MultiPolygon"
geometry_Perth["coordinates"] = coordinates_Perth

feature_Perth = {}
feature_Perth["type"]="Feature"
feature_Perth["geometry"] = geometry_Perth
feature_Perth["properties"] = properties_Perth

#----------------------Canberra-------------------------------
properties_Canberra = {}
#properties_Canberra["type"]="Feature"
properties_Canberra["REGION_CODE"]="07"
properties_Canberra["AREA_SQKM"] = area_sqkm_Canberra
properties_Canberra["STATE_CODE"]="8"
properties_Canberra["CITY_NAME"]="Canberra"

#geometry_Canberra = {}
#geometry_Canberra["type"] = "Polygon"
#geometry_Canberra["coordinates"] = coordinates_Canberra

feature_Canberra = {}
feature_Canberra["type"]="Feature"
feature_Canberra["geometry"] = geometry_Canberra
feature_Canberra["properties"] = properties_Canberra

#----------------------ACT-------------------------------
properties_ACT = {}
#properties_ACT["type"]="Feature"
properties_ACT["REGION_CODE"]="08"
properties_ACT["AREA_SQKM"] = area_sqkm_ACT
properties_ACT["STATE_CODE"]="8"
properties_ACT["STATE_NAME"]="ACT"
properties_ACT["CITY_NAME"]="Australian Capital Territory Other Regions"

geometry_ACT = {}
#geometry_ACT["type"] = "Polygon"
#geometry_ACT["coordinates"] = coordinates_ACT

feature_ACT = {}
feature_ACT["type"]="Feature"
feature_ACT["geometry"] = geometry_ACT
feature_ACT["properties"] = properties_ACT

#----------------------NSW-------------------------------
properties_NSW = {}
#properties_NSW["type"]="Feature"
properties_NSW["REGION_CODE"]="09"
properties_NSW["AREA_SQKM"] = area_sqkm_NSW
properties_NSW["STATE_CODE"]="1"
properties_NSW["STATE_NAME"]="NSW"
properties_NSW["CITY_NAME"]="New South Wales Other Regions"

geometry_NSW = {}
geometry_NSW["type"] = "MultiPolygon"
geometry_NSW["coordinates"] = coordinates_NSW

feature_NSW = {}
feature_NSW["type"]="Feature"
feature_NSW["geometry"] = geometry_NSW
feature_NSW["properties"] = properties_NSW

#----------------------VIC-------------------------------
properties_VIC = {}
#properties_VIC["type"]="Feature"
properties_VIC["REGION_CODE"]="10"
properties_VIC["AREA_SQKM"] = area_sqkm_VIC
properties_VIC["STATE_CODE"]="2"
properties_VIC["STATE_NAME"]="VIC"
properties_VIC["CITY_NAME"]="Victoria Other Regions"

geometry_VIC = {}
geometry_VIC["type"] = "MultiPolygon"
geometry_VIC["coordinates"] = coordinates_VIC

feature_VIC = {}
feature_VIC["type"]="Feature"
feature_VIC["geometry"] = geometry_VIC
feature_VIC["properties"] = properties_VIC

#----------------------QLD-------------------------------
properties_QLD = {}
#properties_QLD["type"]="Feature"
properties_QLD["REGION_CODE"]="11"
properties_QLD["AREA_SQKM"] = area_sqkm_QLD
properties_QLD["STATE_CODE"]="3"
properties_QLD["STATE_NAME"]="QLD"
properties_QLD["CITY_NAME"]="Queensland Other Regions"

geometry_QLD = {}
geometry_QLD["type"] = "MultiPolygon"
geometry_QLD["coordinates"] = coordinates_QLD

feature_QLD = {}
feature_QLD["type"]="Feature"
feature_QLD["geometry"] = geometry_QLD
feature_QLD["properties"] = properties_QLD

#----------------------SA-------------------------------
properties_SA = {}
#properties_SA["type"]="Feature"
properties_SA["REGION_CODE"]="12"
properties_SA["AREA_SQKM"] = area_sqkm_SA
properties_SA["STATE_CODE"]="4"
properties_SA["STATE_NAME"]="SA"
properties_SA["CITY_NAME"]="South Australia Other Regions"

geometry_SA = {}
geometry_SA["type"] = "MultiPolygon"
geometry_SA["coordinates"] = coordinates_SA

feature_SA = {}
feature_SA["type"]="Feature"
feature_SA["geometry"] = geometry_SA
feature_SA["properties"] = properties_SA

#----------------------TAS-------------------------------
properties_TAS = {}
#properties_TAS["type"]="Feature"
properties_TAS["REGION_CODE"]="13"
properties_TAS["AREA_SQKM"] = area_sqkm_TAS
properties_TAS["STATE_CODE"]="6"
properties_TAS["STATE_NAME"]="TAS"
properties_TAS["CITY_NAME"]="Tasmania Other Regions"

geometry_TAS = {}
geometry_TAS["type"] = "MultiPolygon"
geometry_TAS["coordinates"] = coordinates_TAS

feature_TAS = {}
feature_TAS["type"]="Feature"
feature_TAS["geometry"] = geometry_TAS
feature_TAS["properties"] = properties_TAS

#----------------------WA-------------------------------
properties_WA = {}
#properties_WA["type"]="Feature"
properties_WA["REGION_CODE"]="14"
properties_WA["AREA_SQKM"] = area_sqkm_WA
properties_WA["STATE_CODE"]="5"
properties_WA["STATE_NAME"]="WA"
properties_WA["CITY_NAME"]="Western Australia Other Regions"

geometry_WA = {}
geometry_WA["type"] = "MultiPolygon"
geometry_WA["coordinates"] = coordinates_WA

feature_WA = {}
feature_WA["type"]="Feature"
feature_WA["geometry"] = geometry_WA
feature_WA["properties"] = properties_WA

#----------------------NT-------------------------------
properties_NT = {}
#properties_NT["type"]="Feature"
properties_NT["REGION_CODE"]="15"
properties_NT["AREA_SQKM"] = area_sqkm_NT
properties_NT["STATE_CODE"]="7"
properties_NT["STATE_NAME"]="NT"
properties_NT["CITY_NAME"]="Northern Territory Other Regions"

geometry_NT = {}
geometry_NT["type"] = "MultiPolygon"
geometry_NT["coordinates"] = coordinates_NT

feature_NT = {}
feature_NT["type"]="Feature"
feature_NT["geometry"] = geometry_NT
feature_NT["properties"] = properties_NT

#=============================Add feature into features and output====================================
#new_features = [feature_Adelaide,feature_Brisbane,feature_Canberra,feature_GoldCoast,feature_Melbbourne,feature_Perth,feature_Sydney,\
#feature_NSW,feature_NT,feature_QLD,feature_SA,feature_TAS,feature_VIC,feature_WA]

#feature_ACT is empty
new_features = [feature_WA,feature_Perth,feature_Adelaide,feature_Brisbane,feature_Canberra,feature_GoldCoast,feature_Melbbourne,feature_Sydney,\
    feature_NSW,feature_NT,feature_QLD,feature_SA,feature_TAS,feature_VIC,feature_WA]


#print("************************")
#print(feature_ACT["properties"])
#print(feature_ACT["geometry"])

newjsonfile = {}
newjsonfile["type"] = "FeatureCollection"
newjsonfile["features"] = new_features

#print(newjsonfile.keys())
#print(newjsonfile["features"][0].keys())
#print(newjsonfile["features"][0]['properties'])
#print(newjsonfile["features"][0]['geometry'])
#print("newjsonfile done!")

#json_str = json.dumps(newjsonfile)
#print("create json done!")

outputfilename = path + "City_geojson.json"



with open(outputfilename, 'w') as json_file:
    #json_file.write(json_str)
    for chunk in json.JSONEncoder().iterencode(newjsonfile):
        json_file.write(chunk)



print("All Done!")