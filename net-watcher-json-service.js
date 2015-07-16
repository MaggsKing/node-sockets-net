





"use strict";
const
    fs = require('fs'),
    net = require('net'),
    filename = process.argv[2],
    server = net.createServer(function(connection){
        /*
        It reports that the connection has been established
        (both to the client with connection.write, and to the console).
        */
        console.log('Subscriber connected.');
        connection.write(JSON.stringify({
            type:'wathcing',
            file: filename
        }) + '\n');

        /*
        It begins listening for changes to the target file, saving the
        returned watcher object. This callback sends change information
        to the client using connection.write
        */
        let watcher = fs.watch(filename, function(){
            connection.write("File '" + filename + "' changed: "  + Date.now() + "\n");
        });
        /*
        It listens for the connection's close event so it can report that
        the subscriber has diconnected and stop watching the file, with
        watcher.close()
        */
        connection.on('close', function(){
            console.log('Subscriber disconnected.');
            watcher.close();
        });

        connection.on('error', function(err){
            throw Error('There was an error\n', err);
        })
    });

    if(!filename){
        throw Error('No target filename was specified.');
    }

    server.listen(5432, function(){
        console.log('Listening for subsrcibers...');
    });

    
