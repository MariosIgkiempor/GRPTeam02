function getMethodIndex () {
  var url = location.search
  if (url.indexOf('?') == -1) {
    return 0;
  } else {
    var str = unescape(url.substr(1));
    console.log(str);
    switch (str) {
      case "Self-Organising Map":
          return 0;
        break;
        case "K-Means Clustering":
          return 1;
          break;
      case "Principle Component Analysis":
          return 2;
        break;
      case "Linear Regression":
          return 3;
        break;
      case 'Multi-Layer Perceptron':
          return 4;
        break;
      case "Multiclass Neural Network":
          return 5;
        break;
      case "Random Forest Regression":
        return 6;
        break;
      case "Logistic Regression":
          return 7;
        break;
      case "Multiclass Logistic Regression":
        return 8;
        break;
      case "Naive Bayesian Network":
        return 9;
      break;
      case "Support Vector Machine":
        return 10;
      break;
      case "Self Training":
          return 11;
        break;
      case "Deep Learning":
        return 12;
        break;
      case "Recurrent Neural Network":
        return 13;
        break;
      case "Time Delay Neural Network":
        return 14;
        break;
      case "Feature Selection Principal component Analysis":
          return 15;
        break;





      default:
        return 0;
        break;
    }
  }
}


const toplist = new Array();

$(document).ready(function(){
  $(".item").click(function(){

    var index = $(this).index();
    var top = $(".box").eq(index).offset().top - 106;
    $("html,body").animate({scrollTop:top + "px"});
  })

$(window).scroll(function(){
  var index = getIndex();

  $(".item").each(function(){
    if($(this).index() == index){
      $(this).css("background-color","#00AFD8");
      $(this).css("color","#FFFFFF");
      $(this).hover(function(){
        $(this).css("background-color","#00AFD8");
        $(this).css("color","#FFFFFF");
      },function(){
        $(this).css("background-color","#00AFD8");
        $(this).css("color","#FFFFFF");
      })

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

  if(top < toplist[1]){
    return 0;
  }
  for(var i = 1; i < toplist.length - 1; i++){
    if(top >= toplist[i] &&top < toplist[i+1]){
      return i;
    }
  }
  return toplist.length - 1;
}
});

$(window).on("load",function(){

  $(".box").each(function(){
    toplist.push($(this).offset().top - 107);
  })

  var index = getMethodIndex();
  console.log(index);
  var top = $(".box").eq(index).offset().top - 106;
  $("html,body").animate({scrollTop:top + "px"});
});
