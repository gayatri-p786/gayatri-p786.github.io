import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/css/highcharts.css';

function HourlyPriceChart({ chartData, isGreen }) {
    const [chartOptions, setChartOptions] = useState(null);
    const lineColor = isGreen ? 'green' : 'red';

    useEffect(() => {
        if (chartData && chartData.results) {
            const hourlyPrices = chartData.results.map(data => ({
                x: new Date(data.t).getTime(), // Convert timestamp to milliseconds
                y: data.c // Use the 'c' key for stock price
            }));

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
                        text: null // Remove stock price label
                    },
                    opposite: true // Align yAxis to the right
                },
                series: [{
                    name: 'Price',
                    data: hourlyPrices,
                    color: lineColor, // Set line color based on prop
                    marker: {
                        enabled: false // Disable data markers
                    }
                }]
            };

            setChartOptions(options);
        }
    }, [chartData, isGreen]);

    return (
        <div>
            {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
        </div>
    );
}

export default HourlyPriceChart;
