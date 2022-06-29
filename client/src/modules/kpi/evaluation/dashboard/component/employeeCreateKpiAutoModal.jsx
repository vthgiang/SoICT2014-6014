import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { createKpiSetActions } from '../../../employee/creation/redux/actions';
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }

    if (day.length < 2) {
        day = '0' + day;
    }

    return [month, year].join('-');
}

/** Thay đổi ngày tháng */
const convertMMYYtoYYMM = (value) => {
    return value.slice(3, 7) + '-' + value.slice(0, 2);
};

function EmployeeCreateKpiAutoModal(props) {
    const { translate, user, createKpiUnit, department } = props;
    const { organizationalUnit, organizationalUnitId, month, childrenOrganizationalUnit } = props;

    // const childrenUnit = childrenOrganizationalUnit?.children || [];

    // let options = childrenUnit.map(x => {
    //     return {
    //         value: x.id,
    //         text: x.name
    //     }
    // })
    // options.unshift({
    //     value: childrenOrganizationalUnit?.id,
    //     text: childrenOrganizationalUnit?.name,
    // })

    const [employeeImportancesState, setEmployeeImportancesState] = useState(null);
    const [state, setState] = useState({
        date: null,
        idUnit: null,
        employees: {},
        employeeIds: []
    });
    const { employees, employeeIds, idUnit, date } = state;

    const handleClickCheck = (id) => {
        let employee = employees;
        let employeeIds = [];
        employee[id].check = !employee[id].check;
        for (let key in employee) {
            if (employee[key].check) {
                employeeIds.push(employee[key].id)
            }
        }
        setState({
            ...state,
            employees: employee,
            employeeIds,
        })
    }

    const handleChangeUnit = (value) => {
        if (value.length === 0) {
            value = [];
        } else {
            setState({
                ...state,
                idUnit: value[0]
            })
        }
    }

    const handleChangeDate = (value) => {
        if (!value) {
        }
        setState({
            ...state,
            date: convertMMYYtoYYMM(value)
        })
    }

    const handleSubmit = () => {
        let data = {
            employees: employeeIds,
            approver: localStorage.getItem("userId"),
            month: '2022-06',
            organizationalUnit: organizationalUnitId
        };

        props.createEmployeeKpiSetAuto(data)
    }

    const isFormValidated = () => {
        let error;
        if (employeeImportancesState && employeeImportancesState.length !== 0) {
            error = employeeImportancesState.filter(item => !item?.status);
        }

        return error?.length !== 0;
    }

    useEffect(() => {
        if (idUnit && date) {
            props.getCurrentKPIUnit(localStorage.getItem("currentRole"), idUnit, date);
            props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: [idUnit], callApi: true })
        }
    }, [idUnit, date])

    //Get data employee
    useEffect(() => {
        if (createKpiUnit?.currentKPI) {
            const employeeOfUnit = {};
            let employeeIds = [];
            for (let item of createKpiUnit.currentKPI.employeeImportances) {
                employeeOfUnit[item?.employee?.id] = {
                    id: item?.employee?.id,
                    name: item?.employee?.name,
                    check: true,
                }
                employeeIds.push(item?.employee?.id)
            }
            setState({
                ...state,
                employees: employeeOfUnit,
                employeeIds: employeeIds
            });
        }
    }, [createKpiUnit])

    return (
        <React.Fragment>
            <DialogModal
                modalID="employee-create-kpi-auto" isLoading={false}
                formID="form-employee-create-kpi-auto"
                title={`Tự động thiết lập KPI nhân viên`}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
                hasNote={false}
                disableSubmit={false}
            >
                {/* Form khởi tạo KPI đơn vị */}
                <form id="form-employee-create-kpi-auto" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>

                    <div className="row" style={{ marginBottom: 10 }}>
                        {/* <div className="col-sm-6">
                            <div className={`form-group`} >
                                <label style={{ width: "auto" }}>Đơn vị nguồn</label>
                                <SelectBox
                                    id={`selectOrganizationUnitInCreateKpiAuto`}
                                    className="form-control select2"
                                    style={{ width: 230 }}
                                    items={options}
                                    multiple={false}
                                    onChange={handleChangeUnit}
                                    value={idUnit}
                                    options={{ placeholder: '' }}
                                />
                            </div>
                        </div> */}

                        {/* <div className="col-sm-6">
                            <div className={`qlcv form-group`} >
                                <label style={{ width: "auto", display: 'block' }}>Tháng</label>
                                <DatePicker
                                    id="selectMonthInCreateKpiAuto"
                                    dateFormat="month-year"
                                    value={date}
                                    onChange={(e) => {
                                        handleChangeDate(e)
                                    }}
                                    disabled={false}
                                />
                            </div>
                        </div> */}
                    </div>
                    {
                        (idUnit && date && !createKpiUnit.currentKPI)
                            ? <div>Đơn vị chưa thiết lập KPI</div>
                            : <table className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                                        <th title={translate('kpi.evaluation.employee_evaluation.name')}>{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                        <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}</th>
                                        <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}>Chọn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        employees && Object.values(employees).map((item, index) =>
                                            <tr key={organizationalUnitId + index}>
                                                <td style={{ width: '40px' }}>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td >
                                                    {item.importance}
                                                </td>
                                                <td>
                                                    <input type="checkbox" checked={employees[item.id].check} onClick={() => { handleClickCheck(item.id) }} />
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                    }

                </form>
            </DialogModal>
        </React.Fragment>
    );
}


function mapState(state) {
    const { user, createKpiUnit, department } = state;
    return { user, createKpiUnit, department }
}
const actions = {
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    createEmployeeKpiSetAuto: createKpiSetActions.createEmployeeKpiSetAuto,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit
}

const connectedEmployeeCreateKpiAutoModal = connect(mapState, actions)(withTranslate(EmployeeCreateKpiAutoModal));
export { connectedEmployeeCreateKpiAutoModal as EmployeeCreateKpiAutoModal };

