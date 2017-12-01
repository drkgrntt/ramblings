/* global $ */

// FOR CATEGORY SELECTOR IN /BLOGS/ALL
$('select').on('change', () => {
  let value = $('select option:selected').val();
  $('.ui.grid').html('');
  $.get('/blogs/all', (blogs) => {
    blogs.forEach((blog) => {
      // if 'all', render all blogs
      if (value === 'All') {
        $('.ui.grid').append(`
      
          <div class="four wide column ${blog.category}">
            <div class="ui segment">
              <h2 class="header"><a href="/blogs/${blog._id}">${blog.title}</a></h2>
              <div class="ui medium image">
                <img class="allBlogs" src="${blog.image}">
              </div>
            </div>
          </div>

        `);
        
      // render blogs by their category
      } else if (blog.category === value) {

        $('.ui.grid').append(`
      
          <div class="four wide column ${blog.category}">
            <div class="ui segment">
              <h2 class="header"><a href="/blogs/${blog._id}">${blog.title}</a></h2>
              <div class="ui medium image">
                <img class="allBlogs" src="${blog.image}">
              </div>
            </div>
          </div>

        `);
      }
    });
  });
});
