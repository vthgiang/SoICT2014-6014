import c3 from 'c3';
import 'c3/c3.css';
import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

const dataKpiUnit = [
    {
        unit: 'Phòng kinh doanh',
        kpis: [
            {
                type: 'Doanh thu',
                target: 1000000,
                unit: 'VND',
                current: 800000,
                targetByMonth: [],
                resultByMonth: []
            },
            {
                type: 'Hợp đồng',
                target: 10,
                unit: 'Hợp đồng',
                current: 7
            },
            {
                type: 'Giảm chi phí',
                target: 200000,
                unit: 'VND',
                current: 60000
            },
        ]
    },
]
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
        if (!data.target && data.current === 1) {
            progress = 100;
            delayed = false;
        } else if (!data.target && data.current === 0) {
            progress = 0;
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
        let data2 = [data.name, ...data.resultByMonth]
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
            {

                // dataKpiUnit.map((item, index) => {
                // return (
                // <div className="col-md-3 col-sm-6 form-inline">
                //     <div className="info-box">
                //          <span className="info-box-icon bg-red"><i className="fa fa-exclamation-circle" /></span>
                //          <div className="info-box-content">
                //              <span className="info-box-text">{translate('kpi.evaluation.dashboard.not_initial')}</span>
                //             {listUnitKpi && <a className="info-box-number" onClick={() => showListInSwal(organizationalUnitNotInitialKpi?.map(item => item?.text), translate('general.list_employee'))} style={{ cursor: 'pointer', fontSize: '20px' }}>{organizationalUnitNotInitialKpi?.length ?? 0}</a>}
                //          </div>
                //      </div>
                //  </div>
                <div >
                    <div className="box box-primary"
                    // style={{ 'backgroundColor': '#FFFFFF', 'borderRadius': 2, "boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2)", 'padding': 10 }}
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
                                    <span className='text-primary' style={{ fontSize: 22, fontWeight: 600 }}>{
                                        data?.target ? `${data.target} ${data.unit}` : "Hoàn thành công việc"
                                    }</span>
                                    <hr style={{ border: "1px solid #ddd" }} />
                                    <div style={{ display: 'flex', justifyContent: "space-around" }}>
                                        <span>
                                            <span className='text-primary' style={{ fontSize: 18, fontWeight: 600 }}>{
                                                data?.target ? data?.current : (data?.current === 1 ? "Hoàn thành" : "Không hoàn thành")
                                            }</span>
                                            <div>Tháng hiện tại</div>
                                        </span>
                                        <span>
                                            <div className='text-primary' style={{ fontSize: 18, fontWeight: 600 }}>{
                                                data?.target ? data?.resultByMonth[4] : (data?.resultByMonth[4] === 1 ? "Hoàn thành" : "Không hoàn thành")
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
                // )
                // })
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
