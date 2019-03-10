const client = new HttpClient();

client.get(
  "https://protected-tundra-24167.herokuapp.com/api/names",
  makeListOfNames
);

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

function makeListOfNames(response) {
  const list = document.createElement("ul");

  // parse the response string into an array so we can loop over it

  const names = JSON.parse(response).list;

  console.log(names);

  // loop over the list of names and add a li into the list for each name

  for (const name of names) {
    const listItem = document.createElement("li");

    listItem.innerHTML = name;

    list.appendChild(listItem);
  }

  // add the list to the output div

  document.querySelector("#output").appendChild(list);
}

// This function is for decision-making

function makeDecision(response) {
  const dataset = JSON.parse(response)[0]; // MAKE DATA OBJECT, DO NOT CHANGE!!!

  console.log(dataset);
  const resultValue = document.createElement("body");
  const features = document.createElement("body");
  var res =
    "After analysis, the best Machine </br>learning algorithm of " +
    getDatasetName() +
    " is </br>";
  var res2;
  //var features;
  //First of all we need to check: if(pattern != square(attributes), if 'if' return true, suggest user use Feature Selection Principal component Analysis):
  // console.log("suggest user use Feature Selection Principal component Analysis to preprocess dataset");

  // Unsupervised Learning
  if (dataset.labelsRatio == 0) {
    console.log("Unsupervised Learning");
    res2 = "Unsupervised Learning";
    if (dataset.number - of - features < 100) {
      console.log("Self-Organising Map");
      res2 = "Self-Organising Map";
    } else {
      if (dataset.structure < 0) {
        console.log("Principle Component Analysis");
        res2 = "Principle Component Analysis";
      } else {
        console.log("K-means Clustering");
        res2 = "K-means Clustering";
      }
    }
  }

  //  Supervised Learning
  else if (dataset.labelsRatio == 1) {
    console.log("Supervised Learning");
    res2 = "Supervised Learning";
    if (dataset.isCategorical == 1) {
      // Classification
      if (dataset.categories.length >= 3) {
        if (dataset.complexity < 1 && dataset.size >= 1000) {
          console.log("Multiclass Neural Network");
          res2 = "Multiclass Neural Network";
          //When reached any Neural Network, ask the user "Are there any images involved in the dataset?"
          //if(1) suggest Deep Learning: console.log("Deep Learning"); otherwise unchanged: console.log("Multiclass Neural Network");
          //In the same time, ask the user whether the dataset is a time series,
          //if(1) suggest Recurrent Neural Network and Time Delay Neural Network: console.log("Recurrent Neural Network "), console.log("Time Delay Neural Network");
          //otherwise remain constant: console.log("Multiclass Neural Network");
        } else {
          console.log("Multiclass Neural Network");
          res2 = "Multiclass Neural Network";
          //When reached any Neural Network, ask the user "Are there any images involved in the dataset?"
          //if(1) suggest Deep Learning: console.log("Deep Learning"); otherwise unchanged: console.log("Multiclass Neural Network");
          //In the same time, ask the user whether the dataset is a time series,
          //if(1) suggest Recurrent Neural Network and Time Delay Neural Network: console.log("Recurrent Neural Network "), console.log("Time Delay Neural Network");
          //otherwise remain constant: console.log("Multiclass Neural Network");
          console.log("Random Forest");
          res2 = "Random Forest";
        }
      } else {
        if (dataset.relations != null) {
          console.log("Logistic Regression");
          res2 = "Logistic Regression";
        } else {
          if (dataset.numFeatures < 100) {
            console.log("Multi-Layer Perceptron");
            res2 = "Multi-Layer Perceptron";
          } else {
            console.log("Naive Bayes");
            res2 = "Naive Bayes";
            console.log("Support Vector Machine");
            res2 = "Support Vector Machine";
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
        res2 = "Linear Regression";
      } else {
        console.log("Sum Regression");
        res2 = "Sum Regression";
        console.log("Random Forest Regression");
        res2 = "Random Forest Regression";
      }
    }
  }

  // Semi-supervised Learning
  else {
    console.log("Semi-supervised Learning");
    res2 = "Semi-supervised Learning";
    if (dataset.labelsRatio < 0.33) {
      console.log("Forced Clustering");
      res2 = "Forced Clustering";
    } else {
      console.log("Self Training");
      res2 = "Self Training";
    }
  }
  res += res2;
  result.innerHTML = res;
  document.querySelector("#features").appendChild(dataset);
  document.querySelector("#result").appendChild(resultValue);
}
