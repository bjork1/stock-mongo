// $.ajax({
//     async: true,
//     crossDomain: true,
//     url:
//       "https://alpha-vantage.p.rapidapi.com/query?symbol=TSLA&function=GLOBAL_QUOTE",
//     method: "GET",
//     dataType: "json",
//     headers: {
//       "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
//       "x-rapidapi-key": "8837642bb2msh0a32e8bc2274f43p1efad7jsn770d7e11a0d0",
//     },

//     success: function(response){
//var longitude = data.coord.lon;
//var latitude = data.coord.lat;

// console.log(response);

// var wf = '';
// $.each(data.weather, function(index, val) {
//     wf += '<h2><b>' + data.name +' (' + date + ')' + "</b>" + "<img src = 'https://openweathermap.org/img/w/" + data['weather'][0].icon + ".png'>" + "</h2>" + '<p>Temperature: ' + data.main.temp + '&deg;C  </p>'+ '<p>Humidity: ' + data.main.humidity + '%</p>'+ '<p>Wind Speed: ' + data.wind.speed + ' MPH</p>' + val.main + ', ' + val.description
// });
// $("#stockdata").html(wf);
//     }
// })

// var settings = {
//   async: true,
//   crossDomain: true,
//   url:
//     "https://alpha-vantage.p.rapidapi.com/query?symbol=TSLA&function=GLOBAL_QUOTE",
//   method: "GET",
//   dataType: "json",
//   headers: {
//     "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
//     "x-rapidapi-key": "8837642bb2msh0a32e8bc2274f43p1efad7jsn770d7e11a0d0",
//   },
// };

// $.ajax(settings).done(function (response) {
//   // $("#stockdata").html(response.symbol);

//   console.log(response);
//   console.log(response);
// });

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems, options);
});

// Or with jQuery

$(document).ready(function () {
  $(".collapsible").collapsible();
});

function getResults() {
  // Empty any results currently on the page
  $("#results").empty();
  // Grab all of the current notes
  $.getJSON("/all", function (data) {
    // For each note...
    for (var i = 0; i < data.length; i++) {
      // ...populate #results with a p-tag that includes the note's title and object id
      //   <ul class="collapsible">
      //     <li>
      //       <div class="collapsible-header">
      //         <i class="material-icons">filter_drama</i>First
      //       </div>
      //       <div class="collapsible-body">
      //         <span>Lorem ipsum dolor sit amet.</span>
      //       </div>
      //     </li>
      //     <li>
      //       <div class="collapsible-header">
      //         <i class="material-icons">place</i>Second
      //       </div>
      //       <div class="collapsible-body">
      //         <span>Lorem ipsum dolor sit amet.</span>
      //       </div>
      //     </li>
      //     <li>
      //       <div class="collapsible-header">
      //         <i class="material-icons">whatshot</i>Third
      //       </div>
      //       <div class="collapsible-body">
      //         <span>Lorem ipsum dolor sit amet.</span>
      //       </div>
      //     </li>
      //   </ul>;

      $("#results").prepend(
        `<li class = "data-entry" data-id ="` +
          data[i]._id +
          `"><div class = "collapsible-header dataTitle" data-id= "` +
          data[i]._id +
          `">` +
          data[i].title +
          `</div><div class = "collapsible-body"><span>Hello</span></div></li>`
      );

      //Test above
      //   $("#results").prepend(
      //     "<p class='data-entry' data-id=" +
      //       data[i]._id +
      //       "><span class='dataTitle' data-id=" +
      //       data[i]._id +
      //       ">" +
      //       data[i].title +
      //       "</span><span class='delete'>X</span></p>"
      //   );
    }
  });
}

// Runs the getResults function as soon as the script is executed
getResults();

// When the #make-new button is clicked
$(document).on("click", "#make-new", function () {
  // AJAX POST call to the submit route on the server
  // This will take the data from the form and send it to the server
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      title: $("#title").val(),
      note: $("#note").val(),
      average: $("#average").val(),
      total: $("#total").val(),
      created: Date.now(),
    },
  })
    // If that API call succeeds, add the title and a delete button for the note to the page
    .then(function (data) {
      // Add the title and delete button to the #results section

      $("#results").prepend(
        `<li class = "data-entry" data-id ="` +
          data._id +
          `"><div class = "collapsible-header dataTitle" data-id= "` +
          data._id +
          `">` +
          data.title +
          `</div><div class = "collapsible-body"><span>Hello</span></div></li>`
      );

      //   $("#results").prepend(
      //     "<p class='data-entry' data-id=" +
      //       data._id +
      //       "><span class='dataTitle' data-id=" +
      //       data._id +
      //       ">" +
      //       data.title +
      //       "</span><span class='delete'>X</span></p>"
      //   );
      // Clear the note and title inputs on the page
      $("#note").val("");
      $("#title").val("");
      $("#average").val("");
      $("#total").val("");
    });
});

// When the #clear-all button is pressed
$("#clear-all").on("click", function () {
  // Make an AJAX GET request to delete the notes from the db
  $.ajax({
    type: "DELETE",
    dataType: "json",
    url: "/clearall",
    // On a successful call, clear the #results section
    success: function (response) {
      $("#results").empty();
    },
  });
});

// When user clicks the delete button for a note
$(document).on("click", ".delete", function () {
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "DELETE",
    url: "/delete/" + selected.attr("data-id"),

    // On successful call
    success: function (response) {
      // Remove the p-tag from the DOM
      selected.remove();
      // Clear the note and title inputs
      $("#note").val("");
      $("#title").val("");
      $("#average").val("");
      $("#total").val("");
      // Make sure the #action-button is submit (in case it's update)
      $("#action-button").html(
        "<button id = 'make-new' class = 'btn waves-effect waves-light'>Submit<i class = 'material-icons right'>send</i></buttons>"
      );
    },
  });
});

// When user click's on note title, show the note, and allow for updates
$(document).on("click", ".dataTitle", function () {
  // Grab the element
  var selected = $(this);
  // Make an ajax call to find the note
  // This uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function (data) {
      // Fill the inputs with the data that the ajax call collected
      $("#note").val(data.note);
      $("#title").val(data.title);
      $("#average").val(data.average);
      $("#total").val(data.total);
      // Make the #action-button an update button, so user can
      // Update the note s/he chooses
      $("#action-button").html(
        "<button id='updater' class = 'btn waves-effect waves-light' data-id='" +
          data._id +
          "'>Update<i class = 'material-icons rights'>cloud</i></button>"
      );
    },
  });
});

// When user click's update button, update the specific note
$(document).on("click", "#updater", function () {
  // Save the selected element
  var selected = $(this);
  // Make an AJAX POST request
  // This uses the data-id of the update button,
  // which is linked to the specific note title
  // that the user clicked before
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#title").val(),
      note: $("#note").val(),
      average: $("#average").val(),
      total: $("#total").val(),
    },
    // On successful call
    success: function (data) {
      // Clear the inputs
      $("#note").val("");
      $("#title").val("");
      $("#average").val("");
      $("#total").val("");
      // Revert action button to submit
      // $("#action-button").html("<button id='make-new'>Submit</button>");

      $("#action-button").html(
        "<button id = 'make-new' class = 'btn waves-effect waves-light'>Submit<i class = 'material-icons right'>send</i></buttons>"
      );
      // Grab the results from the db again, to populate the DOM
      getResults();
    },
  });
});
