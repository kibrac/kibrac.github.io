/**
 * 文章目录生成脚本
 * 用于解析文章内容中的标题，并生成可点击的目录
 */

document.addEventListener('DOMContentLoaded', function() {
  // 检查是否在文章页面
  const articleContent = document.querySelector('.post-content');
  const tocContainer = document.querySelector('.post-toc-container');
  
  if (!articleContent || !tocContainer) return;
  
  // 获取文章中的所有标题元素 (h2-h6)
  const headings = articleContent.querySelectorAll('h2, h3, h4, h5, h6');
  
  if (headings.length === 0) {
    tocContainer.style.display = 'none';
    return;
  }
  
  // 创建目录结构
  const tocTitle = document.createElement('h2');
  tocTitle.className = 'post-toc-title';
  tocTitle.textContent = '文章目录';
  
  const tocList = document.createElement('ul');
  tocList.className = 'post-toc-list';
  
  // 为每个标题创建目录项
  headings.forEach((heading, index) => {
    // 为每个标题添加ID，用于锚点跳转
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    
    // 创建目录项
    const tocItem = document.createElement('li');
    tocItem.className = `post-toc-item toc-level-${heading.tagName.toLowerCase()}`;
    
    const tocLink = document.createElement('a');
    tocLink.href = `#${heading.id}`;
    tocLink.textContent = heading.textContent;
    
    tocItem.appendChild(tocLink);
    tocList.appendChild(tocItem);
    
    // 添加点击事件，平滑滚动到对应标题
    tocLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetHeading = document.querySelector(this.getAttribute('href'));
      if (targetHeading) {
        window.scrollTo({
          top: targetHeading.offsetTop - 20,
          behavior: 'smooth'
        });
        
        // 更新URL，但不滚动（已经手动滚动了）
        history.pushState(null, null, this.getAttribute('href'));
      }
    });
  });
  
  // 将目录添加到容器中
  const tocElement = document.createElement('div');
  tocElement.className = 'post-toc';
  tocElement.appendChild(tocTitle);
  tocElement.appendChild(tocList);
  tocContainer.appendChild(tocElement);
  
  // 滚动时高亮当前可见的标题
  window.addEventListener('scroll', function() {
    // 获取当前滚动位置
    const scrollPosition = window.scrollY;
    
    // 找到当前可见的标题
    let currentHeading = null;
    
    // 反向遍历标题，找到第一个在视口上方的标题
    for (let i = headings.length - 1; i >= 0; i--) {
      if (headings[i].offsetTop - 80 <= scrollPosition) {
        currentHeading = headings[i];
        break;
      }
    }
    
    // 移除所有高亮
    const tocLinks = tocList.querySelectorAll('a');
    tocLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // 高亮当前标题
    if (currentHeading) {
      const currentLink = tocList.querySelector(`a[href="#${currentHeading.id}"]`);
      if (currentLink) {
        currentLink.classList.add('active');
        
        // 确保当前活动项在目录可视区域内
        const tocElement = document.querySelector('.post-toc');
        if (tocElement) {
          const linkTop = currentLink.offsetTop;
          const tocHeight = tocElement.clientHeight;
          const scrollTop = tocElement.scrollTop;
          
          // 如果当前项不在可视区域，则滚动目录
          if (linkTop < scrollTop || linkTop > scrollTop + tocHeight - 30) {
            tocElement.scrollTop = linkTop - tocHeight / 2;
          }
        }
      }
    }
  });
});