const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser les JSON
app.use(express.json());

//Variable pour stocker les données temporairement
let lastIoTData = null;

// Variable pour stocker les clients connectés
const clients = [];


//Endpoint SSE(/stream) pour le rafraîchissement des données
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  // Supprimer le client s’il se déconnecte
  req.on('close', () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});


// Endpoint pour recevoir les données de AWS IoT
app.post('/iot-data', (req, res) => {
    // console.log('Données reçues de AWS IoT:', req.body);
    // lastIoTData = req.body;
    // res.status(200).send('Données reçues');
    const payload = req.body;
    console.log('Reçu :', payload);

    // Envoyer les données aux clients connectés
    clients.forEach(client => {
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
  });

  res.status(200).json({ message: 'Données reçues' });
});


// Endpoint pour que la page web récupère les données
app.get('/iot-data', (req, res) => {
    res.json(lastIoTData || { message: 'Aucune donnée encore' });
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
