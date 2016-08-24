# coding: utf-8
# import sys
from __future__ import unicode_literals  # for unicode handling (important)
from flask import Flask
from flask_socketio import SocketIO
# import tweepy
# import sys
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
# from tweepy import Stream
import time
import json
# import pandas as pd
from textblob import TextBlob
import random
import os
# reload(sys)
# sys.setdefaultencoding('utf8')


def countNPAT(NPAT, text, dictionary, AT_json, NP_json):
    for row in NPAT:
        for i in row:
            if (type(i) is list):
                flag1 = False
                flag2 = False
                for j in i:
                    if j.lower() in text.lower():
                        dictionary[row[0]] += 1
                        for k in AT_json['features']:
                            if (k['properties']['National Park'].strip() == row[0].strip()):
                                if (k['properties']['Name'].strip() == row[0].strip()):
                                    cor_list = k['geometry']['coordinates']
                                    np_x = cor_list[0]
                                    np_y = cor_list[1]
                                    flag1 = True
                                if (k['properties']['Name'].strip() == i[0].strip()):
                                    cor_list = k['geometry']['coordinates']
                                    at_x = cor_list[0]
                                    at_y = cor_list[1]
                                    new_x, new_y = randomATPoint(at_x, at_y)
                                    count = dictionary[row[0]]
                                    flag2 = True
                                if (flag1 and flag2):
                                    ##print "dictionary", dictionary
                                    return new_x, new_y, np_x, np_y, count, row[0]
            elif i.lower() in text.lower():
                dictionary[row[0]] += 1
                for k in AT_json['features']:
                    if (k['properties']['Name'].strip() == row[0].strip()):
                        cor_list = k['geometry']['coordinates']
                        np_x = cor_list[0]
                        np_y = cor_list[1]
                for j in NP_json['features']:
                    if (j['properties']['UNIT_NAME'].strip() == row[0].strip()):
                        np_minx = j['properties']['MINX']
                        np_maxx = j['properties']['MAXX']
                        np_miny = j['properties']['MINY']
                        np_maxy = j['properties']['MAXY']
                        new_x, new_y = randomNPPoint(np_minx, np_maxx, np_miny, np_maxy)
                        count = dictionary[row[0]]
                        ##print "dictionary", dictionary
                        return new_x, new_y, np_x, np_y, count, row[0]
            else:
                continue
    print ("no return...")
    print text
    new_x = 0
    new_y = 0
    np_x = 0
    np_y = 0
    count = dictionary[row[0]]
    return new_x, new_y, np_x, np_y, count, row[0]


def randomATPoint(cor_x, cor_y):
    new_x = cor_x + 0.02*(random.random()-0.5)
    new_y = cor_y + 0.02*(random.random()-0.5)
    return new_x, new_y


def randomNPPoint(min_x, max_x, min_y, max_y):
    span_x = max_x - min_x
    span_y = max_y - min_y
    new_x = min_x + span_x * random.random()
    new_y = min_y + span_y * random.random()
    return new_x, new_y


def parseTweet(tweet, NPAT_dict, ID_COUNT_dict):
    attraction_path = os.path.join(os.path.dirname(__file__), './static/data/attraction.json')
    NP_path = os.path.join(os.path.dirname(__file__), './static/data/np_bbox.geojson')
    NP_id_dict = {}

    NPAT = [['Acadia National Park', 'AcadiaNPS', 'Acadia100', 'AcadiaNPS', 'acadianationalPark', ['Cadillac Mountain', 'cadillacmountain'], ['Thunder Hole', 'thunderhole'], ['Schoodic Peninsula', 'schoodicpoint', 'schoodic'], ['Jordan Pond', 'Jordonpond']],
            ['National Park of American Samoa', 'Amer_SamoaNPS', ['Mt. Alava', 'Mt.Alava', 'MtAlava']],
            ['Arches National Park', 'ArchesNPS', 'archesnationalPark', 'archesNPS', 'Arches', ['Delicate Arch', 'DelicateArch'], ['Double Arch', 'DoubleArch'], ['Fiery Furnace', 'FieryFurnace']],
            ['Badlands National Park', 'BadlandsNPS', 'badlandsnationalPark', 'badlandsNPS', ['Loop Road', 'LoopRoad'], ['Window Trail',  'WindowTrail']],
            ['Big Bend National Park', 'BigBendNPS', 'bigbend', 'BigBendNationalPark', ['Chisos Mountains', 'ChisosMountains'], ['Lost Mine Trail', 'lostminetrail'], ['Santa Elena Canyon', 'SantaElenaCanyon']],
            ['Biscayne National Park', 'BiscayneNPS', 'BiscayneNationalPark', ['Elliot Key', 'Elliotkey']],
            ['Black Canyon of the Gunnison National Park', 'BlackCanyonNPS', 'BlackCanyon', 'BlackCanyonoftheGunnison', ['North Rim', 'NorthRim'], ['Painted Wall', 'paintedwall'], ['Pulpit Rock Overlook', 'PulpitRock'], ['South Rim Road', 'SouthRim']],
            ['Bryce Canyon National Park', 'BryceCanyonNPS', 'BryceCanyon', 'BryceCanyonNationalPark', 'BryceCanyonNP', ['Inspiration Point', 'inspirationpoint'],     ['Navajo Loop', 'NavajoLoop']],
            ['Canyonlands National Park', 'CanyonlandsNPS', 'canyonlandsnationalPark', 'Canyonlands', ['Dead Horse Point State Park', 'DeadHorsePoint', 'DeadHorsePointStatePark'], ['Grand View Point Overlook', 'GrandViewPoint'], ['Mesa Arch', 'MesaArch']],
            ['Capitol Reef National Park', 'CapitolReefNPS', 'CapitolReef', 'CapitolReefNationalPark'],
            ['Carlsbad Caverns National Park', 'CavernsNPS', 'CarlsbadCaverns', ['Big Room', 'BigRoom'], ['Kings Palace', 'KingsPalace'], ['Lion?s Tail', 'Lionstail']],
            ['Channel Islands National Park', 'CHISNPS', 'ChannelIslandsNationalPark', 'ChannelIslands', ['Anacapa Island', 'AnacapaIsland', 'Anacapa'], ['Santa Rosa Island', 'Bechers Bay Point', 'SantaRosaIsland'], ['The Sea Caves', 'SeaCaves']],
            ['Congaree National Park', 'Congaree', 'CongareeNationalPark'],
            ['Crater Lake National Park', 'CraterLakeNPS', 'CraterLake', 'CraterLakeNationalPark', ['Toketee Falls', 'toketeefalls']],
            ['Cuyahoga Valley National Park', 'CVNPNPS', 'Cuyahoga', 'CuyahogaValley', 'CuyahogaValleyNationalPark', ['Beaver Marsh', 'BeaverMarsh']],
            ['Death Valley National Park', 'DeathValleyNPS', 'DeathValley', 'DeathValleyNationalPark', 'DeathValleyNPS', ['Badwater Basin', 'BadwaterBasin'], ['Dante?s View', 'DantesView'], ['Zabriskie Point', 'ZabriskiePoint', 'Zabriskie']],
            ['Denali National Park', 'DenaliNPS', 'DenaliNationalPark', 'DenaliNP', ['Mt. Healy Overlook', 'MtHealy', 'MtHealy'], ['Savage River Loop Trail', 'savageriver']],
            ['Dry Tortugas National Park', 'DryTortugasNPS', 'drytortugas', 'drytortugasnationalPark', ['Fort Jefferson', 'FortJefferson'], ['Garden Key Lighthouse', 'GardenKey']],
            ['Everglades National Park', 'EvergladesNPS', 'Everglades', 'EvergladesNationalPark', 'EvergladesNPS', ['Shark Valley', 'SharkValley']],
            ['Gates of the Arctic National Park', 'GatesArcticNPS', ['Kobuk River', 'Kobuk']],
            ['Glacier National Park', 'GlacierNPS', 'GlacierNationalPark', 'GlacierNP', 'GlacierNPS', ['Bowman Lake', 'BowmanLake'], ['Going-to-the-Sun Road', 'Sunroad'], ['Grinnell Glacier', 'GrinnellGlacier']],
            ['Glacier Bay National Park', 'GlacierBayNPS', 'GlacierBay', 'GlacierBayNationalPark'],
            ['Grand Canyon National Park', 'GrandCanyonNPS', 'GrandCanyon', 'GrandCanyonNationalPark', 'GrandCanyonNP', ['Bright Angel Trail', 'BrightAngelTrail', 'BrightAngel'], ['Mather Point', 'MatherPoint'], ['Rim Trail', 'RimTrail'], ['South Kaibab Trail', 'Southkaibab', 'SouthKaibabTrail', 'SouthRim']],
            ['Grand Teton National Park', 'GrandTetonNPS', 'GrandTeton', 'GrandTetonNationalPark', 'GrandTetonNP', ['Jenny Lake Trail', 'JennyLake'], ['Mormon Row Historic District', 'mormonrow'], ['Signal Mountain', 'SignalMountain']],
            ['Great Basin National Park', 'GreatBasinNPS', 'GreatBasin', 'GreatBasinNationalPark', ['Bristlecone Pine', 'BristleconePine'], ['Wheeler Peak', 'WheelerPeak']],
            ['Great Sand Dunes National Park', 'GreatSandDunes', 'GreatSandDunesNP', 'GreatSandDunesNationalPark'],
            ['Great Smoky Mountains National Park', 'GSMNP', 'SmokiesRoadsNPS', 'smokymountains', 'smokymountainsnationalPark', 'GreatSmokyMountains', 'GreatSmokyMountainsNationalPark', ['Alum Cave Trail', 'AlumCave', 'AlumCaveTrail'], ['Chimney Tops', 'ChimneyTops'], ['Mount Le Conte', 'MountLeConte', 'MtLeConte']],
            ['Guadalupe Mountains National Park', 'GuadalupeMountainsNP', 'GuadalupeMountains', ['Guadalupe Peak', 'GuadalupePeak']],
            ['Haleakala National Park', 'HaleakalaNPS', 'Halaeakala', 'HalakalaNationalPark', ['Haleakala Crater', 'HaleakalaCrater']],
            ['Hawaii Volcanoes National Park', 'Volcanoes_NPS', 'HawaiiVolcanoesNationalPark', 'HawaiiVolcanoes', ['Kilauea', 'Kilauea'], ['Thurston Lava Tube', 'ThurstonLavaTube']],
            ['Hot Springs National Park', 'HotspringsNationalPark', ['Bathhouse Row', 'BathhouseRow'], ['Lake Ouachita', 'LakeOuachita']],
            ['Isle Royale National Park', 'IsleRoyale', 'IsleRoyaleNationalPark', ['Rock Harbor', 'RockHarbor']],
            ['Joshua Tree National Park', 'JoshuaTreeNPS', 'joshuatree', 'joshuatreenationalPark', ['Cholla Cactus Garden', 'ChollaCactus'], ['Hidden Valley', 'HiddenValley'], ['Keys View', 'KeysView'], ['Skull Rock', 'Skullrock']],
            ['Katmai National Park', 'KatmaiNPS', 'Katmai', 'KatmaiNationalPark', 'KatmaiNP', ['Brooks Falls', 'BrooksFalls']],
            ['Kenai Fjords National Park', 'KenaiFjordsNPS', 'KenaiFjords', 'KenaiFjordsNationalPark', ['Exit Glacier', 'ExitGlacier'], ['Harding Icefield Trail', 'HardingIceFieldTrail']],
            ['Kings Canyon National Park', 'SequoiaKingsNPS', 'KingsCanyon', 'KingsCanyonNationalPark', ['General Grant Tree Trail', 'GeneralGrantTree'], ['General Sherman Tree', 'GeneralShermanTree'], ['Giant Forest', 'GiantForest'], ['Moro Rock', 'MoroRock']],
            ['Kobuk Valley National Park'],
            ['Lake Clark National Park', 'LakeClarkNPS', 'LakeClark', 'LakeClarkNationalPark'],
            ['Lassen Volcanic National Park', 'LassenNPS', 'LassenNPS', 'LassenNationalPark', 'LassenVolcanicNationalPark', ['Kings Creek Falls', 'KingsCreekFalls'], ['Lassen Peak', 'LassenPeakn'], ['Manzanita Lake', 'ManzanitaLake']],
            ['Mammoth Cave National Park', 'MammothCaveNP', 'MammothCaveNP', 'MammothCave', 'MammothCAveNationalPark', ['Mammoth Cave Big Woods', 'MammothCave']],
            ['Mesa Verde National Park', 'MesaVerde', 'MesaVerdeNP', 'MesaVerdeNationalPark', ['Balcony House', 'BalconyHose'], ['Cliff Palace', 'CliffPalace'], ['Spruce Tree House', 'SpruceTreeHouse']],
            ['Mount Rainier National Park', 'MountRainierNPS', 'Mountrainier', 'MountrainierNationalPark', 'MountrainierNP', ['Box Canyon Loop', 'boxcanyon'], ['Mount Rainier', 'MountRainier'], ['Narada Falls', 'NaradaFalls']],
            ['North Cascades National Park', 'NCascadesNPS', 'NorthCascades', 'NorthCascadesNP', 'NorthCascadesNatinalPark', ['Lake Ann', 'LakeAnn'], ['Washington Pass', 'WashingtonPass']],
            ['Olympic National Park', 'OlympicNP', 'OlympicNP', 'OlympicNationalPark', ['Hoh Rain Forest', 'HohRainForest'], ['Hurricane Ridge', 'HurricaneRidge'], ['Lake Crescent', 'LakeCrescent'], ['Olympic National Forest', 'OlympicNationalForest'], ['Rialto Beach', 'RialtoBeach']],
            ['Petrified Forest National Park', 'PetrifiedNPS', 'PetrifiedForest', 'PetrifiedForestNationalPark', ['Blue Mesa', 'BlueMesa'], ['Crystal Forest Loop', 'CrystalForest'], ['Newspaper Rock', 'NewspaperRock'], ['Painted Desert', 'PaintedDesert'], ['Rainbow Forest', 'RainbowForest']],
            ['Pinnacles National Park', 'PinnaclesNPS', 'Pinnacles', 'PinnaclesNationalPark'],
            ['Redwood National Park', 'RedwoodNPS', 'Redwood', 'RedwoodForest', 'RedwoodNationalPark', ['California Coastal Trail', 'CaliforniaCoastalTrail'], ['Crescent Beach Overlook', 'CrescentBeach']],
            ['Rocky Mountain National Park', 'RockyNPS', 'RockyMountains', 'RockyMountain', 'RockyMountainNationalPark', 'RockyMountainNP', ['Bear Lake', 'BearLake'], ['Lily Lake', 'LilyLake'], ['Thunder Lake', 'ThunderLake']],
            ['Saguaro National Park', 'SaguaroNPS', 'saguaro', 'SaguaroNationalPark', ['King Canyon Trail', 'KingCanyon'], ['Signal Hill Trail', 'SignalHill']],
            ['Sequoia National Park', 'SequoiaKingsNPS', 'Sequoia', 'SequioaNationalPark', 'SequoiaNP', ['Crescent Meadow', 'CrescentMeadow'], ['Crystal Cave', 'CrystalCave'], ['Moro Rock', 'MoroRock']],
            ['Shenandoah National Park', 'ShenandoahNPS', 'Shenandoah', 'ShenandoahNP', 'ShenandoahNationalPark', ['Dark Hollow Falls', 'DarkHollowFalls'], ['Old Rag Mountain', 'OldRagMountain'], ['Skyline Drive', 'SkylineDrive']],
            ['Theodore Roosevelt National Park', 'TRooseveltNPS', 'rooseveltnationalPark', 'theodorerooseveltnationalPark', ['Painted Canyon Overlook', 'PaintedCanyon']],
            ['Virgin Islands National Park', 'virginislandsnationalPark', 'virginislandsnp', 'virginislands', ['Cinnamon Bay', 'CinnamonBay'], ['Trunk Bay', 'TrunkBay']],
            ['Voyageurs National Park', 'VoyageursNPA', 'VoyageursNationalPark', 'VoyagueursNP', 'Voaguers', ['Kabetogama Lake', 'KabetogamaLake', 'Kabetogama'], ['Rainy Lake', 'RainyLake']],
            ['Wind Cave National Park', 'WindCaveNPS', 'WindCave', 'WindCaveNP', 'WindCaveNationalPark'],
            ['Wolf Trap National Park', 'Wolf_Trap_NPS', 'WolfTrap', 'Filene Center', 'FileneCEnter'],
            ['Wrangell St. Elias National Park', 'WrangellStENPS', 'Wrangell', 'Wrangellstelias', 'WrangellsteliasNationalPark'],
            ['Yellowstone National Park', 'YellowstoneNPS', 'Yellowstone', 'YellowstoneNP', 'YellowstoneNationalPark', ['Grand Canyon of the Yellowstone', 'GrandCanyonoftheYellowstone'], ['Grand Prismatic Spring', 'GrandPrismaticSpring', 'PrismaticSpring'], ['Lamar Valley'], ['Lower Yellowstone River Falls', 'YellowstoneFalls'], ['Old Faithful', 'OldFaithful']],
            ['Yosemite National Park', 'YosemiteNPS', 'Yosemite', 'YosemiteNP', 'YosemiteNationalPark', ['El Capitan', 'ElCapitan'], ['Half Dome', 'HalfDome'], ['Sierra Nevada', 'SierraNevada'], ['Yosemite Falls', 'YosemiteFalls'], ['Yosemite Valley', 'YosemiteValley']],
            ['Zion National Park', 'ZionNPS', 'ZionNP', 'ZionNationalPark', ['Angels Landing', 'AngelsLanding'], ['Observation Point', 'ObservationPoint'], ['The Narrows', 'TheNarrows'], ['Weeping Rock Trail', 'WeepingRock']]]

    with open(attraction_path) as attraction_data:
        attraction_json = json.load(attraction_data)
        attraction_data.close()

    with open(NP_path) as NP_data:
        nationalpark_json = json.load(NP_data)
        NP_data.close()

    id = 0
    for i in nationalpark_json['features']:
        NPAT_dict[i['properties']['UNIT_NAME'].strip()] = 0
        NP_id_dict[i['properties']['UNIT_NAME'].strip()] = str(id)
        id += 1

    tw_text = tweet['text']
    cor_x, cor_y, np_cor_x, np_cor_y, tweet_count, np_name = countNPAT(NPAT, tw_text, NPAT_dict, attraction_json, nationalpark_json)
    tw_blob = TextBlob(tw_text)
    senti_value = tw_blob.sentiment.polarity
    for i in nationalpark_json['features']:
        ID_COUNT_dict[NP_id_dict[i['properties']['UNIT_NAME'].strip()]] = NPAT_dict[i['properties']['UNIT_NAME'].strip()]

    return cor_x, cor_y, senti_value, np_cor_x, np_cor_y, tweet_count, np_name


search_list_1 = []
search_list_2 = []

with open('./search_term.txt') as f:  # encoding='ISO-8859-1') as f:
    for line in f:
        for elt in line.strip().split(','):
            term = elt.strip()
            if term != '' and term is not None:
                search_list_1.append(term)

with open('./search_term2.txt') as f:  # encoding='ISO-8859-1') as f:
    for line in f:
        for elt in line.strip().split(','):
            term = elt.strip()
            if term != '' and term is not None:
                search_list_2.append(term)

access_token_1 = ""
access_token_secret_1 = ""
consumer_key_1 = ""
consumer_secret_1 = ""

access_token_2 = ""
access_token_secret_2 = ""
consumer_key_2 = ""
consumer_secret_2 = ""

tw_NPAT_dict = {}
tw_ID_COUNT_dict = {}


# tweepy stream
class StdOutListener1(StreamListener):
    def on_data(self, data):
        global tw_NPAT_dict
        global tw_ID_COUNT_dict
        data = json.loads(data)
        name = '@' + data['user']['screen_name']
        text = data['text']
        tw_cor_x, tw_cor_y, tw_senti_value, tw_np_cor_x, tw_np_cor_y, tw_count, np_name = parseTweet(data, tw_NPAT_dict, tw_ID_COUNT_dict)
        if ((tw_cor_x != 0) and (tw_cor_y != 0)):
            socketio.emit('streamTweets1',
                          {'user_name': name, 'stream_text': text, 'X_cor': tw_cor_x, 'Y_cor': tw_cor_y, 'sentimen': tw_senti_value, 'NP_X': tw_np_cor_x, 'NP_Y': tw_np_cor_y, 'TW_count': tw_count, 'NP_name': np_name},
                          namespace='/npTweet')

    def on_error(self, status):
        print status
        if status == 420:
            time.sleep(30)


class StdOutListener2(StreamListener):
    def on_data(self, data):
        global tw_NPAT_dict
        global tw_ID_COUNT_dict
        data = json.loads(data)
        name = '@' + data['user']['screen_name']
        text = data['text']
        tw_cor_x, tw_cor_y, tw_senti_value, tw_np_cor_x, tw_np_cor_y, tw_count, np_name = parseTweet(data, tw_NPAT_dict, tw_ID_COUNT_dict)
        if ((tw_cor_x != 0) and (tw_cor_y != 0)):
            socketio.emit('streamTweets2',
                          {'user_name': name, 'stream_text': text, 'X_cor': tw_cor_x, 'Y_cor': tw_cor_y, 'sentimen': tw_senti_value, 'NP_X': tw_np_cor_x, 'NP_Y': tw_np_cor_y, 'TW_count': tw_count, 'NP_name': np_name},
                          namespace='/npTweet')
        # socketio.emit('streamTweets2', {'stream_result_2': data}, namespace='/npTweet')
        # socketio.emit('senti_2', {'sentiment_2': sentiment_2}, namespace='/npTweet')

    def on_error(self, status):
        print status
        if status == 420:
            time.sleep(30)

# This handles Twitter authetification and the connection to Twitter Streaming API
l1 = StdOutListener1()
l2 = StdOutListener2()

auth_1 = OAuthHandler(consumer_key_1, consumer_secret_1)
auth_1.set_access_token(access_token_1, access_token_secret_1)

auth_2 = OAuthHandler(consumer_key_2, consumer_secret_2)
auth_2.set_access_token(access_token_2, access_token_secret_2)

app = Flask(__name__)  # fine for single module
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)


@app.route("/")
def root():
    return app.send_static_file("index.html")


@socketio.on("connect", namespace="/npTweet")
def connectServer():
    print("Client connected")
    socketio.emit("connected", namespace="/npTweet")


@socketio.on('startTweets1', namespace='/npTweet')
def tweetStreaming1():
    stream_1 = Stream(auth_1, l1)
    stream_1.filter(track=search_list_1)


@socketio.on('startTweets2', namespace='/npTweet')
def tweetStreaming2():
    stream_2 = Stream(auth_2, l2)
    stream_2.filter(track=search_list_2)


# @socketio.on('startTweets2', namespace='/npTweet')
# def tweetStreaming2():
#     stream_2 = Stream(auth_2, l2)
    # stream_2.filter(track=search_list_2)


# @socketio.on("startTweets", namespace="/npTweet")
# def tweetStreaming():
#     print("Start streaming tweets...")
#     stream_1 = Stream(auth_1, l)
#     stream_1.filter(track="Olympics")
    # text_1 = stream_result_1['text']
    # blob_1 = TextBlob(text_1)
    # sentiment_1 = blob_1.sentiment.polarity
    # print type(stream_result_1)
    # # print(stream_result_1["id"])
    # socketio.emit('senti_1', {'sentiment_1': sentiment_1}, namespace='/npTweet')

    # socketio.emit("streamTweets", {"stream_result": "test"}, namespace="/npTweet")

# @socketio.on("disconnect", namespace="/test")
# def disconnectServer():
#     print("Client disconnected")


if __name__ == "__main__":
    socketio.run(app, debug=True, port=7000)  # make it externally visible
	#host="0.0.0.0", 
