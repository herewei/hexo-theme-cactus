/**
 * Filter posts by language
 * @description Filter posts based on current language context
 */
// Make it chainable like Hexo posts object
function makeChainable(arr) {
  arr.each = function(callback) {
    this.forEach(callback);
    return this;
  };
  arr.sort = function(field, order) {
    var sorted = this.slice();
    sorted.sort(function(a, b) {
      var valA = a[field] || '';
      var valB = b[field] || '';
      if (order === 'desc') {
        return valA < valB ? 1 : -1;
      }
      return valA > valB ? 1 : -1;
    });
    return makeChainable(sorted);
  };
  arr.limit = function(count) {
    return makeChainable(this.slice(0, count));
  };
  return arr;
}

hexo.extend.helper.register("filter_posts_by_lang", function (posts, lang) {
  var result = [];
  
  if (!posts || !posts.forEach) {
    return makeChainable(result);
  }
  
  posts.forEach(function(post) {
    var postPath = post.path || '';
    
    // 中文文章路径包含 /zh/，英文不包含
    var hasZhPath = postPath.indexOf('/zh/') !== -1;
    
    if (lang === 'zh') {
      if (hasZhPath) result.push(post);
    } else {
      if (!hasZhPath) result.push(post);
    }
  });
  
  return makeChainable(result);
});

/**
 * Get current language from page path
 * @description Determine current language based on page path
 * @example
 *     <%- get_current_lang() %>
 */
hexo.extend.helper.register("get_current_lang", function () {
  var path = this.page.path || '';
  return path.indexOf('zh/') === 0 ? 'zh' : 'en';
});
