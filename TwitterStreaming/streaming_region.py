"""
Team 46
Haoyue Xie 1003068 @Melbourne
Jiayu Li 713551 @Melbourne
Ruqi Li 1008342 @Melbourne
Yi Zhang 1032768 @Melbourne
Zimeng Jia 978322 @Hebei, China
"""

import json
from shapely.geometry import shape, Point


#current_region is a dictionary
def streaming_region(current_region, tweet):
    if current_region != {}:
        return current_region
    else:
        area_list = []
        with open("City_geojson.json") as f:
            data = json.load(f)
        for area in data["features"]:
            if area["geometry"] != None:
                polygon = shape(area["geometry"])
                area_list.append([polygon,area["properties"]])

        if tweet["coordinates"] != None:
            point = Point(tweet["coordinates"]["coordinates"][0],tweet["coordinates"]["coordinates"][1])
            for plg in area_list:
                if plg[0].contains(point):
                    return plg[1]
            print("no sa4 area defined")
        elif tweet["place"] != None:
            coor1 = tweet["place"]["bounding_box"]["coordinates"][0][0]
            coor2 = tweet["place"]["bounding_box"]["coordinates"][0][2]
            point =  Point((coor1[0]+coor2[0])/2,(coor1[1]+coor2[1])/2)
            for plg in area_list:
                if plg[0].contains(point):
                    return plg[1]
            print("no sa4 area defined")
        else:
            print("no location info!")
            return {} 

