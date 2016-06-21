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

// ----------------------------- LeapMotion-API -----------------------




function LeapMotion(s) {

    this.s = s;

    this.tpe = "de.hawhamburg.csti.leapmotion.LeapMotion";
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

        if(json.tpe === "de.hawhamburg.csti.leapmotion.LeapMotion")
            return this.deserializeLeapMotion(json);

    };

    this.deserializeLeapMotion = function (data) {
        return Object.create(LeapMotion.prototype, transform(data, this));
    };

};

// ----------------------------- Gesture-API -----------------------




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


//--------------------------- Agent ------------------------------


// Connector zur Middleware starten
var connector = new MiddlewareConnector("ws://127.0.0.1:8080/connect");
//var connector = new MiddlewareConnector("ws://141.22.95.26:8080/connect");
//var connector = new MiddlewareConnector("ws://141.22.10.22:8080/connect");

	var armMeshes = [];
	var boneMeshes = [];
	var palmPositions = [];
	var handCount = 0;
	var handIndicies = [];
	var handCounter = 0;
	var remPos = [];
	var PRECISION = 30;
	var set = false;
	var allBones = [];
	var centerPosition;
	var windowObjectReference = window.open();

// Daten aus Middleware holen
connector.subscribe("LeapMotion", LeapMotionDeserializer, function(obj) {
	if(obj instanceof LeapMotion){
    // console.log("Bekomme Daten aus Middleware");
    var frame = JSON.parse(obj.s);

    // console.log(JSON.stringify(frame));

    leapAnimate(frame);

    function checkIfOldHand( frame ) {

  		// console.log("check if old hand");

  		var hand = frame.hands[frame.hands.length - 1];

  		//hand.fingers[2].bones.type[1].basis[0];


  		/*
  		for ( var hand of frame.hands ) {

  			for ( var finger of hand.fingers ) {

  				if ( finger.type === 2 ) {
  					for ( var bone of finger.bones ) {
  						allBones[allBones.length] = bone;
  					}
  				}
  			}

  		}

  		var i = 1;
  		var hash = 0;
  		for ( var bone of allBones ) {

  				hash += bone.length.toFixed(2);
  				i++;

  		}

  		allBones = [];

  		console.log("Hash: ", hash);
  		*/

  		/*
  		for ( i = 0; i < remPos.length; i++ ){

  			if ( compareHands( frame.hands[frame.hands.length - 1] , remPos[i] ) ) {

  				console.log("HAND WIEDERERKANNT!");

  				handIndicies[handIndicies.length] = getOldIndex(remPos[i]);

  				//delete remPos[i];

  			}

  		}
  		*/


  		handIndicies[handIndicies.length] = ++handCounter;
	}

	function getOldIndex( pos ) {



	}

	function updatePalmPosition( frame ) {
		var i = 0;
		palmPositions = [];
		for ( var hand of frame.hands ) {
			palmPositions[i++] = hand.palmPosition;
		}
	}


	/*
		Helpfunction to compare to Hands
	*/
	function compareHands ( hand , palmPosition ) {

		//TODO CHeck if righthand or lefthand

		if ( hand.palmPosition[0] < palmPosition[0]+PRECISION &&  hand.palmPosition[0] > palmPosition[0]-PRECISION ){

			if ( hand.palmPosition[1] < palmPosition[1]+PRECISION &&  hand.palmPosition[1] > palmPosition[1]-PRECISION ){

				if ( hand.palmPosition[2] < palmPosition[2]+PRECISION &&  hand.palmPosition[2] > palmPosition[2]-PRECISION ){

					return true;

				}

			}

		}
		return false;

	}

	/*
		Helpfunction to remember the position of a hand if the hand disappears from the field of view
	*/
	function rememberOldPosition( frame ) {

		if ( frame.hands.length === 0 ){

			remPos[remPos.length] = palmPositions[0];

		}else {

			if ( compareHands( frame.hands[0], palmPositions[0] ) ) {

				remPos[remPos.length] = palmPositions[1];

			}else{

				remPos[remPos.length] = palmPositions[0];

			}

		}

	}

	/*
		Function to check if to Bones are touching or really close to each other
	*/
	function isTouching( thumbBone , indexBone ) {
		var indexVector = indexBone.center();
		var thumbVector = thumbBone.center();
		//console.log("indexvector: " + indexVector);
		//console.log("thumbvector: " + thumbVector);

		var xd = thumbVector[0]-indexVector[0];
		var yd = thumbVector[1]-indexVector[1];
		var zd = thumbVector[2]-indexVector[2];
		var distance = Math.sqrt(xd*xd + yd*yd + zd*zd);

		//console.log("Distance: " + distance)

		if (distance < 10) { return true; }
		return false;
	}

	function leapAnimate( frame ) {

		var countBones = 0;
		var countArms = 0;

		var gestureArr = [];
		var thumb = null;
		var thumbBone = null;
		var index = null;
		var indexBone = null;

    if (frame.hands != null) {
      for ( var hand of frame.hands ) {

  			//TODO press button to set new center point
  			/*var unicode = e.keyCode? e.keyCode : e.charCode;
  			console.log("unicode of pressed key: " + unicode);
  			if( buttonPressed ){
  				centerPosition = hand.palmPosition;
  			}

  			var diff = [];
  			if(!!centerPosition){
  				diff[0] = actPosition[0] - centerPosition[0];
  				diff[1] = actPosition[1] - centerPosition[1];
  				diff[2] = actPosition[2] - centerPosition[2];
  			}

  			*/

  			var actPosition = hand.palmPosition;
  			//console.log(actPosition);

  			var xPos = Math.round( (actPosition[0] / 100) * 10 ) / 10;
  			if(xPos > 1) xPos = 1.0;
  			if(xPos < -1) xPos = -1.0;

  			var yPos = Math.round( ((actPosition[1]-200) / 100) * 10 ) / 10;
  			if(yPos > 1) yPos = 1.0;
  			if(yPos < -1) yPos = -1.0;

  			var zPos = (Math.round( ((actPosition[2]) / 100) * 10 ) / 10) * -1;
  			if(zPos > 1) zPos = 1.0;
  			if(zPos < -1) zPos = -1.0;

        // TODO implement rotationAxis!! -------------------------------
  			// var axis = hand.rotationAxis(frame);

  			//console.log("Axis of Rotation: (" + axis[0] + ", " + axis[1] + ", " + axis[2] + ")");

  			var frontRotation = 0;//Math.round( axis[0] * 10 ) / 10;
  			var sideRotation = 0;//Math.round( axis[2] * 10 ) / 10;

        // -------------------------------------------------------------
  		}

      var frontRotation = getRotation(frame.hands[0].palmPosition[1], frame.pointables[2].tipPosition[1]);
      var sideRotation = getRotation(frame.pointables[0].tipPosition[1], frame.pointables[4].tipPosition[1]);
      //console.log("Front: "+frontRotation+" - Side: "+ sideRotation);

      function getRotation(ay, by){
        var y = Math.round((ay-by)/10)/10;
        if (y > 1.0) y = 1.0;
        if (y < -1.0) y = -1.0;
        return y;
      }

      // TODO Wurde aus (for hand in frame.hands) ausgegelagert, da (siehe nächste Zeile)
      // TODO Es gibt kein Hands.fingers nur pointables die via HandID zur Hand assoziiert werden können
  			for ( var finger of frame.pointables ) {
          // TODO Es gibt keine bones... finger.bases hält ein Array mit mit bones-daten

  					for ( var bone of finger.bases ) {

  						/* das war zum testen ob wir finger bzw hände unterscheiden können
  						if( finger.type === 2 ) {
  							console.log("Middlefinger: ", bone.type);
  							console.log("Length: ", bone.length);
  							console.log("Width: ", bone.width);
  							set = true;
  						}*/


  						//GET all the data we need

  						if ( finger.type === 0 && bone.type === 0 ) {
  							thumbBone = bone;
  							thumb = finger;
  						}else if ( finger.type === 4 && bone.type === 0 ) {
  							indexBone = bone;
  							index = finger;
  						}


  						if ( countBones++ === 0 ) { continue; }

  					}

  			}

  		if(frame.valid && frame.pointables.length > 0){
  			frame.gestures.forEach(function(gesture){
  				var pointableIds = gesture.pointableIds;
  				pointableIds.forEach(function(pointableId){
  				  var pointable = frame.pointable(pointableId);
  				  if(gesture.type === "keyTap"){
  					gestureArr[gestureArr.length] = pointable.type;
            // TODO
  				  }
  				});
  			});
  		}

  		//CHECK IF THUMB IS TOUCHING FOR GESTURE
  		if ( !!thumbBone && !!indexBone ) {
  			if( isTouching( thumbBone , indexBone ) ) {
  				console.log("IT TOUCHED!!!");
  			}
  		}


  		/* Handwiedererkennung */
  		/*
  		var newHandCount = frame.hands.length;

  		if( newHandCount > handCount ){
  			handCount = newHandCount;
  			checkIfOldHand( frame );
  			updatePalmPosition( frame );
  			console.log(palmPositions);
  		}else if( newHandCount < handCount ){
  			handCount = newHandCount;
  			rememberOldPosition( frame );
  			updatePalmPosition( frame );

  			console.log("palmPositions: ", palmPositions);
  			console.log("remPos: ", remPos)
  		}
  		*/


      connector.publish("Position", new Position (xPos, yPos, zPos));
      connector.publish("Rotation", new Rotation (frontRotation, sideRotation));
    }

    if (frame.gestures != null && frame.pointables.length > 4) {
      for (var gesture of frame.gestures){
        if (gesture.type === "keyTap") {
          console.log("Keytap with:");
          switch (gesture.pointableIds+"") {
            case frame.pointables[0].id+"":
              connector.publish("Thumb", new Thumb());
              console.log("- Thumb");
              break;
            case frame.pointables[1].id+"":
              connector.publish("Index", new Index());
              console.log("- Index");
              break;
            case frame.pointables[2].id+"":
              connector.publish("Middle", new Middle());
              console.log("- Middle");
              break;
            case frame.pointables[3].id+"":
              connector.publish("Ring", new Ring());
              console.log("- Ring");
              break;
            case frame.pointables[4].id+"":
              connector.publish("Pinky", new Pinky());
              console.log("- Pinky");
              break;
            default:
              console.log("!! failure  !!");
              break;

          }
        }
      }
    }



	}



  }
});

// Position-Daten aus Middleware holen
connector.subscribe("Position", PositionDeserializer, function(obj) {
	if(obj instanceof Position){
    // console.log("Position Middleware : " + obj.xPos +" "+ obj.yPos +" "+ obj.zPos);
  }
});

// Rotation-Daten aus Middleware holen
connector.subscribe("Rotation", RotationDeserializer, function(obj) {
	if(obj instanceof Rotation){
    // console.log("Rotation Middleware : " + obj.frontRotation +" "+ obj.sideRotation);
  }
});
