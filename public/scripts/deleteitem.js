$(".managerdeletebtn").on("click", function() {
	console.log('fck');
  var id = $(this).attr('id');
  var itemid = id.substring(9);
  console.log(itemid);
  $('#hiddenconfirm'+itemid).toggle();
});

$(".canceldelete").on("click", function() {
  var id = $(this).attr('id');
  var itemid = id.substring(12);
  $('#hiddenconfirm'+itemid).css('display','none');
});

$(".managereditbtn").on("click", function() {
  var id = $(this).attr('id');
  var itemid = id.substring(8);
  console.log('clicked'+itemid);
  //console.log(itemid);
  //$('#hiddenconfirm'+itemid).css('display','inline-block');
  $('#hiddenitem'+itemid).toggle();
});

$(".editcancel").on("click", function() {
  var id = $(this).attr('id');
  var itemid = id.substring(10);
  //console.log(itemid);
  //$('#hiddenconfirm'+itemid).css('display','inline-block');
  $('#hiddenitem'+itemid).toggle();
});