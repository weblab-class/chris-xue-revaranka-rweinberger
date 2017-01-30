$("#scrolltoabout").click(function() {
  $('html, body').animate({
      scrollTop: $("#about").offset().top
  }, 1500);
});

$(".twobuttonsfog").click(function() {
  console.log('hi');
  $('.modal-content').animate({
      scrollTop: $(".twobuttonsfog").offset().top
  }, 800);
});