$(document).ready(function() {
 
  $(".post_img").fancybox({
      openEffect	: 'none',
      closeEffect	: 'none',
      type: "image",
      helpers : {
          title : {
              type : 'over'
          }
      }
  });

  var container = document.querySelector('.container');
  var mixer = mixitup(container);
  
});

