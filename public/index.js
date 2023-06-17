import MD5 from 'crypto-js/md5';
import axios from 'axios';
const uploader = document.querySelector('#uploader');
const output = document.querySelector('#output');
//进度条
const progress = document.querySelector('#progress');

//封装读取文件函数，返回一个promise对象
function fileReader(file) {
    const reader = new FileReader();
    return Promise((resolve, reject) => {
        reader.addEventListener('load', (e) => {
            if (e.type === 'load') {
                resolve(reader.result);
            }
        });
        reader.addEventListener('error', reject);
        //将file对象转化为字符串形式供md5加密
        reader.readAsText();
    });
}
uploader.addEventListener('change', async (event) => {
    // 获取文件
    const { files } = event.target;
    const { file } = files;
    if (!file) {
        return;
    }
    //将已选择文件的路径清空，避免下次点击无change事件
    uploader.value = null;
    //读取文件并获取其唯一hash值
    const content = fileReader(file);
    const hash = MD5(content);
    const { size, name, type } = file;
    progress.max = size;
    const chunkSize = 64 * 1024;
    let start = 0;
    const local = localStorage.getItem(hash);
    if (local) {
        start = Number(local);
    }
    while (start < size) {
        let end = Math.min(start + chunkSize, size);
        const chunk = file.slice(start, end, type);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('size', size);
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('offset', start);

        try {
            await axios.post('/api/upload', formData);
        } catch (error) {
            output.innerHTML = '上传失败' + error.message;
            return;
        }
        start += chunkSize;
        //localStorage数字类型会自动转化为字符串类型
        localStorage.setItem(hash, start);
        progress.value = start;
    }
    output.innerHTML = '上传成功';
});
