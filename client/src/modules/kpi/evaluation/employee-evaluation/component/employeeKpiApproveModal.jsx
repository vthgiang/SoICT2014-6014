import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';

import { kpiMemberActions } from '../redux/actions';
import { createKpiSetActions } from '../../../employee/creation/redux/actions';
import { AuthActions } from '../../../../auth/redux/actions';

import { DataTableSetting } from '../../../../../common-components';
import { DialogModal, ErrorLabel, DatePicker, Comment } from '../../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../../config';
import Swal from 'sweetalert2';
import parse from 'html-react-parser';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
// import { Comment } from '../../../employee/creation/component/comment'
var translate = '';

function EmployeeKpiApproveModal(props) {
    let idUser = getStorage("userId");
    var translate = props.translate;

    const tableId = "employee-kpi-approve-modal";
    getTableConfiguration(tableId);

    const [state, setState] = useState({
        currentUser: idUser,
        date: formatDateBack(Date.now()),
        editing: false,
        edit: "",
        compare: false,
        checkInput: false,
        tableId,
    });

    const { kpimembers } = props;
    const { errorOnDate, date, compare, edit, perPage } = state;
    let kpimember, kpimembercmp, month, totalWeight;

    const newWeight = [];

    useEffect(()=>{
        if (props.id !== state.id) {
            setState({
                ...state,
                id: props.id,
            })
        }
    },[props.id])

    useEffect(()=>{
        const { id } = state;
        if (props.id !== id) {
            if (props.id) {
                props.getKpisByKpiSetId(props.id);
            }
        }
        if (props.auth.user.avatar !== props.auth.user.avatar) {
            props.getKpisByKpiSetId(props.id);
        }
    })

    const handleEdit = (target) => {
        if (target?.approvedPoint !== null && target?.approvedPoint >= 0) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.evaluated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else if (target) {
            setState( {
                ...state,
                editing: true,
                edit: target && state.edit === target._id ? "" : target._id,
            })
        }
    }

    const handleSaveEdit = (target) => {
        let newTarget = {
            ...target,
            weight: parseInt(newWeight[target._id].value)
        }
        setState(  {
            ...state,
            newTarget: newTarget
        })

        if (newWeight?.[target?._id]?.value !== "") {
            props.editTarget(target?._id, newTarget);
            props.editStatusKpi(target?._id, 0);

            setState( {
                ...state,
                edit: "",
                editing: true
            })
        }
    };

    const handleDateChange = (value) => {
        setState( {
            ...state,
            errorOnDate: validateDate(value),
            date: value,
        });

    };

    const validateDate = (value) => {
        const { translate } = props;
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
            props.getKpisByMonth(id, formatDateBack(Date.now()));
        }
    };

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
        let { date } = state;
        if (date === undefined || date === formatDateBack(Date.now())) {
            props.getKpisByMonth(id, formatDateBack(Date.now()));
        }
        else {
            props.getKpisByMonth(id, date);
        }
    }

    const handleEditStatusTarget = (event, kpi, status, listTarget) => {
        event.preventDefault();
        const { edit } = state;

        if (kpi?.approvedPoint !== null && kpi?.approvedPoint >= 0) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.evaluated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            if (edit === "") {
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
            } else {
                Swal.fire({
                    title: translate('kpi.evaluation.employee_evaluation.unsuitable_approval'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
                })
            }
        }
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

   const handleCheckEmployeeKpiStatus = (employeeKpiStatus) => {
        const { translate } = props;
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
                title={`${translate('kpi.evaluation.employee_evaluation.approve_KPI_employee')} - ${translate('kpi.evaluation.employee_evaluation.month')} ${kpimember && month[1]}/${kpimember && month[0]}`}
                hasSaveButton={false}
                size={100}>
                <div className="qlcv">
                    <div className="form-inline pull-right">
                        {compare ?
                            <button className=" btn btn-primary" onClick={() => handleCompare()}>{translate('kpi.evaluation.employee_evaluation.end_compare')}</button> :
                            <button className=" btn btn-primary" onClick={() => kpimember && kpimember.creator && handleCompare(kpimember.creator._id)}>{translate('kpi.evaluation.employee_evaluation.compare')}</button>
                        }
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
                                    value={date}
                                    onChange={handleDateChange}
                                />
                                <ErrorLabel content={errorOnDate} />
                            </div>
                            <div className="form-group" >
                                <button className="btn btn-success" onClick={() => searchKPIMemberByMonth(kpimember && kpimember.creator._id)}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>
                        </div>
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
                            <tbody >
                            {kpimembercmp ?
                                kpimembercmp.kpis.map((item, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item ? item.name : ""}</td>
                                        <td>{item.parent ? item.parent.name : ""}</td>
                                        <td>{item ? parse(item.criteria) : ""}</td>
                                        <td>{edit === item._id ? <input min="0" max="100" defaultValue={item.weight} style={{ width: "60px" }} /> : item.weight}</td>
                                        <td>{item ? item.approvedPoint : ""}</td>
                                    </tr>
                                ) : <tr><td colSpan={6}>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                    }
                    <br></br>
                    <br></br>

                    {/* Label cảnh báo */}
                    <label>{`${translate('kpi.evaluation.employee_evaluation.kpi_this_month')} ${kpimember && month[1]}/${kpimember && month[0]}`} ({totalWeight}/100)</label>

                    {/* Danh sách KPI */}
                    <table id={tableId} className="table table-bordered table-striped table-hover">
                        <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 50 }}>{translate('kpi.evaluation.employee_evaluation.index')}</th>
                            <th>{translate('kpi.evaluation.employee_evaluation.name')}</th>
                            <th>{translate('kpi.evaluation.employee_evaluation.target')}</th>
                            <th>{translate('kpi.evaluation.employee_evaluation.criteria')}</th>
                            <th>{translate('kpi.evaluation.employee_evaluation.weight')}</th>
                            <th>{translate('kpi.evaluation.employee_evaluation.status')}</th>
                            <th>{translate('kpi.evaluation.employee_evaluation.result')}</th>
                            <th className="col-fixed" style={{ width: 130 }}>
                                {translate('kpi.evaluation.employee_evaluation.action')}
                                <DataTableSetting className="pull-right" tableId={tableId}
                                                  columnArr={[
                                                      'STT',
                                                      'Tên mục tiêu'
                                                      , 'Mục tiêu đơn vị',
                                                      'Tiêu chí đánh giá',
                                                      'Trọng số',
                                                      'Trạng thái',
                                                      'Kết quả đánh giá',
                                                      'Hành động']}
                                                  // setLimit={setLimit}
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {kpimember && kpimember.kpis.map((item, index) =>
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item ? item.name : ""}</td>
                                <td>{item.parent ? item.parent.name : ""}</td>
                                <td>{item ? parse(item.criteria) : ""}</td>
                                <td>{edit === item._id ?
                                    <input min="0" max="100"
                                           ref={input => newWeight[item._id] = input}
                                           defaultValue={item.weight}
                                           style={{ width: "60px" }}
                                    /> : item.weight}
                                </td>
                                <td>{handleCheckEmployeeKpiStatus(item.status)}</td>
                                <td>{item?.approvedPoint !== null && item?.approvedPoint >= 0 ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</td>
                                <td>
                                    {edit === item._id ? <a style={{ cursor: 'pointer' }} className="approve" title={translate('kpi.evaluation.employee_evaluation.save_result')} onClick={() => handleSaveEdit(item)}><i className="material-icons">save</i></a>
                                        : <a style={{ cursor: 'pointer' }} className="edit" title={translate('kpi.evaluation.employee_evaluation.edit_target')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>}
                                    <a style={{ cursor: 'pointer' }} className="add_circle" title={translate('kpi.evaluation.employee_evaluation.pass')} onClick={(event) => kpimember && handleEditStatusTarget(event, item, 1, kpimember.kpis)}><i className="material-icons">check</i></a>
                                    <a style={{ cursor: 'pointer' }} className="delete" title={translate('kpi.evaluation.employee_evaluation.fail')} onClick={(event) => handleEditStatusTarget(event, item, 0)}><i className="material-icons">clear</i></a>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
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
    const { kpimembers, auth } = state;
    return { kpimembers, auth };
}

const actionCreators = {
    getKpisByKpiSetId: kpiMemberActions.getKpisByKpiSetId,
    getKpisByMonth: kpiMemberActions.getKpisByMonth,
    editStatusKpi: kpiMemberActions.editStatusKpi,
    approveAllKpis: kpiMemberActions.approveAllKpis,
    editTarget: kpiMemberActions.editKpi,
    createComment: createKpiSetActions.createComment,
    editComment: createKpiSetActions.editComment,
    deleteComment: createKpiSetActions.deleteComment,
    createChildComment: createKpiSetActions.createChildComment,
    editChildComment: createKpiSetActions.editChildComment,
    deleteChildComment: createKpiSetActions.deleteChildComment,
    deleteFileComment: createKpiSetActions.deleteFileComment,
    deleteFileChildComment: createKpiSetActions.deleteFileChildComment,
    downloadFile: AuthActions.downloadFile,
};
const connectedEmployeeKpiApproveModal = connect(mapState, actionCreators)(withTranslate(EmployeeKpiApproveModal));
export { connectedEmployeeKpiApproveModal as EmployeeKpiApproveModal };
