$(function () {
    //client socket connection
    const socket = io();

    //get DOM elements from interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //DOM elementes from the nickname form
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickName = $('#nickname');

    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickName.val(), (data) => {
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                $nickError.html(`
                <div class="alert alert-danger">
                    That username already exits
                </div>
                `)
            }
            $nickName.val(' ');
        });
    })

    //events
    $messageForm.submit(e => {
        e.preventDefault();

        //send the event with the established information
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val(' ');
    })

    //new message event
    socket.on('new message', function(data) {
        $chat.append(`<b>${data.nickname}</b>: ${data.msg}<br>`);
    })

    //usernames event
    socket.on('usernames', (data) => {
        let html = '';
        for(let i=0;i<data.length;i++){
            html += `<p><i class="fas fa-user"></i>  ${data[i]}</p>`
        }
        $users.html(html);
    })

    //whisper event
    socket.on('whisper', (data) => {
        $chat.append(`<p class="whisper"><b>${data.nickname}:</b>${data.msg}</p>`)
    })

    //load messages event
    socket.on('load old msgs', (msgs) => {
        for(let i=0;i<msgs.length;i++){
            displayMessage(msgs[i])
        }
    })

    function displayMessage(data){
        console.log(data);
        $chat.append(`<p class="whisper"><b>${data.nick}:</b>${data.message}</p>`)
    }
})