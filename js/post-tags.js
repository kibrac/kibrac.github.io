// 处理文章列表中标签的点击功能
document.addEventListener('DOMContentLoaded', function() {
    // 为每个标签添加点击事件
    document.querySelectorAll('.post-tag').forEach(function(tag) {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const tagText = this.textContent.trim();
            const article = this.closest('.post-item-masonry');
            const tagLink = article.querySelector(`.post-tag-link[data-tag="${tagText}"]`);
            
            if (tagLink) {
                window.location.href = tagLink.href;
            }
        });
    });
});