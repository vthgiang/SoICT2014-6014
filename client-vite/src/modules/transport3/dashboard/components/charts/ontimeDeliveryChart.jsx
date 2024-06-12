import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';

function OnTimeDeliveryChart (props) {

    const ontimeDeliveryChart = useRef(null);
    useEffect(() => {
        pieChart();
    });

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        let chart = c3.generate({
            bindto: ontimeDeliveryChart.current,
            data: {
                x: 'x',
                columns: [
                    ['x', moment().subtract(6, "months").format("MM-YYYY"), moment().subtract(5, "months").format("MM-YYYY"), moment().subtract(4, "months").format("MM-YYYY"), moment().subtract(3, "months").format("MM-YYYY"), moment().subtract(2, "months").format("MM-YYYY"), moment().subtract(1, "months").format("MM-YYYY") , moment().format("MM-YYYY")],
                    ['onTimeDelivery', 94,60,35,50,85,57,50
                    ],
                ],
                type: 'spline',
                names: {
                    'onTimeDelivery': "Tỉ lệ giao hàng đúng hạn",
                }
            },
            padding: {
                top: 20,
                bottom: 20,
            },

            axis: {
                x: {
                    type: 'category',
                },
                y: {
                    label: '%'
                }
            },

            color: {
                pattern: ['#0793de', '#f5b105']
            },

            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },

            legend: {
                show: true
            }
        });
    }

    return (
        <React.Fragment>
            {/* <button onClick={() => props.getCostOfAllJourney({})}>Test</button> */}
            <section ref={ontimeDeliveryChart}></section>
        </React.Fragment>
    );
}


function mapState(state) {
    
}

const connectedOnTimeDeliveryChart = connect(mapState)(withTranslate(OnTimeDeliveryChart));
export { connectedOnTimeDeliveryChart as OnTimeDeliveryChart };