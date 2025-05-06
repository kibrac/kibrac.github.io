/**
 * JavaScript压缩工具
 * 此脚本用于将JS文件压缩为最小化版本
 * 使用方法：在命令行中运行 node js-minifier.js
 */

const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

// 配置项
const config = {
  // JS文件目录
  jsDir: path.join(__dirname, '../js'),
  // 输出后缀
  outputSuffix: '.min',
  // 是否覆盖原文件
  overwrite: false,
  // 压缩选项
  options: {
    compress: {
      drop_console: false, // 是否移除console语句
      drop_debugger: true, // 是否移除debugger语句
    },
    mangle: true, // 是否混淆变量名
    output: {
      beautify: false, // 是否美化输出
      comments: false // 是否保留注释
    }
  }
};

/**
 * 压缩JS文件
 * @param {string} filePath - JS文件路径
 */
async function minifyJS(filePath) {
  try {
    // 读取JS文件
    const js = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // 如果已经是压缩文件或是minifier本身，则跳过
    if (fileName.includes(config.outputSuffix) || 
        fileName === 'js-minifier.js' || 
        fileName === 'css-minifier.js' || 
        fileName === 'webp-converter.js' || 
        fileName === 'lazysizes.min.js') {
      console.log(`跳过 ${fileName} (已是压缩文件或工具脚本)`);
      return;
    }
    
    // 压缩JS
    const result = UglifyJS.minify(js, config.options);
    
    if (result.error) {
      throw new Error(`UglifyJS错误: ${result.error}`);
    }
    
    // 生成输出文件名
    const outputName = config.overwrite 
      ? filePath 
      : filePath.replace('.js', `${config.outputSuffix}.js`);
    
    // 写入压缩后的JS
    fs.writeFileSync(outputName, result.code);
    
    // 输出压缩结果
    const originalSize = (js.length / 1024).toFixed(2);
    const minifiedSize = (result.code.length / 1024).toFixed(2);
    const savings = (100 - (result.code.length / js.length * 100)).toFixed(2);
    
    console.log(`已压缩: ${fileName}`);
    console.log(`  原始大小: ${originalSize} KB`);
    console.log(`  压缩大小: ${minifiedSize} KB`);
    console.log(`  节省: ${savings}%`);
  } catch (err) {
    console.error(`压缩 ${filePath} 时出错:`, err);
  }
}

/**
 * 处理目录中的所有JS文件
 * @param {string} dir - JS文件目录
 */
async function processDirectory(dir) {
  try {
    // 获取目录中的所有文件
    const files = fs.readdirSync(dir);
    
    // 过滤出JS文件
    const jsFiles = files.filter(file => 
      path.extname(file).toLowerCase() === '.js' && 
      !file.includes(config.outputSuffix) &&
      !['js-minifier.js', 'css-minifier.js', 'webp-converter.js'].includes(file)
    );
    
    // 压缩每个JS文件
    for (const file of jsFiles) {
      const filePath = path.join(dir, file);
      await minifyJS(filePath);
    }
    
    console.log(`共处理 ${jsFiles.length} 个JS文件`);
  } catch (err) {
    console.error(`处理目录 ${dir} 时出错:`, err);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('开始JavaScript压缩...');
  console.log(`JS目录: ${config.jsDir}`);
  
  await processDirectory(config.jsDir);
  
  console.log('JavaScript压缩完成!');
}

// 执行主函数
main().catch(err => {
  console.error('程序执行出错:', err);
  process.exit(1);
});