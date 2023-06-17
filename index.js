const express = require('express');
const uploader = require('express-fileupload');
const app = express();
const port = 3000;

app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    urlencoded: true
}));
app.use(uploader());

// app.get('/', (request, response) => {
//     response.send('hello');
// });

app.post('/api/upload', (request, response) => {

});
app.listen(port, () => {
    console.log('server is running at:' + port);
});
