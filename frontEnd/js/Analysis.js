const client = new HttpClient();

function getDatasetName() {
  var url = location.search;
  console.log(url);
  if (url.indexOf("?") != -1) {
    console.log(url.substr(1));
    return url.substr(1);
  } else {
    console.log("no csv file!!");
  }
}

client.get(
  "https://protected-tundra-24167.herokuapp.com/api/:" + getDatasetName(),
  makeDecision
);

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
  const res = `After analysis, it would appear the dataset would best be modelled using ${methodType}. The algorithm suggests that the best Machine Learning algorithm to use on ${getDatasetName()} is </br> ${bestMethod}`;
  result.innerHTML = res;
  // TODO: Make a list of features
  document.querySelector("#features").innerHTML = JSON.stringify(
    dataset,
    " ",
    2
  );
  document.querySelector("#result").appendChild(resultValue);
}
