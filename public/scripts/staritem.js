$(".star").on("click", function() {
  var blankstarid = $(this).attr('id');
  var itemid = blankstarid.substring(4);
  console.log(itemid);
  $(this).html("&#9733;");
  $.ajax({url:'/star', type: 'POST', data: {
    id: itemid
    }, success: function(data) {
      console.log('item '+itemid)
      window.location.href = data
    }
  });
});