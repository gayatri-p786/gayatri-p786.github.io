// main.js

 // Add an event listener to the form
 document.getElementById('stockSearchForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission
  searchStock(); // Call your searchStock function
});


function displayErrorMessage(message) {
  var errorSection = document.getElementById('errorSection');
  errorSection.style.display = 'block';
  // errorSection.style.backgroundColor = '#dddddd'; // Gray background
  errorSection.innerHTML = message;
}

function searchStock() {
  var stockTicker = document.getElementById('stockTicker').value;
  fetch(`/search_stock?stock_ticker=${stockTicker}`,{method:'GET'})
    .then(response => response.json())
    .then(data => {
      if (Object.keys(data).length === 0) {
        // Empty JSON object, display error message
        displayErrorMessage('Error: No record has been found, please enter a valid symbol');
    } 
    else{

    
      console.log("in data")
      document.getElementById('searchResult').innerHTML = JSON.stringify(data,null,2);
    }
  })
    .catch(error => console.error(error));
}



function clearResult() {
  document.getElementById('stockTicker').value = '';
  document.getElementById('searchResult').innerHTML = '';
  errorSection.innerHTML = '';
  errorSection.style.display = 'none';
}
