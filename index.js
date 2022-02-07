const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;

let usuarios = [];
let obj = {
    x: 0,
    y: 0
}

const comandos = {
    ArrowRight: function(idJogador){
        if(usuarios.find(elemento => elemento.id === idJogador).coordenadas.x < 290){
            usuarios.find(elemento => elemento.id === idJogador).coordenadas.x += 10;
            io.sockets.emit('atualizar', usuarios);
        }
    },
    ArrowLeft: function(idJogador){
        if(usuarios.find(elemento => elemento.id === idJogador).coordenadas.x > 0){
            usuarios.find(elemento => elemento.id === idJogador).coordenadas.x -= 10;
            io.sockets.emit('atualizar', usuarios);
        }
        
    },
    ArrowUp: function(idJogador){
        if(usuarios.find(elemento => elemento.id === idJogador).coordenadas.y > 0){
            usuarios.find(elemento => elemento.id === idJogador).coordenadas.y -= 10;
            io.sockets.emit('atualizar', usuarios);
        }        
    },
    ArrowDown: function(idJogador){
        if(usuarios.find(elemento => elemento.id === idJogador).coordenadas.y < 140){
            usuarios.find(elemento => elemento.id === idJogador).coordenadas.y += 10;
            io.sockets.emit('atualizar', usuarios);
        }

    }
}

server.listen(PORT, () => {
    console.log("Server Running at the port "+ PORT);
});

app.use(express.static(path.join(__dirname, 'public')));

//meu codigo
io.on('connection', (socket) => { 
    console.log("acusando conexão");     
    usuarios.push({
        name: socket.id,
        id: socket.id,
        coordenadas: {
            x: Math.floor(Math.random() * 30) * 10,
            y: Math.floor(Math.random() * 15) * 10
        },
        sprite: ""

    });

    io.sockets.emit('atualizar', usuarios);

    socket.broadcast.emit('novaConexao', {
        message: socket.id + "Fulano entrou!"
    });
    
    socket.emit('informar nome');

    socket.on('msgEnviada', (data) => {
        console.log(data.mensagem);
        io.sockets.emit('nova mensagem', {
            mensagem: data.mensagem
        })
    });

    socket.on('move objeto', (data) => {                
        comandos[data.direcao](data.idJogador);
        console.log(usuarios);
    });

    socket.on('disconnect', (socket)=> {
        let index = usuarios.indexOf(socket.id);
        usuarios.splice(index, 1);

        io.sockets.emit('atualizar', usuarios);
    });

    socket.on('gravar nome', (data) => {
        usuarios.find(elemento => elemento.id === socket.id).name = data.nomeUsuario;
        io.sockets.emit('atualizar', usuarios);
    });

    socket.on('personagem escolhido', function (data) {        
        usuarios.find(elemento => elemento.id === socket.id).sprite = data;        
        io.sockets.emit('atualizar', usuarios);                
    });
});





