import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import parse from 'html-react-parser';

import { DatePicker, ToolTip, SelectBox, Comment } from '../../../../../common-components';

import { OrganizationalUnitKpiAddTargetModal } from './organizationalUnitKpiAddTargetModal';
import { OrganizationalUnitKpiCreateModal } from './organizationalUnitKpiCreateModal';
import { OrganizationalUnitKpiEditTargetModal } from './organizationalUnitKpiEditTargetModal';
import { ModalCopyKPIUnit } from '../../management/component/organizationalUnitKpiCopyModal';
import { EmployeeImportancesModal } from './employeeImportancesModal';
import { OrganizationalUnitImportancesModal } from './organizationalUnitImportancesModal';

import { createUnitKpiActions } from '../redux/actions.js';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';
import { AuthActions } from '../../../../auth/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';

function OrganizationalUnitKpiCreate(props) {
    const { translate, dashboardEvaluationEmployeeKpiSet, createKpiUnit, user, department } = props;
    const { type, selectBoxAllUnit } = props;

    let d = new Date(),
        currentMonth = d.getMonth() + 1,
        year = d.getFullYear();

    if (currentMonth < 10) {
        currentMonth = '0' + currentMonth;
    }


    const [state, setState] = useState({
        defaultDate: [currentMonth, year].join('-'),

        organizationalUnit: null,
        organizationalUnitId: null,
        month: [year, currentMonth].join('-'),

        infoSearch: {
            organizationalUnit: null,
            organizationalUnitId: null,
            month: [year, currentMonth].join('-')
        },

        adding: false,
        editing: false,
        submitted: false,

        currentRole: localStorage.getItem("currentRole"),
        userId: localStorage.getItem("userId")
    });
    const { id, userId, organizationalUnitId, month, 
        selectBoxUnit, currentRole, organizationalUnit, 
        defaultDate, organizationalUnitKpi, infoSearch
    } = state;

    useEffect(()=>{
        if (type !== 'for-admin') {
            // Get department list of company
            props.getDepartmentsThatUserIsManager();
            props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
            props.getDepartment();
            props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
            props.getKPIParent({
                roleId: localStorage.getItem('currentRole')
            })
        }
    }, [])

    // Trường hợp trưởng đơn vị truy cập
    useEffect(()=>{
        if (type !== 'for-admin') {
            // Trưởng hợp đổi 2 role cùng là trưởng đơn vị, cập nhật lại select box chọn đơn vị
            if (organizationalUnitId && dashboardEvaluationEmployeeKpiSet && !dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
                setState({
                    ...state,
                    organizationalUnitId: null
                })
            }

            // Khở tạo select box mới
            if (!organizationalUnitId && dashboardEvaluationEmployeeKpiSet && dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
                setSelectBoxOrganizationalUnit();
            }
        }
    });

    // Trường hợp Admin truy cập
    useEffect(() => {
        if (type === 'for-admin' && selectBoxAllUnit && !organizationalUnitId) {
            setState((state) => {
                return {
                    ...state,
                    organizationalUnit: selectBoxAllUnit?.[0],
                    organizationalUnitId: selectBoxAllUnit?.[0]?.id,
                    selectBoxUnit: selectBoxAllUnit,
                    infoSearch: {
                        ...state.infoSearch,
                        organizationalUnitId: selectBoxAllUnit?.[0]?.id,
                        organizationalUnit: selectBoxAllUnit?.[0]
                    },
                }
            });

            props.getCurrentKPIUnit(null, selectBoxAllUnit?.[0]?.id);
        }
    })

    /** Hàm khởi tạo select box chọn đơn vị */
    const setSelectBoxOrganizationalUnit = () => {
        let childrenOrganizationalUnit = [], queue = [], currentOrganizationalUnit;

        // Khởi tạo selectbox đơn vị
        if (dashboardEvaluationEmployeeKpiSet) {
            currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        }
        if (currentOrganizationalUnit) {
            childrenOrganizationalUnit.push(currentOrganizationalUnit);
            queue.push(currentOrganizationalUnit);
            while (queue.length > 0) {
                let v = queue.shift();
                if (v.children) {
                    for (let i = 0; i < v.children.length; i++) {
                        let u = v.children[i];
                        queue.push(u);
                        childrenOrganizationalUnit.push(u);
                    }
                }
            }
        }

        setState((state) => {
            return {
                ...state,
                organizationalUnit: childrenOrganizationalUnit?.[0],
                organizationalUnitId: childrenOrganizationalUnit?.[0]?.id,
                selectBoxUnit: childrenOrganizationalUnit,
                infoSearch: {
                    ...state.infoSearch,
                    organizationalUnitId: childrenOrganizationalUnit?.[0]?.id,
                    organizationalUnit: childrenOrganizationalUnit?.[0]
                }
            }
        });
    }

    const cancelKPIUnit = (event, id, status) => {
        event.preventDefault();
        Swal.fire({
            title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_cancel_approve'),
            type: 'success',
            showCancelButton: true,
            cancelButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel'),
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
        }).then((res) => {
            if (res.value) {
                props.editKPIUnit(id, { status: status }, 'edit-status');
            }
        });
    }

    const approveKPIUnit = (event, currentStatus, currentKPI, status) => {
        event.preventDefault();
        var totalWeight = currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if (currentStatus === 1) {
            Swal.fire({
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approve_already'),
                type: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
            })
        } else {
            if (totalWeight === 100) {
                Swal.fire({
                    title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approve'),
                    type: 'success',
                    showCancelButton: true,
                    cancelButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel'),
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
                }).then((res) => {
                    if (res.value) {
                        props.editKPIUnit(currentKPI._id, { status: status }, 'edit-status');
                    }
                });
            } else {
                Swal.fire({
                    title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_not_enough_weight'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
                })
            }
        }
    }

    const deleteKPI = (status, id) => {
        if (status === 1) {
            Swal.fire({
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_delete_success'),
                type: 'success',
                showCancelButton: true,
                cancelButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel'),
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
            }).then((res) => {
                if (res.value) {
                    props.deleteKPIUnit(id);
                }
            });
        }
    }

    const deleteTargetKPIUnit = (status, id, organizationalUnitKpiSetId) => {
        if (status === 1) {
            Swal.fire({
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_kpi'),
                type: 'success',
                showCancelButton: true,
                cancelButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel'),
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
            }).then((res) => {
                if (res.value) {
                    props.deleteTargetKPIUnit(id, organizationalUnitKpiSetId);
                }
            });
        }
    }

    function formatDate(date) {
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

    const handleSelectOrganizationalUnit = (value) => {
        let organizationalUnit = selectBoxUnit.filter(item => item.id === value[0]);

        setState( {
            ...state,
            infoSearch: {
                ...state.infoSearch,
                organizationalUnitId: value[0],
                organizationalUnit: organizationalUnit?.[0],
            }
        })
    };

    const handleChangeDate = (value) => {
        let month = value;
        if (value !== '') {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState(  {
            ...state,
            infoSearch: {
                ...state.infoSearch,
                month: month
            }
        })
    };

    const handleSearchData = () => {
        setState(  {
            ...state,
            month: infoSearch?.month,
            organizationalUnitId: infoSearch?.organizationalUnitId,
            organizationalUnit: infoSearch?.organizationalUnit
        })

        if (infoSearch?.organizationalUnitId && infoSearch?.month && infoSearch?.month !== '') {
            console.log(infoSearch?.organizationalUnitId ,infoSearch?.month, infoSearch?.organizationalUnit)
            props.getCurrentKPIUnit(currentRole, infoSearch?.organizationalUnitId, infoSearch?.month);
            props.getKPIParent({
                roleId: currentRole,
                organizationalUnitId: infoSearch?.organizationalUnitId,
                month: infoSearch?.month
            });
        }
    }

    const checkEdittingPermission = (currentUnit) => {
        if (currentUnit) {
            let parentUnit = currentUnit.parent ? currentUnit.parent : currentUnit.parent_id;
            let parentKpi = createKpiUnit && createKpiUnit.parent;

            if (!parentUnit) {
                return true;
            } else {
                if (!parentKpi) {
                    return false;
                }
                else if (parentKpi.status === 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }

        return false;
    }

    const handleEditOrganizationalUnitKPi = (organizationalUnitKpiId, organizationalUnitKpi, organizationalUnitKpiSet) => {
        setState( {
            ...state,
            id: organizationalUnitKpiId,
            organizationalUnitKpi: organizationalUnitKpi,
        })

        if (organizationalUnitKpiSet && organizationalUnitKpiSet.status === 1) {
            swalOfUnitKpi("edit");
        } else {
            window.$(`#editTargetKPIUnit`).modal("show");
        }
    }

    const swalEdittingPermission = () => {
        let parentKpi = createKpiUnit && createKpiUnit.parent;
        if (!parentKpi) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_initialize_organiztional_unit_kpi'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_activate_organiztional_unit_kpi'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
            })
        }
    }

   const swalOfUnitKpi = (type) => {
        switch (type) {
            case "add_target":
                return Swal.fire({
                    title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.add_new_target.activated'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Đồng ý'
                })
            case "edit":
                return Swal.fire({
                    title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.activated'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Đồng ý'
                })
            case "delete":
                return Swal.fire({
                    title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.activated'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Đồng ý'
                })
            case "edit_employee_importance":
                return Swal.fire({
                    title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance_activated'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Đồng ý'
                })
            case "edit_organizational_unit_importance":
                return Swal.fire({
                    title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_importance_activated'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Đồng ý'
                })
        }
    }

    let unitList, currentKPI, organizationalUnitKpiLoading, organizationalUnitsOfUserLoading, childrenOrganizationalUnit, childrenOrganizationalUnitLoading;

    let parentKpi = createKpiUnit && createKpiUnit.parent;

    if (dashboardEvaluationEmployeeKpiSet) {
        childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        childrenOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
    }

    if (user) {
        organizationalUnitsOfUserLoading = user.organizationalUnitsOfUserLoading;
        unitList = user.organizationalUnitsOfUser;
    }

    if (createKpiUnit) {
        currentKPI = createKpiUnit.currentKPI;
        organizationalUnitKpiLoading = createKpiUnit.organizationalUnitKpiLoading
    }

    // Lọc các đơn vị có thể sao chép KPI
    // Lấy các đơn vị nó làm trưởng và đơn vị cha
    let listOrganizationalUnitCopy, listUnitOfUser, listIdOfExistUnit = [];

    if (department) {
        listUnitOfUser = department.departmentsThatUserIsManager;
    }

    // Đơn vị có thể copy: đơn vị cha và đơn vị cùng cha
    listOrganizationalUnitCopy = selectBoxUnit?.filter(item => {
        return (
                (organizationalUnit?.parent_id && item?.parent_id === organizationalUnit?.parent_id)
                || item?.id === organizationalUnit?.parent_id
            )
    })

    if (listOrganizationalUnitCopy?.length > 0) {
        listIdOfExistUnit = listOrganizationalUnitCopy.map(item => item?.id)
    }

    if (!listIdOfExistUnit?.includes(createKpiUnit?.parent?.organizationalUnit?._id) && listOrganizationalUnitCopy) {
        let parentKPI = createKpiUnit?.parent?.organizationalUnit;

        listOrganizationalUnitCopy.push({
            ...parentKPI,
            id: parentKPI?._id
        })
        listIdOfExistUnit.push(parentKPI?._id)
    }

    // Copy từ đơn vị nhân viên này là trưởng
    if (listUnitOfUser?.length > 0 && listOrganizationalUnitCopy) {
        listUnitOfUser.map(item => {
            if (item?.parent === organizationalUnit?.parent_id && !listIdOfExistUnit?.includes(item?._id) && (item?._id !== organizationalUnit?.id)) {
                listOrganizationalUnitCopy.push({
                    ...item,
                    id: item?._id
                })
                listIdOfExistUnit.push(item?._id)
            }
        })
    }

    return (
        <React.Fragment>
            {unitList && unitList.length !== 0 || type === 'for-admin'
                ? <section>
                    <div className="qlcv" style={{ marginLeft: "-5px" }}>
                        {selectBoxUnit &&
                        <div className="form-inline">
                            <div className="form-group">
                                <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                                <SelectBox
                                    id={`organizationalUnitSelectBoxInOrganizationalUnitKpi`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={selectBoxUnit.map(item => { return { value: item.id, text: item.name } })}
                                    multiple={false}
                                    onChange={handleSelectOrganizationalUnit}
                                    value={organizationalUnitId}
                                />
                            </div>

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
                        }
                    </div>

                    <div className="box">
                        {currentKPI
                            ?
                            <React.Fragment>
                                <div className="box-body">
                                    <OrganizationalUnitKpiEditTargetModal
                                        id={id}
                                        organizationalUnitKpi={organizationalUnitKpi}
                                        organizationalUnit={currentKPI.organizationalUnit}
                                    />
                                    <div style={{ marginLeft: "-10px" }}>
                                        {/* Xóa KPI tháng */}
                                        <a className="btn btn-app" onClick={checkEdittingPermission(currentKPI && currentKPI.organizationalUnit) ? () => deleteKPI(currentKPI.status, currentKPI._id) : () => swalEdittingPermission()} title="Xóa KPI tháng">
                                            <i className="fa fa-trash" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.delete')}
                                        </a>

                                        {/* Kich hoạt KPI tháng */}
                                        {currentKPI.status === 0 ?
                                            <a className="btn btn-app" onClick={checkEdittingPermission(currentKPI && currentKPI.organizationalUnit) ? (event) => approveKPIUnit(event, currentKPI.status, currentKPI, 1) : () => swalEdittingPermission()}>
                                                <i className="fa fa-rocket" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.approve')}
                                            </a> :
                                            <a className="btn btn-app" onClick={checkEdittingPermission(currentKPI && currentKPI.organizationalUnit) ? (event) => cancelKPIUnit(event, currentKPI._id, 0) : () => swalEdittingPermission()}>
                                                <i className="fa fa-lock" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel_approve')}
                                            </a>
                                        }

                                        {/* Thêm mục tiêu */}
                                        {checkEdittingPermission(currentKPI && currentKPI.organizationalUnit) ?
                                            <span>
                                                        {currentKPI.status === 1 ?
                                                            <a className="btn btn-app" onClick={() => swalOfUnitKpi("add_target")}>
                                                                <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.add_target')}
                                                            </a>
                                                            : <span>
                                                                <a className="btn btn-app" data-toggle="modal" data-target="#modal-add-target" data-backdrop="static" data-keyboard="false">
                                                                    <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.add_target')}
                                                                </a>
                                                                <OrganizationalUnitKpiAddTargetModal organizationalUnitKpiSetId={currentKPI._id} organizationalUnit={currentKPI.organizationalUnit} />
                                                            </span>
                                                        }
                                                    </span>
                                            : <span>
                                                        <a className="btn btn-app" onClick={() => swalEdittingPermission()}>
                                                            <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.add_target')}
                                                        </a>
                                                    </span>
                                        }

                                        {/* Chỉnh sửa độ quan trọng của nhân viên */}
                                        {checkEdittingPermission(currentKPI && currentKPI.organizationalUnit) ?
                                            <span>
                                                        {currentKPI.status === 1 ?
                                                            <a className="btn btn-app" onClick={() => swalOfUnitKpi("edit_employee_importance")}>
                                                                <i className="fa fa-child" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}
                                                            </a>
                                                            : <span>
                                                                <a className="btn btn-app" data-toggle="modal" data-target="#employee-importances" data-backdrop="static" data-keyboard="false">
                                                                    <i className="fa fa-child" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}
                                                                </a>
                                                                <EmployeeImportancesModal
                                                                    organizationalUnit={currentKPI.organizationalUnit}
                                                                    organizationalUnitId={currentKPI.organizationalUnit && currentKPI.organizationalUnit._id}
                                                                    month={month}
                                                                />
                                                            </span>
                                                        }
                                                    </span>
                                            : <span>
                                                        <a className="btn btn-app" onClick={() => swalEdittingPermission()}>
                                                            <i className="fa fa-child" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}
                                                        </a>
                                                    </span>
                                        }

                                        {/* Chỉnh sửa độ quan trọng của đơn vị con */}
                                        {selectBoxUnit?.filter(item => item?.id === currentKPI?.organizationalUnit?._id)?.[0]?.children &&
                                        <span>
                                                        {checkEdittingPermission(currentKPI && currentKPI.organizationalUnit)
                                                            ? <span>
                                                                {currentKPI.status === 1 ?
                                                                    <a className="btn btn-app" onClick={() => swalOfUnitKpi("edit_organizational_unit_importance")}>
                                                                        <i className="fa fa-university" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_importance')}
                                                                    </a>
                                                                    : <span>
                                                                        <a className="btn btn-app" data-toggle="modal" data-target="#organizational-unit-importances" data-backdrop="static" data-keyboard="false">
                                                                            <i className="fa fa-university" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_importance')}
                                                                        </a>
                                                                        <OrganizationalUnitImportancesModal
                                                                            organizationalUnit={selectBoxUnit?.filter(item => item?.id === currentKPI?.organizationalUnit?._id)?.[0]}
                                                                            organizationalUnitId={currentKPI.organizationalUnit && currentKPI.organizationalUnit._id}
                                                                            month={month}
                                                                        />
                                                                    </span>
                                                                }
                                                            </span>
                                                            : <span>
                                                                <a className="btn btn-app" onClick={() => swalEdittingPermission()}>
                                                                    <i className="fa fa-university" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_importance')}
                                                                </a>
                                                            </span>
                                                        }
                                                    </span>
                                        }
                                    </div>

                                    <div className="">
                                        <h4 style={{ display: "inline-block", fontWeight: "600" }}>
                                            KPI {currentKPI.organizationalUnit ? currentKPI.organizationalUnit.name : "Đơn vị đã bị xóa"} {formatDate(month)}
                                        </h4>

                                        <div className="form-group">
                                                <span>
                                                    {currentKPI.kpis.reduce(sum => sum + 1, 0)} {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.target')} -&nbsp;
                                                    {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.weight_total')} &nbsp;
                                                    {currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100
                                            </span>
                                            {currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ?
                                                <span className="text-danger" style={{ fontWeight: "bold" }}> - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_satisfied')} </span> :
                                                <span className="text-success" style={{ fontWeight: "bold" }}> - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.satisfied')} </span>
                                            }
                                            {currentKPI.status === 1 ?
                                                <span className="text-success" style={{ fontWeight: "bold" }}> - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.approved')}</span> :
                                                <span className="text-danger" style={{ fontWeight: "bold" }}> - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_approved')}</span>
                                            }
                                        </div>

                                        {/* Bảng các mục tiêu của KPI */}
                                        <table className="table table-bordered table-striped table-hover">
                                            <thead>
                                            <tr>
                                                <th title="Số thứ tự" style={{ width: "40px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                                                <th title="Tên mục tiêu">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.target_name')}</th>
                                                {currentKPI?.organizationalUnit?.parent && <th title="Mục tiêu cha">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.parents_target')}</th>}
                                                <th title="Tiêu chí đánh giá">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.evaluation_criteria')}</th>
                                                <th title="Trọng số" className="col-sort-number" style={{ width: "100px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.weight')}</th>
                                                <th style={{ width: "100px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.action')}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                currentKPI.kpis.map((item, index) =>
                                                    <tr key={item._id}>
                                                        <td>{index + 1}</td>
                                                        <td title={item.name}>{item.name}</td>
                                                        {currentKPI?.organizationalUnit?.parent && <td title={item?.parent?.name}>{item?.parent?.name}</td>}
                                                        <td title={parse(item.criteria)}>{parse(item.criteria)}</td>
                                                        <td title={item.weight}>{item.weight}</td>
                                                        <td>
                                                            <a
                                                                className="edit"
                                                                title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.edit')}
                                                                data-toggle="modal"
                                                                data-backdrop="static"
                                                                data-keyboard="false"
                                                                onClick={checkEdittingPermission(currentKPI && currentKPI.organizationalUnit) ? () => handleEditOrganizationalUnitKPi(item._id, item, currentKPI) : () => swalEdittingPermission()}>
                                                                <i className="material-icons"></i>
                                                            </a>

                                                            {item.type === 0 ?
                                                                <a href="#abc" className="delete" title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.delete_title')} onClick={checkEdittingPermission(currentKPI && currentKPI.organizationalUnit) ? () => deleteTargetKPIUnit(currentKPI.status, item._id, currentKPI._id) : () => swalEdittingPermission()}>
                                                                    <i className="material-icons"></i>
                                                                </a> :
                                                                <ToolTip
                                                                    type={"icon_tooltip"} materialIcon={"help"}
                                                                    dataTooltip={[translate('kpi.organizational_unit.create_organizational_unit_kpi_set.content')]}
                                                                />
                                                            }
                                                        </td>
                                                    </tr>
                                                )
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
                            </React.Fragment>
                            : organizationalUnitKpiLoading && (childrenOrganizationalUnitLoading || type === 'for-admin')
                            && <div className="box-body">
                                <div style={{ marginLeft: "-10px" }}>
                                    <div>
                                        {/* Khởi tạo KPI */}
                                        {checkEdittingPermission(organizationalUnit) ?
                                            <span>
                                                <a className="btn btn-app" data-toggle="modal" data-target="#startKPIUnit" data-backdrop="static" data-keyboard="false">
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.initialize_kpi_newmonth')} {formatDate(month)}
                                                </a>
                                                <OrganizationalUnitKpiCreateModal organizationalUnit={organizationalUnit} month={month} />
                                            </span>
                                            :
                                            // Cảnh báo đơn vị cha chưa kích hoạt KPI
                                            <a className="btn btn-app" data-toggle="modal" data-backdrop="static" data-keyboard="false" onClick={() => swalEdittingPermission()}>
                                                <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.initialize_kpi_newmonth')} {formatDate(month)}
                                            </a>
                                        }

                                        {/* Sao chép mục tiêu từ KPI đơn vị cha */}
                                        {checkEdittingPermission(organizationalUnit) && parentKpi ?
                                            <span>
                                                <a className="btn btn-app" data-toggle="modal" data-target={`#copy-old-kpi-to-new-time-${parentKpi && parentKpi._id}`} data-backdrop="static" data-keyboard="false">
                                                    <i className="fa fa-copy" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.copy_kpi_unit')}
                                                </a>
                                                <ModalCopyKPIUnit
                                                    kpiId={parentKpi?._id}
                                                    idunit={organizationalUnit?.id}
                                                    organizationalUnitSelect={listOrganizationalUnitCopy}
                                                    kpiunit={parentKpi}
                                                    editMonth={true}
                                                    monthDefault={month}
                                                    type={'copy-parent-kpi-to-unit'}
                                                />
                                            </span>
                                            : (organizationalUnit?.parent || organizationalUnit?.parent_id)
                                            && <span>
                                                <a className="btn btn-app" onClick={() => swalEdittingPermission()}>
                                                    <i className="fa fa-copy" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.copy_kpi_unit')}
                                                </a>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <h4 style={{ display: "inline-block", fontWeight: "600" }}>KPI {organizationalUnit && organizationalUnit.name}</h4>
                                <p>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_initialize')} {formatDate(month)}</p>
                            </div>
                        }
                    </div>
                </section>
                : organizationalUnitsOfUserLoading
                && <div className="box-body">
                    <h4>Bạn chưa có đơn vị</h4>
                </div>
            }
        </React.Fragment>
    );
}

function mapState(state) {
    const { createKpiUnit, user, department, dashboardEvaluationEmployeeKpiSet } = state;
    return { createKpiUnit, user, department, dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    deleteKPIUnit: createUnitKpiActions.deleteKPIUnit,
    deleteTargetKPIUnit: createUnitKpiActions.deleteTargetKPIUnit,
    editKPIUnit: createUnitKpiActions.editKPIUnit,
    getKPIParent: createUnitKpiActions.getKPIParent,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
    createComment: createUnitKpiActions.createComment,
    editComment: createUnitKpiActions.editComment,
    deleteComment: createUnitKpiActions.deleteComment,
    createChildComment: createUnitKpiActions.createChildComment,
    editChildComment: createUnitKpiActions.editChildComment,
    deleteChildComment: createUnitKpiActions.deleteChildComment,
    deleteFileComment: createUnitKpiActions.deleteFileComment,
    deleteFileChildComment: createUnitKpiActions.deleteFileChildComment,
    downloadFile: AuthActions.downloadFile,
    getDepartmentsThatUserIsManager: DepartmentActions.getDepartmentsThatUserIsManager
};
const connectedOrganizationalUnitKpiCreate = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiCreate));
export { connectedOrganizationalUnitKpiCreate as OrganizationalUnitKpiCreate };
