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
    const { name, size, type, hash, offset, chunk } = request.body;
    const { file } = request.files;
    console.log(name, size, type, hash, offset, chunk);
    const ext = extname(name);
    const fileName = resolve(__dirname, `./public${hash}${ext}`);

    if (offset) {
        if (!existsSync(fileName)) {
            response.status(400).send({
                message: '文件不存在'
            });
            return;
        }
        await appendFile(fileName, file.data);
        response.send({
            data: 'appended'
        });
        return;
    }
    await writeFile(fileName, file.data);
    response.send({
        data: 'created'
    });

});
app.listen(port, () => {
    console.log('server is running at:' + port);
});
