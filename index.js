const express = require('express');
const app = express();
const port = 3000;
app.get('/', (request, response) => {
    response.send('hello');
});
app.listen(port, () => {
    console.log('server is running at:' + port);
});
