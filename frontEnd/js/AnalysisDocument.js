$(document).ready(function(){
  $(".item").click(function(){
    console.log(22);
    var index = $(this).index();
    var top = $(".box").eq(index).offset().top - 106;
    $("html,body").animate({scrollTop:top + "px"});
  });

  const toplist = new Array();
  $(".box").each(function(){
    toplist.push($(this).offset().top - 106);
  })
$(window).scroll(function(){
  var index = getIndex();
  $(".item").each(function(){
    if($(this).index() == index){
      $(this).css("background-color","#00AFD8");
      $(this).css("color","#FFFFFF");
    } else {
      $(this).css("background-color","#FFFFFF");
      $(this).css("color","#0094CB");
      $(this).hover(function(){
        $(this).css("background-color","#00AFD8");
        $(this).css("color","#FFFFFF");
      },function(){
        $(this).css("background-color","#FFFFFF");
        $(this).css("color","#0094CB");
      })
    }
  })
  // $(".item").eq(index).css("background-color","red");
})
function getIndex(){
  var top = $(document).scrollTop();
  for(var i = 0; i < toplist.length - 1; i++){
    if(top >= toplist[i] &&top < toplist[i+1]){
      return i;
    }
  }
  return toplist.length - 1;
}
});
