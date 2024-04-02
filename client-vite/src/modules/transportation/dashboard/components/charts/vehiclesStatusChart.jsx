import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';

function VehiclesStatusChart (props) {

    const vehiclesStatusChart = useRef(null);
    useEffect(() => {
        pieChart();
    });

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        let chart = c3.generate({
            bindto: vehiclesStatusChart.current,
            data: {
                x: 'x',
                columns: [
                    ['x', moment().subtract(6, "days").format("DD-MM"), moment().subtract(5, "days").format("DD-MM"), moment().subtract(4, "days").format("DD-MM"), moment().subtract(3, "days").format("DD-MM"), moment().subtract(2, "days").format("DD-MM"), moment().subtract(1, "days").format("DD-MM") , moment().format("DD-MM")],
                    ['vehiclesPerformance', 94,60,35,50,85,57,50
                    ],
                    ['fillRate', 30,50,25,60,47,56,50
                ],
                ],
                type: 'spline',
                names: {
                    'vehiclesPerformance': "Hiệu suất sử dụng",
                    'fillRate': "Tỉ lệ lấp đầy",
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
                    label: '%'
                }
            },

            color: {
                pattern: ['#0793de', '#f5b105']
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
            <section ref={vehiclesStatusChart}></section>
        </React.Fragment>
    );
}


function mapState(state) {
    
}

const connectedVehiclesStatusChart = connect(mapState)(withTranslate(VehiclesStatusChart));
export { connectedVehiclesStatusChart as VehiclesStatusChart };