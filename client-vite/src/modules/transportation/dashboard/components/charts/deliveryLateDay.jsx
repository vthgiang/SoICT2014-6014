import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';

function DeliveryLateDay (props) {

    const DeliveryLateDay = useRef(null);
    useEffect(() => {
        pieChart();
    });

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        let chart = c3.generate({
            bindto: DeliveryLateDay.current,
            data: {
                x: 'x',
                columns: [
                    ['x', moment().subtract(6, "days").format("DD-MM"), moment().subtract(5, "days").format("DD-MM"), moment().subtract(4, "days").format("DD-MM"), moment().subtract(3, "days").format("DD-MM"), moment().subtract(2, "days").format("DD-MM"), moment().subtract(1, "days").format("DD-MM") , moment().format("DD-MM")],
                    ['deliveryLateDayAverage', 1,3,2,5,7,2,4
                    ],
                ],
                type: 'spline',
                names: {
                    'deliveryLateDayAverage': "Số ngày trễ hạn trung bình",
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
                    label: 'days'
                }
            },

            color: {
                pattern: ['#0793de']
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
            <section ref={DeliveryLateDay}></section>
        </React.Fragment>
    );
}


function mapState(state) {
    
}

const connectedDeliveryLateDay = connect(mapState)(withTranslate(DeliveryLateDay));
export { connectedDeliveryLateDay as DeliveryLateDay };