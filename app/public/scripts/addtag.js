var tags = [];

$("#addtag").on("click", function() {
  var text = $("#inserttag").val();
  var id = Math.floor((Math.random() * 100000) + 1);
  tags.push(text);
  $("#tags").append(
    "<div class='tag' id='tag"+id+"'><div class='tagtext' id='tagtext"+id+"'>"
    +text+
    "</div>&#32;<button id='closetag"
    +id+
    "' class='closetag' type='button'>&#10005;</button></div>");
  console.log("tags: "+tags);
});

$(document).on('click', ".closetag", function() {
  var id = $(this).attr('id');
  var idnum = id.substring(8);
  var tagtext = $("#tagtext"+idnum).text();
  var index = tags.indexOf(tagtext);
  tags.splice(index,1);
  console.log('closing tag '+idnum);
  $("#tag"+idnum).remove();
  console.log("tag removed: "+tagtext);
  console.log("new tag array: "+ tags);
});

$('#submititem').on('click', function(){
  console.log(tags);
  $.ajax({url:'/uploaditem', type: 'POST', data: {
    itemname:$('#itemname').val(),
    price:$('#price').val(),
    description:$('#description').val(),
    tags:tags,}, success: function(data) {
      window.location.href = data
    }
  });
})
