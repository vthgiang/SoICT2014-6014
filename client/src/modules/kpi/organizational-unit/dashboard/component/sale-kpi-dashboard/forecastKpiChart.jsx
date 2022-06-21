import React, { useEffect } from 'react';
import { connect } from 'react-redux';


import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

function ForecastKpiChart(props) {
    const { data } = props;
    const refMultiLineChart = React.createRef();

    useEffect(() => {
        // const revenue = ['Doanh thu'];
        // const cost = ['Chi phí'];
        // const profit = ['Lợi nhuận'];
        // const labels = [];
        // for (let item of data) {
        //     revenue.push(item.revenue);
        //     cost.push(item.cost);
        //     profit.push(item.profit);
        //     labels.push(item.date)
        // }
        multiLineChart();
    }, [])

    const removePreviosMultiLineChart = () => {
        const chart = refMultiLineChart.current;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild)
            }
        }
    };

    const multiLineChart = () => {
        removePreviosMultiLineChart();
        const { translate } = props;

        // let dataMultiLineChart = setDataMultiLineChart();

        let chart = c3.generate({
            bindto: refMultiLineChart.current,
            data: {
                x: "Tháng",
                xFormat: '%m/%d/%Y',
                colors: {
                    "Thực tế": '#4472C4',
                    "Trung bình": '#27ae60',
                    "Biên dưới": '#ED7D31',
                    "Biên trên": '#FFC000'
                },
                json: {
                    "Tháng": ['01-2022', '02-2022', '03-2022', '04-2022', '05-2022', '06-2022', '07-2022', '08-2022'],
                    "Trung bình": [78, 85, 90, 87, 92, 82, 86, 88, 92],
                    "Biên dưới": [78, 85, 90, 87, 92, 82, 82, 84, 85],
                    "Biên trên": [78, 85, 90, 87, 92, 82, 90, 92, 98],
                    "Thực tế": [78, 85, 90, 87, 92, 82],
                }
            },
            point: {
                r: 0
            },
            axis: {
                x: {
                    type: "categories"
                }
            },
            y: {
                padding: { top: 0, bottom: 0 },
                min: 0,
                // tick: {
                //     format: d3.format(",")
                // }
            }
        });
    };


    const { translate } = props;


    return (
        <React.Fragment>
            <section ref={refMultiLineChart}></section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actions = {
    // getAllOrganizationalUnitKpiSetByTime: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTime
}

const connectedResultsOfOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(ForecastKpiChart));
export { connectedResultsOfOrganizationalUnitKpiChart as ForecastKpiChart };

