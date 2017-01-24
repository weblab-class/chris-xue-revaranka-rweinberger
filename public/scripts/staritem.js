$(".blankstar").on("click", function() {
  $(this).removeClass('blankstar');
  $(this).addClass('star');
  console.log($(this).attr('class'));
  var blankstarid = $(this).attr('id');
  var itemid = blankstarid.substring(9);
  console.log('starring '+itemid);
  $(this).html("&#9733;");
  $.ajax({url:'/star', type: 'POST', data: {
    id: itemid
    }, success: function(data) {
      window.location.href = data
    }
  });
});

$(".star").on("click", function() {
  $(this).removeClass('star');
  $(this).addClass('blankstar');
  console.log($(this).attr('class'));
  var starid = $(this).attr('id');
  var itemid = starid.substring(4);
  console.log('unstarring '+itemid);
  $(this).html("&#9734;");
  $.ajax({url:'/unstar', type: 'POST', data: {
    id: itemid
    }, success: function(data) {
      window.location.href = data
    }
  });
});