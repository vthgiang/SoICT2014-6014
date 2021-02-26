import React, { useEffect, useState } from 'react';
import { connect }  from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { createUnitKpiActions } from '../redux/actions.js';

import { DialogModal } from '../../../../../common-components';
import Swal from 'sweetalert2';

function OrganizationalUnitImportancesModal(props) {
    const { translate, createKpiUnit, dashboardEvaluationEmployeeKpiSet } = props;
    const { organizationalUnit, organizationalUnitId, month } = props;

    const [organizationalUnitImportancesState, setOrganizationalUnitImportancesState] = useState(null);
    const [state, setState] = useState({
        updateOrganizationalUnit: false,
        importance: 0,
        editting: false
    });
    const { editting, importance, updateOrganizationalUnit } = state;

    useEffect(() => {
        setOrganizationalUnitImportancesState(null);
    }, [props.organizationalUnitId, props.createKpiUnit?.currentKPI])

    useEffect(() => {
        // Khởi tạo dữ liệu table độ quan trọng nhân viên
        if (!organizationalUnitImportancesState && createKpiUnit?.currentKPI) {
            let currentKpiUnit, organizationalUnits = [];
        
            currentKpiUnit = createKpiUnit.currentKPI;
            if (currentKpiUnit) {
                organizationalUnits = currentKpiUnit?.organizationalUnitImportances?.map(item => {
                    return { value: item?.organizationalUnit?._id, text: item?.organizationalUnit?.name, importance: item?.importance }
                })
            }
            setOrganizationalUnitImportancesState(organizationalUnits)
        }

        // Cập nhât dữ liệu table khi thêm đơn vị con mới
        if (organizationalUnitImportancesState && organizationalUnit && updateOrganizationalUnit) {
            let organizationalUnitChildren, currentKPI, listOrganizationalUnitImportances, organizationalUnitImportancesStateTemp, unit;
            organizationalUnitImportancesStateTemp = organizationalUnitImportancesState;
            unit = organizationalUnitImportancesState.map(item => item?.value);

            // Lấy các đơn vị con trực tiếp của phòng ban hiện tại
            organizationalUnitChildren = organizationalUnit?.children;
            
            // Lấy danh sách đơn vị có độ quan trọng lưu trong DB
            if (createKpiUnit) {
                currentKPI = createKpiUnit.currentKPI;
                if (currentKPI) {
                    listOrganizationalUnitImportances = currentKPI?.organizationalUnitImportances?.map(item => item?.organizationalUnit?._id);
                }
            }

            // Thêm những đơn vị chưa có độ quan trọng trong DB
            if (organizationalUnitChildren?.length > 0) {
                organizationalUnitChildren.map(item => {
                    if (!listOrganizationalUnitImportances || (listOrganizationalUnitImportances.indexOf(item?.id) === -1 && unit.indexOf(item?.id) === -1)) {
                        organizationalUnitImportancesStateTemp.push({ value: item?.id, text: item?.name, importance: 100 })
                    }   
                })

                // Reset state trước khi lưu state mới
                setOrganizationalUnitImportancesState(organizationalUnitImportancesStateTemp);
                setState({
                    ...state,
                    updateOrganizationalUnit: false
                });
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
        if (importance >= 0 && importance <= 100) {
            let organizationalUnitImportancesStateTemp = organizationalUnitImportancesState;
            organizationalUnitImportancesStateTemp[index].importance = importance;
    
            setState({
                ...state,
                editting: ""
            })
            setOrganizationalUnitImportancesState(organizationalUnitImportancesStateTemp);
        } else {
            Swal.fire({
                title: 'Độ quan trọng phải từ 0 đến 100',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
            })
        }
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

    const handleUpdateEmployee = (e) => {
        e.preventDefault();
        setState({
            ...state,
            updateOrganizationalUnit: true
        })
    }

    const handleSubmit = () => {
        const { createKpiUnit } = props;
        let data, currentKPI;

        if (createKpiUnit) {
            currentKPI = createKpiUnit.currentKPI;
        }
        if (organizationalUnitImportancesState && organizationalUnitImportancesState.length !== 0) {
            data = organizationalUnitImportancesState.map(item => {
                return {
                    organizationalUnit: item.value,
                    importance: item.importance
                }
            })

            props.editKPIUnit(currentKPI._id, data, 'edit-organizational-unit-importance')
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="organizational-unit-importances" isLoading={false}
                formID="form-organizational-unit-importances"
                title={`Độ quan trọng đơn vị con của ${organizationalUnit && organizationalUnit.name} tháng ${formatDate(month)}`}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_faile={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
                hasNote={false}
            >
                {/* Form khởi tạo KPI đơn vị */}
                <form id="form-organizational-unit-importances" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                    <button className='btn btn-primary pull-right' style={{ marginBottom: '15px' }} onClick={(e) => handleUpdateEmployee(e)}>Cập nhật đơn vị con mới</button>

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
                            { organizationalUnitImportancesState && organizationalUnitImportancesState.length !== 0
                                && organizationalUnitImportancesState.map((item, index) =>
                                    <tr key={item.value + organizationalUnitId + index}>
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


function mapState(state) {
    const { user, createKpiUnit, dashboardEvaluationEmployeeKpiSet } = state;
    return { user, createKpiUnit, dashboardEvaluationEmployeeKpiSet }
}
const actions = {
    editKPIUnit: createUnitKpiActions.editKPIUnit
}

const connectedOrganizationalUnitImportancesModal = connect(mapState, actions)(withTranslate(OrganizationalUnitImportancesModal));
export { connectedOrganizationalUnitImportancesModal as OrganizationalUnitImportancesModal }