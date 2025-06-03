/**
 * 现代化词云标签效果脚本
 * 基于用户提供的词云图实现更现代化的视觉效果
 * 提供清晰的视觉层次和美观的标签展示
 * 优化移动端体验和交互效果
 */
document.addEventListener('DOMContentLoaded', function() {
  // 获取标签云容器和所有标签
  const container = document.querySelector('.modern-tag-cloud-container');
  const tagCloud = document.querySelector('.modern-tag-cloud');
  const tags = document.querySelectorAll('.modern-tag-cloud-item');
  
  if (!container || !tagCloud || tags.length === 0) return;
  
  // 初始化标签云
  initModernTagCloud();
  
  // 窗口大小改变时重新初始化标签云
  window.addEventListener('resize', debounce(initModernTagCloud, 200));
  
  // 定义一个函数来初始化标签云
  function initModernTagCloud() {
    // 清除现有的布局样式
    tagCloud.style.display = 'flex';
    tagCloud.style.flexWrap = 'wrap';
    tagCloud.style.justifyContent = 'center';
    tagCloud.style.alignItems = 'center';
    tagCloud.style.position = 'relative';
    tagCloud.style.width = '100%';
    tagCloud.style.minHeight = '400px';
    
    // 容器尺寸
    const containerWidth = container.offsetWidth;
    
    // 设置容器最小高度，确保有足够空间显示所有标签
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const baseHeight = isSmallMobile ? 350 : (isMobile ? 400 : 500);
    const tagHeightFactor = isSmallMobile ? 10 : (isMobile ? 12 : 15);
    container.style.minHeight = `${Math.max(baseHeight, tags.length * tagHeightFactor)}px`;
    
    // 文字云颜色方案 - 使用柔和、协调的色彩
    const colors = [
      // 主色调 - 蓝绿色系
      '#3a7ca5', '#4a8db6', '#5a9dc7', '#6aadd8', '#7abde9',
      // 辅助色调 - 绿色系
      '#2e8b57', '#3cb371', '#4caf50', '#66cdaa', '#8fbc8f',
      // 辅助色调 - 金色系
      '#b8860b', '#daa520', '#f0e68c', '#ffd700', '#ffdf00',
      // 辅助色调 - 红色系
      '#cd5c5c', '#dc143c', '#ff6347', '#ff7f50', '#ff8c00'
    ];
    
    // 为每个标签设置样式
    tags.forEach((tag, index) => {
      // 获取标签的权重和计数
      const weight = parseFloat(tag.getAttribute('data-weight'));
      const count = parseInt(tag.getAttribute('data-count'));
      
      // 计算字体大小，基于权重
      const fontSize = weight + 'rem';
      
      // 计算颜色，基于索引
      const colorIndex = index % colors.length;
      const color = colors[colorIndex];
      
      // 计算不透明度，基于计数
      const maxCount = Math.max(...Array.from(tags).map(t => parseInt(t.getAttribute('data-count'))));
      const opacity = 0.7 + (count / maxCount) * 0.3;
      
      // 应用样式
      tag.style.fontSize = fontSize;
      tag.style.backgroundColor = color;
      tag.style.opacity = opacity.toString();
      tag.style.transform = `rotate(${Math.random() * 6 - 3}deg)`;
      tag.style.margin = '0.5em';
      tag.style.padding = '0.5em 1em';
      tag.style.borderRadius = '30px';
      tag.style.color = '#ffffff';
      tag.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      tag.style.transition = 'all 0.3s ease';
      
      // 添加悬停效果
      tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(0deg)';
        this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
        this.style.zIndex = '10';
      });
      
      tag.addEventListener('mouseleave', function() {
        this.style.transform = `rotate(${Math.random() * 6 - 3}deg)`;
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        this.style.zIndex = '1';
      });
    });
    
    // 添加动画效果
    animateTagCloud();
  }
  
  // 添加轻微的动画效果
  function animateTagCloud() {
    tags.forEach((tag) => {
      // 随机延迟
      const delay = Math.random() * 2;
      // 随机动画持续时间
      const duration = 3 + Math.random() * 2;
      
      // 应用动画
      tag.style.animation = `tagFloat ${duration}s ease-in-out ${delay}s infinite alternate`;
    });
    
    // 添加动画关键帧
    if (!document.getElementById('tag-cloud-keyframes')) {
      const style = document.createElement('style');
      style.id = 'tag-cloud-keyframes';
      style.textContent = `
        @keyframes tagFloat {
          0% { transform: translateY(0) rotate(${Math.random() * 6 - 3}deg); }
          100% { transform: translateY(-10px) rotate(${Math.random() * 6 - 3}deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
});