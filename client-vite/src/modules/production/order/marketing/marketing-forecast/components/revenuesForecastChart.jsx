import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

function RevenuesForecastChart() {
    const revenuesForecastChart = useRef(null);
    useEffect(() => {
        pieChart();
    });

    const pieChart = () => {
        let chart = c3.generate({
            bindto: revenuesForecastChart.current,
            data: {
                x: 'x',
                columns: [
                    ['x', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
                    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
                    '41', '42', '43', '44', '45', '46', '47', '48'],
                    // listMonth(),
                    ['Mục tiêu', 170000000, 160000000, 150000000, 160000000, 130000000, 90000000, 110000000,
                        130000000, 90000000, 70000000, 50000000, 70000000, 30000000, 40000000, 30000000,
                        130000000, 90000000, 70000000, 50000000, 70000000, 30000000, 240000000, 270000000,
                        130000000, 90000000, 70000000, 50000000, 70000000, 30000000, 40000000, 30000000,
                        130000000, 90000000, 180000000, 150000000, 170000000, 130000000, 140000000, 180000000,
                        130000000, 90000000, 70000000, 50000000, 70000000, 30000000, 40000000, 30000000,
                        130000000],
                    ['Dự báo', 176427408, 175256304, 173146112, 113436000, 113039088, 98029544, 105451336,
                    124172280, 82332184, 60558200, 52766340, 56566748, 11757453, 25269668, 13647656,
                    36582400, 40323216, 37915868, 4054307, 3092153, 2457204, 245434240, 245756160, 200478592,
                    101873032, 105165320, 97667112, 22827664, 16038986, 19087912, 47343252, 46729964, 49064348,
                    225060096, 217436800, 223102560, 202971520, 265124128, 271377728, 99382512, 117778016,
                    117504488, 83907984, 85453016, 74668496, 113695800, 128720448, 119272848]
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
