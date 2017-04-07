var app = require("http").createServer(handler),
    io = require("socket.io").listen(app),
    fs = require("fs");

app.listen(3000);

function handler(req, res) {
    fs.readFile(__dirname + '/index1.html',
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index1.html');
            }
            res.writeHead(200);
            res.end(data);
        });
}
let arr = [];
io.on('connection', function(socket) {
    //when receiving the data from the server, push the same message to client.
    //arr.push({ id: socket.id, userName: data.name })

    socket.on("clientMsg", function(data) {
        arr.push({ id: socket.id, userName: data.name })
        console.log("Id is------->", arr)
            //send the data to the current client requested/sent.
            //socket.emit("serverMsg", data);
            //send the data to all the clients who are accessing the same site(localhost)
            //socket.broadcast.emit("serverMsg", data);
        console.log("User info------->", data)
        let data1 = { name: data.name, msg: 'Msg From ' + data.name + "------->" + data.msg };
        //data1.msg = "hello"
        let id = "";
        arr.forEach(function(element) {
            console.log(data.r_name, "Hiiii", arr);
            if (data.r_name == element.userName) {
                id = element.id;
            }
        }, this);
        console.log("User id------->", id)
        io.in(id).emit('serverMsg', data1)
            //io.in(id).emit('notify', data1)
            //io.in(arr[1]).emit('serverMsg', data1)
    });

    socket.on("sender", function(data) {
        socket.emit("sender", data);
        socket.broadcast.emit("sender", data);
    });

    socket.on('disconnect', function() {
        console.log(socket.id, 'user disconnected');
    });
    socket.on('reconnect', function() {
        console.log('user reconnect');
        io.connect("http://localhost:3000", {
            'forceNew': true
        });
    });
});