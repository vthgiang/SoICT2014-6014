// Component này chưa được sử dụng
import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

const MultipleBarChart = (props) => {

    const [state, setState] = useState({
        lineBar: true
    })

    const chart = useRef(null);
    useEffect(() => {
        renderChart(state);
    }, []);

    useEffect(() => {
        renderChart(state);
    }, [state])
    // Bắt sự kiện thay đổi chế đọ xem biểu đồ
    const handleChangeViewChart = (value) => {
        setState({
            ...state,
            lineBar: value
        })
    }

    useEffect(() => {
        setState({
            ...state,
            nameChart: props.nameChart,
            nameData1: props.nameData1,
            nameData2: props.nameData2,
            nameData3: props.nameData3,
            ratioX: ['x', "2019-07-01", "2019-08-01", "2019-09-01", "2019-10-01", "2019-11-02", "2019-12-01", "2020-01-01", "2020-02-01", "2020-03-01", "2020-04-01", "2020-05-01", "2020-06-01"],
            data1: ['data1', 12.33, 11.33, 10.33, 13.33, 10.33, 11.33, 12.33, 12.33, 11.33, 12.33, 9.33, 10.33],
            data2: ['data2', 13.50, 13.50, 13.50, 12.50, 11.50, 13.50, 10.50, 13.50, 13.50, 11.50, 13.50, 9.50],
            data3: ['data3', 11.50, 12.50, 19.50, 13.50, 13.50, 14.50, 13.50, 10.50, 13.50, 13.50, 12.50, 13.50]
        })
    }, [props, state])

    // Xóa các chart đã render khi chưa đủ dữ liệu
    const removePreviousChart = () => {
        const chart = chart.current;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    const renderChart = (data) => {
        data.data1.shift(); data.data2.shift(); data.data3.shift();
        removePreviousChart();
        let chart = c3.generate({
            bindto: chart.current,
            data: {
                x: 'x',
                columns: [data.ratioX, ['data1', ...data.data1], ['data2', ...data.data2], ['data3', ...data.data3]],
                type: data.lineBar === true ? 'bar' : '',
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
                    data3: data.nameData3
                }
            },
            bar: {
                width: { ratio: 0.8 }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        rotate: -45,
                        multiline: false
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) { return value + '%'; }
                }
            }
        });
    }
    const { lineBar, nameChart } = state;
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">{nameChart}</h3>
                    </div>
                    <div className="box-body dashboard_box_body">
                        <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: %</b></p>
                        <div className="box-tools pull-right">
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${lineBar === false ? 'btn-danger' : null}`} onClick={() => handleChangeViewChart(true)}>Bar chart</button>
                                <button type="button" className={`btn btn-xs ${lineBar === true ? 'btn-danger' : null}`} onClick={() => handleChangeViewChart(false)}>Line chart</button>
                            </div>
                        </div>
                        <div ref={chart}></div>
                    </div>
                </div>
            </React.Fragment>
        )
}

// function mapState(state) {
//     const { employeesManager, department } = state;
//     return { employeesManager, department };
// }

// const actionCreators = {
//     getDepartment: DepartmentActions.get,
// };

const multipleBarChart = connect(null, null)(withTranslate(MultipleBarChart));
export { multipleBarChart as MultipleBarChart };
