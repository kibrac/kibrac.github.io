/**
 * 目录和回到顶部按钮功能
 */

document.addEventListener('DOMContentLoaded', function() {
  // 只在文章页面执行
  const postContent = document.querySelector('.post-content');
  if (!postContent) return;
  
  // 创建目录容器
  createTableOfContents();
  
  // 创建回到顶部按钮
  createBackToTopButton();
  
  // 监听滚动事件
  handleScrollEvents();
});

/**
 * 创建文章目录
 */
function createTableOfContents() {
  const postContent = document.querySelector('.post-content');
  const headings = postContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  // 如果没有标题，不创建目录
  if (headings.length === 0) return;
  
  // 获取侧边栏容器
  const tocSidebar = document.getElementById('toc-sidebar');
  if (!tocSidebar) return;
  
  // 创建目录标题
  const tocHeader = document.createElement('div');
  tocHeader.className = 'toc-header';
  tocHeader.innerHTML = '<span>目录</span>';
  tocSidebar.appendChild(tocHeader);
  
  // 创建目录列表
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';
  
  // 为每个标题添加ID并创建目录项
  headings.forEach((heading, index) => {
    // 为没有id的标题添加id
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    
    // 获取标题级别
    const level = parseInt(heading.tagName.charAt(1));
    
    // 创建目录项
    const listItem = document.createElement('li');
    listItem.className = `toc-item toc-h${level}`;
    
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.setAttribute('data-target', heading.id);
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    listItem.appendChild(link);
    tocList.appendChild(listItem);
  });
  
  tocSidebar.appendChild(tocList);
}

/**
 * 创建回到顶部按钮
 */
function createBackToTopButton() {
  const backToTopButton = document.createElement('button');
  backToTopButton.className = 'back-to-top';
  backToTopButton.setAttribute('aria-label', '回到顶部');
  backToTopButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  
  // 添加点击事件
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // 添加到页面
  document.body.appendChild(backToTopButton);
}

/**
 * 处理滚动事件
 */
function handleScrollEvents() {
  const backToTopButton = document.querySelector('.back-to-top');
  const tocItems = document.querySelectorAll('.toc-item a');
  const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6');
  
  // 初始状态隐藏回到顶部按钮
  backToTopButton.classList.add('hidden');
  
  // 监听滚动事件
  window.addEventListener('scroll', function() {
    // 显示/隐藏回到顶部按钮
    if (window.scrollY > 300) {
      backToTopButton.classList.remove('hidden');
    } else {
      backToTopButton.classList.add('hidden');
    }
    
    // 更新目录高亮
    if (headings.length > 0 && tocItems.length > 0) {
      updateTocHighlight();
    }
  });
}

/**
 * 更新目录高亮
 */
function updateTocHighlight() {
  const headings = Array.from(document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6'));
  const tocLinks = document.querySelectorAll('.toc-item a');
  
  // 获取当前滚动位置
  const scrollPosition = window.scrollY + 100; // 添加偏移量以提前高亮
  
  // 找到当前可见的标题
  let currentHeadingIndex = -1;
  
  headings.forEach((heading, index) => {
    if (heading.offsetTop <= scrollPosition) {
      currentHeadingIndex = index;
    }
  });
  
  // 移除所有高亮
  tocLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // 添加当前高亮
  if (currentHeadingIndex >= 0 && currentHeadingIndex < tocLinks.length) {
    tocLinks[currentHeadingIndex].classList.add('active');
  }
}