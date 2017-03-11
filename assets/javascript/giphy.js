
  // Need to populate initial buttons linked to Giphy - check
  // Need to append additional buttons linked to Giphy
  // Need those buttons to return results from Giphy- check
  // And those results should be displayed in the well - check
  // And when you click on an image, it Giphy's


  //variable array to hold names for initial buttons
  var topics = ["Dogs", "Snakes", "Monkeys", "Birds"];
  var data, animatedImg, stillImg;

  function displayGiphyInfo() {

    // Pulls the data-search attribute's value to be used later in the queryURL
    var searchTerm = $(this).attr("data-search");
    // console.log("Search Term: " + searchTerm);

    // Build a query URL with a limit of 10 to hit the giphy API with the search term from above
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=dc6zaTOxFJmzC&limit=10";
    // console.log("queryURL: " + queryURL);

        // I was trying to clear the entire well every time the function displayGiphyInfo()
        // is called but it seems to have created another bug.
        $("#showResults").empty();//html("");//empty();

        //This is an ajax query to the URL above to "GET" a response. 
        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {

          // Variable to hold the data array from the response
          data = response.data;

          // Loops over the array of 10 items and builds our new div 
          // each time with the respective classes and attributes
          for(var i = 0; i < data.length; i++){

            // A div with classes and an ID
            var newDiv = $("<div class='col-md-4 text-center' id='resGiphy'>");  

            // Variable for the rating
            var rating = data[i].rating;
            // console.log("Rating: " + rating);

            //Paragraph area to hold the rating
            var pRating = $("<p>").text("Rating: " + rating);

            //Getting the image from the response
            var imgURL = data[i].images.fixed_height_still.url;
            // console.log("imgURL: " + imgURL);

            //Creates an element to hold our images with a src attribute
            //src = "someURL to an image" data-state='still', data-value, and an ID
            var image = $("<img data-state='still' id='imgGiphy'>");
            image.attr("src", imgURL);
            image.attr("data-value", i);

            // Appending the rating to the new div
            newDiv.append(pRating);

            // Appending the image to the new div
            newDiv.append(image);          

            // Take the entirely new div that's been created and prepending it
            // to the well in the ID for showResults
            $("#showResults").prepend(newDiv);            
          }

          // Once you click anything with an id of imgGiphy, this function works
          $("body").on("click", '#imgGiphy', function() {
            // console.log("Clicked it!");

            // Grabs the value from data-value which is a number that coincides 
            // with the Giphy API from above so we don't lose our place
            var val = $(this).attr("data-value");
            // console.log("Value: ", val);

            //Sets the API URL based on the value a couple lines above
            animatedImg = data[val].images.fixed_height.url;
            stillImg = data[val].images.fixed_height_still.url;
            // console.log("Animated URL: " + animatedImg);
            // console.log("Still URL: " + stillImg);

            // Variable to get the state of still or animate from the element clicked in the HTML
            var state = $(this).attr("data-state");
            // console.log("Data-State: " + state);     

            // If the clicked image's state is still, update its src attribute to what its data-animate value is.
            // Then, set the image's data-state to animate
            // Else set src to the data-still value and then set the image's data-state to still


/****BUG ALERT****/
/**
I'm not entirely sure why but when you click a second button, say you first click Monkeys and then you click 
Birds, when you then click on an image it loops through these two conditions twice. I don't know if this is 
a javascript issue but on every click of the image, it would get inside both conditions somehow. I tried 
quite a few things to fix it but have no idea why it was behaving this way. It works fine on page load but
not once you empty everything out and fill it in with new results.
**/

            if (state === "still"){
              console.log("ANIMATE inside");
              $(this).attr("src", animatedImg);
              $(this).attr("data-state", "animate");
            }else{
              console.log("STILL inside");
              $(this).attr("src", stillImg);
              $(this).attr("data-state", "still");
            }

          });       

        });

      }


      //Whenever the submit button is clicked, this function runs
      $("#submitButton").on("click", function(event) {
        event.preventDefault();
        // console.log("Clicked the submit button");

        // This line grabs the input from the textbox
        var giphRes = $("#theInput").val().trim();
        // console.log("Input Value: " + giphRes);

        // Adding another value from the input to the topics array
        topics.push(giphRes);
        $("#theInput").val("");//This clears the input field

        //Calls populateButtons() again to update our buttons
        populateButtons();
      });

      // This function populates our initial buttons
      function populateButtons() {

        //This is to prevent repeat buttons
        $("#populateButtons").empty();

        // Loops through the initial topics array
        for (var i = 0; i < topics.length; i++) {

          // This makes a button each time it loops with 
          // classes and the name on the button from the topics array
          var a = $("<button>");

          a.addClass("btn btn-info btn-lg giphy");

          a.attr("data-search", topics[i]);

          a.text(topics[i]);

          //This appends each new button into the 
          // div with the ID of populateButtons
          $("#populateButtons").append(a);
        }
      }    

      //This is a listener for any element with the class of giphy
      $(document).on("click", ".giphy", displayGiphyInfo);

      // This shows the initial buttons
      populateButtons();            