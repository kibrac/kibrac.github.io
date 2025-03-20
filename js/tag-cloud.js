// Tag Cloud Enhancement Script

document.addEventListener('DOMContentLoaded', function() {
  // 获取所有标签云项目
  const tagItems = document.querySelectorAll('.tag-cloud-item');
  
  // 定义一组柔和的颜色
  const colors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#d35400', '#34495e', '#16a085', '#27ae60',
    '#2980b9', '#8e44ad', '#f1c40f', '#e67e22', '#c0392b',
    '#7f8c8d', '#2c3e50'
  ];
  
  // 为每个标签分配随机颜色
  tagItems.forEach(tag => {
    // 获取随机颜色
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // 设置标签的背景色和文字颜色
    tag.style.backgroundColor = randomColor;
    tag.style.color = '#ffffff';
    
    // 添加悬停效果
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) rotate(2deg)';
      this.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '0 2px 5px var(--shadow-color)';
    });
  });
});