import React, { useEffect, useState, memo } from 'react';
import { connect }  from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { createUnitKpiActions } from '../redux/actions.js';

import { DialogModal } from '../../../../../common-components';

import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';


function EmployeeImportancesModal(props) {
    const { translate, user, createKpiUnit } = props;
    const { organizationalUnit, organizationalUnitId, month } = props;

    const [employeeImportancesState, setEmployeeImportancesState] = useState(null);
    const [state, setState] = useState({
        importance: 0,
        editting: false
    });
    const { editting, importance } = state;

    useEffect(() => {
        props.getAllUserOfDepartment([props.organizationalUnitId]);

        setEmployeeImportancesState(null);
    }, [props.organizationalUnitId])

    useEffect(() => {
        if (!employeeImportancesState && user && user.userdepartments) {
            let userdepartments, unitMembers, currentKPI, listEmployeeImportances, employeeImportances = {};

            if (user) {
                userdepartments = user.userdepartments;
            }
            if (createKpiUnit) {
                currentKPI = createKpiUnit.currentKPI;
            }
            if (currentKPI) {
                listEmployeeImportances = currentKPI.employeeImportances;
            }
        
        
            // Lấy danh sách nhân viên và độ quan trọng hiện có
            if (listEmployeeImportances && listEmployeeImportances.length !== 0) {
                listEmployeeImportances.map(item => {
                    let temp = {};
                    temp[item.employee] = item.importance;
                    Object.assign(employeeImportances, temp);
                })
            }
        
        
            // Khởi tạo select box chọn nhân viên
            if (userdepartments && Array.isArray(userdepartments) && userdepartments.length !== 0) {
                unitMembers = getEmployeeSelectBoxItems(userdepartments);
                // Lấy mảng các nhân viên
                if (unitMembers && unitMembers.length !== 0 && unitMembers[0] && unitMembers[0].value) {
                    unitMembers = unitMembers[0].value;
                }
                // Thêm mảng nhân viên thuộc tính importances
                if (unitMembers && unitMembers.length !== 0) {
                    unitMembers.map(item => {
                        Object.assign(item, {
                            importance: employeeImportances[item.value] ? employeeImportances[item.value] : 100
                        })
                    })

                    setEmployeeImportancesState(unitMembers)
                }
            }
        }
    })
    
   
    
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
   

    const handleEdit = (value, importance) => {
        setState({
            ...state,
            editting: value,
            importance: importance
        })
    }

    const handleSaveEdit = (index) => {
        let employeeImportancesStateTemp = employeeImportancesState;
        employeeImportancesStateTemp[index].importance = importance;

        setState({
            ...state,
            editting: ""
        })
        setEmployeeImportancesState(employeeImportancesStateTemp);
    }
    
    const handleCancelEdit = () => {
        setState({
            ...state,
            editting: ""
        })
    }

    const handleChangeImportance = (e) => {
        setState({
            ...state,
            importance: Number(e.target.value)
        })
    }

    const handleSubmit = () => {
        const { createKpiUnit } = props;
        let data, currentKPI;

        if (createKpiUnit) {
            currentKPI = createKpiUnit.currentKPI;
        }
        if (employeeImportancesState && employeeImportancesState.length !== 0) {
            data = employeeImportancesState.map(item => {
                return {
                    employee: item.value,
                    importance: item.importance
                }
            })

            props.editKPIUnit(currentKPI._id, data, 'edit-importance')
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="employee-importances" isLoading={false}
                formID="form-employee-importances"
                title={`Độ quan trọng nhân viên ${organizationalUnit && organizationalUnit.name} tháng ${formatDate(month)}`}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_faile={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
                hasNote={false}
            >
                {/* Form khởi tạo KPI đơn vị */}
                <form id="form-employee-importances" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                                <th title={translate('kpi.evaluation.employee_evaluation.name')}>{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}</th>
                                <th title={translate('kpi.organizational_unit.management.over_view.action')}>{translate('kpi.organizational_unit.management.over_view.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            { employeeImportancesState && employeeImportancesState.length !== 0
                                && employeeImportancesState.map((item, index) =>
                                    <tr key={item.value + organizationalUnitId}>
                                        <td>{index + 1}</td>
                                        <td>{item.text}</td>
                                        <td>
                                            {editting === item.value
                                                ? <input min="0" max="100"
                                                    onChange={(e) => handleChangeImportance(e)}
                                                    defaultValue={item.importance}
                                                    style={{ width: "60px" }}
                                                /> 
                                                : item.importance
                                            }
                                        </td>
                                        <td>
                                            {editting === item.value
                                                ? <div>
                                                    <span><a style={{ cursor: 'pointer', color: '#398439' }} title={translate('kpi.evaluation.employee_evaluation.save_result')} onClick={() => handleSaveEdit(index)}><i className="material-icons">save</i></a></span>
                                                    <span><a style={{ cursor: 'pointer', color: '#E34724' }} onClick={() => handleCancelEdit()}><i className="material-icons">cancel</i></a></span>
                                                </div>
                                                : <a style={{ cursor: 'pointer', color: '#FFC107' }} title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.edit')} onClick={() => handleEdit(item.value, item.importance)}><i className="material-icons">edit</i></a>
                                            }
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

function shouldComponentUpdate(prevProps, nextProps) {
    // Call API khi organizationalUnitId thay đổi
    console.log("8888", nextProps.organizationalUnitId ,prevProps.organizationalUnitId)
    if (nextProps.organizationalUnitId !== prevProps.organizationalUnitId) {
        console.log("99999")
        nextProps.getAllUserOfDepartment([nextProps.organizationalUnitId]);
        return false;
    }

    return false;
}

function mapState(state) {
    const { user, createKpiUnit } = state;
    return { user, createKpiUnit }
}
const actions = {
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    editKPIUnit: createUnitKpiActions.editKPIUnit
}

const connectedEmployeeImportancesModal = connect(mapState, actions)(withTranslate(memo(EmployeeImportancesModal, shouldComponentUpdate)));
export { connectedEmployeeImportancesModal as EmployeeImportancesModal }