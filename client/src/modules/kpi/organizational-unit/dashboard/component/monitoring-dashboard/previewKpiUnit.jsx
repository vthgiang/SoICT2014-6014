import React from 'react';
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
                current: 800000
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
    {
        unit: 'Phòng nhân sự',
        kpis: [
            {
                type: 'Nhân sự mới',
                target: 100,
                unit: 'Người',
                current: 90
            },
            {
                type: 'Hợp đồng',
                target: 50,
                unit: 'Hợp đồng',
                current: 45
            },
        ]
    },
    {
        unit: 'Phòng marketing',
        kpis: [
            {
                type: 'Quảng cáo',
                target: 150,
                unit: 'QC',
                current: 90
            },
            {
                type: 'Tỉ lệ chuyển đổi KH',
                target: 30,
                unit: '%',
                current: 20
            },
            {
                type: 'Đối tác mới',
                target: 5,
                unit: 'Đối tác',
                current: 3
            },
        ]
    },
]
const PreviewKpiUnit = (props) => {
    const { title, target, currentValue, previousValue, unit } = props;

    return <React.Fragment>
        <div className='row' style={{ display: 'flex', alignItems: "stretch" }} >
            {

                dataKpiUnit.map((item, index) => {
                    return (
                        <div className='' style={{ display: 'flex', margin: 16 }} key={index}>
                            <div className="card"
                                style={{ 'backgroundColor': '#FFFFFF', 'borderRadius': 2, "boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2)", 'padding': 10 }}
                            >
                                <div className="card-body">
                                    <span className="card-title" style={{ "fontWeight": 600, 'fontSize': 18 }}>{item.unit}</span>

                                    <div>
                                        {
                                            item.kpis.map((kpi, index) => {
                                                return (<div style={{ margin: "15px 10px 0 10px" }} key={index}>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {kpi.type}
                                                        <span className='text-success' style={{ marginLeft: 5 }}>{`(${Math.round(kpi.current / kpi.target * 100)}%)`}</span>
                                                    </span>
                                                    <div>
                                                        <span className='text-info' style={{ fontWeight: 600, fontSize: 20 }}>{kpi.current}</span>
                                                        {`/${kpi.target} ${kpi.unit}`}
                                                    </div>

                                                </div>)
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
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

const connectedPreviewKpiUnit = connect(mapState, actions)(withTranslate(PreviewKpiUnit));
export { connectedPreviewKpiUnit as PreviewKpiUnit };
