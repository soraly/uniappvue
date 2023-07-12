const fs = require('fs');
const path = require('path');

// 从命令行参数中获取第二个文件名
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('请提供正确的文件名作为命令行参数！');
    process.exit(1);
}

const platform = args[0];

// 读取pages.json文件
const filePath = '../../pages.json'
const pagesObj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 读取pages-*.json文件
const pagesGetObj = JSON.parse(fs.readFileSync(`pages-${platform}.json`, 'utf8'));

// 更新pages内容
pagesObj.pages = pagesGetObj.pages;
pagesObj.tabBar.list = pagesGetObj.tabBarList

// 将更新后的数据写入pages.json文件
fs.writeFileSync(filePath, JSON.stringify(pagesObj, null, 4), 'utf8');

console.log(filePath + '数据切换完成！');

/**
 * 开始修改config.js里的station
 */
// 获取上级目录的路径
const parentDir = path.resolve(__dirname, '..');

// 拼接config.js文件的路径
const configFilePath = path.join(parentDir, 'config.js');

// 读取config.js文件
fs.readFile(configFilePath, 'utf8', (err, data) => {
    const text = `configEnums.STATION.${platform.toUpperCase()}`
    if (err) {
        console.error(`读取config.js文件时发生错误,请手动修改station为: ${text}`, err);
        return;
    }

    // 替换station的值
    const updatedData = data.replace(/var station\s*=\s*[^;\n]*/g, `var station = ${text}`);

    // 将更新后的数据写入config.js文件
    fs.writeFile(configFilePath, updatedData, 'utf8', err => {
        if (err) {
            console.error('写入config.js文件时发生错误:', err);
            return;
        }
        console.log(`config.js文件的station已成功更改为${text}！`);
    });
});
