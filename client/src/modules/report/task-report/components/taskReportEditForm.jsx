import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../../task/task-template/redux/actions';
import { TaskReportActions } from '../redux/actions';
import { taskReportFormValidator } from './taskReportFormValidator';
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';

class TaskReportEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingReport: {
                organizationalUnit: '',
                taskTemplate: '',
                name: '',
                description: '',
                status: '',
                responsibleEmployees: [],
                accountableEmployees: [],
                readByEmployees: [],
                startDate: '',
                endDate: '',
                frequency: '',
                coefficient: 1,
                taskInformations: []
            },
        }
    }


    /**
    * Hàm bắt sự kiên thay đổi input NameTaskReport
    * @param {*} e 
    */


    componentDidMount() {
        this.props.getTaskReportById(this.props.taskReportId);
        // get department of current user 
        this.props.getDepartment();
        // lấy tất cả nhân viên của công ty
        this.props.getAllUserOfCompany();
        // Lấy tất cả nhân viên trong công ty
        this.props.getAllUserInAllUnitsOfCompany();
        this.props.getTaskTemplateByUser("1", "0", "[]");
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
    }

    /**
    * Bắt sự kiện thay đổi cho ô input mô tả báo cáo
    * @param {*} e 
    */
    handleDesReportChange = (e) => {
        let value = e.target.value;
        this.validateDescriptionTaskReport(value, true);
    }


    /**
     * Hàm kiểm tra validate cho input mô tả báo cáo
     * @param {*} value 
     * @param {*} willUpdateState 
     */
    validateDescriptionTaskReport = (value, willUpdateState = true) => {
        let msg = taskReportFormValidator.validateDescriptionTaskReport(value)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    editingReport: {
                        ...this.state.editingReport,
                        errorOnDescriptiontTaskReport: msg,
                        description: value,

                    }
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Hàm xử lý sự kiện thay đổi đơn vị
     * @param {*} e 
     */
    handleChangeReportOrganizationalUnit = (e) => {
        e.preventDefault();
        let value = e.target.value;
        if (value) {
            this.props.getAllUserOfDepartment(value);
            this.props.getChildrenOfOrganizationalUnits(value);
            this.setState(state => {
                return {
                    ...state,
                    editingReport: {
                        ...this.state.editingReport,
                        organizationalUnit: value,
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        taskTemplate: '',

                    }
                }
            });
        }
    }

    /**
     * Hàm xử lý validate chọn mãu công việc
     * @param {*} value 
     * @param {*} willUpdateState 
     */
    validateTasktemplateReport = (value, willUpdateState = true) => {
        let msg = taskReportFormValidator.validateTasktemplateReport(value);
        if (willUpdateState) {
            if (value === '') {
                this.setState(state => {
                    return {
                        ...state,
                        editingReport: {
                            ...this.state.editingReport,
                            taskTemplate: '',
                            status: '',
                            startDate: '',
                            endDate: '',
                            responsibleEmployees: [],
                            accountableEmployees: [],
                            errorOnDescriptiontTaskReport: undefined,
                            errorOnNameTaskReport: undefined,
                            errorOnTaskTemplateReport: msg,

                        }
                    }
                });
            } else {
                let taskTemplate = this.props.tasktemplates.items.find((taskTemplate) =>
                    taskTemplate._id === value
                );
                let taskInformations = [];

                if (taskTemplate.taskInformations) {
                    for (let [index, value] of taskTemplate.taskInformations.entries()) {
                        taskInformations[index] = {
                            ...value,
                            charType: '0',
                            aggregationType: '0',
                        }
                    }
                }
                this.setState(state => {
                    return {
                        ...state,
                        editingReport: {
                            ...this.state.editingReport,
                            // nameTaskReport: taskTemplate.name,
                            // descriptionTaskReport: taskTemplate.description,
                            taskTemplate: taskTemplate._id,
                            responsibleEmployees: taskTemplate.responsibleEmployees,
                            accountableEmployees: taskTemplate.accountableEmployees,
                            taskInformations: taskInformations,

                        }
                    }
                })
            }
        }
        return msg === undefined;
    }

    /**
     * Hàm xử lý sự kiện thay đổi mẫu công việc
     * @param {*} e 
     */
    handleChangeTaskTemplate = async (e) => {
        let { value } = e.target;
        this.validateTasktemplateReport(value, true);

    }


    handleNameTaskReportChange = (e) => {
        let value = e.target.value;
        this.validateNameTaskReport(value, true);
    }

    /**
     * Hàm xử lý sự kiện thay đổi tên báo cáo
     * @param {*} value 
     * @param {*} willUpdateState 
     */
    validateNameTaskReport = (value, willUpdateState = true) => {
        let msg = taskReportFormValidator.validateNameTaskReport(value)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    editingReport: {
                        ...this.state.editingReport,
                        errorOnNameTaskReport: msg,
                        name: value,
                    }
                }
            });
        }
        return msg === undefined;
    }

    handleDesTaskReportChange = (e) => {
        let value = e.target.value;
        this.validateDescriptionTaskReport(value, true);
    }



    /**
     * Hàm xử lý sự kiện thay đổi đặc thù công việc
     * @param {*} value 
     */
    handleChangeEditStatus = (value) => {
        this.setState(state => {
            return {
                ...state,
                editingReport: {
                    ...this.state.editingReport,
                    status: value,
                }
            }
        })
    }

    /**
     * Hàm xử lý sự kiện thay đổi tần suất
     * @param {*} value 
     */
    handleChangeEditFrequency = (value) => {
        this.setState(state => {
            return {
                ...state,
                editingReport: {
                    ...this.state.editingReport,
                    frequency: value,
                }
            }
        })
    }

    /**
     * Hàm xử lý sự kiện thay đổi người thực hiện
     * @param {*} value 
     */
    handleEditResponsibleEmployees = (value) => {
        this.setState(state => {
            return {
                ...state,
                editingReport: {
                    ...this.state.editingReport,
                    responsibleEmployees: value,
                }
            }
        })
    }

    /**
     * Hàm xử lý sự kiện thay đổi người phê duyệt
     * @param {*} value 
     */
    handleEditAccountableEmployees = (value) => {
        this.setState(state => {
            return {
                ...state,
                editingReport: {
                    ...this.state.editingReport,
                    accountableEmployees: value,
                }
            }
        })
    }

    /**
     * Hàm bắt sự kiện thay đổi ngày bắt đầu
     * @param {*} value 
     */
    handleEditStartDate = (value) => {
        if (typeof value === 'undefined') {
            this.setState(state => {
                return {
                    ...state,
                    editingReport: {
                        ...this.state.editingReport,
                        startDate: '',
                    }
                }
            });
        } else {
            this.setState(state => {
                return {
                    ...state,
                    editingReport: {
                        ...this.state.editingReport,
                        startDate: value,
                    }
                }
            })
        }

    }

    /**
     * Hàm bắt sự kiện thy đổi ngày kết thúc
     * @param {*} value 
     */
    handleEditEndDate = (value) => {
        if (typeof value === 'undefined') {
            this.setState(state => {
                return {
                    ...state,
                    editingReport: {
                        ...this.state.editingReport,
                        endDate: '',
                    }
                }
            });
        } else {
            this.setState(state => {
                return {
                    ...state,
                    editingReport: {
                        ...this.state.editingReport,
                        endDate: value,
                    }
                }
            })
        }

    }

    /**
     * Hàm bắt sự kiện thay đổi điều kiện lọc
     * @param {*} index 
     * @param {*} e 
     */
    handleEditFilter = (index, e) => {
        let { value } = e.target;
        let { editingReport } = this.state;
        let taskInformations = editingReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], filter: value };

        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý sự kiện thay đổi trường showInReport
     * @param {*} index 
     * @param {*} item 
     */
    handleEditChecked = (index, item) => {
        let { editingReport } = this.state;
        let value = item.target.checked;
        let taskInformations = editingReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], showInReport: value };
        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Hàm xử lý sự kiện thay đổi trường newName
     * @param {*} index 
     * @param {*} e 
     */
    handleEditNewName = (index, e) => {
        let { value } = e.target;
        let { editingReport } = this.state;
        let taskInformations = editingReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], newName: value }

        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Hàm xử lý sự kiện khi thay đổi cách tính
     * @param {*} index 
     * @param {*} value 
     */
    handleEditAggregationType = (index, value) => {
        let { editingReport } = this.state;
        let taskInformations = editingReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], aggregationType: value.toString() }

        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Hàm xử lý khi thay đổi input chọn dạng biểu đồ
     * @param {*} index 
     * @param {*} value 
     */
    handleEditChart = (index, value) => {
        let { editingReport } = this.state;
        let taskInformations = editingReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], charType: value.toString() };
        this.setState({
            editingReport: {
                ...editingReport,
                taskInformations: taskInformations,
            }
        })
    }
    /**
     * Hàm kiểm tra đã validate chưa
     */
    isFormValidated = () => {
        let result =
            this.validateNameTaskReport(this.state.editingReport.name, false) &&
            this.validateDescriptionTaskReport(this.state.editingReport.description, false);
        return result;
    }

    /**
    * Hàm xử lý khi ấn lưu
    */
    save = () => {
        if (this.isFormValidated()) {
            this.props.editTaskReport(this.state.taskReportId, this.state.editingReport);
            console.log('this.state.editingReport', this.state.editingReport)
        }
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.taskReportId !== prevState.taskReportId) {
            return {
                ...prevState,
                taskReportId: nextProps.taskReportId,
                errorOnDescriptiontTaskReport: undefined,
                errorOnNameTaskReport: undefined,
            }
        } else {
            return null;
        }
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.taskReportId !== this.state.taskReportId) {
            this.props.getTaskReportById(nextProps.taskReportId);
            return false;
        }
        let newDataArrived = nextProps.reports.listTaskReportById !== undefined && nextProps.reports.listTaskReportById !== null;
        if (!newDataArrived) {
            return false; // Đang lấy dữ liệu, không cần render
        }
        if (this.props.reports.listTaskReportById) {
            newDataArrived = newDataArrived && (nextProps.reports.listTaskReportById._id !== this.props.reports.listTaskReportById._id);
        }
        if (newDataArrived) {
            let listTaskReportById = nextProps.reports.listTaskReportById;
            this.props.getChildrenOfOrganizationalUnits(listTaskReportById.organizationalUnit._id);

            let editingReport = {
                ...listTaskReportById,
                organizationalUnit: listTaskReportById.organizationalUnit._id,
                responsibleEmployees: listTaskReportById.responsibleEmployees.map(x => x._id),
                accountableEmployees: listTaskReportById.accountableEmployees.map(x => x._id),
                readByEmployees: listTaskReportById.readByEmployees.map(x => x._id),
                taskTemplate: listTaskReportById.taskTemplate._id,
                startDate: this.formatDate(listTaskReportById.startDate),
                endDate: this.formatDate(listTaskReportById.endDate),
                taskInformations: listTaskReportById.configurations,
            }
            this.setState(state => {
                return {
                    ...state,
                    editingReport: editingReport,
                };
            });
            return true;
        }
        return true;
    }

    //format date sang string
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date
    }

    render() {

        const { translate, reports, tasktemplates, user, tasks } = this.props;
        const { editingReport } = this.state;
        const { errorOnNameTaskReport, errorOnDescriptiontTaskReport, errorOnTaskTemplateReport } = this.state.editingReport;
        let listTaskTemplate, units, listRole, listRoles = [];
        let listTaskReportById = reports.listTaskReportById;
        console.log('listTaskReportById', listTaskReportById)
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }
        console.log('editingReport', editingReport)
        let usersOfChildrenOrganizationalUnit;
        if (user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }

        if (user.roledepartments) {
            listRole = user.roledepartments;
            for (let x in listRole.deans)
                listRoles[x] = listRole.deans[x];
            for (let x in listRole.viceDeans)
                listRoles = [...listRoles, listRole.viceDeans[x]];
            for (let x in listRole.employees)
                listRoles = [...listRoles, listRole.employees[x]];
        }
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);
        if (tasktemplates.items && editingReport.organizationalUnit) {
            listTaskTemplate = tasktemplates.items.filter(function (taskTemplate) {
                return taskTemplate.organizationalUnit._id === editingReport.organizationalUnit
            })
        }
        console.log('editingReport.startDate', editingReport.startDate)
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-report" isLoading={reports.isLoading}
                    formID="form-edit-report"
                    title="Chỉnh sửa báo cáo"
                    func={this.save}
                    size={100}
                    disableSubmit={!this.isFormValidated()}
                >
                    <div className="row">
                        <div className="col-md-6">
                            {/* Chọn đơn vị */}
                            <div className={'form-group'}>
                                <label>Chọn đơn vị
                                        <span className="text-red">*</span>
                                </label>
                                {
                                    listTaskReportById && units && listTaskReportById.organizationalUnit &&
                                    <select value={editingReport.organizationalUnit} className="form-control" onChange={this.handleChangeReportOrganizationalUnit}>
                                        {units.map(x => {
                                            return <option key={x._id} value={x._id}>{x.name}</option>
                                        })}
                                    </select>
                                }
                            </div>

                        </div>
                        <div className="col-md-6">
                            {/* Người được xem */}
                            <div className={`form-group`} >
                                <label className="control-label">{translate('task_template.permission_view')}<span className="text-red">*</span></label>
                                {(listRoles && editingReport.readByEmployees) &&
                                    <SelectBox
                                        id={`read-select-box`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            listRoles.map(x => { return { value: x._id, text: x.name } })
                                        }

                                        value={editingReport.readByEmployees}
                                        onChange={this.handleCh}
                                        multiple={true}
                                        options={{ placeholder: "Người được xem" }}
                                    />
                                }
                                {/* <ErrorLabel content={this.state.newTemplate.errorOnRead} /> */}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            {/* Mẫu công việc */}
                            <div className="form-group">
                                <label>Mẫu công việc
                                        <span className="text-red">*</span>
                                </label>
                                {
                                    editingReport && listTaskTemplate &&
                                    <React.Fragment>
                                        <select className="form-control" value={editingReport.taskTemplate} onChange={this.handleChangeTaskTemplate}>
                                            <option value="">--Hãy chọn mẫu công việc--</option>
                                            {(listTaskTemplate && listTaskTemplate.length !== 0) &&
                                                listTaskTemplate.map(item => {
                                                    return <option key={item._id} value={item._id}>{item.name}</option>
                                                })
                                            }
                                        </select>
                                        <ErrorLabel content={errorOnTaskTemplateReport} />
                                    </React.Fragment>
                                }
                            </div>

                            {/* Tên báo cáo */}
                            {
                                listTaskReportById && <div className={`form-group ${!errorOnNameTaskReport ? "" : "has-error"}`}>
                                    <label>{translate('report_manager.name')}
                                        <span className="text-red">*</span>
                                    </label>
                                    <input type="text" className="form-control" value={editingReport.name} onChange={this.handleNameTaskReportChange} />
                                    <ErrorLabel content={errorOnNameTaskReport} />
                                </div>
                            }
                        </div>

                        <div className="col-md-6">
                            {/* Mô tả báo cáo */}
                            {
                                listTaskReportById && <div className={`form-group ${!errorOnDescriptiontTaskReport ? "" : "has-error"}`}>
                                    <label htmlFor="Descriptionreport">{translate('report_manager.description')}
                                        <span className="text-red">*</span>
                                    </label>
                                    <textarea rows={5} type="text" className="form-control" id="Descriptionreport" name="description" value={editingReport.description} onChange={this.handleDesTaskReportChange} />
                                    <ErrorLabel content={errorOnDescriptiontTaskReport} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Đặc thù công việc */}
                            <div className={`form-group `}>
                                <label className="control-label">Đặc thù công việc</label>
                                {
                                    listTaskReportById &&
                                    <SelectBox
                                        id="edit-select-status"
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        onChange={this.handleChangeEditStatus}
                                        value={listTaskReportById.status}
                                        items={
                                            [
                                                { value: 0, text: 'Tất cả' },
                                                { value: 1, text: 'Đã hoàn thành' },
                                                { value: 2, text: 'Đang thực hiện' },
                                            ]
                                        }
                                        multiple={false}
                                    />
                                }
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Tần suất */}
                            <div className={`form-group`}>
                                <label className="control-label">Tần suất</label>
                                {
                                    listTaskReportById && <SelectBox
                                        id="select-box-frequency"
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        onChange={this.handleChangeEditFrequency}
                                        value={listTaskReportById.frequency}
                                        items={
                                            [
                                                { value: 'month', text: 'Tháng' },
                                                { value: 'quarter', text: 'Quý' },
                                                { value: 'year', text: 'Năm' },
                                            ]
                                        }
                                        multiple={false}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Chọn người thực hiện */}
                            <div className={`form-group`}>
                                <label className="control-label">Người thực hiện</label>
                                {
                                    unitMembers &&
                                    <SelectBox
                                        id={`responsible-select-box-${editingReport.taskTemplate}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleEditResponsibleEmployees}
                                        value={editingReport.responsibleEmployees}
                                        multiple={true}
                                    />
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            {/* Chọn người phê duyệt */}
                            <div className={`form-group`}>
                                <label className="control-label">Người phê duyệt</label>
                                {
                                    unitMembers &&
                                    <SelectBox
                                        id={`accounttable-select-box-${editingReport.taskTemplate}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleEditAccountableEmployees}
                                        value={editingReport.accountableEmployees}
                                        multiple={true}
                                    />
                                }
                            </div>
                        </div>


                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            {/* Thống kê từ ngày */}
                            {
                                <div className="form-group">
                                    <label>Thống kê từ ngày</label>
                                    <DatePicker
                                        id="start-date"
                                        value={editingReport.startDate}
                                        onChange={this.handleEditStartDate}
                                        disabled={false}

                                    />
                                </div>
                            }
                        </div>

                        <div className="col-md-6">
                            {/* Thống kê đến ngày */}
                            {
                                <div className="form-group">
                                    <label>Thống kê đến ngày </label>
                                    <DatePicker
                                        id="end-date"
                                        value={editingReport.endDate}
                                        onChange={this.handleEditEndDate}
                                        disabled={false}
                                    />
                                </div>
                            }
                        </div>
                    </div>

                    {
                        (editingReport.taskTemplate !== '') &&
                        <div className="row" id="showTable">
                            <hr />
                            <div className="col-md-12">
                                <table className="table table-hover table-striped table-bordered" id="report_manager">
                                    <thead>
                                        <tr>
                                            <th>Mã thông tin</th>
                                            <th>Trường thông tin</th>
                                            <th>Kiểu dữ liệu</th>
                                            <th>Điều kiện lọc</th>
                                            <th>Hiển thị trong báo cáo</th>
                                            <th>Tên mới</th>
                                            <th>Cách tính</th>
                                            <th>Dạng biểu đồ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            editingReport && editingReport.taskInformations ? editingReport.taskInformations.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.code}</td>
                                                    <td>{item.name}</td>
                                                    <td>{(item.type === 'SetOfValues' ? 'Tập dữ liệu' : (item.type))}</td>

                                                    {
                                                        editingReport && editingReport.taskInformations &&
                                                        <td><input className="form-control" style={{ width: '100%' }} type="text" value={item.filter} onChange={(e) => this.handleEditFilter(index, e)} /></td>
                                                    }
                                                    <td>
                                                        {
                                                            (item.type === 'Number') ?
                                                                <div className="checkbox" style={{ paddingLeft: "20%" }}>
                                                                    <label>
                                                                        <input name="showInReport" type="checkbox" checked={item.showInReport} onChange={(e) => this.handleEditChecked(index, e)} />

                                                                    </label>
                                                                </div>
                                                                : ''
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            (item.type === 'Number') ?
                                                                <input className="form-control" style={{ width: '100%' }} type="text" value={item.newName} onChange={(e) => this.handleEditNewName(index, e)} /> : ''
                                                        }

                                                    </td>
                                                    <td>
                                                        {
                                                            (item.type === 'Number') ?
                                                                <SelectBox
                                                                    id={`select-box-calulator-${item.code}`}
                                                                    className="form-control select2"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(e) => this.handleEditAggregationType(index, e)}
                                                                    value={item.aggregationType}
                                                                    items={
                                                                        [
                                                                            { value: '0', text: 'Trung bình cộng' },
                                                                            { value: '1', text: 'Tổng' },
                                                                        ]
                                                                    }
                                                                    multiple={false}
                                                                />
                                                                : ''
                                                        }
                                                    </td>
                                                    <td data-select2-id="1111">
                                                        {
                                                            (item.type === 'Number') ?
                                                                <SelectBox
                                                                    id={`select-box-chart-${item.code}`}
                                                                    className="form-control select2"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(e) => this.handleEditChart(index, e)}
                                                                    value={item.charType}
                                                                    items={
                                                                        [
                                                                            { value: '0', text: 'Cột' },
                                                                            { value: '1', text: 'Đường' },
                                                                            { value: '2', text: 'Tròn' },
                                                                        ]
                                                                    }
                                                                    multiple={false}
                                                                />
                                                                : ''
                                                        }
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan={8}><center>{translate('report_manager.no_data')}</center></td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                </DialogModal>
            </React.Fragment>

        );
    }
}

const mapState = state => state;
const actionCreators = {
    getTaskReportById: TaskReportActions.getTaskReportById,
    editTaskReport: TaskReportActions.editTaskReport,

    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,

    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getDepartment: UserActions.getDepartmentOfUser,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
};
const editReport = connect(mapState, actionCreators)(withTranslate(TaskReportEditForm));

export { editReport as TaskReportEditForm };