import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const CompanyEarningsChart = ({ earningsData }) => {
    // Extracting data from earningsData
    const categories = earningsData.map(data => data.period);
    const surpriseValues = earningsData.map(data => data.surprise);
    const actualData = earningsData.map(data => data.actual);
    const estimateData = earningsData.map(data => data.estimate);

    // Define color legend items
    const colorLegends = [{
        name: 'Actual',
        color: 'blue'
    }, {
        name: 'Estimate',
        color: 'purple'
    }];

    // Define chart options
    const chartOptions = {
        chart: {
            type: 'spline',
            inverted: false // Make it false to have x-axis as period
        },
        title: {
            text: 'Company Earnings',
            align: 'center'
        },
        xAxis: {
            categories: categories,
            title: {
                text: ''
            },
            labels: {
                formatter: function() {
                    const index = this.pos;
                    return `<span style="text-align: center; display: block;">${categories[index]}</span><br><span style="text-align: left">Surprise: ${surpriseValues[index]}</span>`;
                },
                useHTML: true
            }
        },
        yAxis: {
            title: {
                text: 'Quarterly EPS'
            },
            labels: {
                format: '{value}'
            },
            lineWidth: 2,
            tickInterval: 0.1
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            color: 'black'
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x}: {point.y}'
        },
        series: [{
            name: 'Actual',
            data: actualData,
            color: 'blue'
        }, {
            name: 'Estimate',
            data: estimateData,
            color: 'purple'
        }]
    };

    return (
        <div className="d-flex justify-content-center">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};

export default CompanyEarningsChart;
