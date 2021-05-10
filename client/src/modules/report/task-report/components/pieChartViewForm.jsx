import React, { Component, createRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import './transferList.css';
import { chartFunction } from './chart';

function PieChartViewForm(props) {
    const [state, setstate] = useState({

    })
    const { pieChartData, id } = props;
    const refPieChart = createRef();

    useEffect(() => {
        if (props.dataForAxisXInChart && props.pieChartData) {
            let { pieChartData, id } = props;
            setstate({
                ...state,
                id,
                startDate: pieChartData[0][0].slice(0, 6),
                endDate: pieChartData[pieChartData.length - 1][0].slice(0, 6),
                namePieChart: props.namePieChart,
                dataForAxisXInChart: props.dataForAxisXInChart.length > 0 && props.dataForAxisXInChart.map((x, index) => ((index ? '-> ' : '') + chartFunction.formatDataForAxisXInChart(x))),
            })
        }
    }, [JSON.stringify(props.pieChartData)])

    useEffect(() => {
        const { pieChartData, id } = props;
        if (pieChartData) {
            renderPieChart(id, pieChartData)
        }
    }, [JSON.stringify(props.pieChartData)])

    useEffect(() => {
        const { pieChartData, id } = props;
        if (pieChartData) {
            renderPieChart(id, pieChartData)
        }
    }, [])

    function removePrceviousPieChart(id) {
        const chart = refPieChart[id];
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const renderPieChart = (id, data) => {
        removePrceviousPieChart(id);
        let chart = c3.generate({
            bindto: document.getElementById(id),
            // Căn lề biểu đồ

            size: {
                height: 350,
                width: 480,
            },
            data: {
                columns: data,
                type: 'pie',
            },
            legend: {
                position: (data.length > 9) ? 'right' : 'bottom',
                // position: 'right',
                show: true
            }
        })
    }

    const { namePieChart, startDate, endDate, dataForAxisXInChart } = state;
    return (
        <React.Fragment>
            <div className="box" >
                <div className="box-header with-border">
                    <h4 className="box-title report-title"><span style={{ marginRight: '7px' }}>{`Biểu đồ tròn thống kê trường thông tin ${namePieChart ? (namePieChart + ' ') : ''} của các công việc từ `}</span>{`${startDate}`} đến {`${endDate}`}</h4>
                </div>
                <div className="box-body report-box">
                    <p className="box-body"><span style={{ marginRight: '7px' }}>Chiều dữ liệu:</span> {`${dataForAxisXInChart && dataForAxisXInChart.length > 0 ? dataForAxisXInChart.join(' ') : 'Thời gian'}`}</p>
                    <div id={id}></div>
                </div>
            </div >
        </React.Fragment>
    );

}

const pieChart = connect(null, null)(withTranslate(PieChartViewForm));
export { pieChart as PieChartViewForm };

