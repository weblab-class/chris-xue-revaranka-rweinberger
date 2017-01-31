$("#scrolltoabout").click(function() {
  console.log(":(((((");
  $('#about').css('display', 'block');
  $('html, body').animate({
      scrollTop: $("#about").offset().top
  }, 1500);
});

$("#closeabout").click(function() {
  $('html, body').animate({
      scrollTop: 0
  }, 1500);

  setTimeout( function(){
    $('#about').css('display', 'none'); 
  }  , 1501 );   


  // $('#about')
  // .delay(1501)
  // .queue(function (next) { 
  //   $(this).css('display', 'none'); 
  //   next(); 
  // });
  // $('#about').css('display', 'none').delay(1501);
});

$(".twobuttonsfog").click(function() {
  console.log('hi');
  $('.modal-content').animate({
      scrollTop: 0
  }, 800);
});