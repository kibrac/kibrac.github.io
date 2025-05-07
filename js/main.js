// PointFive Theme JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.documentElement.classList.toggle('dark-mode');
      
      // Save preference to localStorage
      if (document.documentElement.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const mainNavigation = document.querySelector('.main-navigation');
  
  if (menuToggle && menu && mainNavigation) {
    // 初始化时检查窗口大小
    const updateMenuState = () => {
      if (window.innerWidth <= 768) {
        menu.style.display = 'none';
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        menu.style.display = 'flex';
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        document.body.style.overflow = '';
      }
    };
    
    // 初始化菜单状态
    updateMenuState();
    
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      const isExpanded = menu.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      
      // 明确设置display属性，解决样式优先级问题
      if (isExpanded) {
        menu.style.display = 'flex';
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        
        // 为菜单项添加延迟动画
        const menuItems = menu.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50 * index);
        });
      } else {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        document.body.style.overflow = '';
        
        // 延迟隐藏菜单，等待过渡动画完成
        setTimeout(() => {
          if (!menu.classList.contains('active')) {
            menu.style.display = 'none';
          }
        }, 300);
      }
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(e) {
      if (!mainNavigation.contains(e.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menu.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
    
    // 点击菜单项后关闭菜单（在移动设备上）
    const menuItems = menu.querySelectorAll('a');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          menu.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          menu.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    });
    
    // 窗口大小变化时处理菜单状态
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menu.style.display = 'flex';
        document.body.style.overflow = '';
      } else if (!menu.classList.contains('active')) {
        menu.style.display = 'none';
      }
    });
    
    // 初始化时检查窗口大小
    if (window.innerWidth > 768) {
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.maxHeight = 'none';
      menu.style.position = 'static';
      menu.style.boxShadow = 'none';
      menu.style.border = 'none';
    }
  }
  
  // Search Toggle
  const searchToggle = document.querySelector('.search-toggle');
  const searchFormContainer = document.querySelector('.search-form-container');
  
  if (searchToggle && searchFormContainer) {
    searchToggle.addEventListener('click', function() {
      const isVisible = searchFormContainer.style.display === 'block';
      searchFormContainer.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(event) {
      if (!searchToggle.contains(event.target) && !searchFormContainer.contains(event.target)) {
        searchFormContainer.style.display = 'none';
      }
    });
  }
  
  // Search Results Close
  const closeSearch = document.querySelector('.close-search');
  const searchResults = document.querySelector('.search-results');
  
  if (closeSearch && searchResults) {
    closeSearch.addEventListener('click', function() {
      searchResults.style.display = 'none';
    });
  }
  
  // Table of Contents Highlight
  const tocLinks = document.querySelectorAll('.toc-content a');
  const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6');
  
  if (tocLinks.length > 0 && headings.length > 0) {
    // 创建Intersection Observer来监视标题元素
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 当标题进入视口
        if (entry.isIntersecting) {
          // 获取当前标题的ID
          const id = entry.target.getAttribute('id');
          
          // 移除所有链接的active类
          tocLinks.forEach(link => {
            link.parentElement.classList.remove('active');
          });
          
          // 为当前标题对应的目录链接添加active类
          const activeLink = document.querySelector(`.toc-content a[href="#${id}"]`);
          if (activeLink) {
            activeLink.parentElement.classList.add('active');
          }
        }
      });
    }, {
      rootMargin: '-100px 0px -80% 0px' // 调整观察区域，使标题在接近顶部时触发
    });
    
    // 观察所有标题元素
    headings.forEach(heading => {
      headingObserver.observe(heading);
    });
    
    // 点击目录链接时平滑滚动
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // 考虑固定头部的高度
            behavior: 'smooth'
          });
        }
      });
    });
  }
});