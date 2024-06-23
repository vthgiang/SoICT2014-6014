import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';
import { DashboardActions } from '../../redux/actions';
import { withRouter } from 'react-router-dom';

function LateStocks (props) {
    const LateStocks = useRef(null);
    useEffect(() => {
        barChart();
    });
    // Khởi tạo BarChart bằng C3
    const barChart = () => {
        let chart = c3.generate({
            bindto: LateStocks.current,
            data: {
                columns: [
                    ['Số lượng sản phẩm trễ hạn', 30, 200, 100, 400, 150]
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
                    categories: ['cat1', 'cat2', 'cat3', 'cat4', 'cat5']
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
