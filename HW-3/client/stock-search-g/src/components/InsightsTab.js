// InsightsTab.jsx

import React from 'react';
import RecommendationChart from './recChart';
import CompanyEarningsChart from './EarningsChart';

const InsightsTab = ({ sentimentData, earningData, recommendationData, ticker }) => {
    // Your logic for rendering insights based on sentimentData and historicalData
    const calculateInsiderSentiments = () => {
        let totalMspr = 0;
        let positiveMspr = 0;
        let negativeMspr = 0;
        let totalChange = 0;
        let positiveChange = 0;
        let negativeChange = 0;

        // console.log("earn",earningData);

        sentimentData.data.forEach(sentiment => {
            totalMspr += sentiment.mspr;
            totalChange += sentiment.change;

            if (sentiment.mspr > 0) {
                positiveMspr += sentiment.mspr;
            } else if (sentiment.mspr < 0) {
                negativeMspr += sentiment.mspr;
            }

            if (sentiment.change > 0) {
                positiveChange += sentiment.change;
            } else if (sentiment.change < 0) {
                negativeChange += sentiment.change;
            }
        });

        return {
            totalMspr,
            positiveMspr,
            negativeMspr,
            totalChange,
            positiveChange,
            negativeChange
        };
    };

    const { totalMspr, positiveMspr, negativeMspr, totalChange, positiveChange, negativeChange } = calculateInsiderSentiments();

    return (
        <div>
            <div className='text-center' style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <h3>Insider Sentiments</h3>
                <div className='mx-auto'>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Header</th>
                            <th>MSPR</th>
                            <th>Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total</td>
                            <td>{totalMspr}</td>
                            <td>{totalChange}</td>
                        </tr>
                        <tr>
                            <td>Positive</td>
                            <td>{positiveMspr}</td>
                            <td>{positiveChange}</td>
                        </tr>
                        <tr>
                            <td>Negative</td>
                            <td>{negativeMspr}</td>
                            <td>{negativeChange}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    {/* Render the RecommendationChart component */}
                    <div className="mb-4" style={{ paddingTop: '20px', paddingBottom: '20px', marginBottom: '40px' }}>
                        <RecommendationChart recommendationData={recommendationData} />
                    </div>
                </div>
                <div className="col-md-6">
                    {/* Render the CompanyEarningsChart component */}
                    <div className="mb-4" style={{ paddingTop: '20px', paddingBottom: '20px', marginBottom: '20px' }}>
                        <CompanyEarningsChart earningsData={earningData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsTab;
