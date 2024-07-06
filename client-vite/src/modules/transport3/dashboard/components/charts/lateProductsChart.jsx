import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';
import { DashboardActions } from '../../redux/actions';
import { withRouter } from 'react-router-dom';

function LateProducts ({monthToSearch}) {
    const dispatch = useDispatch()
    const T3Dashboard = useSelector((state) => state.T3dashboard.topLateProducts)
    const LateProducts = useRef(null);
    useEffect(() => {
        barChart();
    });
    useEffect(() => {
        const [month, year] = monthToSearch.split('-');
        dispatch(DashboardActions.getTopLateProducts(month, year))
    }, [dispatch, monthToSearch]);

    const listProductsName = () => {
        return T3Dashboard.map(item => item.goodName);
    };

    const getLateProductNumber = () => {
        const arr = ['Số lần giao trễ hạn']

        const lateOrderNumber = T3Dashboard.map((item) => {
            return item.lateDeliveries
        })

        return arr.concat(lateOrderNumber)
    }
    // Khởi tạo BarChart bằng C3
    const barChart = () => {
        let chart = c3.generate({
            bindto: LateProducts.current,
            data: {
                columns: [
                    // ['Số lần giao trễ hạn', 30, 25, 12, 9, 7]
                    getLateProductNumber()
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
                    // categories: ['Mascara Mabeline', 'Bộ chăm sóc da simple', 'Đèn LED trị mụn', 'Máy massage mặt và cổ SKG', 'Bộ dầu gội, xả Pantene Pro - V']
                    categories: listProductsName()
                },
                y: {
                    label: 'lần'
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
            <section ref={LateProducts}></section>
        </React.Fragment>
    );
}

function mapState(state) {
    return{}
}

const connectedLateProducts = connect(mapState)(withTranslate(withRouter(LateProducts)));
export { connectedLateProducts as LateProducts };
