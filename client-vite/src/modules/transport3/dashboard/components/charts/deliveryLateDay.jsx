import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';
import { DashboardActions } from '../../redux/actions';
import { withRouter } from 'react-router-dom';

function DeliveryLateDay ({monthToSearch}) {
    const dispatch = useDispatch()
    const T3Dashboard = useSelector((state) => state.T3dashboard)
    console.log(T3Dashboard.deliveryLateDayAverage)
    console.log(monthToSearch)

    useEffect(() => {
        const [month, year] = monthToSearch.split('-');
        dispatch(DashboardActions.getDeliveryLateDayAveragePerMonth(month, year))
    },[dispatch, monthToSearch]);

    const DeliveryLateDay = useRef(null);
    useEffect(() => {
        pieChart();
    });

    const listMonth = () => {
        const arr = ['x']

        const formatData = T3Dashboard.deliveryLateDayAverage.map((item) => {
            return item.month
        })

        return arr.concat(formatData)
    }

    const generateDeliveryLateDayAverage = () => {
        const arr = ['deliveryLateDayAverage']

        const formatData = T3Dashboard.deliveryLateDayAverage.map((item) => {
            return item.lateDayAverage
        })
        return arr.concat(formatData)
    }
    
    const redirectToDetailPage = () => {
        // Thực hiện chuyển hướng đến trang thông tin orders
        props.history.push('/manage-transport3-order');
    };

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        let chart = c3.generate({
            bindto: DeliveryLateDay.current,
            data: {
                x: 'x',
                columns: [
                    listMonth(),
                    generateDeliveryLateDayAverage(),
                    // ['deliveryLateDayAverage', 2.5, 1.2, 3.6, 4, 3.2, 3]
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
            <button
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: '10', // Để đảm bảo nút hiển thị trước biểu đồ
                }}
                onClick={redirectToDetailPage}
            >
                Chi tiết
            </button>
        </React.Fragment>
    );
}


function mapState(state) {
    
}

// const connectedDeliveryLateDay = connect(mapState)(withTranslate(DeliveryLateDay));
const connectedDeliveryLateDay = connect(mapState)(withTranslate(withRouter(DeliveryLateDay)));
export { connectedDeliveryLateDay as DeliveryLateDay };
