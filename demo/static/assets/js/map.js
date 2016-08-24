// Author: Bo Yan | boyan@umail.ucsb.edu
// ESRI Hackathon 2016
// National Park Explorer
var socket;
require([
  "esri/config",
  "esri/geometry/SpatialReference",
  "esri/Map",
  "esri/geometry/Point",
  // "esri/WebMap",
  // "esri/views/MapView",
  "esri/views/SceneView",
  "esri/Basemap",
  "esri/layers/WebTileLayer",
  "esri/layers/TileLayer",
  "esri/symbols/ObjectSymbol3DLayer",
  "esri/symbols/PolygonSymbol3D",
  "esri/symbols/PointSymbol3D",
  "esri/symbols/IconSymbol3DLayer",
  "esri/symbols/LineSymbol3D",
  "esri/geometry/Polyline",
  "esri/symbols/LineSymbol3DLayer",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/PopupTemplate",
  // "esri/renderers/SimpleRenderer",
  // "esri/layers/FeatureLayer",
  // "esri/WebScene",
  "esri/Camera",
  "esri/widgets/Search",
  // "esri/widgets/Home",
  "dojo/dom-construct",
  "dojo/dom",
  "dojo/on",
  "dijit/a11yclick",
  "dojo/dom-attr",
  "esri/geometry/Extent",
  // "dojo/on",
  // Calcite-maps
  "calcite-maps/calcitemaps-v0.2",
  // Boostrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",
  "bootstrap/Tab",
  // "bootstrap/Carousel",
  // "bootstrap/Tooltip",
  // "bootstrap/Modal",
  "dojo/domReady!"
], function(esriConfig, SpatialReference, Map, Point, SceneView, Basemap, WebTileLayer, TileLayer, ObjectSymbol3DLayer, PolygonSymbol3D,
  PointSymbol3D, IconSymbol3DLayer, LineSymbol3D, Polyline, LineSymbol3DLayer, Graphic, GraphicsLayer, PopupTemplate, Camera, Search, domConstruct, dom, on, a11yclick, domAttr, Extent) {

  var npBBox;
  var listNode = dom.byId("np_list");
  var recommendList;
  var attractionData = [];
  var view;
  var totalTweetCnt = 0;
  var tweetGraphics;
  var allHeatmapLayer = [];
  // var heatScene;
  // var npCoords = [];

  // trails

  var trailLine = new Polyline({
    paths: [
      [-119.6829987, 37.7158745],
      [-119.672699, 37.7147882],
      [-119.6630859, 37.7137018],
      [-119.6507263, 37.7169608],
      [-119.6411133, 37.7229354],
      [-119.6342468, 37.721306],
      [-119.6246338, 37.7245648],
      [-119.6177673, 37.7272803],
      [-119.6047211, 37.7337971],
      [-119.5944214, 37.7392273],
      [-119.5820618, 37.7397703],
      [-119.573822, 37.7424852],
      [-119.573822, 37.7381413],
      [-119.5703888, 37.7343401],
      [-119.5707321, 37.7324395],
      [-119.5693588, 37.7310818],
      [-119.5697021, 37.7291811],
      [-119.5645523, 37.7335255],
      [-119.5611191, 37.7373268],
      [-119.5556259, 37.7424852],
      [-119.5463562, 37.7449286],
      [-119.5384598, 37.745743],
      [-119.53228, 37.7506295]
    ]
  });

  // var tweetList = [];  // list of tweets to show live on the map
  // var sceneViewDoc = document.getElementById("viewDiv");

  esriConfig.request.corsEnabledServers.push("a.tile.stamen.com",
    "b.tile.stamen.com", "c.tile.stamen.com", "d.tile.stamen.com");

  // tile for heat map
  // var heatLayer = new TileLayer({
  //   url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/Extract_Idw_2a/MapServer"
  // });

  var heat1 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/jan/MapServer"
  });
  var heat2 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/Feb/MapServer"
  });

  var heat3 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/Mar/MapServer"
  });

  var heat4 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/Apr/MapServer"
  });

  var heat5 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/MAY/MapServer"
  });

  var heat6 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/JUNE/MapServer"
  });

  var heat7 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/july/MapServer"
  });

  var heat8 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/AUGUST/MapServer"
  });

  var heat9 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/SEP/MapServer"
  });

  var heat10 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/OCT/MapServer"
  });

  var heat11 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/Nov/MapServer"
  });

  var heat12 = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/dec/MapServer"
  });

  allHeatmapLayer = [heat1, heat2, heat3, heat4, heat5, heat6, heat7, heat8, heat9, heat10, heat11, heat12];


  // Create a WebTileLayer with a third-party cached service
  var mapBaseLayer = new WebTileLayer({
    urlTemplate: "http://{subDomain}.tile.stamen.com/toner/{level}/{col}/{row}.png",
    // opacity: 0.5,
    subDomains: ["a", "b", "c", "d"],
    copyright: "Map tiles by <a href=\"http://stamen.com/\">Stamen Design</a>, " +
      "under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. " +
      "Data by <a href=\"http://openstreetmap.org/\">OpenStreetMap</a>, " +
      "under <a href=\"http://www.openstreetmap.org/copyright\">ODbL</a>."
  });

  // Create a Basemap with the WebTileLayer. The thumbnailUrl will be used for
  // the image in the BasemapToggle widget.
  var stamen = new Basemap({
    baseLayers: [mapBaseLayer],
    title: "Toner",
    id: "toner"
      // thumbnailUrl: "http://stamen-tiles.a.ssl.fastly.net/toner/10/177/409.png"
  });
  // stamen toner map (default)
  var map = new Map({
    // basemap: "streets-night-vector"
    basemap: stamen,
    ground: "world-elevation"
  });

  // create the heat map webscene
  // heatScene = new WebScene({
  //   portalItem: {
  //     id: "3b7e5d429fa947a5852f6d6154100acb"
  //   }
  // });


  // hybrid map with elevation data
  var elevationMap = new Map({
    // basemap: "streets-night-vector"
    basemap: "hybrid",
    ground: "world-elevation"
  });
  // var homeBtn = new Home({
  //   // view: view
  // });
  // homeBtn.startup();

  // var popup = new Popup({
  //   dockEnabled: true,
  //   dockOptions: {
  //     // disable the dock button
  //     buttonEnabled: false,
  //     breakpoint: false,
  //     position: "bottom-left"
  //   }
  // })

  // var initialExtent = new Extent({
  //     xmin: -170.727550256284,
  //     ymin: -14.283370672194,
  //     xmax: -64.6773579147556,
  //     ymax: 68.6553881588014,
  //     spatialReference: new SpatialReference({wkid:4326})
  // });
  var cam = new Camera({
    position: {
      longitude: -91.4123504953868, // lon
      latitude: 37.3864581146388, // lat
      z: 11509407.399882693, // elevation in meters
    },
    heading: 346.9283363772766
  });

  // scene view
  view = new SceneView({
    id: "sceneView",
    container: "viewDiv",
    // ui: {
    //   components: ["zoom", "compass", "home"],
    //   padding: {
    //     top: 15,
    //     right: 15,
    //     bottom: 30,
    //     left: 15
    //   }
    // },
    padding: {
      top: 65,
      right: 0,
      bottom: 0,
      left: 0
    },
    map: map,
    camera: cam
      // popup: popup
  });


  view.popup.dockOptions = { buttonEnabled: false };

  // make the elevation invisible by default
  view.map.ground.layers.forEach(function(layer) {
    layer.visible = false;
  });

  var searchWidget = new Search({
    viewModel: {
      view: view,
      popupEnabled: false,
      maxSuggestions: 4
    },
  }, "searchNavDiv");

  view.ui.remove("compass");
  view.ui.remove("zoom");

  var newSource = searchWidget.sources.pop();
  newSource.resultGraphicEnabled = false;
  searchWidget.sources.push(newSource);
  searchWidget.startup();

  // Add the search widget to the top left corner of the view
  // view.ui.add(searchWidget, {
  //   position: "top-left",
  //   index: 0
  // });

  // Add the home widget to the top left corner of the view
  // view.ui.add(homeBtn, "top-left");

  // initialize graphics layer for attractions
  var attractionLyr = new GraphicsLayer({});

  var tweetLyr = new GraphicsLayer({});
  // Create objectSymbol and add to renderer
  // attractionSymbol = new PointSymbol3D({
  //   symbolLayers: [new ObjectSymbol3DLayer({
  //     width: 70000,
  //     height: 100000,
  //     resource: {
  //       primitive: "sphere"
  //     },
  //     material: {
  //       color: "orange"
  //     }
  //   })]
  // });

  // attractionSymbolRenderer = new SimpleRenderer({
  //   symbol: attractionSymbol
  // });



  // var view = new MapView({
  //   container: "viewDiv",   // Reference to the DOM node that will contain the view
  //   map: map,               // References the map object created in step 3
  //   extent: initialExtent,
  //   constraints: {
  //     minScale: 73957190.948944
  //   }
  // });

  // for word cloud
  var frequency_list = [];
  // frequency_list = frequency_list.sort(function(a, b){return b.size - a.size});
  // color for wordcloud
  var color = d3.scale.linear()
    .domain([1, 10, 20, 30, 40, 50, 60])
    .range(["#ccc", "#d5d5d5", "#ddd", "#e5e5e5", "#eee", "#f6f6f6", "#fff"]);
  // for word cloud, when a word is clicked
  var clickWord = function(item, dimension, event) {
    // console.log("test");
    // console.log(event);
    $(".chosen").removeClass("chosen");
    $(event.target).addClass("chosen");
    // console.log(recommendList);
    // console.log(recommendList[item[0]]);
    $("#np_list").children().hide();
    setTimeout(function() {
      recommendList[item[0]].forEach(function(npID) {
        $("li[data-result-id='" + npID + "']").show();
      });
    }, 500);

    // event.target.style["text-shadow"] = "text-shadow: 0 0 10px, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff;";
    // domConstruct.empty(listNode);
    // alert(item[0] + ": " + item[1]);
    // $("#np_list").children().each(function(){
    //   if ($(this).attr("data-result-id") == "0") {
    //     $(this).fadeOut(500);
    //   }
    // });
  };

  $(document).ready(function() {
    // $("#collapseInfo").addClass("collapsing");
    // change between toner and elevation basemap

    $("#settingsSelectBasemap").change(function() {
      // console.log("here");
      // console.log($(this).attr('id'))
      $("select option:selected").each(function() {
        if ($(this).attr('id') == "Toner") {
          view.map.basemap = stamen;
        }
        if ($(this).attr('id') == "Hybrid") {
          view.map.basemap = "hybrid";
        }


      })
    }).trigger("change");

    $("#tweetLyr").click(function() {
      if ($(this).prop("checked")) {
        // console.log(view.graphics);
        // tweetGraphics = view.graphics.clone();
        tweetLyr.visible = true;
        // view.graphics.visible = true;
        $("#tweetInfo").fadeIn();
      } else {
        tweetLyr.visible = false;
        // view.graphics.visible = false;
        $("#tweetInfo").fadeOut();
      }
    });

    $("#elevationLyr").click(function() {
      if ($(this).prop("checked")) {
        // show elevation
        view.map.ground.layers.forEach(function(layer) {
          layer.visible = true;
        });
        // $(".tweet-scroll").fadeIn();
      } else {
        view.map.ground.layers.forEach(function(layer) {
          layer.visible = false;
        });
      }
    });


    $("#heatmapLyr").click(function() {
      if ($(this).prop("checked")) {
        $("#heatMapSlider").fadeIn();
        $("#slider").slider({
          value: 0,
          min: 0,
          max: 11,
          step: 1,
          slide: function(event, ui) {
            $("#sliderTime").val(["January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ][ui.value]);
            allHeatmapLayer.forEach(function(lyr,i){
              if (i == ui.value) {
                lyr.visible = true;
              } else {
                lyr.visible = false;
              }
            });
          }
        });
        $("#sliderTime").val("January");
        // show heat map
        // heatLayer.visible = true;
        // $(".tweet-scroll").fadeIn();
        allHeatmapLayer[0].visible = true;
      } else {
        $("#heatMapSlider").fadeOut();
        allHeatmapLayer.forEach(function(lyr){
          lyr.visible = false;
        })
        // heatLayer.visible = false;
      }
    });

    // $("#sliderTime").change(function() {
    //   alert($(this).val());
    //   ["January",
    //     "February",
    //     "March",
    //     "April",
    //     "May",
    //     "June",
    //     "July",
    //     "August",
    //     "September",
    //     "October",
    //     "November",
    //     "December"
    //   ].forEach(function(d, i){
    //     if ($(this).val() == d) {
    //       allHeatmapLayer[i].visible = true;
    //     } else {
    //       allHeatmapLayer[i].visible = false;
    //     }
    //   })
    // })

    // $("#elevationInput").click(function(){
    //   if($(this).prop("checked")){
    //     view.map.basemap = "hybrid";
    //     view.map.ground.layers.forEach(function(layer) {
    //       layer.visible = true;
    //     });
    //   }
    //   else {
    //     view.map.basemap = stamen;
    //     view.map.ground.layers.forEach(function(layer) {
    //       layer.visible = false;
    //     });
    //   }
    // });

    // $("#changeMap").quickselect({
    //   activeButtonClass: 'btn-primary active',
    //   breakOutAll: true,
    //   buttonClass: 'btn btn-default',
    //   selectDefaultText: 'Other',
    //   wrapperClass: 'btn-group'

    // });

    $("#wordcloud").click(function(e) {
      if (e.target !== this)
        return;
      $(".chosen").removeClass("chosen");
      $("#np_list").children().hide();
      $("#np_list").children().show();

      setTimeout(function() {

      }, 6000);
    });
    $.getJSON("./static/data/recommend.json").then(function(data) {
      recommendList = data;
      // console.log(recommendList);
    });
    $.getJSON("./static/data/wordcloud.json").then(function(data) {
      for (var property in data) {
        var tempArray = [];
        if (data.hasOwnProperty(property)) {
          tempArray.push(property);
          tempArray.push(data[property]);
          frequency_list.push(tempArray);
        }
      }
      // console.log(frequency_list);
    });
    // console.log(frequency_list);

    $.fancybox.open(["#wordcloud"], {
      afterClose: function() { $(".panel-result").addClass("panel-result-ani"); },
      afterLoad: function() { $(".panel-result").removeClass("panel-result-ani"); }

    });

    // list all nps by default 
    $.getJSON("./static/data/np_bbox.geojson").then(function(data) { // load the np bbox geojson file
      npBBox = data.features;
      // console.log(npBBox);
      view.then(function() {
        var fragment = document.createDocumentFragment();
        npBBox.forEach(function(result, index) {
          var npName = result.properties.UNIT_NAME;
          // create the np list
          domConstruct.create("li", {
            className: "panel-result",
            tabIdex: 0,
            "data-result-id": index,
            textContent: npName,
            // style: "display: none;",
          }, fragment);
        });
        domConstruct.place(fragment, listNode, "only");

        // // check and change basemap
        // on(dom.byId("elevationInput"), "change", updateElevation);

        // function updateElevation(e) {
        //   // change base map and turn on/off elevation
        //   map.view = 
        // }
      }).then(function() {



        // set initial number
        setTimeout(function() {
          odometer.innerHTML = 0;
        }, 1000);
        // console.log(frequency_list);
        WordCloud(document.getElementById("wordcloud"), {
          gridSize: 12,
          // weightFactor: 1,
          weightFactor: function(size) {
            if (size < 10) {
              return size * 2.5
            } else {
              return size
            }
          },
          color: "random-light",
          rotateRatio: 0.3,
          list: frequency_list,
          // backgroundColor: "black",
          // set the min font size to make all words intelligible
          // minSize: 10,
          // hover: window.drawBox,
          color: function(word, weight) {
            return color(weight);
          },
          click: clickWord
        });
        // load np list after the 3d map is ready
        $(".navbar").delay(500).fadeIn(500);
        $("#panelInfo").delay(500).fadeIn(500);
        // $(".tweet-scroll").delay(500).fadeIn(500);
        $("#tweetInfo").delay(500).fadeIn(500);


        // $("#np_list").children().each(function(index){
        //   $(this).delay(190*index).fadeIn(150);
        // });
      }).then(function() {
        // start the socket connection
        socket = io.connect("http://" + document.domain + ":" + location.port + "/npTweet");
        // listen to the event 'connected'
        socket.on("connected", function(data) {
          console.log("listening connected...");
          socket.emit("startTweets1");
          socket.emit("startTweets2");
        });

        socket.on("streamTweets1", function(data) {
          var name = data.user_name;
          var text = data.stream_text;
          // var cntObj = data.count_dict;
          // var tw_count = data.TW_count;
          var np_name = data.NP_name;
          var sentiment = data.sentimen;
          var graphicColor, graphicHeight;
          var dataGeom = new Point({
            x: data.X_cor,
            y: data.Y_cor
          });
          // var npGeom = new Point({
          //   x: data.NP_X,
          //   y: data.NP_Y
          // });
          // var NPAttr = {
          //   Name: np_name,
          //   TweetCount: tw_count
          // };

          console.log("listen streamTweets1...");

          // console.log(data);
          // if (sentiment < 0) {
          //   var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#d53e4f'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          // } else if (sentiment > 0) {
          //   var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#66c2a5'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          // } else {
          //   var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#fee08b'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          // }
          // show live tweets in scroll bar

          // set color and height
          if (sentiment >= -1 && sentiment < -0.6) {
            graphicColor = [215, 48, 39, 0.8];
            graphicHeight = 4500000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#d73027'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment >= -0.6 && sentiment < -0.3) {
            graphicColor = [252, 141, 89, 0.8];
            graphicHeight = 3000000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#fc8d59'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment >= -0.3 && sentiment < 0) {
            graphicColor = [254, 224, 139, 0.8];
            graphicHeight = 1600000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#fee08b'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment == 0) {
            graphicColor = [255, 255, 191, 0.8];
            graphicHeight = 900000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#ffffbf'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment > 0 && sentiment <= 0.3) {
            graphicColor = [217, 239, 139, 0.8];
            graphicHeight = 1600000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#d9ef8b'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment > 0.3 && sentiment <= 0.6) {
            graphicColor = [145, 207, 96, 0.8];
            graphicHeight = 3000000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#91cf60'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment > 0.6 && sentiment <= 1) {
            graphicColor = [26, 152, 80, 0.8];
            graphicHeight = 4500000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#1a9850'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          }

          if (totalTweetCnt == 0) {
            // console.log("add 1")
            // console.log(tweetShow)
            $("#tweet_list").empty().append(tweetShow);
            totalTweetCnt += 1;

          } else {
            // console.log("add 1")
            // console.log(tweetShow)
            $("#tweet_list").prepend(tweetShow);
            totalTweetCnt += 1;

          }

          setTimeout(function() {
            odometer.innerHTML = totalTweetCnt;
          }, 1000);

          var dataAttr = {
            ObjectID: totalTweetCnt,
            NationalPark: np_name,
            Text: text,
            Sentiment: (sentiment + ""),
            Name: name
          };


          // var radius = tw_count;


          // draw extrusion
          var graphicSymbol = new PolygonSymbol3D({
            symbolLayers: [new ObjectSymbol3DLayer({
              resource: { primitive: "cylinder" },
              width: 15000,
              height: graphicHeight,
              depth: 15000,
              material: { color: graphicColor }
            })]
          });

          // var npGraphicSymbol = new PointSymbol3D({
          //   symbolLayers: [new IconSymbol3DLayer({
          //     size: (tw_count * 10 +5), // points
          //     resource: { primitive: "circle" },
          //     material: { color: "red" }
          //   })]
          // });

          tweetLyr.graphics.add({
            geometry: dataGeom,
            attributes: dataAttr,
            symbol: graphicSymbol,
            popupTemplate: new PopupTemplate({
              title: "{Name}",
              content: [{
                type: "fields",
                fieldInfos: [{
                  fieldName: "NationalPark",
                  visible: true,
                  label: "National Park"
                }, {
                  fieldName: "Text",
                  visible: true,
                  label: "Tweet"
                }, {
                  fieldName: "Sentiment",
                  visible: true,
                  label: "Sentiment"

                }]
              }],
              overwriteActions: true, // do not show "zoom to" button
            }),
            // popupTemplate: popUp
          });

          // tweetLyr.graphics.add({
          //   geometry: npGeom,
          //   attributes: NPAttr,
          //   symbol: npGraphicSymbol,
          //   popupTemplate: {
          //     overwriteActions: true, // do not show "zoom to" button
          //   },
          // });

          // view.graphics.add({
          //   geometry: dataGeom, 
          //   attributes:dataAttr, 
          //   symbol: graphicSymbol
          //   // popupTemplate: popUp
          // });
          // console.log(view.graphics);
          // console.log(tweetItem);
        });

        socket.on("streamTweets2", function(data) {
          var name = data.user_name;
          var text = data.stream_text;
          // var cntObj = data.count_dict;
          // var tw_count = data.TW_count;
          var np_name = data.NP_name;
          var sentiment = data.sentimen;
          var graphicColor, graphicHeight;
          var dataGeom = new Point({
            x: data.X_cor,
            y: data.Y_cor
          });
          // var npGeom = new Point({
          //   x: data.NP_X,
          //   y: data.NP_Y
          // });
          // var NPAttr = {
          //   Name: np_name,
          //   TweetCount: tw_count
          // };

          console.log("listen streamTweets2...");

          // console.log(data);
          // if (sentiment < 0) {
          //   var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#d53e4f'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          // } else if (sentiment > 0) {
          //   var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#66c2a5'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          // } else {
          //   var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#fee08b'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          // }
          // show live tweets in scroll bar

          // set color and height
          if (sentiment >= -1 && sentiment < -0.6) {
            graphicColor = [215, 48, 39, 0.8];
            graphicHeight = 4500000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#d73027'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment >= -0.6 && sentiment < -0.3) {
            graphicColor = [252, 141, 89, 0.8];
            graphicHeight = 3000000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#fc8d59'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment >= -0.3 && sentiment < 0) {
            graphicColor = [254, 224, 139, 0.8];
            graphicHeight = 1600000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#fee08b'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment == 0) {
            graphicColor = [255, 255, 191, 0.8];
            graphicHeight = 900000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#ffffbf'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment > 0 && sentiment <= 0.3) {
            graphicColor = [217, 239, 139, 0.8];
            graphicHeight = 1600000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#d9ef8b'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment > 0.3 && sentiment <= 0.6) {
            graphicColor = [145, 207, 96, 0.8];
            graphicHeight = 3000000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#91cf60'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          } else if (sentiment > 0.6 && sentiment <= 1) {
            graphicColor = [26, 152, 80, 0.8];
            graphicHeight = 4500000;
            var tweetShow = $("<li class='tweet-result tweet-result-ani' style='color:#1a9850'>" + name + " tweets: " + text + "</li>").hide().fadeIn();
          }

          if (totalTweetCnt == 0) {
            // console.log("add 1")
            // console.log(tweetShow)
            $("#tweet_list").empty().append(tweetShow);
            totalTweetCnt += 1;

          } else {
            // console.log("add 1")
            // console.log(tweetShow)
            $("#tweet_list").prepend(tweetShow);
            totalTweetCnt += 1;

          }

          setTimeout(function() {
            odometer.innerHTML = totalTweetCnt;
          }, 1000);

          var dataAttr = {
            ObjectID: totalTweetCnt,
            NationalPark: np_name,
            Text: text,
            Sentiment: (sentiment + ""),
            Name: name
          };


          // var radius = tw_count;


          // draw extrusion
          var graphicSymbol = new PolygonSymbol3D({
            symbolLayers: [new ObjectSymbol3DLayer({
              resource: { primitive: "cylinder" },
              width: 15000,
              height: graphicHeight,
              depth: 15000,
              material: { color: graphicColor }
            })]
          });

          // var npGraphicSymbol = new PointSymbol3D({
          //   symbolLayers: [new IconSymbol3DLayer({
          //     size: (tw_count * 10 + 5), // points
          //     resource: { primitive: "circle" },
          //     material: { color: "red" }
          //   })]
          // });

          tweetLyr.graphics.add({
            geometry: dataGeom,
            attributes: dataAttr,
            symbol: graphicSymbol,
            popupTemplate: new PopupTemplate({
              title: "{Name}",
              content: [{
                type: "fields",
                fieldInfos: [{
                  fieldName: "NationalPark",
                  visible: true,
                  label: "National Park"
                }, {
                  fieldName: "Text",
                  visible: true,
                  label: "Tweet"
                }, {
                  fieldName: "Sentiment",
                  visible: true,
                  label: "Sentiment"

                }]
              }],
              overwriteActions: true, // do not show "zoom to" button
            }),
          });

          // tweetLyr.graphics.add({
          //   geometry: npGeom,
          //   attributes: NPAttr,
          //   symbol: npGraphicSymbol,
          //   popupTemplate: {
          //     overwriteActions: true, // do not show "zoom to" button
          //   },
          // });

          // view.graphics.add({
          //   geometry: dataGeom, 
          //   attributes:dataAttr, 
          //   symbol: graphicSymbol
          //   // popupTemplate: popUp
          // });
          // console.log(view.graphics);
          // console.log(tweetItem);
        });
        // socket.on("streamTweets2", function(data){
        //   console.log("listen streamTweets1...");
        //   console.log(data.stream_result_2);
        // });

        // socket.on("senti_1", function(data){
        //   console.log("listen senti_1...");
        //   console.log(data.sentiment_1);
        // });

        // socket.on("senti_2", function(data){
        //   console.log("listen senti_2...");
        //   console.log(data.sentiment_2);
        // });


      });
      // hightlight selected np in the panel list
      $("#np_list li").click(function() {
        // console.log("there");
        $(".hightlight").removeClass("hightlight");
        $(this).addClass("hightlight");
      });

      $("#wordcloudBtn").on("click", function() {
        $.fancybox.open(
          ["#wordcloud"], {
            afterClose: function() { $(".panel-result").addClass("panel-result-ani"); },
            afterLoad: function() {
              $(".panel-result").removeClass("panel-result-ani");
              $(".hightlight").removeClass("hightlight");
            }
          }
        );

      });

      // homeBtn.on("click", function(e) {
      //   $.fancybox.open(
      //     ["#wordcloud"], {
      //       afterClose: function() { $(".panel-result").addClass("panel-result-ani"); },
      //       afterLoad: function() {
      //         $(".panel-result").removeClass("panel-result-ani");
      //         $(".hightlight").removeClass("hightlight");
      //       }
      //     }
      //   );
      // });
    });
    // view.on("click", function(){
    //   console.log(view.camera)
    // });

    // show attractions
    $.getJSON("./static/data/attraction.json").then(function(data) {
      var tempGeom, tempAttr, popUp, graphicSymbol;
      data.features.forEach(function(feature, i) {
        // if (feature.properties.Class == "National Park") {
        //   var npPoint = new Point({
        //     x: feature.geometry.coordinates[0],
        //     y: feature.geometry.coordinates[1]
        //   });
        //   npCoords.push({
        //     geo: npPoint,
        //     name: feature.properties["National Park"]
        //   });
        // }
        if (feature.properties.Class == "Attraction") {
          tempGeom = new Point({
            x: feature.geometry.coordinates[0],
            y: feature.geometry.coordinates[1]
          });
          tempAttr = {
            ObjectID: i,
            Description: feature.properties.Description,
            Name: feature.properties.Name,
            NationalPark: feature.properties["National Park"]
          };
          popUp = {
            overwriteActions: true, // do not show "zoom to" button
            title: "<div style='word-break: keep-all;'>{Name}</div>",
            content: [{
              type: "fields",
              fieldInfos: [{
                fieldName: "Description",
                visible: true,
                label: "Description"
              }, {
                fieldName: "NationalPark",
                visible: true,
                label: "National Park"
              }]
            }, {
              type: "media",
              mediaInfos: [{
                title: "<p style='text-align:center;font-weight:bold;'>Photo</p>",
                type: "image",
                value: { "sourceURL": feature.properties["Image Link"] }
              }]
            }]
          };

          graphicSymbol = new PointSymbol3D({
            symbolLayers: [new ObjectSymbol3DLayer({
              width: 1000,
              // height: 10000,
              resource: {
                primitive: "sphere"
              },
              material: {
                color: [70, 130, 180, 0.8],
              }
            })]
          });

          attractionData.push({
            geometry: tempGeom,
            attributes: tempAttr,
            symbol: graphicSymbol,
            popupTemplate: popUp
          });
        }
      });
      // sort the np by name alphabatically
      // npCoords = npCoords.sort(function(obj1, obj2) {

      //   var textA = a.name.toUpperCase();
      //   var textB = b.name.toUpperCase();
      //   return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      // });



      var trailSymbol = new LineSymbol3D({
        symbolLayers: [new LineSymbol3DLayer({
          size: 5,
          material: { color: "#ff7380" }
        })]
      });

      var trailGraphic = new Graphic({
        geometry: trailLine,
        symbol: trailSymbol
      });
      // console.log(attractionData);
      // view.graphics.addMany(attractionData);
      attractionLyr.graphics.addMany(attractionData);
      attractionLyr.graphics.add(trailGraphic);
      // attractionLyr.elevationInfo = {
      //   mode: "relative-to-ground",
      //   offset: 1000
      // };

      map.add(attractionLyr);
      // console.log(map);
    });

    map.add(tweetLyr);
    // map.add(heatLayer);
    map.addMany(allHeatmapLayer);
    // make heat layer invisible by default
    allHeatmapLayer.forEach(function(lyr) {
      lyr.visible = false;
    });
    // heatLayer.visible = false;




    // sceneViewDoc.onmousedown = function(e){
    //   $('.hightlight').removeClass('hightlight');
    // };
    // function MouseWheelHandler(e) {
    //   $('.hightlight').removeClass('hightlight');
    //   return false;
    // }
    // if (sceneViewDoc.addEventListener){
    //   // ie9, chrome, safari, opera
    //   sceneViewDoc.addEventListener("mousewheel", MouseWheelHandler, false);
    //   //firefox
    //   sceneViewDoc.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    // }
    // // ie 6/7/8
    // else {sceneViewDoc.attachEvent("onmousewheel", MouseWheelHandler)};

    // listen to click event on the np list
    on(listNode, on.selector("li", a11yclick), function(evt) {
      var target = evt.target;
      var resultId = domAttr.get(target, "data-result-id");
      if (resultId) {
        // go to the NP
        var npExtent = new Extent({
          xmin: npBBox[resultId].properties.MINX,
          ymin: npBBox[resultId].properties.MINY,
          xmax: npBBox[resultId].properties.MAXX,
          ymax: npBBox[resultId].properties.MAXY,
          spatialReference: new SpatialReference({ wkid: 4326 })
        });
        if (view.zoom > 4.1) {
          view.goTo({
            zoom: 4.1
          });
        }
        setTimeout(function() {
          view.goTo({
            target: npExtent,
          });
        }, 800);

      };

    });

  });
});
