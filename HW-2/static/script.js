// main.js

 // Add an event listener to the form
 document.getElementById('searchButton').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default form submission
  // searchStock(); // Call the searchStock function
  if (document.getElementById('stockTicker').checkValidity()) {

    searchStock(); // Call the searchStock function if input is valid
} else {
    // Input is invalid, show required input message
    document.getElementById('stockTicker').reportValidity();
}
});


function displayErrorMessage(message) {
  var errorSection = document.getElementById('errorSection');
  errorSection.style.display = 'block';
  // errorSection.style.backgroundColor = '#dddddd'; // Gray background
  errorSection.innerHTML = message;
}

function searchStock() {
  var stockTicker = document.getElementById('stockTicker').value;
  fetch(`/search_stock?stock_ticker=${stockTicker.toUpperCase()}`,{method:'GET'})
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
        // clearResult();
        displayErrorMessage('Error: No record has been found, please enter a valid symbol');
        document.getElementById('stockTicker').value = stockTicker;
    } 
    else{
      clearResult();
      result.style.display = 'block';
      // displayCompanyData(data);
      // Extract profile and quote data
        profileData = data.profile;
        quoteData = data.quote;
        recData = data.recommendation;
        newsData = data.news;
        chartData = data.chart;
        // Display company data
        // clearResult();
        displayCompanyData(profileData);
        // Update search bar with ticker symbol
        document.getElementById('stockTicker').value = stockTicker;
    
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
                <div class="indicator-cell" style="color: #ed2938;">
                    <div style="line-height: 1;">Strong</div>
                    <div style="line-height: 1;">Sell</div>
                </div>
                  <div class="indicator-cell" id="strongSell">${rec.strongSell}</div>
                  <div class="indicator-cell" id="sell">${rec.sell}</div>
                  <div class="indicator-cell" id="hold">${rec.hold}</div>
                  <div class="indicator-cell" id="buy">${rec.buy}</div>
                  <div class="indicator-cell" id="strongBuy">${rec.strongBuy}</div>
                  <div class="indicator-cell" style="color: #01ff7f;">
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
          changeCell.innerHTML = `<span>${quo.d}<img src="/images/GreenArrowUp.png" alt="Positive Arrow" style="vertical-align: middle;"></span>`;
      } else if (parseFloat(quo.d) < 0) {
          // Change is negative, display negative arrow image
          changeCell.innerHTML = `<span>${quo.d}<img src="/images/RedArrowDown.png" alt="Negative Arrow" style="vertical-align: middle;"></span>`;
      } else {
          // Change is zero, display text only
          changeCell.textContent = quo.d;
      }

      // Check if change percent is positive or negative
      if (parseFloat(quo.dp) > 0) {
          // Change percent is positive, display positive arrow image
          changePercentCell.innerHTML = `<span>${quo.dp}<img src="/images/GreenArrowUp.png" alt="Positive Arrow" style="vertical-align: middle;" ></span>`;
      } else if (parseFloat(quo.dp) < 0) {
          // Change percent is negative, display negative arrow image
          changePercentCell.innerHTML = `<span>${quo.dp}<img src="/images/RedArrowDown.png" alt="Negative Arrow" style="vertical-align: middle;"></span>`;
      } else {
          // Change percent is zero, display text only
          changePercentCell.textContent = quo.dp;
      }

    summaryContent.style.display='block';
}

function displayLatestNews(newsData) {
  activateTab('newsTab', 'newsContent');
  const newsContainer = document.getElementById('newsContent');
  newsContainer.innerHTML = ''; // Clear existing content

  newsData.forEach(article => {
    console.log(article.datetime)
    const articleDate = new Date(article.datetime * 1000);

        // Format the date using toLocaleDateString
        const formattedDate = articleDate.toLocaleDateString('en-US', {
          month: 'long',  
          day: 'numeric',
          year: 'numeric'
        });
      // Create card container
      const cardHtml = `
            <div class="news-card">
                <div class="news-image-container">
                    <img src="${article.image}" alt="News Image" class="news-image">
                </div>
                <div class="news-content">
                    <h3>${article.headline}</h3>
                    <p>${formattedDate}</p>
                    <a href="${article.url}" target="_blank">See Original Post</a>
                </div>
            </div>
        `;
        newsContainer.innerHTML += cardHtml;
  });
  newsContent.style.display='block';
}

async function displayChart (chartData,ticker) {
  activateTab('chartsTab', 'chartsContent');
  const chartsContainer = document.getElementById('chartsContent');
  chartsContainer.innerHTML = ''; // Clear existing content

  const priceData = chartData.price;
  const volumeData = chartData.volume;

  // Get today's date in YYYY-MM-DD format
  const todayDate = new Date().toISOString().split('T')[0];

  console.log(priceData,volumeData);
  console.log(todayDate);

  Highcharts.stockChart('chartsContent', {
    rangeSelector: {
      // Set default zoom level to 7 days
      buttons: [
          {
              type: 'day',
              count: 7,
              text: '7d'
          },
          {
              type: 'day',
              count: 15,
              text: '15d'
          },
          {
              type: 'month',
              count: 1,
              text: '1m'
          },
          {
              type: 'month',
              count: 3,
              text: '3m'
          },
          {
            type: 'month',
            count: 6,
            text: '6m'
        },
          
          
      ],
      selected: 0, 
      inputEnabled: false
  },
  tooltip: {
    // Customize the date format for the tooltip
    dateTimeLabelFormats: {
        millisecond: '%A, %e %b %Y', // For milliseconds
        second: '%A, %e %b %Y',      // For seconds
        minute: '%A, %e %b %Y',      // For minutes
        hour: '%A, %e %b %Y',        // For hours
        day: '%A, %e %b %Y',         // For days
        week: '%A, %e %b %Y',        // For weeks
        month: '%A, %e %b %Y',       // For months
        year: '%A, %e %b %Y'         // For years
    }
},
    title: {
        text: `Stock Price ${ticker} ${todayDate}`
    },
    subtitle: {
        text: '<a href="https://polygon.io/" target="_blank" style="color: blue; text-decoration: underline;">Source: Polygon.io</a>'
    },
    xAxis: {
        events: {
            setExtremes: function(e) {
                // Dynamically adjust pointWidth based on zoom level
                const zoomLevel = e.max - e.min;
                const pointWidth = zoomLevel > 90 * 24 * 3600 * 1000 ? 1 : // 3 months or more
                                  zoomLevel > 30 * 24 * 3600 * 1000 ? 0.5 : // 1 month or more
                                  zoomLevel > 7 * 24 * 3600 * 1000 ? 0.25 : // 7 days or more
                                  zoomLevel > 2 * 24 * 3600 * 1000 ? 0.1 : // 2 days or more
                                  0.05; // Less than 2 days
                // Apply pointWidth to volume series
                this.series[1].update({
                    pointWidth: pointWidth
                }, false);
            }
        }
    },
    yAxis: [{
        // Primary yAxis for price
        title: {
            text: 'Stock Price'
        },
        labels: {
            align: 'right',
            x: -3
        },
        opposite: false // Align on left side
    }, {
        // Secondary yAxis for volume
        title: {
            text: 'Volume'
        },
        labels: {
            align: 'right',
            x: -3
        },
        opposite: true, // Align on right side
    }],
    
    series: [{
        name: 'Stock Price',
        data: priceData,
        type: 'area',
        yAxis: 0, // Link to the first yAxis
        color: 'rgba(124, 181, 236, 0.5)', // Color for the price series
        tooltip: {
            valueDecimals: 2 // Show two decimals in tooltip
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
        },
        stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        ]
      },
    }, {
        name: 'Volume',
        data: volumeData,
        type: 'column',
        yAxis: 1, // Link to the second yAxis
        color: 'rgba(0, 0, 0, 0.8)', // Color for the volume bars
        tooltip: {
            valueDecimals: 0 // Show integer values in tooltip
        },
        pointWidth: 0.25 // Initial pointWidth for volume bars
    }],
    
});

  chartsContent.style.display='block';
}

document.getElementById('chartsTab').addEventListener('click', function() {
  // Check if quoteData is available
  if (chartData) {
    // Display quote data (e.g., call a display function)
    // displayQuoteData(quoteData);
    displayChart(chartData,document.getElementById('stockTicker').value)
    
  } else {
    // Quote data not available, fetch it again or display an error message
    console.error('Error: Chart data not available');
  }
});

document.getElementById('newsTab').addEventListener('click', function() {
  // Check if quoteData is available
  if (newsData) {
    // Display quote data (e.g., call a display function)
    // displayQuoteData(quoteData);
    displayLatestNews(newsData)
  } else {
    // Quote data not available, fetch it again or display an error message
    console.error('Error: News data not available');
  }
});

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
    console.error('Error: Profile data not available');
  }
});

function createChart(series) {

  Highcharts.stockChart('container', {

      rangeSelector: {
          selected: 4
      },

      yAxis: {
          labels: {
              format: '{#if (gt value 0)}+{/if}{value}%'
          },
          plotLines: [{
              value: 0,
              width: 2,
              color: 'silver'
          }]
      },

      plotOptions: {
          series: {
              compare: 'percent',
              showInNavigator: true
          }
      },

      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
          valueDecimals: 2,
          split: true
      },

      series
  });

}

// (async () => {

//   const names = ['MSFT', 'AAPL', 'GOOG'];

//   /**
//    * Create the chart when all data is loaded
//    * @return {undefined}
//    */


//   const promises = names.map(name => new Promise(resolve => {
//       (async () => {
//           const data = await fetch(`/get_chart?stock_ticker=${stockTicker}`,{method:'GET'})
//               .then(response => response.json());
//           resolve({ name, data });
//       })();
//   }));

//   const series = await Promise.all(promises);
//   createChart(series);

// })();
