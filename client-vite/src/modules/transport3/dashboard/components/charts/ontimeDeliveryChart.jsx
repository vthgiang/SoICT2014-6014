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
        dispatch(DashboardActions.getOnTimeDeliveryRatesPerMonth())
        dispatch(DashboardActions.getEstimatedOnTimeDeliveryRatesPerMonth())
    },[dispatch]);



    // Khởi tạo PieChart bằng C3
    const listMonth = () => {
        const arr = ['x']
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const monthList = Array.from({length: currentMonth}, (_, i) => {
            const month = (i + 1).toString().padStart(2, '0');
            return `${month}-${currentYear}`
        })

        return arr.concat(monthList)
    }

    const generateActualOntimeRate = () => {
        const arr = ['actualOntimeDeliveryRate']

        const formatData = T3Dashboard.onTimeDeliveryData.map((item) => {
            return item.onTimeRate
        })

        return arr.concat(formatData)
    }

    const generateEstimatedOntimeRate = () => {
        const arr = ['estimatedOntimeDeliveryRate']

        const formatData = T3Dashboard.estimatedOnTimeDeliveryData.map((item) => {
            return item.onTimeRate
        })

        return arr.concat(formatData)
    }

    const pieChart = () => {
        let chart = c3.generate({
            bindto: ontimeDeliveryChart.current,
            data: {
                x: 'x',
                columns: [
                    listMonth(),
                    generateActualOntimeRate(),
                    generateEstimatedOntimeRate(),
                    ['plannedOntimeDeliveryRate', 80,80,80,80,80,80],
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
        </React.Fragment>
    );
}


function mapState(state) {
    
}

const connectedOnTimeDeliveryChart = connect(mapState)(withTranslate(OnTimeDeliveryChart));
export { connectedOnTimeDeliveryChart as OnTimeDeliveryChart };