$(".managerdeletebtn").on("click", function() {
  var id = $(this).attr('id');
  var itemid = id.substring(9);
  console.log(itemid);
  $('#hiddenconfirm'+itemid).css('display','inline-block');
});

$(".canceldelete").on("click", function() {
  var id = $(this).attr('id');
  var itemid = id.substring(12);
  $('#hiddenconfirm'+itemid).css('display','none');
});
