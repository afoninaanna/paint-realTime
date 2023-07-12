const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env.PORT || 5000;

app.ws('/', (ws, req) => {
    console.log('Подключение установлено');
    ws.send(JSON.stringify(`Ты успешно подключился`));
    ws.on('message', (msg) => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg);
                break;
            case 'draw':
                connectionHandler(ws, msg);
                break;
        }
    })
}) 

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

const connectionHandler = (ws, msg) => {
    ws.id = msg.id; 
    broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if(client.id === msg.id) {
            client.send(JSON.stringify(msg));
        }
    })
} 