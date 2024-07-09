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
                    ['Mục tiêu', 600000000, 800000000, 650000000, 503000000, 660000000, 490000000, 300000000,
                        400000000, 450000000, 350000000, 950000000, 200000000, 120000000, 100000000, 200000000,
                        150000000, 150000000, 220000000, 120000000, 543000000, 567000000, 1189000000, 189000000,
                        270000000, 280000000, 260000000, 63000000, 440000000, 370000000, 520000000, 180000000,
                        190000000, 180000000, 1300000000, 1100000000, 1200000000, 1570000000, 1340000000, 1120000000,
                        520000000, 630000000, 510000000, 620000000, 710000000, 530000000, 556000000, 656000000,
                        705000000],
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
