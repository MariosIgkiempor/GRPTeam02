// This is a class which helps making HTTP requests easier for us later

// We will use it a lot because this application will make a lot of requests

// There are libraries which do this for us but this is pure javascript with no libraries

class HttpClient {

  constructor() {

    // The class only has one function called "get" which sends a GET HTTP request to the server

    // When we need to upload files we will also need a post but we can add that later

    // The function takes the server URL and a "callback"

    // "callback" is a function that will be executed when the request is so we can process the data

    this.get = function(url, callback) {

      // "request" is an XMLHttpRequest object

      // this class is provided by the browser

      const request = new XMLHttpRequest();



      // This bit might be confusing

      // onreadystatechange is a function that is called when the "ready" state of the object changes

      // The "ready" state of the object will change when we make the request

      // IMPORTANT: we are not making the request here!!

      // we are just defining what happens when we make the event

      request.onreadystatechange = function() {

        // After the request has been made, the request object will have some HTTP codes associated with it

        // You can research what these codes mean by searching HTTP codes

        // 200 is OK (the request was successfull), readyState 4 is DONE

        // We only want to perform the callback function if everything went smoothly

        // If there were errors, we don't do anything (this will change in the final code, we will need to handle errors)

        if (request.readyState === 4 && request.status === 200) {

          // The callback specified on line 10 will take 1 argument - the plain text of the response

          // This text is just a string of data which the server gives back to us when we make the request

          // The callback will be defined below

          callback(request.responseText);

        }

      };



      // Ok now we are actually making the request

      // Here we tell the request object that we are about to make a GET request to the specified "url"

      // Ignore the "true" for now

      request.open("GET", url, true);



      // Allow the server to respond (security stuff, ignore this line for learning)

      request.setRequestHeader("Access-Control-Allow-Origin", "*");



      // This line sends the request

      // Because it is a GET request we don't need to send any data

      request.send(null);

    };

  }

}



// ----------------------------------------------------------------------------



// Now we are using the HttpClient class we defined on line 4 (object instance)

const client = new HttpClient();

// we call the get method of the class with the url of the server and the function to execute when the request has been made

// the client class will handle making the request for us

// FRONT END

client.get(

  "https://protected-tundra-24167.herokuapp.com/api/names",

  makeListOfNames

);



// MACHINE LEARNING

client.get(

  "https://protected-tundra-24167.herokuapp.com/api/:testing.csv",

  makeDecision

);



// in this function, we can do anything we want with the data

// for example, we can make a list of all the names

// we will need seperate functions for different requests we make

// for example, one function to visualise the data, one function to make a list of all the file names etc

// this function makes a list of all the file names and puts them in the div id "output" in the html

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



//First of all we need to check: if(pattern != square(attributes), if 'if' return true, suggest user use Feature Selection Principal component Analysis):
// console.log("suggest user use Feature Selection Principal component Analysis to preprocess dataset");

// Unsupervised Learning
  if (dataset.labelsRatio == 0) 
  {
    console.log("Unsupervised Learning");
    if (dataset.number-of-features < 100)
    {
      console.log("Self-Organising Map");
    }
    else 
    {
      if(dataset.structure < 0)
      {
        console.log("Principle Component Analysis");
      }
      else
      {
        console.log("K-means Clustering"); 
      }
    }
  }

//  Supervised Learning
  else if (dataset.labelsRatio == 1) {
    console.log("Supervised Learning");
    if (dataset.isCategorical == 1)
    {
      // Classification
      if (dataset.categories.length >= 3)
      {
        if (dataset.complexity < 1 && dataset.size >= 1000)
        {
          console.log("Multiclass Neural Network");
          //When reached any Neural Network, ask the user "Are there any images involved in the dataset?"
          //if(1) suggest Deep Learning: console.log("Deep Learning"); otherwise unchanged: console.log("Multiclass Neural Network");
          //In the same time, ask the user whether the dataset is a time series,
          //if(1) suggest Recurrent Neural Network and Time Delay Neural Network: console.log("Recurrent Neural Network "), console.log("Time Delay Neural Network");
          //otherwise remain constant: console.log("Multiclass Neural Network");
        }
        else
        {
          console.log("Multiclass Neural Network");
          //When reached any Neural Network, ask the user "Are there any images involved in the dataset?"
          //if(1) suggest Deep Learning: console.log("Deep Learning"); otherwise unchanged: console.log("Multiclass Neural Network");
          //In the same time, ask the user whether the dataset is a time series,
          //if(1) suggest Recurrent Neural Network and Time Delay Neural Network: console.log("Recurrent Neural Network "), console.log("Time Delay Neural Network");
          //otherwise remain constant: console.log("Multiclass Neural Network");
          console.log("Random Forest");
        }
      }
      else 
      {
        if (dataset.relations.length != 0)
        {
          console.log("Logistic Regression");
        }
        else
        {
          if (dataset.number-of-features < 100)
          {
            console.log("Multi-Layer Perceptron");
          }
          else 
          {
            console.log("Naive Bayes");
            console.log("Support Vector Machine");
            //Is the result of analyse better than guessing(>50%)?
            //If yes use Anti-learning
            //But Chris doesn' t need us to analyse. How could we know the result after analysing?

            //////After discuss with chris: whether to do the analysing is optional, hence, it' s OK not to use Anti-learning
          }
        }
      }
    }
    else
    // outputs are values, not Categories  
    //regression 
    {
      if (dataset.complexity < 1 && dataset.size >= 1000)
        {
          console.log("Linear Regression");
        }
        else
        {
          console.log("Sum Regression");
          console.log("Random Forest Regression");
        }
    }
  }

// Semi-supervised Learning
  else {
    console.log("Semi-supervised Learning");
    if (dataset.labelsRatio < 0.33)
    {
      console.log("Forced Clustering");
    }
    else
    {
      console.log("Self Training");
    }
  }
}