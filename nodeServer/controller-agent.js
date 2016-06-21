var app = require('express')();
var http = require('http').Server(app);
var WebSocket = require('ws');

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

// ----------------------------- Controller-API -----------------------

function Position(xPos, yPos, zPos) {

    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos = zPos;

    this.tpe = "de.hawhamburg.csti.gesture.Position";
}

function Rotation(frontRotation, sideRotation) {

    this.frontRotation = frontRotation;
    this.sideRotation = sideRotation;

    this.tpe = "de.hawhamburg.csti.gesture.Rotation";
}

function Thumb() {

    this.tpe = "de.hawhamburg.csti.gesture.Thumb";
}

function Index() {

    this.tpe = "de.hawhamburg.csti.gesture.Index";
}

function Middle() {

    this.tpe = "de.hawhamburg.csti.gesture.Middle";
}

function Ring() {

    this.tpe = "de.hawhamburg.csti.gesture.Ring";
}

function Pinky() {

    this.tpe = "de.hawhamburg.csti.gesture.Pinky";
}


var PositionDeserializer = new function() {
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

        if(json.tpe === "de.hawhamburg.csti.gesture.Position")
            return this.deserializePosition(json);

    };

    this.deserializePosition = function (data) {
        return Object.create(Position.prototype, transform(data, this));
    };

};

var RotationDeserializer = new function() {
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

        if(json.tpe === "de.hawhamburg.csti.gesture.Rotation")
            return this.deserializeRotation(json);

    };

    this.deserializeRotation = function (data) {
        return Object.create(Rotation.prototype, transform(data, this));
    };

};


// ----------------------------- Controller-API -----------------------

function One() {

    this.tpe = "de.hawhamburg.csti.controller.One";
}

function Two() {

    this.tpe = "de.hawhamburg.csti.controller.Two";
}

function Three() {

    this.tpe = "de.hawhamburg.csti.controller.Three";
}

function Four() {

    this.tpe = "de.hawhamburg.csti.controller.Four";
}

function Five() {

    this.tpe = "de.hawhamburg.csti.controller.Five";
}

function Up() {

    this.tpe = "de.hawhamburg.csti.controller.Up";
}

function Down() {

    this.tpe = "de.hawhamburg.csti.controller.Down";
}

function Left() {

    this.tpe = "de.hawhamburg.csti.controller.Left";
}

function Right() {

    this.tpe = "de.hawhamburg.csti.controller.Right";
}

function Back() {

    this.tpe = "de.hawhamburg.csti.controller.Back";
}

function Front() {

    this.tpe = "de.hawhamburg.csti.controller.Front";
}

function LeftRotation() {

    this.tpe = "de.hawhamburg.csti.controller.LeftRotation";
}

function RightRotation() {

    this.tpe = "de.hawhamburg.csti.controller.RightRotation";
}

function BackRotation() {

    this.tpe = "de.hawhamburg.csti.controller.BackRotation";
}

function FrontRotation() {

    this.tpe = "de.hawhamburg.csti.controller.FrontRotation";
}


//--------------------------- Agent ------------------------------


// Connector zur Middleware starten
var connector = new MiddlewareConnector("ws://127.0.0.1:8080/connect");
var pubConnector = new MiddlewareConnector("ws://127.0.0.1:8080/connect");

//var connector = new MiddlewareConnector("ws://141.22.95.26:8080/connect");
//var pubConnector = new MiddlewareConnector("ws://141.22.95.26:8080/connect");
//var pubConnector = new MiddlewareConnector("ws://141.22.95.91:8080/connect");
//var connector = new MiddlewareConnector("ws://141.22.10.22:8080/connect");
//var pubConnector = new MiddlewareConnector("ws://141.22.10.22:8080/connect");

// Daten aus Middleware holen
connector.subscribe("Position", PositionDeserializer, function(obj){
	
	if(obj instanceof Position){
		if(obj.xPos > 0.5){
			console.log("Moving Right!");
			pubConnector.publish("Right", new Right());
		}
		if(obj.xPos < -0.5){
			console.log("Moving Left!");
			pubConnector.publish("Left", new Left());
		}
		
		if(obj.yPos > 0.5){
			console.log("Moving Up!");
			pubConnector.publish("Up", new Up());
		}
		if(obj.yPos < -0.5){
			console.log("Moving Down!");
			pubConnector.publish("Down", new Down());
		}
		
		if(obj.zPos > 0.5){
			console.log("Moving Front!");
			pubConnector.publish("Front", new Front());
		}
		if(obj.zPos < -0.5){
			console.log("Moving Back!");
			pubConnector.publish("Back", new Back());
		}
	}
	
});

connector.subscribe("Rotation", RotationDeserializer, function(obj){
	
	if(obj instanceof Rotation){
		if(obj.frontRotation > 0.5){
			console.log("Leaning Front!");
			pubConnector.publish("FrontRotation", new FrontRotation());
		}
		if(obj.frontRotation < -0.5){
			console.log("Leaning Back!");
			pubConnector.publish("BackRotation", new BackRotation());
		}
		
		if(obj.sideRotation > 0.6){
			console.log("Leaning Right!");
			pubConnector.publish("RightRotation", new RightRotation());
		}
		if(obj.sideRotation < -0.6){
			console.log("Leaning Left!");
			pubConnector.publish("LeftRotation", new LeftRotation());
		}
		
	}
	
});

connector.subscribe("Thumb", RotationDeserializer, function(obj){
	pubConnector.publish("One", new One());
	console.log("- Thumb-Tap");
});

connector.subscribe("Index", RotationDeserializer, function(obj){
	pubConnector.publish("Two", new Two());
	console.log("- Index-Tap");
});

connector.subscribe("Middle", RotationDeserializer, function(obj){
	pubConnector.publish("Three", new Three());
	console.log("- Middle-Tap");
});

connector.subscribe("Ring", RotationDeserializer, function(obj){
	pubConnector.publish("Four", new Four());
	console.log("- Ring-Tap");
});

connector.subscribe("Pinky", RotationDeserializer, function(obj){
	pubConnector.publish("Five", new Five());
	console.log("- Pinky-Tap");
});