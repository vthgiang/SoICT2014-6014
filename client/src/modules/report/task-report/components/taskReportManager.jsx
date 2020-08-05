import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import Swal from 'sweetalert2';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { ButtonModal } from '../../../../common-components';
import { DataTableSetting, PaginateBar, SelectBox } from '../../../../common-components';
import { TaskReportActions } from '../redux/actions';
import { TaskReportCreateForm } from './taskReportCreateForm';
import { TaskReportEditForm } from './taskReportEditForm';
import { TaskReportDetailForm } from './taskReportDetailForm';

class TaskReportManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 0,
            name: '',
            currentRole: localStorage.getItem("userId"),
        }
    }
    componentDidMount() {
        this.props.getTaskReports(this.state);
        this.props.getDepartment();
    }


    /**
     * Bắt sự kiện click nút Edit
     * @param {*} report 
     */
    handleEdit = async (idReport) => {
        console.log('idTaskReport=>', idReport);
        await this.setState(state => {
            return {
                ...state,
                currentEditRow: idReport
            }
        });
        await window.$('#modal-edit-report').modal('show'); // hiển thị modal edit
    }

    /**
     * Hàm xóa báo cáo
     * @param {*} id  của báo cáo muốn xóa
     * @param {*} name tên báo cáo muốn xóa
     */
    handleDelete = async (id, name) => {
        const { translate } = this.props;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('report_manager.delete')} </div> <div> "${name}" ?</div></h4>`,
            type: 'success',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: translate('report_manager.cancel'),
            confirmButtonColor: '#3085d6',
            confirmButtonText: translate('report_manager.confirm')
        }).then((res) => {
            if (res.value) {
                this.props.deleteTaskReport(id);
            }
        });
    }


    /**
     * Hàm  bắt sự kiện khi ấn enter để lưu
     * @param {*} event 
     */
    handleEnterLimitSetting = (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            this.props.getTaskReports();
        }
    }


    /**
     * Bắt sự kiện thay đổi khi gõ vào ô input search
     * @param {*} e 
     */
    handleChangeInput = (e) => {
        const { value } = e.target;
        const { name } = e.target;

        this.setState(state => {
            return {
                ...state,
                [name]: value,
            }
        })
    }

    // Bắt sự kiện khi click nút tìm kiếm
    search = async () => {
        await this.props.getTaskReports(this.state);
    }

    /**
     *  Bắt sự kiện chuyển trang
     * @param {*} pageNumber 
     */
    setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (this.state.limit);

        await this.setState({
            page: parseInt(page),
        });
        this.props.getTaskReports(this.state);
    }

    handleView = async (taskReportId) => {
        await this.setState(state => {
            return {
                ...state,
                currentViewRow: taskReportId
            }
        })
        await window.$('#modal-detail-taskreport').modal('show');
    }
    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number 
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getTaskReports(this.state);

    }

    checkPermisson = (creator) => {
        let userId = this.state.currentRole;
        if (userId === creator) {
            return true;
        }
        return false;
    }


    render() {
        const { reports, translate, deleteTaskReport, user } = this.props;
        let pageTotal = (reports.totalList % this.state.limit === 0) ?
            parseInt(reports.totalList / this.state.limit) :
            parseInt((reports.totalList / this.state.limit) + 1);
        let page = parseInt((this.state.page / this.state.limit) + 1);
        console.log('role', this.state.currentRole);
        return (
            <div className="box">
                <div className="box-body qlcv" >
                    {
                        this.state.currentEditRow !== undefined &&
                        <TaskReportEditForm taskReportId={this.state.currentEditRow} />
                    }

                    {/* Thêm mới bao cáo */}
                    <div style={{ height: '40px' }}>
                        <ButtonModal modalID="modal-create-task-report" button_name={translate('report_manager.add_report')} title={translate('report_manager.add_report')} />
                    </div>
                    <TaskReportCreateForm />

                    {/* <TaskReportViewForm taskReportId={this.state.currentViewRow} /> */}
                    <TaskReportDetailForm taskReportId={this.state.currentViewRow} />

                    {/* search form */}
                    <div className="form-inline" style={{ marginBottom: '2px' }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('report_manager.name')}</label>
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} name="name" onChange={this.handleChangeInput} placeholder={translate('report_manager.search_by_name')} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('report_manager.creator')}</label>
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} name="name" onChange={this.handleChangeInput} placeholder={translate('report_manager.search_by_creator')} />
                        </div>

                    </div>

                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">Sắp xếp theo</label>
                            <SelectBox
                                id={`sort-date33333`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    [
                                        { value: "", text: 'Ngày tạo mới nhất' },
                                        { value: "", text: 'Ngày tạo cũ nhất' },
                                    ]
                                }
                                onChange={this.handleSortDate}
                                multiple={false}
                            />
                        </div>

                        <div className="form-group" >
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.search} title={translate('form.search')}>{translate('form.search')}</button>
                        </div>
                    </div>

                    <DataTableSetting
                        tableId="report_manager"
                        columnArr={[
                            translate('report_manager.name'),
                            translate('report_manager.description'),
                            translate('report_manager.creator'),
                        ]}
                        limit={this.state.limit}
                        setLimit={this.setLimit}
                        hideColumnOption={true}
                    />

                    {/* table hiển thị danh sách báo cáo công việc */}
                    <table className="table table-hover table-striped table-bordered" id="report_manager">
                        <thead>
                            <tr>
                                <th>{translate('report_manager.name')}</th>
                                <th>{translate('report_manager.description')}</th>
                                <th>{translate('report_manager.creator')}</th>
                                <th>{translate('report_manager.createdAt')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>
                                    {translate('table.action')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (reports && reports.listTaskReport && reports.listTaskReport.length !== 0 && typeof reports.listTaskReport !== 'undefined') ? reports.listTaskReport.map(item => (

                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.creator.name}</td>
                                        <td>{item.createdAt.slice(0, 10)}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a onClick={() => this.handleView(item._id)}><i className="material-icons">visibility</i></a>

                                            {/* Check nếu là người tạo thì có thể sửa, xóa báo cáo */}
                                            {
                                                this.checkPermisson(item.creator._id) &&
                                                <React.Fragment>
                                                    <a onClick={() => this.handleEdit(item._id)} className="edit text-yellow" style={{ width: '5px' }} title={translate('report_manager.edit')}><i className="material-icons">edit</i></a>
                                                    <a onClick={() => this.handleDelete(item._id, item.name)} className="delete" title={translate('report_manager.title_delete')}>
                                                        <i className="material-icons">delete</i>
                                                    </a>
                                                </React.Fragment>

                                            }
                                        </td>
                                    </tr>
                                )) : null
                            }
                        </tbody>
                    </table>
                    {reports.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        reports.listTaskReport.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}

                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { tasktemplates, tasks, user, KPIPersonalManager, reports } = state;
    return { tasktemplates, tasks, user, KPIPersonalManager, reports };
}
const actionCreators = {
    getTaskReports: TaskReportActions.getTaskReports,
    deleteTaskReport: TaskReportActions.deleteTaskReport,
    getDepartment: UserActions.getDepartmentOfUser,
    getTaskReportById: TaskReportActions.getTaskReportById,

}

export default connect(mapState, actionCreators)(withTranslate(TaskReportManager));