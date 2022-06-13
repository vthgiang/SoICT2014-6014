import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { createKpiSetActions } from '../../../employee/creation/redux/actions';

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

function EmployeeCreateKpiAutoModal(props) {
    const { translate, user, createKpiUnit, department } = props;
    const { organizationalUnit, organizationalUnitId, month } = props;

    const [employeeImportancesState, setEmployeeImportancesState] = useState(null);
    const [state, setState] = useState({
        updateEmployee: false,
        employees: {}
    });
    const { updateEmployee, employees } = state;

    useEffect(() => {
        setEmployeeImportancesState(null);
    }, [props.organizationalUnitId, props.createKpiUnit?.currentKPI])

    useEffect(() => {
        // Khởi tạo dữ liệu table độ quan trọng nhân viên
        if (!employeeImportancesState && createKpiUnit?.currentKPI) {
            let currentKpiUnit, employees = [];

            currentKpiUnit = createKpiUnit.currentKPI;
            if (currentKpiUnit) {
                employees = currentKpiUnit?.employeeImportances?.map(item => {
                    return {
                        value: item?.employee?._id,
                        text: item?.employee?.name,
                        importance: item?.importance,
                        status: true
                    }
                })
            }
            setEmployeeImportancesState(employees)
        }

        // Cập nhât dữ liệu table khi thêm nhân viên mới
        if (employeeImportancesState && user?.employeesOfUnitsUserIsManager && user?.employeesOfUnitsUserIsManager?.[0]?.idUnit === organizationalUnitId && updateEmployee) {
            let userdepartments, unitMembers, currentKPI, listEmployeeImportances, employeeImportances, employee;
            employeeImportances = employeeImportancesState;
            employee = employeeImportancesState.map(item => item?.value);

            // Lấy các nhân viên thuộc phòng ban hiện tại
            if (user) {
                userdepartments = user.employeesOfUnitsUserIsManager;
                if (userdepartments) {
                    unitMembers = userdepartments.map(item => item?.userId)
                }
            }

            // Lấy danh sách nhân viên có độ quan trọng lưu trong DB
            if (createKpiUnit) {
                currentKPI = createKpiUnit.currentKPI;
                if (currentKPI) {
                    listEmployeeImportances = currentKPI?.employeeImportances?.map(item => item?.employee?._id);
                }
            }

            // Thêm những nhân viên chưa có độ quan trọng trong DB
            if (unitMembers?.length > 0) {
                unitMembers.map(item => {
                    if (!listEmployeeImportances || (listEmployeeImportances.indexOf(item?._id) === -1 && employee.indexOf(item?._id) === -1)) {
                        employeeImportances.push({
                            value: item?._id,
                            text: item?.name,
                            importance: 100,
                            status: true
                        })
                    }
                })

                // Reset state trước khi lưu state mới
                setEmployeeImportancesState(employeeImportances);
                setState({
                    ...state,
                    updateEmployee: false
                });
            }
        }
    })

    const handleClickCheck = (id) => {
        let employee = employees;
        employee[id] = !employee[id];

        setState({
            ...state,
            employees: employee
        })
    }

    const handleUpdateEmployee = (e) => {
        e.preventDefault();
        setState({
            ...state,
            updateEmployee: true
        })
        props.getAllEmployeeOfUnitByIds({
            organizationalUnitIds: [props.organizationalUnitId],
            callApi: true
        });
    }

    const handleSubmit = () => {
        const { createKpiUnit, month, organizationalUnit } = props;
        const employee = Object.keys(employees);

        let data = {
            employee,
            approver: localStorage.getItem("userId"),
            month,
            organizationalUnit: organizationalUnit?._id
        };
        console.log('data', data)

        props.createEmployeeKpiSetAuto(data)
    }

    const isFormValidated = () => {
        let error;
        if (employeeImportancesState && employeeImportancesState.length !== 0) {
            error = employeeImportancesState.filter(item => !item?.status);
        }

        return error?.length !== 0;
    }
    console.log('depart', department);

    console.log('me', employeeImportancesState)

    return (
        <React.Fragment>
            <DialogModal
                modalID="employee-create-kpi-auto" isLoading={false}
                formID="form-employee-create-kpi-auto"
                title={`Khởi tạo tự động KPI nhân viên ${organizationalUnit && organizationalUnit.name} tháng ${formatDate(month)}`}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
                hasNote={false}
                disableSubmit={isFormValidated()}
            >
                {/* Form khởi tạo KPI đơn vị */}
                <form id="form-employee-create-kpi-auto" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                    <button className='btn btn-primary pull-right' style={{ marginBottom: '15px' }} onClick={(e) => handleUpdateEmployee(e)}>Cập nhật nhân viên mới</button>

                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                                <th title={translate('kpi.evaluation.employee_evaluation.name')}>{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}</th>
                                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}>Chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeImportancesState && employeeImportancesState.length !== 0
                                && employeeImportancesState.map((item, index) =>
                                    <tr key={item.value + organizationalUnitId + index}>
                                        <td style={{ width: '40px' }}>{index + 1}</td>
                                        <td>{item.text}</td>
                                        <td >{item.importance}</td>
                                        <td>
                                            <input type="checkbox" checked={employees[item.value]} onClick={() => { handleClickCheck(item.value) }} />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
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
}

const connectedEmployeeCreateKpiAutoModal = connect(mapState, actions)(withTranslate(EmployeeCreateKpiAutoModal));
export { connectedEmployeeCreateKpiAutoModal as EmployeeCreateKpiAutoModal };

