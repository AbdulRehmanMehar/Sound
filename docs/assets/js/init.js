setTimeout(() => {
  $("#preloader").addClass("hidden");
  $("#mainContent").removeClass("hidden");
},2000);

/*
----- Smooth Scrolling
*/
$(document).ready(function(){
  $('a[href^="#"]').on('click',function (e) {
      e.preventDefault();

      var target = this.hash;
      var $target = $(target);
      $(".active").removeClass("active");      
      $(this).closest('li').addClass("active");
      $('html, body').stop().animate({
          'scrollTop': $target.offset().top
      }, 900, 'swing', function () {
          window.location.hash = target;
      });
  });
});

/*
----- Slider
*/

$(document).ready(function(){
  $('.slider').slider();
});
