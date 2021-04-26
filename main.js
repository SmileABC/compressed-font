let fs = require('fs');
let path = require('path');
let extname = ['.js','.html'];
let url = 'D:/gz/VM/xcheck.xmirror.cn';
let font = 'SourceHanSansCN-Light(1).ttf';

let readFileList = (dir, filesList = []) =>  {
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
        let fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            readFileList(path.join(dir, item), filesList);
        } else {
            if(extname.indexOf(path.extname(fullPath)) !== -1){
                filesList.push(fullPath);
            }
        }
    });
    return filesList;
}

let filesList = [];
readFileList(url,filesList);

let content = '';
let current = 0;
let readFileContent = (value,length,callback) => {
    fs.readFile(value,'utf-8',(err,data) => {
        if(err){
            console.error(err);
        } else{
            fileContent = data.replace(/[\n\d\r\s]/g,'');
            content += fileContent;
            current += 1;
            if(length === current){
                callback(content)
            }
        }
    });
}

filesList.forEach((value,index) => {
    readFileContent(value,filesList.length,(content) => {
        content = content.replace(/[a-zA-Z]/g,'');
        content += 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        content = content.split('');
        content = Array.from(new Set(content));
        content = content.join('');
        let testHtml = fs.readFileSync('./index.html', 'utf8');
        testHtml = testHtml.replace(/\/\*start\*\/src:url\('.\/fonts\/.+'\);\/\*end\*\//g, '/*start*/src:url(\'./fonts/' + font + '\');/*end*/');
        testHtml = testHtml.replace(/<body><\/body>/,'<body>' + content + '</body>');
        fs.writeFileSync('./index.html',testHtml, 'utf8');
    })
});
