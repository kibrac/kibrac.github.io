/**
 * CSS压缩工具
 * 此脚本用于将CSS文件压缩为最小化版本
 * 使用方法：在命令行中运行 node css-minifier.js
 */

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

// 配置项
const config = {
  // CSS文件目录
  cssDir: path.join(__dirname, '../css'),
  // 输出后缀
  outputSuffix: '.min',
  // 是否覆盖原文件
  overwrite: false,
  // 压缩选项
  options: {
    level: 2, // 压缩级别 (0-2)
    compatibility: '*', // 兼容性
    format: 'keep-breaks' // 保留换行符
  }
};

/**
 * 压缩CSS文件
 * @param {string} filePath - CSS文件路径
 */
async function minifyCSS(filePath) {
  try {
    // 读取CSS文件
    const css = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // 如果已经是压缩文件，则跳过
    if (fileName.includes(config.outputSuffix)) {
      console.log(`跳过 ${fileName} (已是压缩文件)`);
      return;
    }
    
    // 压缩CSS
    const minifier = new CleanCSS(config.options);
    const minified = minifier.minify(css);
    
    // 生成输出文件名
    const outputName = config.overwrite 
      ? filePath 
      : filePath.replace('.css', `${config.outputSuffix}.css`);
    
    // 写入压缩后的CSS
    fs.writeFileSync(outputName, minified.styles);
    
    // 输出压缩结果
    const originalSize = (css.length / 1024).toFixed(2);
    const minifiedSize = (minified.styles.length / 1024).toFixed(2);
    const savings = (100 - (minified.styles.length / css.length * 100)).toFixed(2);
    
    console.log(`已压缩: ${fileName}`);
    console.log(`  原始大小: ${originalSize} KB`);
    console.log(`  压缩大小: ${minifiedSize} KB`);
    console.log(`  节省: ${savings}%`);
  } catch (err) {
    console.error(`压缩 ${filePath} 时出错:`, err);
  }
}

/**
 * 处理目录中的所有CSS文件
 * @param {string} dir - CSS文件目录
 */
async function processDirectory(dir) {
  try {
    // 获取目录中的所有文件
    const files = fs.readdirSync(dir);
    
    // 过滤出CSS文件
    const cssFiles = files.filter(file => 
      path.extname(file).toLowerCase() === '.css' && 
      !file.includes(config.outputSuffix)
    );
    
    // 压缩每个CSS文件
    for (const file of cssFiles) {
      const filePath = path.join(dir, file);
      await minifyCSS(filePath);
    }
    
    console.log(`共处理 ${cssFiles.length} 个CSS文件`);
  } catch (err) {
    console.error(`处理目录 ${dir} 时出错:`, err);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('开始CSS压缩...');
  console.log(`CSS目录: ${config.cssDir}`);
  
  await processDirectory(config.cssDir);
  
  console.log('CSS压缩完成!');
}

// 执行主函数
main().catch(err => {
  console.error('程序执行出错:', err);
  process.exit(1);
});