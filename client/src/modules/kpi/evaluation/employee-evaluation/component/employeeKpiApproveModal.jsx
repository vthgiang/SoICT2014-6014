import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import parse from 'html-react-parser';

import { kpiMemberActions } from '../redux/actions';
import { createKpiSetActions } from '../../../employee/creation/redux/actions';
import { AuthActions } from '../../../../auth/redux/actions';
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';

import { DialogModal, ErrorLabel, DatePicker, Comment, DataTableSetting, SlimScroll } from '../../../../../common-components/index';

import { getStorage } from '../../../../../config';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

import { ModalEditEmployeeKpi } from '../../../employee/creation/component/employeeKpiEditTargetModal'
import { EmployeeKpiSetLogsModal } from '../../../employee/management/component/employeeKpiSetLogsModal'

function EmployeeKpiApproveModal(props) {
    let idUser = getStorage("userId");
    const { translate, kpimembers, createKpiUnit, employeeKpiSet } = props;

    const tableId = "employee-kpi-approve-modal";
    getTableConfiguration(tableId);

    const [state, setState] = useState({
        currentUser: idUser,
        date: formatDate(Date.now()),
        defaultDate: formatDateBack(Date.now()),
        editing: false,
        edit: "",
        compare: false,
        checkInput: false,
        tableId,
        employeeKpiSetId: null,
        type: "approve",
        tableBodyKpiId: "table-body-kpi",
        tableBodyKpiCompareId: "table-body-kpi-compare"
    });
    const { errorOnDate, date, compare, edit, defaultDate, employeeKpiSetId, type, tableBodyKpiId, tableBodyKpiCompareId } = state;
    let kpimember, kpimembercmp, month, totalWeight;

    if (props.id !== state.id) {
        setState({
            ...state,
            id: props.id,
        })
    }

    useEffect(()=>{
        if (state.id) {
            props.getKpisByKpiSetId(state.id);
        }
    }, [state.id, props?.auth?.user?.avatar])

    useEffect(() => {
        SlimScroll.removeVerticalScrollStyleCSS(tableBodyKpiId)
        SlimScroll.addVerticalScrollStyleCSS(tableBodyKpiId, 450, true)

        SlimScroll.removeVerticalScrollStyleCSS(tableBodyKpiCompareId)
        SlimScroll.addVerticalScrollStyleCSS(tableBodyKpiCompareId, 450, true)
    })

    useEffect(() => {
        if (!createKpiUnit.currentKPI && kpimembers.currentKPI?.organizationalUnit?._id) {
            let month = new Date(kpimembers.currentKPI?.date)
            props.getCurrentKPIUnit(null, kpimembers.currentKPI.organizationalUnit._id, month)
        }
    }, [kpimembers.currentKPI])

    const handleEditOrganizationalUnitKPi = async (employeeKPI) => {
        // if (employeeKPI?.approvedPoint !== null && employeeKPI?.approvedPoint >= 0) {
        //     Swal.fire({
        //         title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.evaluated'),
        //         type: 'warning',
        //         confirmButtonColor: '#3085d6',
        //         confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
        //     })
        // } else {
            await setState( {
                ...state,
                edit: employeeKPI,
            })
            window.$(`#editEmployeeKpi`).modal("show");
        // }
    }

    const handleDateChange = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        
        setState( {
            ...state,
            errorOnDate: validateDate(value),
            date: month,
        });

    };

    const validateDate = (value) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('kpi.evaluation.employee_evaluation.choose_month_cmp');
        }
        return msg;
    };

    const handleCompare = (id) => {
        setState( {
            ...state,
            compare: !state.compare
        })
        if (id) {
            props.getKpisByMonth(id, formatDate(Date.now()));
        }
    }

    const showEmployeeKPISetLogs = (id) => {
        setState({
            ...state,
            employeeKpiSetId: id
        })
        window.$(`#modal-employee-kpi-set-log-${type}`).modal('show')
    }

    function formatDate(date) {
        let d = new Date(date), month, day, year;
        if (d.getMonth() === 0) {
            month = '' + 12;
            day = '' + d.getDate();
            year = d.getFullYear() - 1;
        } else {
            month = '' + (d.getMonth() + 1);
            day = '' + d.getDate();
            year = d.getFullYear();
        }
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month].join('-');
    }

    function formatDateBack(date) {
        let d = new Date(date), month, day, year;
        if (d.getMonth() === 0) {
            month = '' + 12;
            day = '' + d.getDate();
            year = d.getFullYear() - 1;
        } else {
            month = '' + (d.getMonth() + 1);
            day = '' + d.getDate();
            year = d.getFullYear();
        }
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    const searchKPIMemberByMonth = async (id) => {
        if (!date || date === formatDate(Date.now())) {
            props.getKpisByMonth(id, formatDate(Date.now()));
        }
        else {
            props.getKpisByMonth(id, date);
        }
    }

    const handleEditStatusTarget = (event, kpi, status, listTarget) => {
        event.preventDefault();

        // if (kpi?.approvedPoint !== null && kpi?.approvedPoint >= 0) {
        //     Swal.fire({
        //         title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.evaluated'),
        //         type: 'warning',
        //         confirmButtonColor: '#3085d6',
        //         confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
        //     })
        // } else {
            if (listTarget) {
                let totalWeight;
                if (listTarget) {
                    totalWeight = listTarget.filter(item => item.status === 1 || item._id === kpi?._id).map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
                }

                if (totalWeight !== 100 && listTarget) {
                    Swal.fire({
                        title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_not_enough_weight'),
                        type: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
                    })
                } else {
                    if (kpi?._id) {
                        props.editStatusKpi(kpi?._id, status);
                    }
                }
            } else {
                props.editStatusKpi(kpi?._id, status);
            }
        // }
    }

   const handleApproveKPI = async (id, listTarget) => {
        let totalWeight = listTarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if (totalWeight !== 100) {
            Swal.fire({
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_not_enough_weight'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
            })
        } else {
            props.approveAllKpis(id);
        }
    }

    function formatMonth(date) {
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

    const handleCheckEmployeeKpiStatus = (employeeKpiStatus) => {
        if (employeeKpiStatus === null) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.not_approved');
        } else if (employeeKpiStatus === 0) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.edit_request');
        } else if (employeeKpiStatus === 1) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.activated');
        } else if (employeeKpiStatus === 2) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.finished')
        }
    }

    if (kpimembers.currentKPI) {
        kpimember = kpimembers.currentKPI;
        month = kpimember.date.split('-');
    }
    if (kpimembers.kpimembers) {
        let arrkpimember = kpimembers.kpimembers;
        arrkpimember.forEach(item => {
            let datekpi = item.date.split('-');
            let date = new Date();
            if ((date.getMonth() + 1) === datekpi[1] && date.getFullYear() === datekpi[2]) {
                kpimember = item;
            }
        });
    }
    if (kpimembers.kpimember) kpimembercmp = kpimembers.kpimember;

    totalWeight = kpimember && kpimember.kpis && kpimember.kpis.length !== 0
        && kpimember.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-approve-KPI-member`}
                title={employeeKpiSet?.creator?.name && `KPI ${employeeKpiSet.creator.name}, ${translate('kpi.evaluation.employee_evaluation.month')} ${formatMonth(employeeKpiSet?.date)}`}
                hasSaveButton={false}
                size={100}
            >
                <ModalEditEmployeeKpi
                    id={edit?._id}
                    employeeKpi={edit}
                />
                <EmployeeKpiSetLogsModal
                    employeeKpiSetId={employeeKpiSetId}
                    type={type}
                />
                <div className="qlcv">
                    <div className="form-inline pull-right">
                        {compare ?
                            <button className=" btn btn-primary" onClick={() => handleCompare()}>{translate('kpi.evaluation.employee_evaluation.end_compare')}</button> :
                            <button className=" btn btn-primary" onClick={() => kpimember && kpimember.creator && handleCompare(kpimember.creator._id)}>{translate('kpi.evaluation.employee_evaluation.compare')}</button>
                        }
                        <button className=" btn btn-primary" onClick={() => kpimember && showEmployeeKPISetLogs(kpimember._id)}>{translate('kpi.evaluation.employee_evaluation.show_logs')}</button>
                        <button className=" btn btn-success" onClick={() => kpimember && handleApproveKPI(kpimember._id, kpimember.kpis)}>{translate('kpi.evaluation.employee_evaluation.approve_all')}</button>
                    </div>
                    <br />

                    {/* So sánh KPI */}
                    {compare &&
                    <div>
                        <div className="form-inline">
                            <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                                <label style={{ minWidth: "160px", marginLeft: "-40px" }}>{translate('kpi.evaluation.employee_evaluation.choose_month_cmp')}</label>
                                <DatePicker
                                    id="create_date"
                                    dateFormat="month-year"
                                    value={defaultDate}
                                    onChange={handleDateChange}
                                />
                                <ErrorLabel content={errorOnDate} />
                            </div>
                            <div className="form-group" >
                                <button className="btn btn-success" onClick={() => searchKPIMemberByMonth(kpimember && kpimember.creator._id)}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>
                        </div>
                        <div id={tableBodyKpiCompareId}>
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                <tr key="approve">
                                    <th title="STT" className="col-fixed" style={{ width: 50 }}>STT</th>
                                    <th title="Tên mục tiêu">{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                    <th title="Mục tiêu đơn vị">{translate('kpi.evaluation.employee_evaluation.target')}</th>
                                    <th title="Tiêu chí đánh giá">{translate('kpi.evaluation.employee_evaluation.criteria')}</th>
                                    <th title="Trọng số">{translate('kpi.evaluation.employee_evaluation.weight')}</th>
                                    <th title="Kết quả đánh giá">{translate('kpi.evaluation.employee_evaluation.result')}</th>
                                </tr>
                                </thead>
                                <tbody style={{ height: "200px" }}>
                                {kpimembercmp ?
                                    kpimembercmp.kpis.map((item, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item ? item.name : ""}</td>
                                            <td>{item.parent ? item.parent.name : ""}</td>
                                            <td>{item ? parse(item.criteria) : ""}</td>
                                            <td>{item.weight}</td>
                                            <td>{item ? item.approvedPoint : ""}</td>
                                        </tr>
                                    ) : <tr><td colSpan={6}>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</td></tr>
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    }
                    <br></br>
                    <br></br>
                </div>

                {/* Label cảnh báo */}
                <label>{`${translate('kpi.evaluation.employee_evaluation.kpi_this_month')} ${formatMonth(employeeKpiSet?.date)} (${totalWeight ?? 0}/100)`}</label>
                {/* Danh sách KPI */}
                <DataTableSetting 
                    className="pull-right" 
                    tableId={tableId}
                    columnArr={[
                        'STT',
                        'Tên mục tiêu'
                        , 'Mục tiêu đơn vị',
                        'Tiêu chí đánh giá',
                        'Trọng số',
                        'Trạng thái',
                        'Kết quả đánh giá',
                        'Hành động'
                    ]}
                />
                <div id={tableBodyKpiId}>
                    <table id={tableId} className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 50 }}>{translate('kpi.evaluation.employee_evaluation.index')}</th>
                                <th>{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                <th>{translate('kpi.evaluation.employee_evaluation.target')}</th>
                                <th>{translate('kpi.evaluation.employee_evaluation.criteria')}</th>
                                <th>{translate('kpi.evaluation.employee_evaluation.weight')}</th>
                                <th>{translate('kpi.evaluation.employee_evaluation.status')}</th>
                                <th>{translate('kpi.evaluation.employee_evaluation.result')}</th>
                                <th className="col-fixed" style={{ width: 130 }}>{translate('kpi.evaluation.employee_evaluation.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {kpimember && kpimember.kpis.map((item, index) =>
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item ? item.name : ""}</td>
                                <td>{item.parent ? item.parent.name : ""}</td>
                                <td>{item ? parse(item.criteria) : ""}</td>
                                <td>{item.weight}</td>
                                <td>{handleCheckEmployeeKpiStatus(item.status)}</td>
                                <td>{item?.approvedPoint !== null && item?.approvedPoint >= 0 ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</td>
                                <td>
                                    <a
                                        className="edit"
                                        title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action_title.edit')}
                                        data-toggle="modal"
                                        data-backdrop="static"
                                        data-keyboard="false"
                                        onClick={() => handleEditOrganizationalUnitKPi(item)}
                                    >
                                        <i className="material-icons"></i>
                                    </a>
                                    <a style={{ cursor: 'pointer' }} className="add_circle" title={translate('kpi.evaluation.employee_evaluation.pass')} onClick={(event) => kpimember && handleEditStatusTarget(event, item, 1, kpimember.kpis)}><i className="material-icons">check</i></a>
                                    <a style={{ cursor: 'pointer' }} className="delete" title={translate('kpi.evaluation.employee_evaluation.fail')} onClick={(event) => handleEditStatusTarget(event, item, 0)}><i className="material-icons">clear</i></a>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <br/><br/>

                <div className="row" style={{ display: 'flex', flex: 'no-wrap', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <Comment
                            data={kpimembers?.currentKPI}
                            comments={kpimembers?.currentKPI?.comments}
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
            </DialogModal>
        </React.Fragment>
    );

}

function mapState(state) {
    const { kpimembers, auth, KPIPersonalManager, createKpiUnit } = state;
    return { kpimembers, auth, KPIPersonalManager, createKpiUnit };
}

const actionCreators = {
    getKpisByKpiSetId: kpiMemberActions.getKpisByKpiSetId,
    getKpisByMonth: kpiMemberActions.getKpisByMonth,
    editStatusKpi: kpiMemberActions.editStatusKpi,
    approveAllKpis: kpiMemberActions.approveAllKpis,
    createComment: createKpiSetActions.createComment,
    editComment: createKpiSetActions.editComment,
    deleteComment: createKpiSetActions.deleteComment,
    createChildComment: createKpiSetActions.createChildComment,
    editChildComment: createKpiSetActions.editChildComment,
    deleteChildComment: createKpiSetActions.deleteChildComment,
    deleteFileComment: createKpiSetActions.deleteFileComment,
    deleteFileChildComment: createKpiSetActions.deleteFileChildComment,
    downloadFile: AuthActions.downloadFile,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
};
const connectedEmployeeKpiApproveModal = connect(mapState, actionCreators)(withTranslate(EmployeeKpiApproveModal));
export { connectedEmployeeKpiApproveModal as EmployeeKpiApproveModal };
