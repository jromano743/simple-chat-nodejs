const Chat = require('./models/Chat');

module.exports = function(io){

    let users = {};

    //server socket connection
    io.on('connection', async socket => {//has all sockets, all users
        
        //new user enter
        let messages = await Chat.find({});

        socket.on('new user', (data, cb) => {
            if(data in users){
                cb(false);
            }else{
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
                console.log('New user connected:', socket.nickname);

                socket.emit('load old msgs', messages);
            }
        })

        //user send message
        socket.on('send message', async (data, cb) => {
            let msg = data.trim();

            if(msg.substr(0,3) === '/w '){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if(index !== -1){
                    let name = msg.substring(0, index);
                    let message = msg.substring(index + 1);
                    if(name in users){
                        users[name].emit('whisper', {
                            msg: message,
                            nickname: socket.nickname
                        });
                        users[socket.nickname].emit('whisper', {
                            msg: message,
                            nickname: socket.nickname
                        })
                    }else{
                        cb('Error! Please enter a Valid User');
                    }
                }else{
                    cb('Error! Please enter your message');
                }
            }else{
                //save message in DB
                let newMessage = new Chat({
                    nick: socket.nickname,
                    message: data
                });
                await newMessage.save();

                //send message to global chat
                io.sockets.emit('new message', {
                    msg: data,
                    nickname: socket.nickname
                });
            }
        })

        //disconnect
        socket.on('disconnect', (data) => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        })

        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
}