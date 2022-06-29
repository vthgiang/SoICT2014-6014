import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import Swal from 'sweetalert2';

const dataKpiUnit = [
    {
        name: 'Nguyễn Văn A',
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
        name: 'Nguyễn B',
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
        name: 'Nguyễn C',
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
const PreviewKpiEmployee = (props) => {
    const { data } = props;
    const [delay, setDelay] = useState(false);

    console.log(72, data)
    // Tinh chi so can no luc de thuc hien kpi
    useEffect(() => {
        const currentDate = new Date().getDate();
        if (data) {
            let effort = 0;
            let effortIndex = 0;
            let count = 0;
            for (let item of data.kpis) {
                if (typeof item.target === 'number' && typeof item.current === 'number') {
                    if (item.current >= item.target) {
                        effort += 100 * item.weight;
                    } else {
                        effort += item.current / item.target * 100 * item.weight;
                    }
                    effortIndex += currentDate / 30 * 100 * item.weight;
                    count++;
                }
            }
            if (count === 0) {
                count = 1;
            }
            if (effort / count < effortIndex / count) {
                setDelay(true)
            }
        }
    }, [data])

    return <React.Fragment>
        <div className='col-md-4'  >

            {/* style={{ display: 'flex', alignItems: "stretch" }} style={{ display: 'flex', margin: 16 }}*/}
            {

                data && <div className='' >
                    <div className="card"
                        style={{ 'backgroundColor': '#FFFFFF', 'borderRadius': 2, "boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2)", 'padding': 10 }}
                    >
                        <div className="card-body" style={{ position: "relative" }}>
                            {
                                delay && <span style={{ position: "absolute", right: 0 }} onClick={() => {
                                    Swal.fire({
                                        title: 'Nhân viên này chậm tiến độ KPI. Hãy cân bằng KPI nhân viên để đạt mục tiêu',
                                        type: 'warning',
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: 'OK',
                                    })
                                }}>
                                    <i style={{ fontSize: 20 }} className="fa fa-exclamation-circle text-danger" />
                                </span>
                            }
                            <span className="card-title" style={{ "fontWeight": 600, 'fontSize': 18 }}>{data.creator.name}</span>

                            <div>
                                {
                                    data.kpis.map((kpi, index) => {
                                        return (<div style={{ margin: "15px 10px 0 10px" }} key={index}>
                                            <span style={{ fontWeight: 600 }}>
                                                {kpi.name}
                                                {kpi.type === 0 &&
                                                    <span className='text-success' style={{ marginLeft: 5 }}>{`(${Math.round(kpi.current / kpi.target * 100)}%)`}</span>
                                                }
                                            </span>
                                            <div>
                                                {
                                                    kpi.type !== 0 ? <span>
                                                        <span className='text-info' style={{ fontWeight: 600, fontSize: 20 }}>{kpi.current === 1 ? 'Hoàn thành' : 'Chưa hoàn thành'}</span>
                                                    </span> : <span>
                                                        <span className='text-info' style={{ fontWeight: 600, fontSize: 20 }}>{kpi.current}</span>
                                                        {`/${kpi.target} ${kpi.unit}`}
                                                    </span>
                                                }

                                            </div>

                                        </div>)
                                    })
                                }
                            </div>
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

const connectedPreviewKpiEmployee = connect(mapState, actions)(withTranslate(PreviewKpiEmployee));
export { connectedPreviewKpiEmployee as PreviewKpiEmployee };
