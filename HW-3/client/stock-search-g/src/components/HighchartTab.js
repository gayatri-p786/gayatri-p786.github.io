import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import IndicatorsCore from "highcharts/indicators/indicators";
import IndicatorZigzag from "highcharts/indicators/zigzag";
import IndicatorVBP from "highcharts/indicators/volume-by-price";

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);
IndicatorVBP(Highcharts);

const HighChartsTab = ({ historicalData }) => {
    const [chartOptions, setChartOptions] = useState(null);
    const ohlc = historicalData.results.map(data => ([
        new Date(data.t).getTime(), // Timestamp
        data.o,
        data.h,
        data.l,
        data.c 
    ]));
    
    const volume = historicalData.results.map(data => ([
        new Date(data.t).getTime(), // Timestamp
        data.v // Volume
    ]));

    const groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
    ], [
        'month',
        [1, 2, 3, 4, 6]
    ]];

    useEffect(() => {
        if (historicalData) {
            // Create the chart options
            
            const options = {
                rangeSelector: {
                    selected: 2
                },
        
                title: {
                    text: 'Historical Data'
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
                    id: 'ticker',
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
                    linkedTo: 'ticker',
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
                    linkedTo: 'ticker',
                    zIndex: 1,
                    marker: {
                        enabled: false
                    }
                }]
            };
            setChartOptions(options);
        }
    }, [historicalData]);

    return (
        <div>
            {chartOptions ? (
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType={'stockChart'}
                    options={chartOptions}
                />
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
};

export default HighChartsTab;
