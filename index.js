const express = require('express');
const uploader = require('express-fileupload');
const { extname, resolve } = require('path');
const { writeFile, appendFile } = require('fs/promises');
const { existsSync } = require('fs');
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

app.post('/api/upload', async (request, response) => {
    const { name, size, type, hash, offset } = request.body;
    const { chunk } = request.files;
    // console.log(request, name, size, type, hash, offset);
    const ext = extname(name);
    const fileName = resolve(__dirname, `./public/${hash}${ext}`);

    if (offset > 0) {
        if (!existsSync(fileName)) {
            response.status(400).send({
                message: '文件不存在'
            });
            return;
        }
        await appendFile(fileName, chunk.data);
        response.send({
            data: 'appended'
        });
        return;
    }
    await writeFile(fileName, chunk.data);
    response.send({
        data: 'created'
    });

});
app.listen(port, () => {
    console.log('server is running at:' + port);
});
