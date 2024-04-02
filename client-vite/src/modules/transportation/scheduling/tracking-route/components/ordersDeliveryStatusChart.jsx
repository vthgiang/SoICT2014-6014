import React, { Component, useEffect, useRef } from 'react';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

function OrdersDeliveryStatusChart (props) {

    const transportationPieChart = useRef(null);
    const { orderStatus } = props;

    useEffect(() => {
        pieChart();
    });

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        let chart = c3.generate({
            bindto: transportationPieChart.current,
            size: {
                height: 270,
                width: 270,
            },
            data: {
                columns: [
                    ['Đang giao', orderStatus.inProcessNumber],
                    ['Thất bại', orderStatus.failureNumber],
                    ['Đã hoàn thành', orderStatus.deliveredNumber],
                ],
                type: 'donut',
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
            donut: {
                title: `Tổng ${orderStatus.ordersNumber} đơn`
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

export default (withTranslate(OrdersDeliveryStatusChart));