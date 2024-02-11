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
      activateTab('companyTab', 'companyContent');
      displayCompanyData(data);
    
      // console.log("in data")
      // document.getElementById('searchResult').innerHTML = JSON.stringify(data,null,2);
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



// Function to activate tab and corresponding content
function activateTab(tabId, contentId) {
  // Deactivate all tabs and hide content
  document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
  });
  // Activate clicked tab and show corresponding content
  document.getElementById(tabId).classList.add('active');
  document.getElementById(contentId).classList.add('active');
}

  // Function to display company data
  function displayCompanyData(data) {
    const companyContent = document.getElementById('companyContent');
    companyContent.innerHTML = `
    <div class="company-info">
        <img src="${data.logo}" alt="Company Logo">
        <table>
            <tr>
                <td>Company Name</td>
                <td>${data.name}</td>
            </tr>
            <tr>
                <td>Stock Ticker Symbol</td>
                <td>${data.ticker}</td>
            </tr>
            <tr>
                <td>Stock Exchange Code</td>
                <td>${data.exchange}</td>
            </tr>
            <tr>
                <td>Company IPO Date</td>
                <td>${data.ipo}</td>
            </tr>
            <tr>
                <td>Category</td>
                <td>${data.finnhubIndustry}</td>
            </tr>
        </table>
      </div>
    `;
}


