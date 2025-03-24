/**
 * 文字云标签效果脚本
 * 实现优雅、平衡的文字云布局
 * 提供清晰的视觉层次和美观的标签展示
 * 优化移动端体验和交互效果
 */
document.addEventListener('DOMContentLoaded', function() {
  // 获取标签云容器和所有标签
  const container = document.querySelector('.tags-cloud-container');
  const tagCloud = document.querySelector('.tag-cloud');
  const tags = document.querySelectorAll('.tag-cloud-item');
  
  if (!container || !tagCloud || tags.length === 0) return;
  
  // 定义一个函数来初始化标签云
  function initTagCloud() {
  
  // 清除现有的flex布局样式
  tagCloud.style.display = 'block';
  tagCloud.style.position = 'relative';
  tagCloud.style.width = '100%';
  tagCloud.style.height = '100%';
  
  // 容器尺寸
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  
  // 设置容器最小高度，确保有足够空间显示所有标签
  // 根据设备类型和标签数量动态调整高度
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const baseHeight = isSmallMobile ? 350 : (isMobile ? 400 : 500);
  const tagHeightFactor = isSmallMobile ? 10 : (isMobile ? 12 : 15);
  container.style.minHeight = `${Math.max(baseHeight, tags.length * tagHeightFactor)}px`;
  
  // 文字云布局参数 - 优化布局算法
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const maxRadius = Math.min(containerWidth, containerHeight) * 0.45; // 增加最大半径以获得更好的分布
  
  // 文字云颜色方案 - 使用柔和、协调的色彩
  const colors = [
    // 主色调
    '#3a7ca5', '#4a8db6', '#5a9dc7', '#6aadd8', 
    '#7abde9',
    '#4a6b8c', '#5a7b9c', '#6a8bac', '#7a9bbc', '#8aabcc',
    '#4a6b7c', '#5a7b8c', '#6a8b9c', '#7a9bac', '#8aabbc',
    '#4a5b6c', '#5a6b7c', '#6a7b8c', '#7a8b9c', '#8a9bac'
  ];
  
  // 获取所有标签的数量值
  const counts = Array.from(tags).map(tag => {
    const countEl = tag.querySelector('.tag-count');
    if (countEl) {
      const countText = countEl.textContent;
      return parseInt(countText.replace(/[()]/g, ''));
    }
    return 1;
  });
  
  // 找出最大和最小数量
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  
  // 根据标签数量排序
  const tagData = Array.from(tags).map((tag, index) => {
    return {
      element: tag,
      count: counts[index]
    };
  }).sort((a, b) => b.count - a.count);
  
  // 用于检测碰撞的标签位置数组
  const placedTags = [];
  
  // 检测位置是否与已放置标签重叠 - 优化碰撞检测
  function checkCollision(x, y, width, height) {
    const padding = 10; // 增加标签间距，使布局更加宽松
    for (const placed of placedTags) {
      if (x + width + padding > placed.x - padding && 
          x - padding < placed.x + placed.width + padding && 
          y + height + padding > placed.y - padding && 
          y - padding < placed.y + placed.height + padding) {
        return true; // 碰撞
      }
    }
    return false; // 无碰撞
  }
  
  // 为每个标签设置位置和样式
  tagData.forEach((tagInfo, index) => {
    const tag = tagInfo.element;
    const count = tagInfo.count;
    
    // 计算标签的重要性
    const importance = (count - minCount) / (maxCount - minCount || 1);
    
    // 根据重要性设置字体大小 - 更平衡的差异
    // 在移动设备上使用较小的字体大小范围
    const fontSizeMin = isSmallMobile ? 0.85 : (isMobile ? 0.9 : 0.95);
    const fontSizeMax = isSmallMobile ? 1.2 : (isMobile ? 1.4 : 1.6);
    const fontSize = fontSizeMin + importance * (fontSizeMax - fontSizeMin);
    tag.style.fontSize = `${fontSize}rem`;
    
    // 根据重要性选择颜色
    const colorIndex = Math.floor(Math.random() * colors.length);
    const color = colors[colorIndex];
    
    // 设置基本样式
    tag.style.position = 'absolute';
    tag.style.color = color;
    tag.style.fontWeight = 400 + Math.floor(importance * 200);
    tag.style.textDecoration = 'none';
    tag.style.border = '1px solid rgba(0, 0, 0, 0.05)';
    tag.style.background = 'rgba(255, 255, 255, 0.5)';
    tag.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    tag.style.padding = isSmallMobile ? '0.4em 0.7em' : '0.5em 0.9em';
    tag.style.borderRadius = '20px';
    tag.style.lineHeight = '1.4';
    tag.style.transition = 'all 0.3s ease';
    tag.style.opacity = '0.9';
    tag.style.transform = 'rotate(0deg)';
    tag.style.textShadow = 'none';
    
    // 不再使用随机旋转，保持所有标签水平
    const rotation = 0;
    
    // 尝试找到一个不重叠的位置
    let placed = false;
    let attempts = 0;
    let x, y, angle, radius;
    
    // 计算标签尺寸
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.fontSize = `${fontSize}rem`;
    tempDiv.style.padding = '0.3em 0.5em';
    tempDiv.style.whiteSpace = 'nowrap';
    tempDiv.textContent = tag.textContent;
    document.body.appendChild(tempDiv);
    const width = tempDiv.offsetWidth;
    const height = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv);
    
    // 重要标签优先放在中心区域
    const startRadius = importance > 0.7 ? 0 : maxRadius * 0.3;
    
    while (!placed && attempts < 100) {
      // 使用改进的螺旋分布算法
      angle = index * (Math.PI * (3 - Math.sqrt(5))) + (Math.random() * 0.3);
      radius = startRadius + (attempts / 100) * (maxRadius - startRadius);
      
      // 计算位置，重要标签更靠近中心，提高重要性因子的影响
      x = centerX + radius * Math.cos(angle) * (1 - importance * 0.4);
      y = centerY + radius * Math.sin(angle) * (1 - importance * 0.4);
      
      // 检查是否超出容器边界
      if (x - width/2 < 0) x = width/2;
      if (x + width/2 > containerWidth) x = containerWidth - width/2;
      if (y - height/2 < 0) y = height/2;
      if (y + height/2 > containerHeight) y = containerHeight - height/2;
      
      // 检查碰撞
      if (!checkCollision(x - width/2, y - height/2, width, height)) {
        placed = true;
        placedTags.push({
          x: x - width/2,
          y: y - height/2,
          width: width,
          height: height
        });
      }
      
      attempts++;
      
      // 在移动设备上减少尝试次数，提高性能
      if (isMobile && attempts > 50) break;
    }
    
    // 如果尝试多次仍无法放置，则强制放置
    if (!placed) {
      x = Math.random() * (containerWidth - width);
      y = Math.random() * (containerHeight - height);
    }
    
    // 应用位置和旋转
    tag.style.left = `${x}px`;
    tag.style.top = `${y}px`;
    tag.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    
    // 添加优雅的悬停效果
    tag.onmouseover = function() {
      this.style.transform = `translate(-50%, -50%) scale(1.1)`;
      this.style.zIndex = '100';
      this.style.opacity = '1';
      this.style.color = '#ffffff';
      this.style.background = color;
      this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      this.style.transition = 'all 0.3s ease';
    };
    
    tag.onmouseout = function() {
      this.style.transform = `translate(-50%, -50%)`;
      this.style.zIndex = '';
      this.style.opacity = '0.9';
      this.style.color = color;
      this.style.background = 'rgba(255, 255, 255, 0.5)';
      this.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
      this.style.transition = 'all 0.3s ease';
    };
  });
  }
  
  // 初始化标签云
  initTagCloud();
  
  // 监听窗口大小变化，重新布局标签云
  let resizeTimeout;
  window.addEventListener('resize', function() {
    // 清除之前的定时器，防止频繁触发
    clearTimeout(resizeTimeout);
    
    // 设置新的定时器，延迟执行重新布局
    resizeTimeout = setTimeout(function() {
      // 清除所有标签的样式和事件
      tagData.forEach(tagInfo => {
        const tag = tagInfo.element;
        tag.removeAttribute('style');
        tag.onmouseover = null;
        tag.onmouseout = null;
      });
      
      // 重置标签云容器
      tagCloud.style = '';
      tagCloud.style.display = 'block';
      tagCloud.style.position = 'relative';
      tagCloud.style.width = '100%';
      tagCloud.style.height = '100%';
      
      // 重新初始化标签云
      initTagCloud();
    }, 300);
  });
  
  // 初始化时检查设备方向变化（对移动设备特别重要）
  window.addEventListener('orientationchange', function() {
    // 延迟执行以确保方向变化完成
    setTimeout(function() {
      // 清除所有标签的样式和事件
      tagData.forEach(tagInfo => {
        const tag = tagInfo.element;
        tag.removeAttribute('style');
        tag.onmouseover = null;
        tag.onmouseout = null;
      });
      
      // 重置标签云容器
      tagCloud.style = '';
      tagCloud.style.display = 'block';
      tagCloud.style.position = 'relative';
      tagCloud.style.width = '100%';
      tagCloud.style.height = '100%';
      
      // 重新初始化标签云
      initTagCloud();
    }, 500);
  });
});