$("#addtag").on("click", function() {
  var text = $("#inserttag").val();
  var id = Math.floor((Math.random() * 100000) + 1);
  $("#tags").append(
    "<div class='tag' id='tag" + id+"'>"
    +text+
    "&#32;<button id='closetag"
    +id+
    "' class='closetag' type='button'>&#10005;</button></div>");
});

$(document).on('click', ".closetag", function() {
  console.log('hi');
  var id = $(this).attr('id');
  var idnum = id.substring(8)
  console.log('closing id #tag'+id);
  $("#tag"+idnum).remove();
  console.log("did it work");
});
