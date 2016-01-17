var app = require('http').createServer(handler),
    fs = require('fs'),
    io = require('socket.io').listen(app),
    mysql = require('mysql');

app.listen(8000);
var users = 0;
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '490Nikolay490',
    database: 'chat'
})
 
// Log any errors connected to the db
db.connect(function(err){
    if (err) console.log(err)
})
console.log('started');
function handler(req, res) {
    fs.readFile(__dirname+'/index.html', function(err, data) {
       if(err) {
            console.log('error' + err);
           res.writeHead(404);
           return res.end ('Error index.html');
       }
       res.writeHead(200);
        res.end(data);
    });
}

io.sockets.on('connection', function(socket) {
    var addedUser = false;
    io.sockets.emit('number_connected', users);
   socket.on('set name',function(name) {
       if (addedUser) return;
//      socket.set('name',name,function() {
//         console.log(name + "connected"); 
//      });
       socket.username = name;
        addedUser = true;  
       var con_msg = "<strong>" + name + " connected </strong>";
        io.sockets.emit('user_connected', con_msg);
        ++users;
        io.sockets.emit('number_connected', users);
          
     
     
   });
    
   socket.on('send_msg', function(msg) { 
      io.sockets.emit('broadcast_msg', socket.username+ ': ' + msg);
   });
    socket.on('disconnect', function () {
        if (addedUser) {
            --users;
            var con_msg = "<strong>" + socket.username + " left chat </strong>";
            socket.broadcast.emit('user left', {
                username: con_msg,
                numUsers: users
            });
        }
    });
});