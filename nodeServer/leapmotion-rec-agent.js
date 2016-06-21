var app = require('express')();
var http = require('http').Server(app);
var WebSocket = require('ws');

// Zum schreiben von JSONs in deine Datei
var jsonfile = require('jsonfile');
var file = 'leapmotiondata.json';
var leapmotiondata = {
   data: []
};


// TODO Kann das weg??
// Agent soll auf diesem Port laufen
http.listen(3000, function(){
    console.log('listening on *:3000');
});


connectToWebSocket();

// Connection zur Leao Motion via WebSocket
function connectToWebSocket() {

    var ws = new WebSocket("ws://127.0.0.1:6437/v6.json");

    // WebSocket soll nach 10sek wieder geschlossen werden
    // oder var timer ?
    setTimeout(function(){ws.close();}, 10000);

    ws.onopen = function(event) {
        ws.send(JSON.stringify({optimizeHMD: true}));   // This doesn't work
        ws.send(JSON.stringify({background: true})); // But this works
        console.log("open");
    };

    // Wenn ein Event ueber den WebSocket empfangen wird
    ws.onmessage = function(event) {
      if (event.data != null ) {
        var obj = JSON.parse(event.data);
        var str = JSON.stringify(obj, undefined, 2);
        console.log("Leap Motion: " + str);

        leapmotiondata.data.push(str);

      }

    };

    ws.onclose = function(event) {
        ws = null;
        console.log("close");


        // Schreibe JSON-File in die Datei
        // TODO Muessen das wirklich alle Daten sein??
        // vielleicht muss auch obj statt str gespeichert werden?
        jsonfile.writeFile(file, leapmotiondata, function(err) {
          if (err) {
            console.error("writeFileErr: "+err);
          }else {
            console.log(file + " wurde ueberschrieben!");
          }

        });
    };

    ws.onerror = function(event) {
        console.log("error");
    };
}
