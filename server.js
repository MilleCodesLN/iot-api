const express = require('express');
const app = express();
const port = 3000;

// Middleware pour parser les JSON
app.use(express.json());

// Variable pour stocker les données temporairement
let lastIoTData = null;

// Endpoint pour recevoir les données de AWS IoT
// app.post('/iot-data', (req, res) => {
//     console.log('Données reçues de AWS IoT:', req.body);
//     lastIoTData = req.body;
//     res.status(200).send('Données reçues');
// });

app.post('/iot-data', (req, res) => {
  console.log('Requête reçue:', req.body);  // 👈 log du token
  res.status(200).json({ message: 'OK' });
});

// Endpoint pour que la page web récupère les données
app.get('/iot-data', (req, res) => {
    res.json(lastIoTData || { message: 'Aucune donnée encore' });
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
