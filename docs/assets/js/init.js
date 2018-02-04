function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

if((getOS() === 'Android') || (getOS() === 'iOS') || (getOS() === 'Mac OS')){
  alert(`Hey ${getOS()} user! We don't have made software for your plateform. i.e(${getOS()})`)
}else{
  setTimeout(() => {
    $("#preloader").addClass("hidden");
    $("#mainContent").removeClass("hidden");
  },2000);
}

/*
----- Smooth Scrolling
*/
// $(document).ready(function(){
//   $('a[href^="#"]').on('click',function (e) {
//       e.preventDefault();

//       var target = this.hash;
//       var $target = $(target);
//       $(".active").removeClass("active");      
//       $(this).closest('li').addClass("active");
//       $('html, body').stop().animate({
//           'scrollTop': $target.offset().top
//       }, 900, 'swing', function () {
//           window.location.hash = target;
//       });
//   });
// });

// Select all links with hashes
$('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    /* if ($target.is(":focus")) { // Checking if the target was focused
                       return false;
                     } else {
                       $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                       $target.focus(); // Set focus again
                     };*/
                });
            }
        }
    });

/*
----- Slider
*/

$(document).ready(function(){
  $('.slider').slider();
});
