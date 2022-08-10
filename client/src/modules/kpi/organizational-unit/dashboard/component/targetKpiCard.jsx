import c3 from 'c3';
import 'c3/c3.css';
import parse from 'html-react-parser';
import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

const formatTarget = (value) => {
    let number;
    if (value > 1000000) {
        number = Math.round(value / 1000) * 1000;
        return new Intl.NumberFormat().format(number);
    }
    else return new Intl.NumberFormat().format(value);
}

const TargetKpiCard = (props) => {
    const { data, month } = props;
    const refProcessChart = React.createRef();
    const refGeneralChart = React.createRef();

    const generateChart = () => {
        removePreviousChart();
        const { translate } = props;
        let progress;
        let delayed = true;
        let date = new Date().getDate();
        // let dataMultiLineChart = setDataMultiLineChart();
        if (data.itemType === 0) {
            return
        }
        else {
            progress = data.current / data.target * 100;
            if (progress > date / 30 * 100) {
                delayed = false;
            }
        }

        let chart = c3.generate({
            bindto: refProcessChart.current,
            data: {
                columns: [
                    ['data', progress]
                ],
                type: 'gauge',
            },
            size: {
                height: 180
            },

            color: {
                pattern: [delayed ? '#d62728' : '#2ca02c'],
            },
            legend: {
                show: false
            },

        });
        let data2 = [data.name, ...data?.resultByMonth]
        let chart2 = c3.generate({
            bindto: refGeneralChart.current,
            data: {
                columns: [data2],
                type: 'bar',
                types: {
                    data3: 'spline',
                },
            },
            axis: {
                x: {
                    type: 'category',
                    categories: month
                },
                y: {
                    // type: 'category',
                    tick: {
                        // values: data.target,
                        count: 10,
                        format: function (e) {
                            let val = parseInt(e);

                            if (val >= 1000 && val < 1000000) {
                                return `${Math.floor(val / 1000)}K`
                            } else if (val >= 1000000 && val < 1000000000) {
                                return `${Math.floor(val / 1000000)}M`
                            } else if (val >= 1000000000) {
                                return `${Math.floor(val / 1000000000)}B`
                            }
                            return val;
                        }
                    },
                    label: {
                        text: data.unit ?? ""
                    }
                }
            },
            size: {
                height: 180
            }
        });
    };

    const removePreviousChart = () => {
        const chart = refProcessChart.current;
        const chart2 = refGeneralChart.current;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild)
            }
        }
        if (chart2) {
            while (chart2.hasChildNodes()) {
                chart2.removeChild(chart2.lastChild)
            }
        }
    };

    useEffect(() => {
        if (data) {
            generateChart();
        }
    }, [data])

    return <React.Fragment>
        <div>
            {data.itemType === 0
                ? <div >
                    <div className="box box-primary" style={{ minHeight: 421 }}>
                        <div className="box-header with-border">
                            <div className="box-title">{data?.name}</div>
                        </div>

                        <div className='row padding-10'>
                            <div className="col-sm-6" style={{ padding: '10px 20px' }}>
                                <div className='' style={{ textAlign: "center" }}>
                                    <div>Mục tiêu</div>
                                    <span className='text-primary' style={{ fontSize: 20, fontWeight: 600 }}>{
                                        "Hoàn thành công việc"
                                    }</span>

                                </div>
                            </div>
                            <div className="col-sm-6" style={{ padding: '10px 20px' }}>
                                <div className='' style={{ textAlign: "center" }}>
                                    <div>Tiêu chí</div>
                                    <span className='text-primary' style={{ fontSize: 20, fontWeight: 600 }}>
                                        {parse(data?.criteria)}
                                    </span>

                                </div>
                            </div>

                        </div>
                        <div className="padding-10" ref={refGeneralChart} />
                    </div>
                </div>
                :
                <div>
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">{data?.name}</div>
                        </div>

                        <div className='box-body'>
                            <div className="row">
                                <section className='col-md-7'>
                                    <div ref={refProcessChart} />
                                </section>
                                <div className="col-md-5" style={{ padding: '10px 20px' }}>
                                    <div className='' style={{ textAlign: "center" }}>
                                        <div>Mục tiêu</div>
                                        <span className='text-primary' style={{ fontSize: 20, fontWeight: 600 }}>{
                                            `${formatTarget(data.target)} ${data.unit}`
                                        }</span>
                                        <hr style={{ border: "1px solid #ddd" }} />
                                        <div style={{ display: 'flex', justifyContent: "space-around" }}>
                                            <span>
                                                <span className='text-primary' style={{ fontSize: 18, fontWeight: 600 }}>{
                                                    data?.current ? formatTarget(data.current) : 0
                                                }</span>
                                                <div>Tháng hiện tại</div>
                                            </span>
                                            <span style={{ width: 10 }}></span>
                                            <span>
                                                <div className='text-secondary' style={{ fontSize: 18, fontWeight: 600 }}>{
                                                    data?.resultByMonth ? formatTarget(data?.resultByMonth[4]) : 0
                                                }</div>
                                                <div>Tháng trước</div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginRight: 10 }} >
                            <div ref={refGeneralChart} />
                        </div>
                    </div>
                </div>
            }
        </div>

    </React.Fragment >
}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, createKpiUnit } = state;
    return { dashboardEvaluationEmployeeKpiSet, createKpiUnit };
}

const actions = {
}

const connectedTargetKpiCard = connect(mapState, actions)(withTranslate(TargetKpiCard));
export { connectedTargetKpiCard as TargetKpiCard };
