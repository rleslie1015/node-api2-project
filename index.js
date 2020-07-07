const express = require("express");
const apiRoutes = require('./api/api-router');

const server = express();

// To read data from the request body, we need to do:
server.use(express.json());
server.use('/api', apiRoutes)

server.use('/', (req, res) => res.send('API up and running!'));

// PORT
const port = process.env.PORT || 7000

server.listen(port, () => {
    console.log(`Listening on Port ${port}`);
})
