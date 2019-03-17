const client = new HttpClient();
document.querySelector("#selectlist").innerHTML = "Requesting http now, please wait";
document.querySelector("#features").innerHTML = "Requesting http now, please wait";
document.querySelector("#result").innerHTML = "Requesting http now, please wait";
const intro = `Below is a list of features of <em>${getDatasetName()}</em> that the<br />system has automatically detected. Click the Edit<br />button to manually correct these. Editing features<br />of the dataset may influence the decision made by<br />the analyser and may change the optimal<br />machine learning algorithm suggested.`
document.querySelector("#intro").innerHTML = intro;

function getDatasetName() {
  var url = location.search;
  if (url.indexOf("?") != -1) {
    return url.substr(1);
  } else {
    client.get(
      "https://protected-tundra-24167.herokuapp.com/api/names",
      getDefaut
    );
  }
}

client.get(
  "https://protected-tundra-24167.herokuapp.com/api/names",
  makeSelectList
);

client.get(
  "https://protected-tundra-24167.herokuapp.com/api/:" + getDatasetName(),
  makeDecision
);

function getDefaut(response) {
  const names = JSON.parse(response).list;
  name = names[0];
  window.location.href = "Analysis.html?" + name;
}

function makeSelectList(response) {
  const names = JSON.parse(response).list;
  console.log(names);
  const selectlist = document.createElement("select");
  selectlist.style.fontSize = "40px";
  selectlist.style.padding = "10px";
  selectlist.style.color = "#007dcb";
  selectlist.style.width = "404px";

  for(const name of names) {
    const selectlistItem = document.createElement("option");
    selectlistItem.innerHTML = name;
    if(name == getDatasetName()){
      selectlistItem.selected = true;
    }
    selectlist.appendChild(selectlistItem);
  }
  selectlist.onchange = function() {
    window.location.href = "Analysis.html?" + selectlist.options[selectlist.selectedIndex].text;
  }
  document.querySelector("#selectlist").innerHTML = "";
  document.querySelector("#selectlist").appendChild(selectlist);
}


let dataset;

// This function is for decision-making
function makeDecision(response) {
  dataset = JSON.parse(response)[0]; // MAKE DATA OBJECT, DO NOT CHANGE!!!

  console.log(dataset);
  const resultValue = document.createElement("body");
  const features = document.createElement("body");
  let methodType, bestMethod;
  //var features;
  //First of all we need to check: if(pattern != square(attributes), if 'if' return true, suggest user use Feature Selection Principal component Analysis):
  // console.log("suggest user use Feature Selection Principal component Analysis to preprocess dataset");

  // Unsupervised Learning
  if (dataset.labelsRatio == 0) {
    console.log("Unsupervised Learning");
    methodType = "Unsupervised Learning";
    if (dataset.numFeatures < 100) {
      console.log("Self-Organising Map");
      bestMethod = "Self-Organising Map";
    } else {
      if (dataset.structure < 0) {
        console.log("Principle Component Analysis");
        bestMethod = "Principle Component Analysis";
      } else {
        console.log("K-means Clustering");
        bestMethod = "K-means Clustering";
      }
    }
  }

  //  Supervised Learning
  else if (dataset.labelsRatio == 1) {
    console.log("Supervised Learning");
    methodType = "Supervised Learning";
    if (dataset.isCategorical) {
      // Classification
      if (dataset.categories.length >= 3) {
        if (dataset.complexity < 1 && dataset.size >= 1000) {
          console.log("Multiclass Neural Network");
          bestMethod = "Multiclass Neural Network";
          //When reached any Neural Network, ask the user "Are there any images involved in the dataset?"
          //if(1) suggest Deep Learning: console.log("Deep Learning"); otherwise unchanged: console.log("Multiclass Neural Network");
          //In the same time, ask the user whether the dataset is a time series,
          //if(1) suggest Recurrent Neural Network and Time Delay Neural Network: console.log("Recurrent Neural Network "), console.log("Time Delay Neural Network");
          //otherwise remain constant: console.log("Multiclass Neural Network");
        } else {
          console.log("either Multiclass Neural Network OR Random Forest");
          bestMethod = "either Multiclass Neural Network OR Random Forest";
          //When reached any Neural Network, ask the user "Are there any images involved in the dataset?"
          //if(1) suggest Deep Learning: console.log("Deep Learning"); otherwise unchanged: console.log("Multiclass Neural Network");
          //In the same time, ask the user whether the dataset is a time series,
          //if(1) suggest Recurrent Neural Network and Time Delay Neural Network: console.log("Recurrent Neural Network "), console.log("Time Delay Neural Network");
          //otherwise remain constant: console.log("Multiclass Neural Network");
        }
      } else {
        if (dataset.relations != null) {
          console.log("Logistic Regression");
          bestMethod = "Logistic Regression";
        } else {
          if (dataset.numFeatures < 100) {
            console.log("Multi-Layer Perceptron");
            bestMethod = "Multi-Layer Perceptron";
          } else {
            console.log(
              "either Naive Bayesian Network OR Support Vector Machine"
            );
            bestMethod =
              "either Naive Bayesian Network OR Support Vector Machine";
            //Is the result of analyse better than guessing(>50%)?
            //If yes use Anti-learning
            //But Chris doesn' t need us to analyse. How could we know the result after analysing?

            //////After discuss with chris: whether to do the analysing is optional, hence, it' s OK not to use Anti-learning
          }
        }
      }
    }
    // outputs are values, not Categories
    //regression
    else {
      if (dataset.complexity < 1 && dataset.size >= 1000) {
        console.log("Linear Regression");
        bestMethod = "Linear Regression";
      } else {
        console.log("either Sum Regression OR Random Forest Regression");
        bestMethod = "either Sum Regression OR Random Forest Regression";
      }
    }
  }

  // Semi-supervised Learning
  else {
    console.log("Semi-supervised Learning");
    methodType = "Semi-supervised Learning";
    if (dataset.labelsRatio < 0.33) {
      console.log("Forced Clustering");
      bestMethod = "Forced Clustering";
    } else {
      console.log("Self Training");
      bestMethod = "Self Training";
    }
  }
  const res = `After analysis, it would appear the dataset would best be modelled using <strong>${methodType}</strong>. </br>The algorithm suggests that the best Machine Learning algorithm to use on <em>${getDatasetName()}</em> is </br> <strong>${bestMethod}</strong>`;
  result.innerHTML = res;
  //let feat =`Dataset' s Name is : ${getDatasetName}</br>`;
  let feat =`The labelsRatio is : <strong>${dataset.labelsRatio}</strong></br>`;
  feat += `Number of Features: <strong>${dataset.numFeatures}</strong></br>`
  feat += `The data type of the dataset : <strong>${dataset.dataType}</strong></br>`
  feat += `The size of the dataset: <strong>${dataset.size}</strong></br>`
  feat += `There are  <strong>${dataset.categories.length}</strong>`
  feat += ` categories of the dataset: <strong>${dataset.categories}</strong></br>`
  if (dataset.missingLabels.length == 0){
    feat += `MissingLabels: <strong>No missing labels of the dataset</strong></br>`
  }
  else {
    feat += `Missing labels of the dataset:<strong>${dataset.missingLabels}</strong></br>`
  }
  if (dataset.missingValues.length == 0){
    feat += `MissingLabels: <strong>No missing values of the dataset</strong></br>`
  }
  else {
    feat += `Missing values of the dataset:<strong>${dataset.missingValues}</strong></br>`
  }
  if(dataset.isCategorical == false){
    feat += `The complexity of the dataset: <strong>${dataset.complexity}</strong></br>`
    feat += `Unstructured or structured dataset(-1,1): <strong>${dataset.structure}</strong></br>`
    feat += ` There are <strong>${dataset.anomalies.length}</strong> anomalies of the dataset: <strong>${dataset.anomalies}</strong></br>`
    feat += ` Relations of the dataset: <strong>${dataset.relations}</strong></br>`
  }
  //feat += ` missing labels of the dataset: ${  {null} else{dataset.categories}}</br>`
  //feat += ` categories of the dataset: ${dataset.categories}</br>`

  // TODO: Make a list of features
  // document.querySelector("#features").innerHTML = JSON.stringify(
  //   dataset,
  //   " ",
  //   2
  // );
  document.querySelector("#features").innerHTML = feat;
  document.querySelector("#result").appendChild(resultValue);
}
