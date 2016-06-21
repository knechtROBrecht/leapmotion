var app = require('express')();
var http = require('http').Server(app);
var WebSocket = require('ws');

//----------------------------- JSON File ---------------------------

// Zum schreiben von JSONs in deine Datei
// TODO npm install --save jsonfile
// TODO genaue Funktion testen, wie wird file gelöscht?
var jsonfile = require('jsonfile');

//----------------------------- API / Middleware ---------------------

// var connec = require('./lib/connector.min');

// TODO Middleware und API auslagern

// ----------------------------- Middleware --------------------------

function Subscribe(b){this.group=b;this.tpe="de.hawhamburg.csti.messaging.Subscribe"}function SubscribeAck(b){this.group=b;this.tpe="de.hawhamburg.csti.messaging.SubscribeAck"}function Unsubscribe(b){this.group=b;this.tpe="de.hawhamburg.csti.messaging.Unsubscribe"}function UnsubscribeAck(b){this.group=b;this.tpe="de.hawhamburg.csti.messaging.UnsubscribeAck"}function Publish(b,a){this.group=b;this.msg=a;this.tpe="de.hawhamburg.csti.messaging.Publish"}
var TunnelDeserializer=new function(){var b=function(a,b){var e={};Object.keys(a).forEach(function(d){var c=a[d];Array.isArray(c)?c=a[d].map(function(a){console.log(a);return"object"===typeof a?b.deserialize(a):a}):"object"===typeof c&&(c=b.deserialize(c));e[d]={writable:!1,configurable:!1,value:c}});return e};this.deserialize=function(a){if("de.hawhamburg.csti.messaging.Subscribe"===a.tpe)return this.deserializeSubscribe(a);if("de.hawhamburg.csti.messaging.SubscribeAck"===a.tpe)return this.deserializeSubscribeAck(a);
if("de.hawhamburg.csti.messaging.Unsubscribe"===a.tpe)return this.deserializeUnsubscribe(a);if("de.hawhamburg.csti.messaging.UnsubscribeAck"===a.tpe)return this.deserializeUnsubscribeAck(a);if("de.hawhamburg.csti.messaging.Publish"===a.tpe)return this.deserializePublish(a)};this.deserializeSubscribe=function(a){return Object.create(Subscribe.prototype,b(a,this))};this.deserializeSubscribeAck=function(a){return Object.create(SubscribeAck.prototype,b(a,this))};this.deserializeUnsubscribe=function(a){return Object.create(Unsubscribe.prototype,
b(a,this))};this.deserializeUnsubscribeAck=function(a){return Object.create(UnsubscribeAck.prototype,b(a,this))};this.deserializePublish=function(a){return Object.create(Publish.prototype,b(a,this))}};
function MiddlewareConnector(b){var a=!1,g=[],e=[],d=this;this.publish=function(b,f){if(a){var h=new Publish(b,JSON.stringify(f));c.send(JSON.stringify(h))}};this.subscribe=function(b,f,h){f={group:b,deser:f,callback:h};a?(e.push(f),b=new Subscribe(b),c.send(JSON.stringify(b))):g.push(f)};var c=new WebSocket(b);c.onmessage=function(a){a=JSON.parse(a.data);for(var b=0;b<e.length;b++){var c=e[b];if(c.group===a.group){var d=JSON.parse(a.msg);c.callback(c.deser.deserialize(d))}}};c.onopen=function(){a=
!0;for(var b=0;b<g.length;b++){var c=g[b];d.subscribe(c.group,c.deser,c.callback)}};c.onclose=function(){a&&console.error("connection lost");a=!1}};

// ----------------------------- LeapMotion-API -----------------------




function LeapMotion(s) {

    this.s = s;

    this.tpe = "de.hawhamburg.csti.leapmotion.LeapMotion";
}

// TODO Kann glaube ich weg! nirgends wir GetLeapMo.. verwendet!
function GetLeapMotion(s) {

    this.s = s;

    this.tpe = "de.hawhamburg.csti.leapmotion.GetLeapMotion";
}


var LeapMotionDeserializer = new function() {
	var transform = function(data, deser) {
    	var re = {};
    	Object.keys(data).forEach(function(k) {
    	    var value = data[k];

			if (Array.isArray(value)) {
            	value = data[k].map(function(val) {
                	console.log(val);
                	if(typeof val === 'object')
                    	return deser.deserialize(val);
                	else return val;
            	});
        	} else if(typeof value === 'object') {
    	        value = deser.deserialize(value);
   		    }
        	re[k] = {
            	writable: false,
            	configurable: false,
            	value: value
        	};
    	});
    	return re;
	}

    this.deserialize = function(json) {

        // TODO Kann glaube ich weg! nirgends wir GetLeapMo.. verwendet!
        if(json.tpe === "de.hawhamburg.csti.leapmotion.GetLeapMotion")
            return this.deserializeGetLeapMotion(json);

        if(json.tpe === "de.hawhamburg.csti.leapmotion.LeapMotion")
            return this.deserializeLeapMotion(json);

    };

    // TODO Kann glaube ich weg! nirgends wir GetLeapMo.. verwendet!
    this.deserializeGetLeapMotion = function (data) {
        return Object.create(GetLeapMotion.prototype, transform(data, this));
    };

    this.deserializeLeapMotion = function (data) {
        return Object.create(LeapMotion.prototype, transform(data, this));
    };

};


//--------------------------- Agent ------------------------------


// Connector zur Middleware starten
var connector = new MiddlewareConnector("ws://127.0.0.1:8080/connect");
//var connector = new MiddlewareConnector("ws://141.22.95.26:8080/connect");
//var connector = new MiddlewareConnector("ws://141.22.10.22:8080/connect");

// TODO Kann das weg??
// Agent soll auf diesem Port laufen
http.listen(3000, function(){
    console.log('listening on *:3000');
});

var leapmotion_connected = false; // gibt es einen Socket zur Leapmotion
var defaultIsOver = true; // Sperrt Ausgaben der Leapmotion, solange Defaultdaten abgespielt werden
var lastData = null; // zuletzt gelesenes Lm-Objekt
var defaultData = null; // default Datensatz aus Datei
var file = 'leapmotiondata.json'; // Datei fuer Default Daten
var print;

// Lade Default-Daten fuer den Fall das keine Leapmotion angeschlossen ist aus Datei
jsonfile.readFile(file, function(err, obj) {
    if (err){
        console.log(err);
    } else {
    defaultData = obj;
    console.log("Default Daten wurden geladen aus File: " + file);
    // publishDefaultData();
    lastData = defaultData.data[5];
    connectToWebSocket();
    // console.log(defaultData.data[4]);
}});


// Publishe ca 100 JSON pro Sekunde in die Middleware, wenn keine Leapmotion angeschlossen ist
function publishDefaultData(){
        /*if(defaultData !== null){
            defaultIsOver = false;

            var i = 0;

            var print = setInterval(function(){
              if (i<defaultData.data.length) {
                console.log("Default Daten : "+i);
                var str = defaultData.data[i];
                connector.publish("LeapMotion", new LeapMotion (str));
                i++;
              } else {
                i = 0;
                defaultIsOver = true;
                clearInterval(print);
                connectToWebSocket();
              }
            },10);
        }*/
}

// Connection zur Leao Motion via WebSocket
function connectToWebSocket() {

    var ws = new WebSocket("ws://127.0.0.1:6437/v6.json");
    var gotStream = false;
    var noHandsCounter = 0;

    ws.onopen = function(event) {
        ws.send(JSON.stringify({optimizeHMD: true}));   // This doesn't work
        ws.send(JSON.stringify({background: true})); // But this works
        var wait = setTimeout(function(){
          console.log("gotStream is: "+gotStream);
          if (!gotStream) {
            publishDefaultData();
          }
        }, 100);
        leapmotion_connected = true;
        console.log("open");
    };

    // Wenn ein Event ueber den WebSocket empfangen wird
    ws.onmessage = function(event) {
      if (event.data != null && defaultIsOver) {
        var obj = JSON.parse(event.data);
        if (obj.hands != null) {
          gotStream = true;
          if (obj.hands.length > 0) {
              noHandsCounter = 0;
              // LeapMotion-String in der Middleware veröffentlichen
              console.log("aktuelleDaten :");
              var str = JSON.stringify(obj, undefined, 2);
              connector.publish("LeapMotion", new LeapMotion (str));
              lastData = str;
          } else {
              noHandsCounter++;
              // Wenn keine Hand erkannt wird, publishe den letzten Datensatz mit erkannter Hand
              console.log("Ersatzdaten : " + noHandsCounter);
              //connector.publish("LeapMotion", new LeapMotion (lastData));
          }
        }else {
          gotStream = false;
        }
      }
      if (noHandsCounter > 500) {
        noHandsCounter = 0;
        publishDefaultData();
      }

    };

    ws.onclose = function(event) {
        ws = null;
        leapmotion_connected = false;
        console.log("close");
        gotStream = false;
        publishDefaultData();
    };

    ws.onerror = function(event) {
        leapmotion_connected = false;
        console.log("error");
        gotStream = false;
        publishDefaultData();
    };
}

// // Daten aus Middleware holen
// connector.subscribe("LeapMotion", LeapMotionDeserializer, function(obj) {
// 	if(obj instanceof LeapMotion){
//     console.log("Middleware : " + JSON.stringify(obj.s));
//   }
// });
