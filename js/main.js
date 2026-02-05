document.addEventListener('DOMContentLoaded', () => {

  // First visit animation control
  const FIRST_VISIT_KEY = 'kiro-first-visit';
  const isFirstVisit = !localStorage.getItem(FIRST_VISIT_KEY);
  
  if (isFirstVisit) {
    document.body.classList.add('first-visit');
    localStorage.setItem(FIRST_VISIT_KEY, 'false');
  }

  // Debug function to reset first visit (for testing)
  // You can call resetFirstVisit() in browser console to test the animation again
  window.resetFirstVisit = function() {
    localStorage.removeItem(FIRST_VISIT_KEY);
    location.reload();
  };

  // Back to top button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Code block copy button functionality
  function initCodeCopyButtons() {
    // Remove existing copy buttons to avoid duplicates
    document.querySelectorAll('.copy-code-button').forEach(btn => btn.remove());
    
    // Add copy buttons to all code blocks
    document.querySelectorAll('.code-block-wrapper .highlight').forEach(codeBlock => {
      const wrapper = codeBlock.closest('.code-block-wrapper');
      if (!wrapper || wrapper.querySelector('.copy-code-button')) return;
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-code-button';
      copyButton.innerHTML = '<span class="copy-text">Copy</span><span class="copied-text" style="display: none;">Copied!</span>';
      
      wrapper.appendChild(copyButton);
      
      copyButton.addEventListener('click', async () => {
        try {
          const textToCopy = codeBlock.innerText || codeBlock.textContent;
          await navigator.clipboard.writeText(textToCopy);
          
          const copyText = copyButton.querySelector('.copy-text');
          const copiedText = copyButton.querySelector('.copied-text');
          
          if (copyText && copiedText) {
            copyText.style.display = 'none';
            copiedText.style.display = 'inline';
            
            setTimeout(() => {
              copyText.style.display = 'inline';
              copiedText.style.display = 'none';
            }, 2000);
          }
        } catch (err) {
          console.error('Failed to copy code: ', err);
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = codeBlock.innerText || codeBlock.textContent;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
              copyButton.innerHTML = '<span class="copy-text">Copy</span><span class="copied-text" style="display: none;">Copied!</span>';
            }, 2000);
          } catch (fallbackErr) {
            console.error('Fallback copy failed: ', fallbackErr);
          }
          document.body.removeChild(textArea);
        }
      });
    });
  }

  // Initialize copy buttons
  initCodeCopyButtons();

  // Collapsible code blocks
  const codeBlocks = document.querySelectorAll('.code-block-wrapper');
  const COLLAPSE_THRESHOLD = 300; // Corresponds to max-height in CSS

  codeBlocks.forEach(wrapper => {
    const highlight = wrapper.querySelector('.highlight');
    if (highlight && highlight.scrollHeight > COLLAPSE_THRESHOLD) {
      wrapper.classList.add('is-collapsible');

      const expandButton = document.createElement('button');
      expandButton.className = 'expand-code-button';
      expandButton.textContent = 'Expand Code';
      wrapper.appendChild(expandButton);

      expandButton.addEventListener('click', () => {
        wrapper.classList.toggle('is-expanded');
        if (wrapper.classList.contains('is-expanded')) {
          expandButton.textContent = 'Collapse Code';
        } else {
          expandButton.textContent = 'Expand Code';
        }
      });
    }
  });

  // Re-initialize copy buttons if content is dynamically loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        const hasCodeBlocks = Array.from(mutation.addedNodes).some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          (node.querySelector && node.querySelector('.highlight'))
        );
        if (hasCodeBlocks) {
          setTimeout(initCodeCopyButtons, 100);
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});