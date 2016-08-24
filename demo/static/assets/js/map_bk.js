var socket;
require([
  "esri/config",
  "esri/geometry/SpatialReference",
  "esri/Map",
  "esri/geometry/Point",
  // "esri/WebMap",
  "esri/views/MapView",
  "esri/views/SceneView",
  "esri/Basemap",
  "esri/layers/WebTileLayer",
  "esri/layers/TileLayer",
  "esri/symbols/ObjectSymbol3DLayer",
  // "esri/widgets/Popup",
  "esri/symbols/PolygonSymbol3D",
  "esri/symbols/PointSymbol3D",
  "esri/symbols/LineSymbol3D",
  "esri/geometry/Polyline",
  "esri/symbols/LineSymbol3DLayer",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  // "esri/renderers/SimpleRenderer",
  // "esri/layers/FeatureLayer",
  "esri/WebScene",
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
  "bootstrap/Carousel",
  "bootstrap/Tooltip",
  // "bootstrap/Modal",
  "dojo/domReady!"
], function(esriConfig, SpatialReference, Map, Point, MapView, SceneView, Basemap, WebTileLayer, TileLayer, ObjectSymbol3DLayer, PolygonSymbol3D,
  PointSymbol3D, LineSymbol3D, Polyline, LineSymbol3DLayer, Graphic, GraphicsLayer, WebScene, Camera, Search, domConstruct, dom, on, a11yclick, domAttr, Extent) {

  var npBBox;
  var listNode = dom.byId("np_list");
  var recommendList;
  var attractionData = [];
  var view;
  var totalTweetCnt = 0;
  var tweetGraphics;
  var heatScene;

  // trails

  var trailLine = new Polyline({
    paths: [
      [-110.1393127, 44.8879854],
      [-110.173645, 44.869496],
      [-110.2230835, 44.8909043],
      [-110.2615356, 44.9113317],
      [-110.315094, 44.9191117],
      [-110.357666, 44.908414],
      [-110.3947449, 44.9045234],
      [-110.3837585, 44.8772819],
      [-110.3947449, 44.8665763],
      [-110.4153442, 44.8510011],
      [-110.4386902, 44.8363955],
      [-110.4483032, 44.8120445],
      [-110.4496765, 44.7945055],
      [-110.4592896, 44.7759862],
      [-110.4922485, 44.7467332],
      [-110.4840088, 44.7184413],
      [-110.5018616, 44.7038021],
      [-110.4826355, 44.6764656],
      [-110.4537964, 44.6383684],
      [-110.4125977, 44.6139339],
      [-110.3865051, 44.605135],
      [-110.3823853, 44.5748174],
      [-110.4139709, 44.5464414],
      [-110.4345703, 44.5258847],
      [-110.4180908, 44.5141347],
      [-110.4290771, 44.4857292],
      [-110.4798889, 44.4631908],
      [-110.5059814, 44.4553493],
      [-110.5403137, 44.4788706],
      [-110.5622864, 44.4494675],
      [-110.574646, 44.4435851],
      [-110.6433105, 44.4347605],
      [-110.6666565, 44.432799],
      [-110.6886292, 44.4484872],
      [-110.7202148, 44.4396632],
      [-110.76828, 44.4318186],
      [-110.8039856, 44.4484872],
      [-110.8259583, 44.4553493],
      [-110.8575439, 44.4769109],
      [-110.8259583, 44.5219683],
      [-110.8177185, 44.5679693],
      [-110.8424377, 44.6090458],
      [-110.8602905, 44.6442312],
      [-110.801239, 44.6520472],
      [-110.7710266, 44.6530242],
      [-110.7463074, 44.6745126],
      [-110.7394409, 44.7116101],
      [-110.7009888, 44.7203929],
      [-110.7202148, 44.7545355]
    ]
  });

  // var tweetList = [];  // list of tweets to show live on the map
  // var sceneViewDoc = document.getElementById("viewDiv");

  esriConfig.request.corsEnabledServers.push("a.tile.stamen.com",
    "b.tile.stamen.com", "c.tile.stamen.com", "d.tile.stamen.com");

  // tile for heat map
  var heatLayer = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/6k7tkD4gkI9PbMup/arcgis/rest/services/Extract_Idw_2a/MapServer"
  });

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
  heatScene = new WebScene({
    portalItem: {
      id: "3b7e5d429fa947a5852f6d6154100acb"
    }
  });


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

    $("#tweetsInput").click(function() {
      if ($(this).prop("checked")) {
        // console.log(view.graphics);
        // tweetGraphics = view.graphics.clone();
        tweetLyr.visible = true;
        // view.graphics.visible = true;
        $(".tweet-scroll").fadeIn();
      } else {
        tweetLyr.visible = false;
        // view.graphics.visible = false;
        $(".tweet-scroll").fadeOut();
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
        // show heat map
        heatLayer.visible = true;
        // $(".tweet-scroll").fadeIn();
      } else {
        heatLayer.visible = false;
      }
    });

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
          var cntObj = data.count_dict;
          var sentiment = data.sentimen;
          var graphicColor, graphicHeight;
          var dataGeom = new Point({
            x: data.X_cor,
            y: data.Y_cor
          });
          var dataAttr = {
            ObjectID: totalTweetCnt,
            Name: name,
            Text: text,
            Sentiment: sentiment
          };

          console.log("listen streamTweets1...");

          console.log(data);
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
            console.log("add 1")
            console.log(tweetShow)
            $("#tweet_list").empty().append(tweetShow);
            totalTweetCnt += 1;

          } else {
            console.log("add 1")
            console.log(tweetShow)
            $("#tweet_list").prepend(tweetShow);
            totalTweetCnt += 1;

          }

          setTimeout(function() {
            odometer.innerHTML = totalTweetCnt;
          }, 1000);


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

          tweetLyr.graphics.add({
            geometry: dataGeom,
            attributes: dataAttr,
            symbol: graphicSymbol
              // popupTemplate: popUp
          })

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
          var cntObj = data.count_dict;
          var sentiment = data.sentimen;
          var graphicColor, graphicHeight;
          var dataGeom = new Point({
            x: data.X_cor,
            y: data.Y_cor
          });
          var dataAttr = {
            ObjectID: totalTweetCnt,
            Name: name,
            Text: text,
            Sentiment: sentiment
          };

          console.log("listen streamTweets2...");
          console.log(data);
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
            console.log("add 2");
            console.log(tweetShow)
            $("#tweet_list").empty().append(tweetShow);
            totalTweetCnt += 1;


          } else {
            console.log("add 2");
            console.log(tweetShow)
            $("#tweet_list").prepend(tweetShow);
            totalTweetCnt += 1;

          }

          setTimeout(function() {
            odometer.innerHTML = totalTweetCnt;
          }, 1000);



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

          tweetLyr.graphics.add({
            geometry: dataGeom,
            attributes: dataAttr,
            symbol: graphicSymbol
              // popupTemplate: popUp
          })

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
      })

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

      var trailSymbol = new LineSymbol3D({
        symbolLayers: [new LineSymbol3DLayer({
          size: 1,
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
      // attractionLyr.graphics.add(trailGraphic);
      // attractionLyr.elevationInfo = {
      //   mode: "relative-to-ground",
      //   offset: 1000
      // };

      map.add(attractionLyr);
      // console.log(map);
    });

    map.add(tweetLyr);
    map.add(heatLayer);
    // make heat layer invisible by default
    heatLayer.visible = false;

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
