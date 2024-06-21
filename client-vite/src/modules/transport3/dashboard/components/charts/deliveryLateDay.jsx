import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';
import { DashboardActions } from '../../redux/actions';
import { withRouter } from 'react-router-dom';

function DeliveryLateDay (props) {
    const dispatch = useDispatch()
    const T3Dashboard = useSelector((state) => state.T3dashboard)

    useEffect(() => {
        dispatch(DashboardActions.getDeliveryLateDayAveragePerMonth())
    },[dispatch]);

    const DeliveryLateDay = useRef(null);
    useEffect(() => {
        pieChart();
    });

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
            {/* {console.log(T3Dashboard)} */}
        </React.Fragment>
    );
}


function mapState(state) {
    
}

// const connectedDeliveryLateDay = connect(mapState)(withTranslate(DeliveryLateDay));
const connectedDeliveryLateDay = connect(mapState)(withTranslate(withRouter(DeliveryLateDay)));
export { connectedDeliveryLateDay as DeliveryLateDay };
