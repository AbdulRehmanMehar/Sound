$(document).ready(() => {
  setTimeout(() => {
    // $("body").removeClass("not-loaded");
    $(".maindiv").removeClass("display-none");
    $(".main-meta").addClass("display-none");
  },2000);

  $("#btntoggle").click(() => {
    if( $("#btntoggle i").is(".not-clicked") ){
      $("#btntoggle i").removeClass("not-clicked");
      $("#btntoggle i").removeClass("fa-bars");
      $("#btntoggle i").addClass("fa-times");
      $("#btntoggle i").addClass("clicked");

    }else{
      $("#btntoggle i").removeClass("clicked");
      $("#btntoggle i").removeClass("fa-times");
      $("#btntoggle i").addClass("fa-bars");
      $("#btntoggle i").addClass("not-clicked");
    }
  });

});
