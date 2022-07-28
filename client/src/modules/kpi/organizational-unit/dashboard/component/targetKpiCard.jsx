import c3 from 'c3';
import 'c3/c3.css';
import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";


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
                    tick: {
                        values: !data.target && [0, 1]
                    }
                }
            },
            size: {
                height: 200
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
                ? <div>
                    <div className="box box-primary"
                    >
                        <div className="box-header with-border">
                            <div className="box-title">{data?.name}</div>
                        </div>

                        <div className='row'>
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
                                    <span className='text-primary' style={{ fontSize: 20, fontWeight: 600 }}>{
                                        data?.criteria
                                    }</span>

                                </div>
                            </div>

                        </div>
                        <div ref={refGeneralChart}>

                        </div>
                    </div>
                </div>
                :
                <div >
                    <div className="box box-primary"
                    >
                        <div className="box-header with-border">
                            <div className="box-title">{data?.name}</div>
                        </div>

                        <div className='row'>
                            <section className='col-sm-7'>
                                <div ref={refProcessChart} />
                            </section>
                            <div className="col-sm-5" style={{ padding: '10px 20px' }}>
                                <div className='' style={{ textAlign: "center" }}>
                                    <div>Mục tiêu</div>
                                    <span className='text-primary' style={{ fontSize: 20, fontWeight: 600 }}>{
                                        `${data.target} ${data.unit}`
                                    }</span>
                                    <hr style={{ border: "1px solid #ddd" }} />
                                    <div style={{ display: 'flex', justifyContent: "space-around" }}>
                                        <span>
                                            <span className='text-primary' style={{ fontSize: 18, fontWeight: 600 }}>{
                                                data?.target?.current ?? 0
                                            }</span>
                                            <div>Tháng hiện tại</div>
                                        </span>
                                        <span>
                                            <div className='text-primary' style={{ fontSize: 18, fontWeight: 600 }}>{
                                                data?.resultByMonth ? data?.resultByMonth[4] : 0
                                            }</div>
                                            <div>Tháng trước</div>
                                        </span>
                                    </div>
                                </div>



                            </div>

                        </div>
                        <div ref={refGeneralChart}>

                        </div>
                    </div>
                </div>
            }
        </div>

    </React.Fragment>
}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, createKpiUnit } = state;
    return { dashboardEvaluationEmployeeKpiSet, createKpiUnit };
}

const actions = {
}

const connectedTargetKpiCard = connect(mapState, actions)(withTranslate(TargetKpiCard));
export { connectedTargetKpiCard as TargetKpiCard };
