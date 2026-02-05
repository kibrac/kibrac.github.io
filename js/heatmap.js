// 热力图年份切换功能
document.addEventListener('DOMContentLoaded', function() {
    const heatmapDataElement = document.getElementById('heatmap-data');
    if (!heatmapDataElement) {
        console.error('Heatmap data element not found');
        return;
    }
    
    let heatmapData;
    try {
        heatmapData = JSON.parse(heatmapDataElement.textContent);
    } catch (e) {
        console.error('Failed to parse heatmap data:', e);
        return;
    }
    
    const currentYearSpan = document.querySelector('.current-year');
    const prevYearBtn = document.querySelector('.prev-year');
    const nextYearBtn = document.querySelector('.next-year');
    const heatmapGrid = document.getElementById('heatmap-grid');
    
    if (!currentYearSpan || !prevYearBtn || !nextYearBtn || !heatmapGrid) {
        console.error('Heatmap UI elements not found');
        return;
    }
    
    const years = Object.keys(heatmapData).sort((a, b) => a - b); // 升序排列，便于逻辑处理
    const currentYear = new Date().getFullYear().toString();
    let currentYearIndex = years.indexOf(currentYear);
    
    // 如果当前年份不存在，默认显示最新年份
    if (currentYearIndex === -1) {
        currentYearIndex = years.length - 1;
    }
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    function getIntensity(count) {
        if (count === 0) return 0;
        if (count <= 1) return 1;
        if (count <= 2) return 2;
        if (count <= 4) return 3;
        return 4;
    }
    
    function renderHeatmap(year) {
        const yearData = heatmapData[year] || {};
        heatmapGrid.innerHTML = '';
        
        for (let month = 1; month <= 12; month++) {
            const monthKey = month.toString().padStart(2, '0');
            const count = yearData[monthKey] || 0;
            const intensity = getIntensity(count);
            const monthName = monthNames[month - 1];
            
            const cell = document.createElement('div');
            cell.className = `heatmap-cell intensity-${intensity}`;
            cell.setAttribute('data-month', monthName);
            cell.setAttribute('data-count', count);
            cell.setAttribute('data-year', year);
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('aria-label', `${monthName} ${year}: ${count} posts`);
            
            cell.innerHTML = `
                <span class="month-label">${monthName}</span>
                <div class="heatmap-tooltip">
                    ${monthName} ${year}: ${count} ${count === 1 ? 'post' : 'posts'}
                </div>
            `;
            
            heatmapGrid.appendChild(cell);
        }
    }
    
    function updateYear() {
        const year = years[currentYearIndex];
        currentYearSpan.textContent = year;
        renderHeatmap(year);
        
        // 更新按钮状态：左按钮是之前的年份，右按钮是之后的年份
        prevYearBtn.disabled = currentYearIndex === 0; // 已经是最早年份
        nextYearBtn.disabled = currentYearIndex === years.length - 1; // 已经是最新年份
    }
    
    // 事件监听器
    prevYearBtn.addEventListener('click', function() {
        // 左翻页：切换到之前的年份（索引减1）
        if (currentYearIndex > 0) {
            currentYearIndex--;
            updateYear();
        }
    });
    
    nextYearBtn.addEventListener('click', function() {
        // 右翻页：切换到之后的年份（索引加1）
        if (currentYearIndex < years.length - 1) {
            currentYearIndex++;
            updateYear();
        }
    });
    
    // 键盘支持
    prevYearBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    nextYearBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // 初始化
    if (years.length > 0) {
        updateYear();
    }
});