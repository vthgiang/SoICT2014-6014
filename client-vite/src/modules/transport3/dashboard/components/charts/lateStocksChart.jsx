import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';
import { DashboardActions } from '../../redux/actions';
import { withRouter } from 'react-router-dom';

function LateStocks ({monthToSearch}) {
    const dispatch = useDispatch()
    const T3Dashboard = useSelector((state) => state.T3dashboard.topLateStocks)
    const LateStocks = useRef(null);
    useEffect(() => {
        barChart();
    });
    useEffect(() => {
        const [month, year] = monthToSearch.split('-');
        dispatch(DashboardActions.getTopLateStocks(month, year))
    }, [dispatch, monthToSearch]);

    const listStocksName = () => {
        return T3Dashboard.map(item => item.stockName);
    };

    const getLateOrderNumber = () => {
        const arr = ['Số lượng đơn hàng lấy sản phẩm từ kho trễ hạn']

        const lateOrderNumber = T3Dashboard.map((item) => {
            return item.lateDeliveries
        })

        return arr.concat(lateOrderNumber)
    }
    // Khởi tạo BarChart bằng C3
    const barChart = () => {
        let chart = c3.generate({
            bindto: LateStocks.current,
            data: {
                columns: [
                    ['Số lượng đơn hàng lấy sản phẩm từ kho trễ hạn', 20, 11]
                    // getLateOrderNumber()
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
                    // categories: ['Kho Trần Đại Nghĩa', 'Kho AEON Mall Hà Đông', 'Kho AEON Mall Long Biên', 'Trung tâm cung cấp nông sản Vineco', 'Big C Mê Linh']
                    categories: listStocksName()
                },
                y: {
                    label: '%'
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
            <section ref={LateStocks}></section>
        </React.Fragment>
    );
}

function mapState(state) {
    return{}
}

const connectedLateStocks = connect(mapState)(withTranslate(withRouter(LateStocks)));
export { connectedLateStocks as LateStocks };
