// 代码块增强脚本

document.addEventListener('DOMContentLoaded', function() {
  // 获取所有代码块
  const codeBlocks = document.querySelectorAll('pre code');
  
  // 处理每个代码块
  codeBlocks.forEach(function(codeBlock, index) {
    // 获取父元素 pre
    const preBlock = codeBlock.parentNode;
    
    // 为每个代码块添加唯一ID
    const codeId = `code-block-${index}`;
    codeBlock.id = codeId;
    
    // 创建代码块容器
    const codeContainer = document.createElement('div');
    codeContainer.className = 'code-block-container';
    
    // 创建代码块头部
    const codeHeader = document.createElement('div');
    codeHeader.className = 'code-block-header';
    
    // 获取代码语言
    let language = '';
    const classList = codeBlock.className.split(' ');
    for (let i = 0; i < classList.length; i++) {
      if (classList[i].startsWith('language-')) {
        language = classList[i].replace('language-', '');
        break;
      }
    }
    
    // 创建语言标签
    if (language) {
      const languageTag = document.createElement('span');
      languageTag.className = 'code-language';
      languageTag.textContent = language;
      codeHeader.appendChild(languageTag);
    }
    
    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
    copyButton.setAttribute('aria-label', '复制代码');
    copyButton.setAttribute('data-code-id', codeId);
    codeHeader.appendChild(copyButton);
    
    // 将原始的pre元素包装在新容器中
    preBlock.parentNode.insertBefore(codeContainer, preBlock);
    codeContainer.appendChild(codeHeader);
    codeContainer.appendChild(preBlock);
    
    // 添加复制功能
    copyButton.addEventListener('click', function() {
      const codeId = this.getAttribute('data-code-id');
      const codeElement = document.getElementById(codeId);
      const codeText = codeElement.textContent;
      
      // 复制到剪贴板
      navigator.clipboard.writeText(codeText).then(function() {
        // 复制成功，更改按钮状态
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        copyButton.classList.add('copied');
        
        // 2秒后恢复按钮状态
        setTimeout(function() {
          copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
          copyButton.classList.remove('copied');
        }, 2000);
      }).catch(function(error) {
        console.error('复制失败:', error);
      });
    });
    
    // 添加行号
    if (codeBlock.textContent.trim().split('\n').length > 1) {
      const codeLines = codeBlock.innerHTML.split('\n');
      let lineNumbersHTML = '';
      let codeHTML = '';
      
      codeLines.forEach(function(line, lineIndex) {
        if (lineIndex === codeLines.length - 1 && line.trim() === '') return;
        lineNumbersHTML += `<span class="line-number">${lineIndex + 1}</span>`;
        codeHTML += `<span class="code-line">${line}</span>` + (lineIndex < codeLines.length - 1 ? '\n' : '');
      });
      
      const lineNumbersContainer = document.createElement('div');
      lineNumbersContainer.className = 'line-numbers';
      lineNumbersContainer.innerHTML = lineNumbersHTML;
      
      preBlock.classList.add('has-line-numbers');
      preBlock.insertBefore(lineNumbersContainer, codeBlock);
      codeBlock.innerHTML = codeHTML;
    }
  });
});