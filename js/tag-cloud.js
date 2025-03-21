/**
 * 文字云标签效果脚本
 * 实现更自然、随机的文字云布局
 */
document.addEventListener('DOMContentLoaded', function() {
  // 获取标签云容器和所有标签
  const container = document.querySelector('.tags-cloud-container');
  const tagCloud = document.querySelector('.tag-cloud');
  const tags = document.querySelectorAll('.tag-cloud-item');
  
  if (!container || !tagCloud || tags.length === 0) return;
  
  // 清除现有的flex布局样式
  tagCloud.style.display = 'block';
  tagCloud.style.position = 'relative';
  tagCloud.style.width = '100%';
  tagCloud.style.height = '100%';
  
  // 容器尺寸
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  
  // 设置容器最小高度，确保有足够空间显示所有标签
  container.style.minHeight = `${Math.max(500, tags.length * 15)}px`;
  
  // 文字云布局参数
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const maxRadius = Math.min(containerWidth, containerHeight) * 0.42; // 最大半径
  
  // 文字云颜色方案 - 使用更深、更鲜明的色彩
  const colors = [
    // 深色主色调
    '#4a78a2', '#5b88b2', '#3a6a95', '#2a5a85', '#1a4a75',
    '#4a6b4c', '#5a7b5c', '#3a5b3c', '#2a4b2c', '#1a3b1c',
    '#8a4a3a', '#7a3a2a', '#6a2a1a', '#9a5a4a', '#8a4a3a',
    '#6a3a6a', '#5a2a5a', '#4a1a4a', '#7a4a7a', '#4a2a7a'
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
  
  // 检测位置是否与已放置标签重叠
  function checkCollision(x, y, width, height) {
    const padding = 5; // 标签间距
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
    
    // 根据重要性设置字体大小 - 更大的差异
    const fontSize = 0.8 + importance * 1.2;
    tag.style.fontSize = `${fontSize}rem`;
    
    // 根据重要性选择颜色
    const colorIndex = Math.floor(Math.random() * colors.length);
    const color = colors[colorIndex];
    
    // 设置基本样式
    tag.style.position = 'absolute';
    tag.style.color = color;
    tag.style.fontWeight = 500 + Math.floor(importance * 300);
    tag.style.textDecoration = 'none';
    tag.style.border = 'none';
    tag.style.background = 'rgba(255, 255, 255, 0.1)';
    tag.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    tag.style.padding = '0.4em 0.6em';
    tag.style.borderRadius = '4px';
    tag.style.lineHeight = '1.2';
    tag.style.transition = 'all 0.3s ease';
    tag.style.opacity = '1';
    tag.style.transform = 'rotate(0deg)';
    tag.style.textShadow = '0 1px 1px rgba(0, 0, 0, 0.05)';
    
    // 随机旋转角度 - 仅对次要标签应用
    const rotation = importance < 0.5 ? (Math.random() * 30 - 15) : 0;
    
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
      // 使用螺旋分布 + 随机偏移
      angle = index * (Math.PI * (3 - Math.sqrt(5))) + (Math.random() * 0.5);
      radius = startRadius + (attempts / 100) * (maxRadius - startRadius);
      
      // 计算位置，重要标签更靠近中心
      x = centerX + radius * Math.cos(angle) * (1 - importance * 0.3);
      y = centerY + radius * Math.sin(angle) * (1 - importance * 0.3);
      
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
    
    // 添加更明显的悬停效果
    tag.onmouseover = function() {
      this.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1.15)`;
      this.style.zIndex = '100';
      this.style.opacity = '1';
      this.style.textShadow = '0 0 6px rgba(0, 0, 0, 0.2)';
      this.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.15)';
      this.style.background = 'rgba(255, 255, 255, 0.2)';
      this.style.transition = 'all 0.4s ease';
    };
    
    tag.onmouseout = function() {
      this.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      this.style.zIndex = '';
      this.style.opacity = '1';
      this.style.textShadow = '0 1px 1px rgba(0, 0, 0, 0.05)';
      this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      this.style.background = 'rgba(255, 255, 255, 0.1)';
      this.style.transition = 'all 0.3s ease';
    };
  });
});