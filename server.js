//----------------------------------------------------------------------------------------------------------------------
// Main server module
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var connect = require('connect');
var UniSocketServer = require('unisocket');

var package = require('./package');

var sockets = require('./server/sockets');

//----------------------------------------------------------------------------------------------------------------------

var server = connect()
    .use(connect.logger('dev'))
    .use(connect.static('client'))
    .use(function(request, response)
    {
        if(request.url != '/unisocket/$/client.js')
        {
            // Serve the index on all urls
            var indexStream = fs.createReadStream(path.join(__dirname, 'client', 'index.html'));
            indexStream.pipe(response);
        } // end if
    })
    .listen(4000);

var socketServer = new UniSocketServer().attach(server);
sockets.init(socketServer);

console.log('Mooks v%s started on %s, port %s.', package.version, server.address().address, server.address().port);

//----------------------------------------------------------------------------------------------------------------------