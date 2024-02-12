// main.js

 // Add an event listener to the form
 document.getElementById('searchButton').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default form submission
  searchStock(); // Call the searchStock function
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
    .then(response => {
        if (!response.ok) {
        // If response status is not OK (200), throw an error
        displayErrorMessage('Error: No record has been found, please enter a valid symbol');
        return 
    }
    // Parse JSON response
    return response.json();
  }).then(data => {
      if (Object.keys(data).length === 0) {
        // Empty JSON object, display error message
        displayErrorMessage('Error: No record has been found, please enter a valid symbol');
    } 
    else{
      result.style.display = 'block';
      // displayCompanyData(data);
      // Extract profile and quote data
        profileData = data.profile;
        quoteData = data.quote;
        recData = data.recommendation
        // Display company data
        displayCompanyData(profileData);
    
      // console.log("in data")
      // document.getElementById('searchResult').innerHTML = JSON.stringify(data,null,2);
    }
  })
    .catch(error => console.error(error));
}



function clearResult() {
  document.getElementById('stockTicker').value = '';
  // document.getElementById('result').innerHTML = '';
  errorSection.innerHTML = '';
  errorSection.style.display = 'none';
  result.style.display='none';
}



// Function to activate tab and corresponding content
function activateTab(tabId, contentId) {
  // Deactivate all tabs and hide content
  
  document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
      if (content.id != contentId) {
        content.style.display = 'none'; // Hide the content associated with contentId
      }
  });
  // Activate clicked tab and show corresponding content
  document.getElementById(tabId).classList.add('active');
  document.getElementById(contentId).classList.add('active');
  // contentId.style.display = 'block';
}

  // Function to display company data
  function displayCompanyData(data) {
    activateTab('companyTab', 'companyContent');
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
    companyContent.style.display='block';
}

  // Function to display stock summary data
  function displaySummaryData(profile, quo, rec) {
    activateTab('summaryTab', 'summaryContent');
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = `
    <div class="company-info">
        <table>
            <tr>
                <td>Stock Ticker Symbol</td>
                <td>${profile.ticker}</td>
            </tr>
            <tr>
                <td>Trading Day</td>
                <td>${quo.t}</td>
            </tr>
            <tr>
                <td>Previous Closing Price</td>
                <td>${quo.pc}</td>
            </tr>
            <tr>
                <td>Opening Price</td>
                <td>${quo.o}</td>
            </tr>
            <tr>
                <td>High Price</td>
                <td>${quo.h}</td>
            </tr>
            <tr>
                <td>Low Price</td>
                <td>${quo.l}</td>
            </tr>
            <tr>
                <td>Change</td>
                <td id="changeCell"></td>
            </tr>
            <tr>
                <td>Change Percent</td>
                <td id="changePercentCell"></td>
            </tr>
        </table>
        
      </div>
      <div style="margin-top: 20px;"></div>
      <div>
          <div id="indicatorTable">
              <div class="indicator-row">
                <div class="indicator-cell" style="color: red;">
                    <div style="line-height: 1;">Strong</div>
                    <div style="line-height: 1;">Sell</div>
                </div>
                  <div class="indicator-cell" id="strongSell">${rec.strongSell}</div>
                  <div class="indicator-cell" id="sell">${rec.sell}</div>
                  <div class="indicator-cell" id="hold">${rec.hold}</div>
                  <div class="indicator-cell" id="buy">${rec.buy}</div>
                  <div class="indicator-cell" id="strongBuy">${rec.strongBuy}</div>
                  <div class="indicator-cell" style="color: green;">
                    <div style="line-height: 1;">Strong</div>
                    <div style="line-height: 1;">Buy</div>
                </div>
              </div>
          </div>   
          <div style="margin:20px auto; text-align: center;">Recommendation Trends</div>
        </div>
    `;
          // Get references to the change and change percent cells
      const changeCell = document.getElementById('changeCell');
      const changePercentCell = document.getElementById('changePercentCell');

      // Check if change is positive or negative
      if (parseFloat(quo.d) > 0) {
          // Change is positive, display positive arrow image
          changeCell.innerHTML = `<span>${quo.d}<img src="/static/images/GreenArrowUp.png" alt="Positive Arrow" style="vertical-align: middle;"></span>`;
      } else if (parseFloat(quo.d) < 0) {
          // Change is negative, display negative arrow image
          changeCell.innerHTML = `<span>${quo.d}<img src="/static/images/RedArrowDown.png" alt="Negative Arrow" style="vertical-align: middle;"></span>`;
      } else {
          // Change is zero, display text only
          changeCell.textContent = quo.d;
      }

      // Check if change percent is positive or negative
      if (parseFloat(quo.dp) > 0) {
          // Change percent is positive, display positive arrow image
          changePercentCell.innerHTML = `<span>${quo.dp}<img src="/static/images/GreenArrowUp.png" alt="Positive Arrow" style="vertical-align: middle;" ></span>`;
      } else if (parseFloat(quo.dp) < 0) {
          // Change percent is negative, display negative arrow image
          changePercentCell.innerHTML = `<span>${quo.dp}<img src="/static/images/RedArrowDown.png" alt="Negative Arrow" style="vertical-align: middle;"></span>`;
      } else {
          // Change percent is zero, display text only
          changePercentCell.textContent = quo.dp;
      }

    summaryContent.style.display='block';
}

document.getElementById('summaryTab').addEventListener('click', function() {
  // Check if quoteData is available
  if (quoteData) {
    // Display quote data (e.g., call a display function)
    // displayQuoteData(quoteData);
    displaySummaryData(profileData, quoteData,recData)
  } else {
    // Quote data not available, fetch it again or display an error message
    console.error('Error: Quote data not available');
  }
});


document.getElementById('companyTab').addEventListener('click', function() {
  // Check if quoteData is available
  if (profileData) {
    // Display quote data (e.g., call a display function)
    // displayQuoteData(quoteData);
    displayCompanyData(profileData)
  } else {
    // Quote data not available, fetch it again or display an error message
    console.error('Error: Quote data not available');
  }
});
