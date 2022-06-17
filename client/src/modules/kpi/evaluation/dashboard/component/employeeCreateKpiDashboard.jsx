import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, TreeTable } from '../../../../../common-components';

const convertMonth = (date) => {
    let d = new Date(date);
    let m = d.getMonth() + 1;
    let y = d.getFullYear();
    if (m < 10) {
        return `0${m}-${y}`
    } else return `${m}-${y}`
}

function EmployeeCreateKpiDashboard(props) {
    const { user, dashboardEvaluationEmployeeKpiSet } = props;
    const [data, setData] = useState();
    const [month, setMonth] = useState(convertMonth(new Date()));

    // lay data table
    useEffect(() => {
        let { employeeKpiSets } = dashboardEvaluationEmployeeKpiSet;
        let employeeKpiInMonth = employeeKpiSets && employeeKpiSets.filter(item => convertMonth(item.date) === month);
        let dataTable = [];
        let userdepartments = user?.userdepartments;

        if (userdepartments && !userdepartments.length) {
            userdepartments = [user.userdepartments]
        }

        if (userdepartments) {
            for (let item of userdepartments) {
                dataTable.push({
                    parent: null,
                    _id: item.department,
                    name: item.department,
                    kpiAutoCreated: "none",
                    kpiManualCreated: "none",
                })

                let employeesUnit = item.employees ? Object.values(item.employees) : [];
                if (employeesUnit.length > 0) {
                    employeesUnit = employeesUnit[0].members;
                }
                let status = "Chưa phê duyệt"
                if (employeesUnit && employeeKpiInMonth) {
                    for (let employee of employeesUnit) {
                        let kpiAutoCreated = false;
                        let kpiManualCreated = false;
                        let kpiEmployee = [];

                        for (let kpi of employeeKpiInMonth) {
                            if (kpi.organizationalUnit.name === item.department && employee.id === kpi.creator.id) {
                                kpiEmployee.push(kpi);
                            }
                        }

                        for (let o of kpiEmployee) {
                            if (o.type === 'auto') {
                                kpiAutoCreated = true;
                                if (o.status === 2) {
                                    status = "Đã kích hoạt KPI tự động"
                                }
                            } else if (!o.type) {
                                kpiManualCreated = true;
                                if (o.status === 2) {
                                    status = "Đã kích hoạt KPI thủ công"

                                }
                            }
                        }
                        dataTable.push({
                            parent: item.department,
                            _id: employee.id,
                            name: employee.name,
                            kpiAutoCreated,
                            kpiManualCreated,
                            status
                        })

                    }
                }

            }
        }
        setData(dataTable);

    }, [month, dashboardEvaluationEmployeeKpiSet.employeeKpiSets, user?.userdepartments])


    let column = [
        { name: 'Đơn vị', key: "unit" },
        { name: 'KPI tạo thủ công', key: "kpiManual" },
        { name: 'KPI tạo tự động', key: "kpiAuto" },
        { name: 'Trạng thái', key: "status" },
    ];

    const bindTextToEvent = (key, text, bold = "bold") => {
        let textColor = "";
        switch (key) {
            case "unit":
                return (
                    <span >{text}</span>
                )
            case "kpiAuto":
                return (
                    <span >{text !== "none" ? (text ? <i className="fa fa-check-circle text-success" /> : <i className="fa fa-exclamation-circle text-danger" />) : null}</span>
                )
            case "kpiManual":
                return (
                    <span >{text !== "none" ? (text ? <i className="fa fa-check-circle text-success" /> : <i className="fa fa-exclamation-circle text-danger" />) : null}</span>
                )

            case "status":
                return (
                    <span >{text}</span>
                )

        }
        return (
            <a onClick={() => { }} style={{ color: textColor, fontWeight: bold }}>{text}</a>
        )
    }

    let dataTable = [];
    let dataTemp = data?.filter(o => o.name);

    for (let i in dataTemp) {
        let bold = dataTemp[i].parent && dataTemp[i].parent !== true ? "normal" : "bold";
        dataTable[i] = {
            ...dataTemp[i],
            rawData: dataTemp[i],
            unit: bindTextToEvent("unit", dataTemp[i].name, dataTemp[i], bold),
            kpiAuto: bindTextToEvent("kpiAuto", dataTemp[i].kpiAutoCreated, dataTemp[i]),
            kpiManual: bindTextToEvent("kpiManual", dataTemp[i].kpiManualCreated, dataTemp[i]),
            status: bindTextToEvent("status", dataTemp[i].status, dataTemp[i]),
            parent: dataTemp[i].parent && dataTemp[i].parent !== true ? dataTemp[i].parent : null,
            _id: dataTemp[i]._id ? dataTemp[i]._id : -1
        }
    }

    return (
        <React.Fragment>
            <div className="form-inline">
                <div className="col-sm-6 col-xs-12 form-group">
                    <label className="form-control-static">Tháng</label>
                    <DatePicker
                        id="kpi-employee-month"
                        dateFormat="month-year"
                        value={month}
                        onChange={(e) => { setMonth(e) }}
                        disabled={false}
                    />
                    <button className='btn btn-success'>Tìm kiếm</button>
                </div>
            </div>
            <div className="general_task_unit" id="general-list-task-wrapper" style={{ marginTop: '20px' }}>

                <TreeTable
                    tableId={'kpi-create-employee-dashboard'}
                    tableSetting={true}
                    rowPerPage={false}
                    behaviour="show-children"
                    column={column}
                    data={dataTable}
                    actions={false}
                />
            </div>
            <div style={{ 'textAlign': 'center', 'marginTop': 10 }}>
                <i style={{ 'marginRight': 5 }} className="fa fa-check-circle text-success" />
                <span style={{ 'marginRight': 10 }}>Đã khởi tạo</span>
                <i style={{ 'marginRight': 5 }} className="fa fa-exclamation-circle text-danger" />
                <span style={{ 'marginRight': 10 }}>Chưa khởi tạo</span>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { kpimembers, user, dashboardEvaluationEmployeeKpiSet } = state;
    return { kpimembers, user, dashboardEvaluationEmployeeKpiSet };
}

const actions = {
}

const connectedEmployeeCreateKpiDashboard = connect(mapState, actions)(withTranslate(EmployeeCreateKpiDashboard));

export { connectedEmployeeCreateKpiDashboard as EmployeeCreateKpiDashboard };
