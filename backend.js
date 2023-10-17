const io=require('socket.io')(8000)
const users={};
io.on('connection', socket=>{
     socket.on('new-user-joined', name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined', name)//Tell all the user that new user joined

     });

     socket.send('send',message=>{
         socket.emit.broadcast('recieve',{message:message, name:user[socket.id]})
     });
})

