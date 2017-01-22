$('#sort').on('change', function() {
  var sort = $(this).val();
  console.log(sort);
  $.ajax({url:'/sort', type: 'POST', data: {
    sort: sort
    }, success: function(data) {
      window.location.href = data
    }
  });
})