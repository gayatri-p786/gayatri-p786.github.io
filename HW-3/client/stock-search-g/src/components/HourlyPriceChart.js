import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/css/highcharts.css';

function HourlyPriceChart({ historicalData, isMarketOpen }) {
    const [chartOptions, setChartOptions] = useState(null);

    function isTimestampBetweenYesterdayAndToday(timestamp) {
        // Convert the Unix timestamp to milliseconds
        const dateToCheck = new Date(timestamp * 1000);
        
        // Get the current date
        const currentDate = new Date();
        
        // Get the start of yesterday
        const yesterdayStart = new Date();
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0); // Set time to midnight
        
        // Get the end of yesterday
        const yesterdayEnd = new Date();
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        yesterdayEnd.setHours(23, 59, 59, 999); // Set time to end of day
        
        // Check if the date falls between yesterday's start and end
        const isBetweenYesterday = dateToCheck >= yesterdayStart && dateToCheck <= yesterdayEnd;
        
        // Check if the date falls between today's start and end
        const isBetweenToday = dateToCheck >= currentDate.setHours(0, 0, 0, 0) && dateToCheck <= currentDate;
        
        return isBetweenYesterday || isBetweenToday;
    }
    
    function filterDataForMarketOpen(historicalData) {
        const currentDate = new Date();
        const filteredData = historicalData.results.filter(entry => {
            return isTimestampBetweenYesterdayAndToday(entry.t);
        });
        return filteredData;
    }
    
    // Example usage
    
    

    useEffect(() => {
        if (historicalData && historicalData.results.length > 0) {
            let filteredData;
            if (isMarketOpen) {
                // Market is open: show stock price variation from previous day to current day
                const currentDate = new Date();
                const currentDay = currentDate.getDate();
                console.log("Current day:", currentDay);
                const marketOpenData = filterDataForMarketOpen(historicalData);
                console.log(marketOpenData);
            } else {
                // Market is closed: show stock price variation from one day before closing to the date when the market was closed
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                console.log("Yesterday:", yesterday);
                // Example condition: Select entries where the value is greater than 25
                
                });
            }
            const hourlyPrices=[];

            // const hourlyPrices = filteredData.map(entry => ({
            //     x: new Date(entry.t * 1000).getTime(),
            //     y: entry.c
            // }));

            const options = {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Hourly Price Variation Chart'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: 'Stock Price'
                    }
                },
                series: [{
                    name: 'Price',
                    data: hourlyPrices
                }]
            };

            setChartOptions(options);
        }
    }, [historicalData, isMarketOpen]);

    return (
        <div>
            {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
        </div>
    );
}

export default HourlyPriceChart;
