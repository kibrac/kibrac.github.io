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
    if (window.innerWidth <= 768) {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'flex';
    }
    
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      const isExpanded = menu.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      
      // 明确设置display属性，解决样式优先级问题
      if (isExpanded) {
        menu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      } else {
        menu.style.display = 'none';
        document.body.style.overflow = '';
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
});