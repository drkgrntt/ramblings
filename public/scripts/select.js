/* global $ */
/* global blogs */

$('select').on('change', () => {
  let value = $('select option:selected').val();
  console.log('=================');
  console.log(`Value = ${value}.`);
  console.log('=================');
  $('.ui.grid').html('');
  $.get('/blogs/all', (blogs) => {
    blogs.forEach((blog) => {
      if (value === 'All') {
        console.log(blog.title);
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
      } else if (blog.category === value) {
        console.log(blog.title);

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
