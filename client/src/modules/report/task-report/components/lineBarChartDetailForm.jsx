import React, { createRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import './transferList.css';
import { chartFunction } from './chart';

function LineBarChartDetailForm(props) {
    const [state, setState] = useState({
        collapseChart: false,
    })
    let { id, dataForAxisXInChart } = props;

    const refChart = createRef();
    const { startDate, endDate, barLineChartData, collapseChart } = state;
    let typeChart = '';
    if (barLineChartData) {
        typeChart = barLineChartData.typeChart;
    }
    let checkType = '';

    const callCollapseChart = () => {
        setState({
            collapseChart: !state.collapseChart,
        })
    }

    useEffect(() => {
        if (dataForAxisXInChart && props.barLineChartData) {
            let { dataConvert } = props.barLineChartData;
            dataConvert = dataConvert[0];
            setState({
                ...state,
                id,
                barLineChartData: props.barLineChartData,
                startDate: dataConvert[1].slice(0, 6),
                endDate: dataConvert[dataConvert.length - 1].slice(0, 6),
                dataForAxisXInChart: props.dataForAxisXInChart.length > 0 && props.dataForAxisXInChart.map((x, index) => ((index ? '-> ' : '') + chartFunction.formatDataForAxisXInChart(x))),
            })
        }
    }, [JSON.stringify(props.barLineChartData)])

    useEffect(() => {
        const { barLineChartData, id } = props;
        if (barLineChartData) {
            renderBarAndLineChart(id, barLineChartData);
        }
    }, [props.barLineChartData])

    useEffect(() => {
        const { barLineChartData, id } = props;
        if (barLineChartData) {
            renderBarAndLineChart(id, barLineChartData);
        }
    }, [])

    // Xóa các barchart đã render khi chưa đủ dữ liệu
    function removePreviousBarChart(id) {
        const chart = refChart[id];
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const renderBarAndLineChart = (id, data) => {
        removePreviousBarChart(id);
        let newData = data.dataConvert;
        // set height cho biểu đồ
        let getLenghtData = newData[0].length;
        let setHeightChart = (getLenghtData * 40) < 320 ? 320 : (getLenghtData * 60);
        let typeChart = data.typeChart;
        let chart = c3.generate({
            bindto: document.getElementById(id),
            padding: {
                top: 20,
                bottom: 20,
                right: 20
            },
            size: {
                height: setHeightChart,
            },
            data: {
                x: 'x',
                columns: newData,
                type: 'bar',
                labels: true,
                types: typeChart,
            },
            bar: {
                width: {
                    ratio: (getLenghtData < 5) ? 0.4 : 0.7
                }
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category',
                    tick: {
                        multiline: true
                    },
                },
                y: {
                    label: {
                        text: 'Thành tiền',
                        position: 'outer-middle'
                    },
                }
            },

            // tooltip: {
            //     format: {
            //         value: d3.format(',')
            //     }
            // }
        });
    }


    if (Object.values(typeChart).includes("bar") && Object.values(typeChart).includes("line")) {
        checkType = 'Biểu đồ cột và đường thống kê các trường thông tin của các công việc từ: ';
    } else if (Object.values(typeChart).includes("bar") && !Object.values(typeChart).includes("line")) {
        checkType = 'Biểu đồ cột thống kê các trường thông tin của các công việc từ: ';
    } else if (!Object.values(typeChart).includes("bar") && Object.values(typeChart).includes("line")) {
        checkType = 'Biểu đồ đường thống kê các trường thông tin của các công việc từ: ';
    }

    return (
        <div className="row" style={{ marginBottom: '10px' }}>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="box" >
                    <div className="box-header with-border" style={{ display: 'flex' }}>
                        <h4 className="box-title report-title"><span style={{ marginRight: '7px' }}>{checkType != '' && checkType} {`${startDate}`} đến {`${endDate}`}</span></h4>
                        <div className="box-tools pull-right">
                            <button onClick={callCollapseChart} className="btn btn-box-tool" data-toggle="collapse" data-target="#showBarLineChart"><i className={collapseChart ? `fa fa-plus` : `fa fa-minus`}></i></button>
                        </div>
                    </div>
                    <div className=" box-body lineBarChart in" data-toggle="collapse" aria-expanded="true" id="showBarLineChart">
                        <p className="box-body" ><span style={{ marginRight: '7px' }}>Chiều dữ liệu:</span> {`${dataForAxisXInChart && dataForAxisXInChart.length > 0 ? dataForAxisXInChart.join(' ') : 'Thời gian'}`}</p>
                        <div id={id}></div>
                    </div>
                </div >
            </div>
        </div>
    )



}

const lineBarChart = connect(null, null)(withTranslate(LineBarChartDetailForm));
export { lineBarChart as LineBarChartDetailForm };
