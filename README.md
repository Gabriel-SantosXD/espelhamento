# Compartilhamento de Tela - Projeto

Este projeto permite o compartilhamento de tela em tempo real, utilizando WebRTC e WebSockets. O servidor é baseado em Node.js e o cliente é um aplicativo React. O cliente transmite a tela do usuário para outros dispositivos conectados através de WebRTC, com áudio e vídeo.

## Funcionalidades

- Compartilhamento de tela com áudio e vídeo.
- Comunicação em tempo real utilizando WebSockets.
- Interface simples para iniciar o compartilhamento de tela.

## Tecnologias

- **Backend:** Node.js, Socket.IO
- **Frontend:** React
- **WebRTC:** Para transmissão de mídia (áudio e vídeo).

## Requisitos

Para rodar este projeto, você precisará de:

- [Node.js](https://nodejs.org/) (versão recomendada: 14 ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## Como começar

### 1. Clonar o repositório

Clone este repositório para o seu ambiente local:

```bash
git clone https://github.com/Gabriel-SantosXD/espelhamento.git
cd compartilhamento-tela
```

### 2. Instalar dependências

Backend (Servidor): </br>
Navegue até a pasta <strong>"server"</strong> e instale a dependência necessária:

```bash
npm install
```

Frontend (Cliente React):</br>
Na raiz da pasta <strong>"client"</strong>, instale as dependências do cliente React:

```bash
npm install
```

### 3. Configuração e execução

Rodar o servidor</br>
No terminal, na pasta server, execute o servidor:

```bash
node server.js
```

Isso iniciará o servidor backend na porta 5000 (http://localhost:5000/server) </br>

Rodar o cliente (React)</br>
Em outro terminal, na pasta client, inicie o cliente:

```bash
npm start
```

Isso iniciará o cliente React na porta 3000.

O frontend estará disponível em http://localhost:3000 e se conectará ao servidor WebSocket na porta 5000.

### Compartilhar a tela

Entre na interface gerada pelo servidor http://localhost:5000/server </br>
Ao acessar a interface, você verá um botão "iniciar compartilhamento de tela". </br>
Clique nele para começar a compartilhar sua tela. O fluxo é:

1. O cliente solicita acesso(basta está com site aberto http://localhost:3000)
2. O servidor WebSocket gerencia as ofertas e respostas WebRTC.
3. A tela compartilhada é transmitida para todos os outros dispositivos conectados.

##

### Configuração de rede (opcional)

Se você estiver rodando o projeto em diferentes máquinas ou em um ambiente de produção, será necessário configurar as portas no seu firewall e garantir que o servidor esteja acessível. Certifique-se de que o WebSocket possa se comunicar entre as máquinas.

### Dependências

- Backend (Node.js):
  - express
  - socket.io
- Frontend (React):
  - react
  - react-dom

### Contribuindo

Se você deseja contribuir para este projeto, faça um fork e envie um pull request com suas alterações. Certifique-se de testar as alterações localmente antes de submeter.

### Licença

Este projeto está licenciado sob a MIT License.
