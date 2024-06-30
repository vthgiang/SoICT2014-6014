import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';
import { DashboardActions } from '../../redux/actions';
import { withRouter } from 'react-router-dom';

function DayOfWeek ({monthToSearch}) {
    const dispatch = useDispatch()
    const T3Dashboard = useSelector((state) => state.T3dashboard.topLateDeliveryDay)
    const DayOfWeek = useRef(null);
    useEffect(() => {
        barChart();
    });
    useEffect(() => {
        const [month, year] = monthToSearch.split('-');
        dispatch(DashboardActions.getTopLateDeliveryDay(month, year))
    }, [dispatch, monthToSearch]);

    
    const dayOfWeekMap = {
        "0": "Chủ nhật",
        "1": "Thứ hai",
        "2": "Thứ ba",
        "3": "Thứ tư",
        "4": "Thứ năm",
        "5": "Thứ sáu",
        "6": "Thứ bảy"
    };

    const listDayOfWeek = () => {
        return T3Dashboard.map(item => dayOfWeekMap[item.dayOfWeek]);
    };

    const getLateOrderNumber = () => {
        const arr = ['Số đơn hàng trễ hạn']

        const lateOrderNumber = T3Dashboard.map((item) => {
            return item.lateDeliveries
        })

        return arr.concat(lateOrderNumber)
    }
    // Khởi tạo BarChart bằng C3
    const barChart = () => {
        let chart = c3.generate({
            bindto: DayOfWeek.current,
            data: {
                columns: [
                    // getLateOrderNumber()
                    ['Số đơn hàng trễ hạn', 15, 9, 7, 6, 4]
                ],
                type: 'bar',
                labels: true
            },
            padding: {
                top: 20,
                bottom: 20,
            },

            axis: {
                x: {
                    type: 'category',
                    // categories: listDayOfWeek()
                    categories: ['Thứ 6', 'Thứ 2', 'Thứ 3', 'Thứ 5', 'Thứ 4']
                },
                y: {
                    label: 'đơn'
                }, 
                rotated: true
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
            <section ref={DayOfWeek}></section>
        </React.Fragment>
    );
}

function mapState(state) {
    return{}
}

const connectedDayOfWeek = connect(mapState)(withTranslate(withRouter(DayOfWeek)));
export { connectedDayOfWeek as DayOfWeek };
