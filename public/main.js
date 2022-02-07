const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const comandosHabilitados = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

var nomeUsuario;

document.addEventListener('keydown', (event) => {
  if (comandosHabilitados.indexOf(event.key) > -1){
    socket.emit('move objeto', {
      direcao: event.key,
      idJogador: socket.id
    });    
  }  
});

socket.on('novaConexao', (data) => {
  //window.alert(data.message);
  console.log(data.message);
});

socket.on('nova mensagem', (data) => {  
  var msg =   data.mensagem;

  novoElemento = document.createElement('div');
  conteudoMensagem = document.createTextNode(msg);

  novoElemento.appendChild(conteudoMensagem);

  var div = document.getElementById("mensagens");
  div.appendChild(novoElemento);
  
});

socket.on('atualizar', (usuarios) => {  
  desenhasJogadores(usuarios);
  gerarListaJogadores(usuarios);  
});

socket.on('informar nome', ()=> {
  nomeUsuario = prompt("Digite seu nome");
  
  if (nomeUsuario.trim() == ""){
    nomeUsuario = "Jogador "+ socket.id;
  }

  socket.emit('gravar nome', {
    nomeUsuario: nomeUsuario
  });
});

  function enviarMensagem(){
    let msg = document.getElementById('input').value;    
    socket.emit('msgEnviada', {
      mensagem: nomeUsuario + " diz: " + msg
    });
  }

  function escolherSprite(){
    let select = document.getElementById('sprite').value; 
    console.log(select);
    if(select === ""){
      window.alert("Escolher um aí doidão");
    }else {
      socket.emit('personagem escolhido', select);    
    }    
  }

function desenhasJogadores(usuarios){
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  usuarios.forEach(function(usuario){
    if(usuario.id === socket.id){
      ctx.fillStyle = 'green';
    }else{
      ctx.fillStyle = 'red';
    }

    if(usuario.sprite === ""){
      ctx.fillRect(usuario.coordenadas.x, usuario.coordenadas.y, 10, 10);
    }else {
      //ESTÁ MUDANDO DO SOURCE MAS NÃO ESTÁ EXIBINDO POIS JÁ FOI CARREGADA A PÁGINA
      var image = new Image();
      image.style = "width: 50px; height: 50px; object-fit: cover; object-position: center;"      
      image.src ="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+usuario.sprite+".png";      

      image.coordenadas = {
        x: usuario.coordenadas.x,
        y: usuario.coordenadas.y
      };     

      image.onload = function (){          
        ctx.drawImage(this, this.coordenadas.x-15, this.coordenadas.y-15, 40, 40);
      }      
      //ctx.drawImage(image, usuario.coordenadas.x-15, usuario.coordenadas.y-15, 40, 40);
      
      
    }
});
}

function gerarListaJogadores(usuarios) {  
  let lista = document.getElementById('lista');
  let item;

  while (lista.firstChild) {
    lista.removeChild(lista.firstChild);
  }

  usuarios.forEach(usuario=>{
      item = document.createElement('li');
      item.textContent = usuario.name;
      lista.appendChild(item)
  })

};

async function gerarPersonagem(usuario){
  let image = new Image();     
  image.style = "width: 50px; height: 50px; object-fit: cover; object-position: center;"
  image.src ="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+usuario.sprite+".png";

  return image;
}


