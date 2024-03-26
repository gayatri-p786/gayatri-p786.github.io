import React, { useEffect } from 'react';
// import Highcharts from 'highcharts/highstock';
import * as Highcharts from 'highcharts/highstock';
// import HC_exporting from 'highcharts/modules/exporting';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsSMA from 'highcharts/indicators/indicators';
import IndicatorsCore from "highcharts/indicators/indicators";
import IndicatorZigzag from "highcharts/indicators/zigzag";
import IndicatorVBP from "highcharts/indicators/volume-by-price";


// import HighchartsVBP from 'highcharts/indicators/volume-by-price';

// HC_exporting(Highcharts);
// HighchartsMore(Highcharts);
IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);
IndicatorVBP(Highcharts);

// HighchartsSMA(Highcharts);
// HighchartsVBP(Highcharts);

const ChartsTab = ({ historicalData }) => {
        
    useEffect(() => {

        // console.log(historicalData);
        // console.log(latestPriceData);

        if (historicalData) {
            const groupingUnits = [[
                'week',                         // unit name
                [1]                             // allowed multiples
            ], [
                'month',
                [1, 2, 3, 4, 6]
            ]];
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

            // console.log('Volume data:', volume);
            // console.log('OHLC data:', ohlc);

            Highcharts.stockChart('chartcontainer', {
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
                    name: 'OHLC',
                    id: 'Ticker',
                    data: ohlc,
                    zIndex: 2
                }, {
                    type: 'column',
                    name: 'Volume',
                    id: 'volume',
                    data: volume,
                    yAxis: 1
                }, {
                    type: 'vbp',
                    linkedTo: 'Ticker',
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
                    linkedTo: 'Ticker',
                    zIndex: 1,
                    marker: {
                        enabled: false
                    }
                }]
            });
        }
    }, [historicalData]);

    return (
        <div id="chartcontainer"></div>
    );
};

export default ChartsTab;
