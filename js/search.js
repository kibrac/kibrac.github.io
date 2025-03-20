// PointFive Theme Search JavaScript

document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  const searchResultsList = document.querySelector('.search-results-list');
  
  if (searchForm && searchInput && searchResults && searchResultsList) {
    // Load search index
    let searchIndex = [];
    let searchData = {};
    
    // Fetch search index JSON file
    fetch('/index.json')
      .then(response => response.json())
      .then(data => {
        searchData = data;
        searchIndex = data.map(item => {
          return {
            title: item.title,
            content: item.content,
            url: item.permalink
          };
        });
      })
      .catch(error => console.error('Error loading search index:', error));
    
    // Search form submit handler
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      
      if (query.length < 2) {
        return;
      }
      
      // Perform search
      const results = searchIndex.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const contentMatch = item.content.toLowerCase().includes(query);
        return titleMatch || contentMatch;
      });
      
      // Display results
      displayResults(results, query);
    });
    
    // Display search results
    function displayResults(results, query) {
      // Clear previous results
      searchResultsList.innerHTML = '';
      
      if (results.length === 0) {
        searchResultsList.innerHTML = `<p>没有找到与 "${query}" 相关的结果</p>`;
      } else {
        results.forEach(item => {
          const resultItem = document.createElement('div');
          resultItem.className = 'search-result-item';
          
          // Highlight the query in the title
          let title = item.title;
          const titleRegExp = new RegExp(query, 'gi');
          title = title.replace(titleRegExp, match => `<mark>${match}</mark>`);
          
          // Create a snippet from content with the query highlighted
          let content = item.content;
          const contentRegExp = new RegExp(query, 'gi');
          
          // Find the position of the first match
          const matchPosition = content.toLowerCase().indexOf(query.toLowerCase());
          let snippet = '';
          
          if (matchPosition !== -1) {
            // Create a snippet around the match
            const start = Math.max(0, matchPosition - 50);
            const end = Math.min(content.length, matchPosition + query.length + 50);
            snippet = content.substring(start, end);
            
            // Add ellipsis if needed
            if (start > 0) snippet = '...' + snippet;
            if (end < content.length) snippet = snippet + '...';
            
            // Highlight the query
            snippet = snippet.replace(contentRegExp, match => `<mark>${match}</mark>`);
          } else {
            // If no match in content (might be in title only), show the beginning
            snippet = content.substring(0, 100) + '...';
          }
          
          resultItem.innerHTML = `
            <h3 class="result-title"><a href="${item.url}">${title}</a></h3>
            <div class="result-snippet">${snippet}</div>
          `;
          
          searchResultsList.appendChild(resultItem);
        });
      }
      
      // Show results container
      searchResults.style.display = 'block';
    }
  }
});