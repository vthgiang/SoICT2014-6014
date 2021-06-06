import React, { useEffect, useState} from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import parse from 'html-react-parser';
// import { Comment } from './comment';

import { UserActions } from "../../../../super-admin/user/redux/actions";
import { createKpiSetActions } from '../redux/actions';
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { AuthActions } from '../../../../auth/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';

import { ModalCreateEmployeeKpi } from './employeeKpiAddTargetModal';
import { ModalCreateEmployeeKpiSet } from './employeeKpiCreateModal';
import { ModalEditEmployeeKpi } from './employeeKpiEditTargetModal';
import { ModalCopyKPIUnit } from '../../../organizational-unit/management/component/organizationalUnitKpiCopyModal';

import { getStorage } from '../../../../../config'
import { DatePicker, SelectBox, SlimScroll, ToolTip, Comment } from '../../../../../../src/common-components';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';


var translate = '';
function CreateEmployeeKpiSet(props) {
    let idUser = getStorage("userId");
    var translate = props.translate;

    let d = new Date(),
        currentMonth = d.getMonth() + 1,
        year = d.getFullYear();

    if (currentMonth < 10) {
        currentMonth = '0' + currentMonth;
    }
    const [state, setState] = useState({
        employeeKpiSet: {
            creator: "",
            organizationUnit: "",
            approver: null
        },
        month: [year, currentMonth].join('-'),
        defaultDate: [currentMonth, year].join('-'),
        adding: false,
        editing: false,
        editingTarget: "",
        submitted: false,
        commenting: false,
        currentRole: localStorage.getItem("currentRole"),
        fixTableWidth: false,
        comment: {
            creator: idUser,
            description: '',
            files: [],
        },
        newComment: {
            description: ''
        },
        commentOfComment: {
            creator: idUser,
            description: '',
            files: [],
        }
    });

    useEffect(()=>{
        props.getDepartment();
        props.getEmployeeKpiSet({
            roleId: localStorage.getItem("currentRole")
        });
        props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
        props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    },[])

    useEffect(()=>{
        const { createEmployeeKpiSet, createKpiUnit } = props;
        const { month, currentRole } = state;

        // Lấy thông tin đơn vị cha
        if (createKpiUnit?.currentKPI?.organizationalUnit?.parent && props.department && !props.department.unitLoading && !props.department.unit) {
            props.getOrganizationalUnit(createKpiUnit?.currentKPI?.organizationalUnit?.parent);
        }

        // Khi truy vấn API đã có kết quả
        if (!state.employeeKpiSet.approver && createEmployeeKpiSet?.currentKPI?.approver && createEmployeeKpiSet?.currentKPILoading) {
            setState({
                    ...state,
                    employeeKpiSet: {
                        ...state.employeeKpiSet,
                        approver: createEmployeeKpiSet?.currentKPI?.approver?._id
                }
            });
            // return false; // Sẽ cập nhật lại state nên không cần render
        }

        props.getEmployeeKpiSet({
            roleId: currentRole,
            month: month
        })
        // return true;
    }, [])

    /**
     * Xử lí các thông điệp
     */

    const handleEditEmployeeKpiSet = async (status) => {
        if (status === 0) {
            await setState( {
                ...state,
                editing: !state.editing
            })
        } else if (status === 1) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.handle_edit_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.handle_edit_kpi.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

    const checkOrganizationalUnitKpi = () => {
        const { createKpiUnit } = props;
        let currentKPIUnit;

        if (createKpiUnit) {
            currentKPIUnit = createKpiUnit.currentKPI;
        }

        if (currentKPIUnit) {
            if (currentKPIUnit.status === 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    const handleStartOrganizationalUnitKpi = () => {
        const { createKpiUnit } = props;
        let currentKPIUnit;

        if (createKpiUnit) {
            currentKPIUnit = createKpiUnit.currentKPI;
        }

        if (currentKPIUnit) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_activate_organiztional_unit_kpi'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_initialize_organiztional_unit_kpi'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

   const handleDeleteEmployeeKpiSet = async (id, employeeKpiSet) => {
        if (employeeKpiSet === 0) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.kpi'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            }).then((res) => {
                if (res.value) {
                    // Xóa KPI
                    props.deleteEmployeeKpiSet(id);
                }
            });
        } else if (employeeKpiSet === 1) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

    /**Thay đổi người phê duyệt tập KPI này */
    const handleApproverChange = (value) => {
        setState( {
            ...state,
            employeeKpiSet: {
                ...state.employeeKpiSet,
                approver: value[0],
            }
        });
    }

   const handleChangeDate = (value) => {
        let month = value
        if (value !== '') {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState( {
            ...state,
            month: month
        })
    }

   const handleSearchData = () => {
        const { currentRole, month } = state;

        if (month && month !== '') {
            props.getEmployeeKpiSet({
                roleId: currentRole,
                month: month
            });
            props.getCurrentKPIUnit(currentRole, null, month);
        }
    }

    /**Lưu người phê duyệt của tập KPI này */
    const handleSaveEditEmployeeKpiSet = (id) => {
        setState( {
            ...state,
            editing: !state.editing
        })

        let { employeeKpiSet } = state;
        if (employeeKpiSet.approver) {//&& kpipersonal.creater
            props.editEmployeeKpiSet(id, employeeKpiSet);
        }
    }

    /**Hủy thay đổi thời gian của tập kpi này */
   const handleCancelEditEmployeeKpiSet = () => {
        setState( {
            ...state, editing: !state.editing
        })
    }

   function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    /** Thêm KPI cá nhân */
   const handleCreateEmployeeKpi = (employeeKpiStatus) => {
        if (employeeKpiStatus === 0) {
            window.$(`#createEmployeeKpi`).modal("show");
        } else if (employeeKpiStatus === 1) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.add_new_target.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.add_new_target.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

    /**Xóa tập KPI cá nhân này */
    const handleDeleteEmployeeKpi = (employeeKpiSetId, employeeKpiSetStatus, employeeKpiId, employeeKpiStatus) => {
        if (employeeKpiSetStatus === 0) {
            if (employeeKpiStatus === 1) {
                Swal.fire({
                    title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.activated'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
                })
            } else {
                Swal.fire({
                    title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.kpi_target'),
                    type: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
                }).then((res) => {
                    if (res.value) {
                        props.deleteEmployeeKpi(employeeKpiId, employeeKpiSetId);
                    }
                });
            }
        } else if (employeeKpiSetStatus === 1) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }

    }

    /**thay đổi thời gian của tậpKPI này */
   const handleEditEmployeeKpi = async (employeeKpiSetStatus, id, employeeKpi) => {
        await setState({
            ...state,
            id: id,
            employeeKpi: employeeKpi
        })

        if (employeeKpiSetStatus === 0) {
            if (employeeKpi.status === 1) {
                Swal.fire({
                    title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.activated'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
                })
            } else if (employeeKpi.status === 2) {
                Swal.fire({
                    title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.finished'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
                })
            } else {
                window.$(`#editEmployeeKpi`).modal("show");
            }
        } else if (employeeKpiSetStatus === 1) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }

    }

   const handleCheckEmployeeKpiStatus = (employeeKpiStatus) => {
        if (employeeKpiStatus === null) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.not_approved');
        } else if (employeeKpiStatus === 0) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.edit_request');
        } else if (employeeKpiStatus === 1) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.activated');
        } else if (employeeKpiStatus === 2) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.not_finished')
        }
    }

   const handleCheckEmployeeKpiSetStatus = (employeeKpiSetStatus) => {
        if (employeeKpiSetStatus === 0) {
            return <span style={{ fontWeight: "bold" }} >{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.kpi_status.setting_up')} <i className="fa fa-cogs" style={{ fontSize: "16px" }}></i></span>;
        } else if (employeeKpiSetStatus === 1) {
            return <span style={{ fontWeight: "bold" }} className="text-danger">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.kpi_status.awaiting_approval')} <i className="fa fa-hourglass-half" style={{ fontSize: "16px" }}></i></span>;
        } else if (employeeKpiSetStatus === 2) {
            return <span style={{ fontWeight: "bold" }} className="text-success">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.kpi_status.activated')} <i className="fa fa-check-circle" style={{ fontSize: "16px" }}></i></span>;
        }
    }

    /**Yêu cầu phê duyệt tập KPI này */
   const handleRequestApproveEmployeeKpiSet = (kpipersonal) => {
        let totalWeight = kpipersonal.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if (totalWeight === 100) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.request_approval_kpi.approve'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            }).then((res) => {
                if (res.value) {
                    props.updateEmployeeKpiSetStatus(kpipersonal._id, 1);
                }
            });
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.request_approval_kpi.not_enough_weight'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

   const handleCancelApproveEmployeeKpiSet = (kpipersonal) => {
        if (kpipersonal.status === 1) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.cancel_approve.cancel'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            }).then((res) => {
                if (res.value) {
                    props.updateEmployeeKpiSetStatus(kpipersonal._id, 0);
                }
            });
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.cancel_approve.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

    const { createEmployeeKpiSet, user, createKpiUnit, department } = props;
    const { editing, id, employeeKpi, employeeKpiSet, defaultDate , month} = state;
    let unitList, currentUnit, currentKPI, currentKPILoading, userdepartments, organizationalUnitsOfUser;

    if (user) {
        unitList = user.organizationalUnitsOfUser;
        currentUnit = unitList && unitList.filter(item => (
            item.managers.includes(state.currentRole)
            || item.employees.includes(state.currentRole)
            || item.deputyManagers.includes(state.currentRole)));

        if (currentUnit && currentUnit[0]) {
            currentUnit = currentUnit[0];
        }
    }

    let parentKpi = createKpiUnit && createKpiUnit.currentKPI;

    if (createEmployeeKpiSet) {
        currentKPI = createEmployeeKpiSet.currentKPI;
        currentKPILoading = createEmployeeKpiSet.currentKPILoading;
    }
    let managers = [];

    if (user?.userdepartments) {
        managers = getEmployeeSelectBoxItems([user.userdepartments], true, false, false);
    }
    if (department?.unit) {
        let temp;
        temp = {
            text: department?.unit?.name,
            value: []
        }
        if (department?.unit?.managers?.[0]?.users) {
            department.unit.managers[0].users.map(item => {
                temp.value.push({
                    value: item?.userId?.id,
                    text: item?.userId?.name + ' (' + department.unit.managers[0]?.name + ')'
                })
            })
        }

        if (managers) {
            managers.unshift(temp);
        }
    }

    return (
        <section>
            <div className="qlcv" style={{ marginLeft: "-5px" }}>
                <div className="form-inline">
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                        <DatePicker
                            id="monthInOrganizationalUnitKpi"
                            dateFormat="month-year"
                            value={defaultDate}
                            onChange={handleChangeDate}
                            disabled={false}
                        />
                    </div>

                    <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.general.show')}</button>
                </div>
            </div>
            <div className="box">
                <div className="box-body">
                    <div className="row">
                        <ModalEditEmployeeKpi
                            id={id}
                            employeeKpi={employeeKpi}
                        />

                        {/* Khi đã khởi tạo tập KPI */}
                        {currentKPI ?
                            <div className="col-xs-12 col-sm-12">
                                <div style={{ marginLeft: "-10px", marginBottom: "10px" }}>

                                    {/* Chỉnh sửa thông tin của tập KPI này */}
                                    {editing ?
                                        <React.Fragment>
                                            <a className="btn btn-app" onClick={() => handleSaveEditEmployeeKpiSet(currentKPI._id)} title={translate('kpi.evaluation.employee_evaluation.save_result')}>
                                                <i className="fa fa-save" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.save')}
                                            </a>
                                            <a className="btn btn-app" onClick={() => handleCancelEditEmployeeKpiSet()} title="Hủy bỏ chỉnh sửa">
                                                <i className="fa fa-ban" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.cancel')}
                                            </a>
                                        </React.Fragment> :
                                        <a className="btn btn-app" onClick={checkOrganizationalUnitKpi() ? () => handleEditEmployeeKpiSet(currentKPI.status) : () => handleStartOrganizationalUnitKpi()} title="Chỉnh sửa thông tin chung">
                                            <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.edit')}
                                        </a>
                                    }

                                    {/* Xóa tập KPI này */}
                                    <a className="btn btn-app" onClick={() => handleDeleteEmployeeKpiSet(currentKPI._id, currentKPI.status)} title="Xóa KPI tháng">
                                        <i className="fa fa-trash" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.delete')}
                                    </a>

                                    {/* Thêm KPI cá nhân */}
                                    <a
                                        className="btn btn-app"
                                        data-toggle="modal"
                                        data-backdrop="static"
                                        data-keyboard="false"
                                        onClick={
                                            checkOrganizationalUnitKpi() ?
                                                () => handleCreateEmployeeKpi(currentKPI.status) :
                                                () => handleStartOrganizationalUnitKpi()
                                        }
                                    >
                                        <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.add_target')}
                                    </a>

                                    <ModalCreateEmployeeKpi employeeKpiSet={currentKPI._id} organizationalUnit={currentUnit} />

                                    {/* Yêu cầu phê duyệt tập KPI này */}
                                    {currentKPI.status === 0 ?
                                        <a className="btn btn-app" onClick={checkOrganizationalUnitKpi() ? () => handleRequestApproveEmployeeKpiSet(currentKPI) : () => handleStartOrganizationalUnitKpi()}>
                                            <i className="fa fa-external-link-square" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.request_approval')}
                                        </a>
                                        : <a className="btn btn-app" onClick={() => handleCancelApproveEmployeeKpiSet(currentKPI)}>
                                            <i className="fa fa-minus-square" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.cancel_request_approval')}
                                        </a>
                                    }
                                </div>

                                <div className="" style={{ marginBottom: "10px" }}>
                                    <h4 style={{ display: "inline", fontWeight: "600" }}>
                                        {/* Tên đơn vị */}
                                        {translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.general_information')} {formatDate(currentKPI.date)} ({currentKPI.organizationalUnit.name ? currentKPI.organizationalUnit.name : translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.handle_populate_info_null.error_kpi_organizational_unit_null')})
                                    </h4>
                                </div>

                                {/* Khi edit tập KPI này */}
                                {editing ? managers &&
                                    <div className="form-group">
                                        <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}</label>
                                        <SelectBox
                                            id={`createEmployeeKpiSet`}
                                            className="form-control select2"
                                            style={{ width: "40%" }}
                                            items={managers}
                                            multiple={false}
                                            onChange={handleApproverChange}
                                            value={employeeKpiSet.approver}
                                        />
                                    </div>
                                    : <div>
                                        {/* Tên người phê duyệt */}
                                        <span style={{ fontWeight: "600" }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.approver')}: </span>
                                        <span>{currentKPI.approver && currentKPI.approver.name ? currentKPI.approver.name : translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.handle_populate_info_null.error_kpi_approver_null')}</span>
                                    </div>
                                }


                                {/*Tổng trọng số */}
                                {!editing &&
                                <div>
                                    <span>{currentKPI.kpis.length} {translate('kpi.evaluation.employee_evaluation.target')} - {translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight_total')} </span>
                                    <span>{currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100 - </span>
                                    {currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ?
                                        <span className="text-danger" style={{ fontWeight: "bold" }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_satisfied')}</span>
                                        : <span className="text-success" style={{ fontWeight: "bold" }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.satisfied')}</span>
                                    }
                                    <span> - </span>
                                    {handleCheckEmployeeKpiSetStatus(currentKPI.status)}
                                </div>
                                }

                                {/* Danh sách các mục tiêu */}
                                <div>
                                    {(typeof currentKPI !== 'undefined' && currentKPI !== null) &&
                                    <h4 style={{ display: "inline-block", fontWeight: "600", marginTop: "20px" }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_list')}</h4>
                                    }
                                    <SlimScroll outerComponentId="kpi_table" innerComponentId="kpipersonal_table" innerComponentWidth="992px" activate={state.fixTableWidth} />
                                    <div id="kpi_table">
                                        <table className="table table-bordered table-striped table-hover" id="kpipersonal_table">
                                            <thead>
                                            <tr>
                                                <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')} style={{ width: '40px' }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                                                <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')} className="col-lg-3 col-sm-3">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')}</th>
                                                <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.parents_target')} className="col-lg-3 col-sm-3">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.parents_target')}</th>
                                                <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.evaluation_criteria')} className="col-lg-2 col-sm-2">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.evaluation_criteria')}</th>
                                                <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')} className="col-lg-1 col-sm-1">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')}</th>
                                                <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.status')} className="col-lg-1 col-sm-1">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.status')}</th>
                                                <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action')} className="col-lg-1 col-sm-1">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action')}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                (typeof currentKPI === 'undefined' || currentKPI === null) ?
                                                    <tr><td colSpan={7}><center>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_initialize')} {formatDate(Date.now())}</center></td></tr>
                                                    : (currentKPI.kpis.map((item, index) => item ?
                                                    <tr key={index + 1}>
                                                        <td title={index + 1}>{index + 1}</td>
                                                        <td title={item.name}>{item.name}</td>
                                                        <td title={item.parent ? item.parent.name : translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.handle_populate_info_null.error_kpi_approver_null')}>{item.parent ? item.parent.name : translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.handle_populate_info_null.error_kpi_approver_null')}</td>
                                                        <td title={parse(item.criteria)}>{parse(item.criteria)}</td>
                                                        <td title={item.weight}>{item.weight}</td>
                                                        <td title={handleCheckEmployeeKpiStatus(item.status)}>{handleCheckEmployeeKpiStatus(item.status)}</td>
                                                        <td>
                                                            <a
                                                                style={{ color: "#FFC107", fontSize: "16px" }}
                                                                title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action_title.edit')}
                                                                data-target={`editEmployeeKpi`}
                                                                data-toggle="modal"
                                                                data-backdrop="static"
                                                                data-keyboard="false"
                                                                onClick={checkOrganizationalUnitKpi() ? () => handleEditEmployeeKpi(currentKPI.status, item._id, item) : () => handleStartOrganizationalUnitKpi()}>
                                                                <i className="fa fa-edit"></i>
                                                            </a>

                                                            {item.type !== 0 ?
                                                                // <a className="copy" title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action_title.content')}><i className="material-icons">notification_important</i></a>
                                                                <ToolTip
                                                                    type={"icon_tooltip"} materialIcon={"notification_important"}
                                                                    dataTooltip={[translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action_title.content')]}
                                                                />
                                                                : <a
                                                                    style={{ color: "#E34724", fontSize: "16px" }}
                                                                    title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action_title.delete')}
                                                                    onClick={checkOrganizationalUnitKpi() ? () => handleDeleteEmployeeKpi(currentKPI._id, currentKPI.status, item._id, item.status) : () => handleStartOrganizationalUnitKpi()}>
                                                                    <i className="fa fa-trash"></i>
                                                                </a>
                                                            }
                                                        </td>
                                                    </tr> : translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.handle_populate_info_null.error_kpi_targets_list_null')
                                                    ))
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row" style={{ display: 'flex', flex: 'no-wrap', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <div className="col-xs-12 col-sm-12 col-md-6">
                                        <Comment
                                            data={currentKPI}
                                            comments={currentKPI.comments}
                                            createComment={(dataId, data) => props.createComment(dataId, data)}
                                            editComment={(dataId, commentId, data) => props.editComment(dataId, commentId, data)}
                                            deleteComment={(dataId, commentId) => props.deleteComment(dataId, commentId)}
                                            createChildComment={(dataId, commentId, data) => props.createChildComment(dataId, commentId, data)}
                                            editChildComment={(dataId, commentId, childCommentId, data) => props.editChildComment(dataId, commentId, childCommentId, data)}
                                            deleteChildComment={(dataId, commentId, childCommentId) => props.deleteChildComment(dataId, commentId, childCommentId)}
                                            deleteFileComment={(fileId, commentId, dataId) => props.deleteFileComment(fileId, commentId, dataId)}
                                            deleteFileChildComment={(fileId, commentId, childCommentId, dataId) => props.deleteFileChildComment(fileId, commentId, childCommentId, dataId)}
                                            downloadFile={(path, fileName) => props.downloadFile(path, fileName)}
                                        />
                                    </div>
                                </div>
                            </div>

                            /* Khi chưa khởi tạo tập KPI cá nhân */
                            : currentKPILoading
                            && <div className="col-xs-12">
                                <div style={{ marginLeft: "-10px" }}>
                                    {checkOrganizationalUnitKpi() ?
                                        <span>
                                                <a className="btn btn-app" data-toggle="modal" data-target="#createEmployeeKpiSet" data-backdrop="static" data-keyboard="false">
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.initialize_kpi_newmonth')} {formatDate(month)}
                                                </a>
                                                <ModalCreateEmployeeKpiSet
                                                    organizationalUnit={currentUnit}
                                                    month={month}
                                                    managers={managers}
                                                />
                                            </span>
                                        : <span>
                                                <a className="btn btn-app" data-toggle="modal" data-target="#startKPIPersonal" data-backdrop="static" data-keyboard="false" onClick={() => handleStartOrganizationalUnitKpi()}>
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.initialize_kpi_newmonth')} {formatDate(month)}
                                                </a>
                                            </span>
                                    }

                                    {/* Sao chép mục tiêu từ KPI đơn vị cha */}
                                    {checkOrganizationalUnitKpi() ?
                                        <span>
                                                <a className="btn btn-app" data-toggle="modal" data-target={`#copy-old-kpi-to-new-time-${parentKpi && parentKpi._id}`} data-backdrop="static" data-keyboard="false">
                                                    <i className="fa fa-copy" style={{ fontSize: "16px" }}></i>Sao chép KPI đơn vị cha
                                                </a>
                                                <ModalCopyKPIUnit
                                                    kpiId={parentKpi && parentKpi._id}
                                                    idunit={currentUnit && currentUnit._id}
                                                    kpiunit={parentKpi}
                                                    editMonth={true}
                                                    monthDefault={month}
                                                    approverDefault={managers}
                                                    type={'copy-parent-kpi-to-employee'}
                                                />
                                            </span>
                                        : <span>
                                                <a className="btn btn-app" onClick={() => handleStartOrganizationalUnitKpi()}>
                                                    <i className="fa fa-copy" style={{ fontSize: "16px" }}></i>Sao chép KPI đơn vị cha
                                                </a>
                                            </span>
                                    }
                                </div>
                                <h3 style={{ display: "inline-block", fontWeight: "600" }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.general_information')} {formatDate(month)}</h3>
                                <p>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_initialize')} {formatDate(month)}</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}
function mapState(state) {
    const { department, createEmployeeKpiSet, user, createKpiUnit, auth } = state;
    return { department, createEmployeeKpiSet, user, createKpiUnit, auth };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartment: UserActions.getDepartmentOfUser,

    getEmployeeKpiSet: createKpiSetActions.getEmployeeKpiSet,
    deleteEmployeeKpi: createKpiSetActions.deleteEmployeeKpi,
    editEmployeeKpiSet: createKpiSetActions.editEmployeeKpiSet,
    deleteEmployeeKpiSet: createKpiSetActions.deleteEmployeeKpiSet,
    updateEmployeeKpiSetStatus: createKpiSetActions.updateEmployeeKpiSetStatus,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    createComment: createKpiSetActions.createComment,
    editComment: createKpiSetActions.editComment,
    deleteComment: createKpiSetActions.deleteComment,
    createChildComment: createKpiSetActions.createChildComment,
    editChildComment: createKpiSetActions.editChildComment,
    deleteChildComment: createKpiSetActions.deleteChildComment,
    deleteFileComment: createKpiSetActions.deleteFileComment,
    deleteFileChildComment: createKpiSetActions.deleteFileChildComment,

    getOrganizationalUnit: DepartmentActions.getOrganizationalUnit,

    downloadFile: AuthActions.downloadFile,
};

export default connect(mapState, actionCreators)(withTranslate(CreateEmployeeKpiSet));
