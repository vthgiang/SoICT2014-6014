import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DataTableSetting, PaginateBar, DeleteNotification } from '../../../../common-components';
import { TaskReportActions } from '../redux/actions';
import { TaskReportCreateForm } from './taskReportCreateForm';
import { TaskReportEditForm } from './taskReportEditForm';

class TaskReportManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 0,
            name: '',
        }
    }
    componentDidMount() {
        this.props.getTaskReports(this.state);
    }


    /**
     * Bắt sự kiện click nút Edit
     * @param {*} report 
     */
    handleEdit = async (report) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow : report
            }
        });
        await window.$('#modal-edit-report').modal('show'); // hiển thị modal edit
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

    render() {
        const { reports, translate, deleteTaskReport } = this.props;
        let pageTotal = (reports.totalList % this.state.limit === 0) ?
            parseInt(reports.totalList / this.state.limit) :
            parseInt((reports.totalList / this.state.limit) + 1);
        let page = parseInt((this.state.page / this.state.limit) + 1);

        return (
            <div className="box">
                <TaskReportCreateForm/>
                {
                    this.state.currentRow !== undefined &&
                    <TaskReportEditForm 
                    _id = { this.state.currentRow._id } 
                    nameTaskReport = { this.state.currentRow.name }
                    descriptionTaskReport = { this.state.currentRow.description }
                    />
                }
                
                {/* search form */}
                <div className="qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('form.value')}</label>
                            <input className="form-control" type="text" onKeyUp= { this.handleEnterLimitSetting } name="name" onChange= { this.handleChangeInput }/>
                            <button type="button" className="btn btn-success" onClick= { this.search } title= {translate('form.search')}>{translate('form.search')}</button>
                        </div>
                    </div>
                </div>

                {/* table hiển thị danh sách báo cáo công việc */}
                <table className="table table-hover table-striped table-bordered" id="report_manager">
                    <thead>
                        <tr>
                            <th>{ translate('report_manager.name') }</th>
                            <th>{ translate('report_manager.description') }</th>
                            <th>{ translate('report_manager.creator') }</th>
                            <th style={{ width: '120px', textAlign: 'center' } }>
                                { translate('table.action') }
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
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                      {
                         (reports && reports.totalList && reports.listTaskReport) ? reports.listTaskReport.map(item => (
                            <tr key= { item._id }>
                                <td>{ item.name }</td>
                                <td>{ item.description }</td>
                                <td>{ item.creator.name }</td>
                                <td style={{textAlign: 'center'}}>
                                    <a onClick={() => this.handleEdit(item)} className="edit text-yellow" style= {{width: '5px'}} title={translate('report_manager.edit')}><i className="material-icons">edit</i></a>
                                    {
                                        <DeleteNotification 
                                            content={ translate('report_manager.delete') }
                                            data={ { id: item._id, info: item.name + item._id } }
                                            func={ deleteTaskReport }
                                        />
                                    }
                                </td>
                            </tr>
                         )) : null
                      }
                    </tbody>
                </table>

                {
                    reports.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    reports.totalList === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                <PaginateBar pageTotal= { pageTotal ? pageTotal : 0 } currentPage= { page } func= { this.setPage } />     
            </div>
        );
    }
}

const mapState = state => state;
const actionCreators = {
    getTaskReports: TaskReportActions.getTaskReports,
    deleteTaskReport: TaskReportActions.deleteTaskReport,
}

export default connect(mapState, actionCreators)(withTranslate(TaskReportManager));