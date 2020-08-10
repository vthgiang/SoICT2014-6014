import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskReportActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

import { getStorage } from '../../../../config';
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from '../../../../common-components';
import { taskReportFormValidator } from './taskReportFormValidator';
import { TaskReportViewForm } from './taskReportViewForm';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../../task/task-template/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';

class TaskReportCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newReport: {
                nameTaskReport: '',
                descriptionTaskReport: '',
                organizationalUnit: '',
                taskTemplate: '',
                status: '',
                responsibleEmployees: [],
                accountableEmployees: [],
                startDate: '',
                endDate: '',
                frequency: 'month',
                coefficient: 1,
                // listCheckBox: [],

            },
            currentRole: getStorage('currentRole'),
        }
    }

    /**
     * Hàm kiểm tra đã validate chưa
     */
    isFormValidated = () => {
        let result =
            this.validateNameTaskReport(this.state.newReport.nameTaskReport, false) &&
            this.validateDescriptionTaskReport(this.state.newReport.descriptionTaskReport, false);
        return result;
    }

    /**
     * Hàm bắt sự kiên thay đổi input NameTaskReport
     * @param {*} e 
     */
    handleNameTaskReportChange = (e) => {
        let value = e.target.value;
        this.validateNameTaskReport(value, true);
    }

    /**
     * Hàm validate input NameTaskReport
     * @param {*} value 
     * @param {*} willUpdateState 
     */
    validateNameTaskReport = (value, willUpdateState = true) => {
        let msg = taskReportFormValidator.validateNameTaskReport(value)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...this.state.newReport,
                        errorOnNameTaskReport: msg,
                        nameTaskReport: value,
                    }
                }
            });
        }
        return msg === undefined;
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
                    newReport: {
                        ...this.state.newReport,
                        errorOnDescriptiontTaskReport: msg,
                        descriptionTaskReport: value,

                    }
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi cho ô input mô tả báo cáo
     * @param {*} e 
     */
    handleDesTaskReportChange = (e) => {
        let value = e.target.value;
        this.validateDescriptionTaskReport(value, true);
    }

    /**
     * Hàm xử lý khi thay đổi đơn vị
     * @param {*} e 
     */
    handleChangeReportOrganizationalUnit = e => {
        e.preventDefault();
        let value = e.target.value;
        if (value) {
            this.props.getAllUserOfDepartment(value);
            this.props.getChildrenOfOrganizationalUnits(value);
            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...this.state.newReport,
                        nameTaskReport: '',
                        descriptionTaskReport: '',
                        organizationalUnit: value,
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        taskTemplate: '',
                        errorOnDescriptiontTaskReport: undefined,
                        errorOnNameTaskReport: undefined,
                    }
                }
            });
        }
    }
    /**
     * Hàm xử lý khi thay đổi mẫu công việc
     * @param {*} e 
     */
    handleChangeTaskTemplate = async (e) => {
        let { value } = e.target;

        if (value === '') {
            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...this.state.newReport,
                        nameTaskReport: '',
                        descriptionTaskReport: '',
                        taskTemplate: '',
                        status: '',
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        errorOnDescriptiontTaskReport: undefined,
                        errorOnNameTaskReport: undefined,
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
                        showInReport: false,
                    }
                }
            }
            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...this.state.newReport,
                        nameTaskReport: taskTemplate.name,
                        descriptionTaskReport: taskTemplate.description,
                        taskTemplate: taskTemplate._id,
                        responsibleEmployees: taskTemplate.responsibleEmployees,
                        accountableEmployees: taskTemplate.accountableEmployees,
                        taskInformations: taskInformations,
                    }
                }
            })
        }
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        const { user } = this.props;
        const { newReport } = this.state;
        if (newReport.organizationalUnit === "" && user.organizationalUnitsOfUser) {
            let defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser.length > 0) { // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0];
            }
            this.props.getChildrenOfOrganizationalUnits(defaultUnit._id);
            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...this.state.newReport,
                        organizationalUnit: defaultUnit._id,
                    }
                };
            });
            return false;
        }
        return true;
    }

    /**
     * Hàm xử lý ngày bắt đầu thay đổi
     * @param {*} value 
     */
    handleChangeStartDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                newReport: {
                    ...this.state.newReport,
                    startDate: value,
                }
            }
        })
    }

    /**
     * Hàm xử lý ngày kết thúc thay đổi
     * @param {*} value 
     */
    handleChangeEndDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                newReport: {
                    ...this.state.newReport,
                    endDate: value,
                }
            }
        })
    }

    /**
     * Hàm xử lý khi chọn đặc thù công việc
     * @param {*} value 
     */
    handleChangeStatus = (value) => {
        this.setState(state => {
            return {
                ...state,
                newReport: {
                    ...this.state.newReport,
                    status: value,
                }
            }
        })
    }

    /**
     * Hàm xử lý khi chọn tần suất
     * @param {*} value 
     */
    handleChangeFrequency = (value) => {
        this.setState(state => {
            return {
                ...state,
                newReport: {
                    ...this.state.newReport,
                    frequency: value,
                }
            }
        })
    }

    /**
     * Hàm xử lý khi nhập hệ số
     * @param {*} e 
     */
    handleChangeCoefficient = (e) => {
        let { value } = e.target;
        if (value === '') {
            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...this.state.newReport,
                    }
                }
            })
        } else {
            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...this.state.newReport,
                        coefficient: value,
                    }
                }
            })
        }
    }
    /**
     * hàm xử lý khi chọn cách tính
     * @param {*} value 
     */
    handleChangeAggregationType = (index, value) => {
        let { newReport } = this.state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], aggregationType: value.toString() }

        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Hàm xử lý khi chọn dạng biểu đồ
     * @param {*} e 
     */
    handleChangeChart = (index, value) => {
        let { newReport } = this.state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], charType: value.toString() };
        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Hàm xử lý khi nhập điều kiện lọc
     * @param {*} e 
    */
    handleChangeFilter = (index, e) => {
        let { value } = e.target;
        let { newReport } = this.state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], filter: value };

        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Hàm xử lý khi khi nhập tên mới
     * @param {*} e 
     */
    handleChangeNewName = (index, e) => {
        let { value } = e.target;
        let { newReport } = this.state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], newName: value }

        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Hàm xử lý khi người tạo báo cáo thay đổi
     * @param {*} value : tên người tạo
     */
    handleChangeReportResponsibleEmployees = (value) => {

        this.setState(state => {
            return {
                ...state,
                newReport: {
                    ...this.state.newReport,
                    responsibleEmployees: value,
                }
            }
        })
    }

    /**
     * Hàm xử lý khi người phê duyệt báo cáo thay đổi
     * @param {*} value 
     */
    handleChangeReportAccountableEmployees = (value) => {

        this.setState(state => {
            return {
                ...state,
                newReport: {
                    ...this.state.newReport,
                    accountableEmployees: value,
                }
            }
        })

    }

    /**
     * Hàm xử lý khi click vào checkbox
     * @param {*} item 
     */
    handleChangeChecked = (index, item) => {
        let { newReport } = this.state;
        let value = item.target.checked;

        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], showInReport: value };
        this.setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }

    /**
     * Xử lý hiện form view
     */
    handleView = () => {

        console.log('state', this.state.newReport)
        const { newReport } = this.state;
        let data = {
            accountableEmployees: newReport.accountableEmployees,
            responsibleEmployees: newReport.responsibleEmployees,
            aggregationType: newReport.aggregationType,
            chartType: newReport.chartType,
            coefficient: newReport.coefficient,
            nameTaskReport: newReport.nameTaskReport,
            descriptionTaskReport: newReport.descriptionTaskReport,
            endDate: newReport.endDate,
            frequency: newReport.frequency,
            organizationalUnit: newReport.organizationalUnit,

            startDate: newReport.startDate,
            status: newReport.status,
            taskTemplate: newReport.taskTemplate,
            taskInformations: newReport.taskInformations,
        }

        this.props.getTaskEvaluations(data);

        window.$('#modal-view-taskreport').modal('show');
    }


    /**
     * Hàm xử lý khi ấn lưu
     */
    save = () => {
        if (this.isFormValidated()) {
            this.props.createTaskReport(this.state.newReport);
        }
    }

    componentDidMount() {
        this.props.getTaskTemplateByUser("1", "0", "[]");
        // Lấy tất cả nhân viên trong công ty
        this.props.getAllUserOfCompany();
        this.props.getAllUserInAllUnitsOfCompany();
        this.props.getAllTask();
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));

    }

    render() {
        const { translate, reports, tasktemplates, user, tasks } = this.props;
        const { errorOnNameTaskReport, errorOnDescriptiontTaskReport, newReport, } = this.state;
        let listTaskTemplate, units, taskInformations = newReport.taskInformations, listRole, listRoles = [];

        // Lấy ra list task template theo đơn vị
        if (tasktemplates.items && newReport.organizationalUnit) {
            listTaskTemplate = tasktemplates.items.filter(function (taskTemplate) {
                return taskTemplate.organizationalUnit._id === newReport.organizationalUnit
            })
        }
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }

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
        // Lấy thông tin nhân viên của đơn vị
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-task-report" isLoading={reports.isLoading}
                    formID="form-create-task-report"
                    title="Thêm mới báo cáo"
                    func={this.save}
                    size={100}
                    disableSubmit={!this.isFormValidated()}
                >
                    <TaskReportViewForm passState={newReport.listCheckBox} startDate={newReport.startDate} endDate={newReport.endDate} />
                    <div className="row" >
                        <div className="col-md-12 col-lg-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div className="form-inline d-flex justify-content-end">
                                <button id="exportButton" className="btn btn-sm btn-success " title="Xem chi tiết" style={{ marginBottom: '10px' }} onClick={() => this.handleView()} ><span className="fa fa-eye" style={{ color: '#4e4e4e' }}></span> Xem</button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Chọn đơn vị */}
                            <div className={'form-group'}>
                                <label className="control-label">Chọn đơn vị</label>
                                {units &&
                                    <select value={newReport.organizationalUnit} className="form-control" onChange={this.handleChangeReportOrganizationalUnit}>
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
                                {listRoles &&
                                    <SelectBox
                                        id={`read-select-box`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            listRoles.map(x => { return { value: x._id, text: x.name } })
                                        }
                                        onChange={this.handleTaskTemplateRead}
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
                            {/* Chọn mẫu công việc */}
                            <div className="form-group">
                                <label>Mẫu công việc
                                        <span className="text-red">*</span>
                                </label>
                                <select className="form-control" value={newReport.taskTemplate} onChange={this.handleChangeTaskTemplate}>
                                    <option value="">--Hãy chọn mẫu công việc--</option>
                                    {(listTaskTemplate && listTaskTemplate.length !== 0) &&
                                        listTaskTemplate.map(item => {
                                            return <option key={item._id} value={item._id}>{item.name}</option>
                                        })
                                    }
                                </select>
                            </div>

                            {/* Tên báo cáo */}
                            <div className={`form-group ${!errorOnNameTaskReport ? "" : "has-error"}`}>
                                <label>{translate('report_manager.name')}
                                    <span className="text-red">*</span>
                                </label>
                                <input type="Name" className="form-control" value={(newReport.nameTaskReport)} onChange={this.handleNameTaskReportChange} placeholder="Nhập tên báo cáo" />
                                <ErrorLabel content={errorOnNameTaskReport} />
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Mô tả báo cáo */}
                            <div className={`form-group ${!errorOnDescriptiontTaskReport ? "" : "has-error"}`}>
                                <label htmlFor="Descriptionreport">{translate('report_manager.description')}
                                    <span className="text-red">*</span>
                                </label>
                                <textarea rows={5} type="text" className="form-control" id="Descriptionreport" name="description" value={(newReport.descriptionTaskReport)} onChange={this.handleDesTaskReportChange} />
                                <ErrorLabel content={errorOnDescriptiontTaskReport} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Đặc thù công việc */}
                            <div className={`form-group `}>
                                <label className="control-label">Đặc thù công việc</label>
                                <SelectBox
                                    id="select-status"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    onChange={this.handleChangeStatus}
                                    items={
                                        [
                                            { value: "0", text: 'Tất cả' },
                                            { value: "1", text: 'Đã hoàn thành' },
                                            { value: "2", text: 'Đang thực hiện' },
                                        ]
                                    }
                                    multiple={false}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Tần suất */}
                            <div className={`form-group`}>
                                <label className="control-label">Tần suất</label>
                                <SelectBox
                                    id="select-box-frequency"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    onChange={this.handleChangeFrequency}
                                    items={
                                        [
                                            { value: 'month', text: 'Tháng' },
                                            { value: 'quarter', text: 'Quý' },
                                            { value: 'year', text: 'Năm' },
                                        ]
                                    }
                                    multiple={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Chọn người thực hiện */}
                            <div className={`form-group`}>
                                <label className="control-label">Người thực hiện</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`responsible-select-box${newReport.taskTemplate}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleChangeReportResponsibleEmployees}
                                        value={newReport.responsibleEmployees}
                                        multiple={true}
                                        options={{ placeholder: "Chọn người thực hiện" }}
                                    />
                                }
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Chọn người phê duyệt */}
                            <div className="form-group">
                                <label className="control-label">Người phê duyệt</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`accountableEmployees-select-box${newReport.taskTemplate}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={this.handleChangeReportAccountableEmployees}
                                        value={newReport.accountableEmployees}
                                        multiple={true}
                                        options={{ placeholder: "Chọn người phê duyệt" }}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            {/* Thống kê từ ngày */}
                            <div className="form-group">
                                <label>Thống kê từ ngày</label>
                                <DatePicker
                                    id="start-date"
                                    value={this.state.startDate}
                                    onChange={this.handleChangeStartDate}
                                    disabled={false}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            {/* Thống kê đến ngày */}
                            <div className="form-group">
                                <label>Thống kê đến ngày </label>
                                <DatePicker
                                    id="end-date"
                                    value={this.state.endDate}
                                    onChange={this.handleChangeEndDate}
                                    disabled={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form show thông tin mẫu công việc */}
                    {
                        (newReport.taskTemplate !== '') &&
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
                                            taskInformations ? taskInformations.map((item2, index) => (
                                                <tr key={index}>
                                                    <td>{item2.code}</td>
                                                    <td>{item2.name}</td>
                                                    <td>{(item2.type === 'SetOfValues' ? 'Tập dữ liệu' : (item2.type))}</td>
                                                    <td><input className="form-control" style={{ width: '100%' }} type="text" onChange={(e) => this.handleChangeFilter(index, e)} placeholder={(item2.type === 'Number' ? `p${index + 1} > 3000` : (item2.type === 'SetOfValues' ? `p${index + 1} = 3000` : ''))} /></td>
                                                    <td>
                                                        {(item2.type === 'Number') ?
                                                            <div className="checkbox" style={{ paddingLeft: "20%" }}>
                                                                <label>
                                                                    <input name="showInReport" type="checkbox" value={item2.name} onChange={(e) => this.handleChangeChecked(index, e)} />
                                                                </label>
                                                            </div>
                                                            : ''
                                                        }
                                                    </td>
                                                    <td>
                                                        {(item2.type === 'Number') ?
                                                            <input className="form-control" style={{ width: '100%' }} type="text" onChange={(e) => this.handleChangeNewName(index, e)} /> : ''
                                                        }

                                                    </td>
                                                    <td>
                                                        {(item2.type === 'Number') ?
                                                            <SelectBox
                                                                id={`select-box-calulator-${item2.code}`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                onChange={(e) => this.handleChangeAggregationType(index, e)}
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
                                                            (item2.type === 'Number') ?
                                                                <SelectBox
                                                                    id={`select-box-chart-${item2.code}`}
                                                                    className="form-control select2"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(e) => this.handleChangeChart(index, e)}
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

                                                // Khong dung colSpan
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
function mapState(state) {
    const { tasks, user, reports, tasktemplates } = state;
    return { tasks, user, reports, tasktemplates };
}
const actionCreators = {
    createTaskReport: TaskReportActions.createTaskReport,
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,

    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getDepartment: UserActions.getDepartmentOfUser,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,

    getAllTask: taskManagementActions.getAll,
    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
}
const createForm = connect(mapState, actionCreators)(withTranslate(TaskReportCreateForm));

export { createForm as TaskReportCreateForm };
