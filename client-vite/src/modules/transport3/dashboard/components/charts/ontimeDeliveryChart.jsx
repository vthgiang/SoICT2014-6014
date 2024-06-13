import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';
import { DashboardActions } from '../../redux/actions';

function OnTimeDeliveryChart (props) {
    const dispatch = useDispatch()
    const T3Dashboard = useSelector((state) => state.T3dashboard)
    const ontimeDeliveryChart = useRef(null);
    useEffect(() => {
        pieChart();
    });

    useEffect(() => {
        dispatch(DashboardActions.getOntimeDeliveryRate())
    },[dispatch]);



    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        let chart = c3.generate({
            bindto: ontimeDeliveryChart.current,
            data: {
                x: 'x',
                columns: [
                    ['x', moment().subtract(6, "days").format("DD-MM"), moment().subtract(5, "days").format("DD-MM"), moment().subtract(4, "days").format("DD-MM"), moment().subtract(3, "days").format("DD-MM"), moment().subtract(2, "days").format("DD-MM"), moment().subtract(1, "days").format("DD-MM") , moment().format("DD-MM")],
                    ['actualOntimeDeliveryRate', 94,60,35,50,85,57,T3Dashboard.onTimeDeliveryData
                    ],
                    ['estimatedOntimeDeliveryRate', 30,50,25,60,47,56,50
                    ],
                    ['plannedOntimeDeliveryRate', 32,52,24,62,43,52,44
                    ],
                ],
                type: 'spline',
                names: {
                    'actualOntimeDeliveryRate': "Tỉ lệ giao hàng đúng hạn thực tế",
                    'estimatedOntimeDeliveryRate': "Tỉ lệ giao hàng đúng hạn dự kiến",
                    'plannedOntimeDeliveryRate': "Tỉ lệ giao hàng đúng hạn kế hoạch",
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
                pattern: ['#0793de', '#f5b105', '#000000']
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
            {console.log(T3Dashboard)}
            ABC
        </React.Fragment>
    );
}


function mapState(state) {
    
}

const connectedOnTimeDeliveryChart = connect(mapState)(withTranslate(OnTimeDeliveryChart));
export { connectedOnTimeDeliveryChart as OnTimeDeliveryChart };