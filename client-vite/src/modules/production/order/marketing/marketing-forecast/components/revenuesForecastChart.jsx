import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

function RevenuesForecastChart({data}) {
    const revenuesForecastChart = useRef(null);
    useEffect(() => {
        pieChart(data);
    });

    const pieChart = (data) => {
        if(!data) return;
        let chart = c3.generate({
            bindto: revenuesForecastChart.current,
            data: {
                x: 'x',
                columns: [
                    ['x'].concat(data.map((element) => `${element.code} - ${element.name}`)),
                    // listMonth(),
                    ['Mục tiêu', 300000000, 220000000, 140000000, 193000000, 550000000, 150000000, 160000000,
                        140000000, 220000000, 350000000, 450000000, 200000000, 120000000, 100000000, 200000000,
                        150000000, 150000000, 220000000, 120000000, 343000000, 367000000, 89000000, 189000000,
                        270000000, 280000000, 260000000, 23000000, 140000000, 370000000, 220000000, 180000000,
                        190000000, 180000000, 500000000, 400000000, 430000000, 370000000, 340000000, 120000000,
                        120000000, 130000000, 110000000, 120000000, 310000000, 430000000, 256000000, 356000000,
                        205000000],
                    ['Dự báo'].concat(data.map((element) => element.forecastRevenue))
                ],
                type: 'spline',
                names: {
                    'Mục tiêu': "Doanh thu mục tiêu",
                    'Dự báo': "Doanh thu dự báo"
                }
            },
            padding: {
                top: 20,
                bottom: 20,
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        values: [],
                        outer: false
                    }
                },
                y: {
                    padding: {top: 0, bottom: 10},
                    label: 'VNĐ'
                }
            },

            color: {
                pattern: ['#0793de', '#f5b105', '#000000']
            },
        });
    }

    return (
        <React.Fragment>
            <section ref={revenuesForecastChart}>
            </section>
        </React.Fragment>
    );
}


function mapState(state) {

}
// const connectedRevenuesForecastChart = connect(mapState)(withTranslate(RevenuesForecastChart));
const connectedRevenuesForecastChart = connect(mapState)(withTranslate(RevenuesForecastChart));
export { connectedRevenuesForecastChart as RevenuesForecastChart };
