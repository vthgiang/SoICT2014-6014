import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../production/common-production/request-management/redux/actions';
import { DashboardActions } from '../../redux/actions';

function OrdersInfoChart ({monthToSearch}) {
    const dispatch = useDispatch()
    const T3orderStatus = useSelector((state) => state.T3dashboard.orderStatus)
    const transportationPieChart = useRef(null);

    useEffect(() => {
        pieChart();
    });
    useEffect(() => {
        const [month, year] = monthToSearch.split('-');
        dispatch(DashboardActions.getOrderStatus(month, year))
    }, [dispatch, monthToSearch]);

    const convertOrderStatusToArray = () => {
        const statusMap = {
            1: 'Chưa giao',
            2: 'Đang giao',
            3: 'Thành công',
            4: 'Thất bại'
        };
    
        let resultArray = [];
    
        if (T3orderStatus && typeof T3orderStatus === 'object') {
            for (const [status, count] of Object.entries(T3orderStatus)) {
                const numericStatus = parseInt(status, 10);  // Chuyển đổi khóa sang số nguyên
                if (statusMap.hasOwnProperty(numericStatus)) {
                    resultArray.push([statusMap[numericStatus], count]);
                }
            }
        }
        console.log(resultArray)
        return resultArray;
    }

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        let chart = c3.generate({
            bindto: transportationPieChart.current,
            data: {
                columns: 
                    // [['Chưa giao', 1],
                    // ['Đang giao', 2],
                    // ['Thành công', 3],
                    // ['Thất bại', 4]],
                    convertOrderStatusToArray()
                ,
                type: 'pie',
                colors: {
                    'Chưa giao': '#3383f2',
                    'Đang giao': '#fade0a',
                    'Thất bại': '#ff2d03',
                    'Thành công': '#04de29'
                },
            },
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
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
            <section ref={transportationPieChart}></section>
        </React.Fragment>
    );
}

function mapState(state) {
    const requestManagements = state.requestManagements;
    return { requestManagements }
}
const mapDispatchToProps = {
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
}

const connectedOrdersInfoChart = connect(mapState, mapDispatchToProps)(withTranslate(OrdersInfoChart));
export { connectedOrdersInfoChart as OrdersInfoChart };