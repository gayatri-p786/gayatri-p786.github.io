import React, { useEffect } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsSMA from 'highcharts/indicators/indicators';
import HighchartsVBP from 'highcharts/indicators/volume-by-price';

HighchartsSMA(Highcharts);
HighchartsVBP(Highcharts);

const TabCharts = ({ historicalData, latestPriceData }) => {
        
    useEffect(() => {

        (async () => {

            // Load the dataset
            const data = await fetch(
                'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
            ).then(response => response.json());
        
            // split the data set into ohlc and volume
            const ohlc = [],
                volume = [],
                dataLength = data.length,
                // set the allowed units for data grouping
                groupingUnits = [[
                    'week',                         // unit name
                    [1]                             // allowed multiples
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ]];
        
            for (let i = 0; i < dataLength; i += 1) {
                ohlc.push([
                    data[i][0], // the date
                    data[i][1], // open
                    data[i][2], // high
                    data[i][3], // low
                    data[i][4] // close
                ]);
        
                volume.push([
                    data[i][0], // the date
                    data[i][5] // the volume
                ]);
            }
        
            // create the chart
            Highcharts.stockChart('container', {
        
                rangeSelector: {
                    selected: 2
                },
        
                title: {
                    text: 'AAPL Historical'
                },
        
                subtitle: {
                    text: 'With SMA and Volume by Price technical indicators'
                },
        
                yAxis: [{
                    startOnTick: false,
                    endOnTick: false,
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'OHLC'
                    },
                    height: '60%',
                    lineWidth: 2,
                    resize: {
                        enabled: true
                    }
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'Volume'
                    },
                    top: '65%',
                    height: '35%',
                    offset: 0,
                    lineWidth: 2
                }],
        
                tooltip: {
                    split: true
                },
        
                plotOptions: {
                    series: {
                        dataGrouping: {
                            units: groupingUnits
                        }
                    }
                },
        
                series: [{
                    type: 'candlestick',
                    name: 'AAPL',
                    id: 'aapl',
                    zIndex: 2,
                    data: ohlc
                }, {
                    type: 'column',
                    name: 'Volume',
                    id: 'volume',
                    data: volume,
                    yAxis: 1
                }, {
                    type: 'vbp',
                    linkedTo: 'aapl',
                    params: {
                        volumeSeriesID: 'volume'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    zoneLines: {
                        enabled: false
                    }
                }, {
                    type: 'sma',
                    linkedTo: 'aapl',
                    zIndex: 1,
                    marker: {
                        enabled: false
                    }
                }]
            });
        })();

            });

        return (
            <div id="container"></div>
        );
    };
    
export default TabCharts;