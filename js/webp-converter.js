/**
 * WebP图片转换工具
 * 此脚本用于将网站中的图片转换为WebP格式
 * 使用方法：在命令行中运行 node webp-converter.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 配置项
const config = {
  // 需要处理的图片目录
  inputDir: path.join(__dirname, '../../content'),
  // 支持的图片格式
  supportedFormats: ['.jpg', '.jpeg', '.png', '.gif'],
  // WebP质量 (1-100)
  quality: 80
};

/**
 * 递归遍历目录并处理图片
 * @param {string} dir - 要遍历的目录
 */
async function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // 递归处理子目录
        await processDirectory(filePath);
      } else {
        // 处理文件
        const ext = path.extname(filePath).toLowerCase();
        if (config.supportedFormats.includes(ext)) {
          await convertToWebP(filePath);
        }
      }
    }
  } catch (err) {
    console.error(`处理目录 ${dir} 时出错:`, err);
  }
}

/**
 * 将图片转换为WebP格式
 * @param {string} filePath - 图片文件路径
 */
async function convertToWebP(filePath) {
  try {
    const webpPath = filePath.replace(path.extname(filePath), '.webp');
    
    // 检查WebP文件是否已存在，如果存在且比原文件新，则跳过
    if (fs.existsSync(webpPath)) {
      const originalStat = fs.statSync(filePath);
      const webpStat = fs.statSync(webpPath);
      
      if (webpStat.mtime > originalStat.mtime) {
        console.log(`跳过 ${filePath} (WebP已是最新)`);
        return;
      }
    }
    
    // 转换图片
    await sharp(filePath)
      .webp({ quality: config.quality })
      .toFile(webpPath);
    
    console.log(`已转换: ${filePath} -> ${webpPath}`);
  } catch (err) {
    console.error(`转换 ${filePath} 时出错:`, err);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('开始WebP图片转换...');
  console.log(`输入目录: ${config.inputDir}`);
  console.log(`支持的格式: ${config.supportedFormats.join(', ')}`);
  console.log(`WebP质量: ${config.quality}`);
  
  await processDirectory(config.inputDir);
  
  console.log('WebP图片转换完成!');
}

// 执行主函数
main().catch(err => {
  console.error('程序执行出错:', err);
  process.exit(1);
});