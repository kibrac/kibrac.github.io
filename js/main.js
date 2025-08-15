document.addEventListener('DOMContentLoaded', () => {
  // Sticky header
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 10) { // A small threshold
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

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

  // Code block copy button
  const copyButtons = document.querySelectorAll('.copy-code-button');
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const wrapper = button.closest('.code-block-wrapper');
      const code = wrapper.querySelector('.highlight');
      if (!code) return;

      const textToCopy = code.innerText;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const copyText = button.querySelector('.copy-text');
        const copiedText = button.querySelector('.copied-text');
        
        if (copyText && copiedText) {
            copyText.style.display = 'none';
            copiedText.style.display = 'inline';

            setTimeout(() => {
              copyText.style.display = 'inline';
              copiedText.style.display = 'none';
            }, 2000);
        }
      }).catch(err => {
        console.error('Failed to copy code: ', err);
      });
    });
  });

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
});