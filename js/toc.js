// 文章目录自动生成功能
document.addEventListener('DOMContentLoaded', () => {
    // 获取文章内容区域
    const postContent = document.querySelector('.post-content');
    const tocContainer = document.querySelector('.table-of-contents');
    
    // 如果不存在文章内容或目录容器，则退出
    if (!postContent || !tocContainer) return;
    
    // 获取所有标题元素
    const headings = postContent.querySelectorAll('h2, h3, h4, h5, h6');
    
    // 如果没有标题，则隐藏目录容器
    if (headings.length === 0) {
        tocContainer.style.display = 'none';
        return;
    }
    
    // 创建目录列表
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    // 为每个标题创建目录项
    headings.forEach((heading, index) => {
        // 为每个标题添加ID，如果没有的话
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        // 创建目录项
        const listItem = document.createElement('li');
        listItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
        
        // 创建链接
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        
        // 添加点击事件，平滑滚动到对应标题
        link.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        });
        
        // 将链接添加到目录项
        listItem.appendChild(link);
        
        // 将目录项添加到目录列表
        tocList.appendChild(listItem);
    });
    
    // 将目录列表添加到目录容器
    tocContainer.appendChild(tocList);
    
    // 显示目录容器
    tocContainer.style.display = 'block';
    
    // 添加目录固定效果
    const tocOffset = tocContainer.offsetTop;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > tocOffset) {
            tocContainer.classList.add('toc-fixed');
        } else {
            tocContainer.classList.remove('toc-fixed');
        }
    });
});

// 增强Markdown渲染
document.addEventListener('DOMContentLoaded', () => {
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;
    
    // 为代码块添加语法高亮
    const codeBlocks = postContent.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // 添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = '复制';
        
        copyButton.addEventListener('click', () => {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.textContent = '已复制!';
                setTimeout(() => {
                    copyButton.textContent = '复制';
                }, 2000);
            });
        });
        
        // 将复制按钮添加到代码块的父元素
        const pre = block.parentNode;
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
    });
    
    // 为图片添加点击放大效果
    const images = postContent.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            
            const imgClone = img.cloneNode();
            imgClone.className = 'enlarged-image';
            
            overlay.appendChild(imgClone);
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
        });
        
        // 添加可点击的样式
        img.style.cursor = 'zoom-in';
    });
});