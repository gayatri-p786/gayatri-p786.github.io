import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const RecommendationChart = ({ recommendationData }) => {
    // Extracting data from recommendationData
    const categories = recommendationData.map(data => data.period);
    const buyData = recommendationData.map(data => data.buy);
    const sellData = recommendationData.map(data => data.sell);
    const holdData = recommendationData.map(data => data.hold);
    const strongBuyData = recommendationData.map(data => data.strongBuy);
    const strongSellData = recommendationData.map(data => data.strongSell);

    // Define custom colors
    const colors = {
        strongSell: 'rgba(115,40,40,255)',
        sell: 'rgba(240,80,80,255)',
        hold: 'rgb(173,125,46)',
        buy: 'rgba(35,175,80,255)',
        strongBuy: 'rgba(25,95,50,255)'
    };

    // Define chart options
    const chartOptions = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Recommendation Trends', // Chart title
            align: 'center' // Center the title
        },
        xAxis: {
            categories: categories,
            title: {
                text: '' // Empty string to remove the x-axis title
            },
            labels:{
                enabled:true
            }
        },
        yAxis: {
            title: {
                text: '#Analysis'
            },
            stackLabels: {
                enabled: true
            }
        },
        
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        // 
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            color: 'black'
        },
        series: [{
            name: 'Strong Buy',
            data: strongBuyData,
            color: colors.strongBuy
        }, {
            name: 'Buy',
            data: buyData,
            color: colors.buy
        }, {
            name: 'Hold',
            data: holdData,
            color: colors.hold
        }, {
            name: 'Sell',
            data: sellData,
            color: colors.sell
        }, {
            name: 'Strong Sell',
            data: strongSellData,
            color: colors.strongSell
        }]
    };

    return (
        <div className="d-flex justify-content-center">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};

export default RecommendationChart;
