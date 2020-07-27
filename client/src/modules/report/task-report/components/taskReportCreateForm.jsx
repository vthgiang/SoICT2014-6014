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
                frequency: '',
                filterCondition: [],
                coefficient: 1,
                newName: [],
                calulator: '',
                chartType: '',
                listCheckBox: [],

            },
            showInReport: new Set(),
            currentRole: getStorage('currentRole'),
        }
        this.checkedCheckbox = new Set();
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
            let taskTemplate = this.props.tasktemplates.items.find(function (taskTemplate) {
                return taskTemplate._id === value;
            })
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
    handleChangeCalulator = (value) => {
        this.setState(state => {
            return {
                ...state,
                newReport: {
                    ...this.state.newReport,
                    calulator: value,
                }
            }
        })
    }

    /**
     * Hàm xử lý khi chọn dạng biểu đồ
     * @param {*} e 
     */
    handleChangeChart = (value) => {
        this.setState(state => {
            return {
                ...state,
                newReport: {
                    ...this.state.newReport,
                    chartType: value,
                }
            }
        })
    }

    /**
         * Hàm xử lý khi nhập điều kiện lọc
         * @param {*} e 
         */
    handleChangeFilter = (index, e) => {
        let { value } = e.target;
        const updatedArr = [...this.state.newReport.filterCondition]
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
            updatedArr[index] = value;
            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...this.state.newReport,
                        filterCondition: updatedArr,
                    }
                }
            });
        }
    }

    /**
     * Hàm xử lý khi khi nhập tên mới
     * @param {*} e 
     */
    handleChangeNewName = (index, e) => {
        let { value } = e.target;
        const newNameArr = [...this.state.newReport.newName]
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
            newNameArr[index] = value;
            this.setState(state => {
                return {
                    ...state,
                    newReport: {
                        ...this.state.newReport,
                        newName: newNameArr,
                    }
                }
            })
        }
    }
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

    handleChangeChecked = (item) => {

        if (this.checkedCheckbox.has(item)) {
            this.checkedCheckbox.delete(item);
        } else {
            this.checkedCheckbox.add(item);
        }
        this.setState({
            showInReport: this.checkedCheckbox,
        })

    }
    /**
     * Xử lý hiện form view
     */
    handleView = () => {
        // if (this.isFormValidated()) {
        // }
        console.log('state', this.state.newReport)

        let data = {
            accountableEmployees: this.state.newReport.accountableEmployees,
            responsibleEmployees: this.state.newReport.responsibleEmployees,
            calulator: this.state.newReport.calulator,
            chartType: this.state.newReport.chartType,
            coefficient: this.state.newReport.coefficient,
            descriptionTaskReport: this.state.newReport.descriptionTaskReport,
            endDate: this.state.newReport.endDate,
            filterCondition: this.state.newReport.filterCondition,
            frequency: this.state.newReport.frequency,
            nameTaskReport: this.state.newReport.nameTaskReport,
            newName: this.state.newReport.newName,
            organizationalUnit: this.state.newReport.organizationalUnit,

            startDate: this.state.newReport.startDate,
            status: this.state.newReport.status,
            taskTemplate: this.state.newReport.taskTemplate,
            showInReport: this.state.showInReport,
        }
        let listCheck = [];
        for (const i of this.state.showInReport) {
            listCheck = [...listCheck, i]
        }
        this.setState(state => {
            return {
                ...state,
                newReport: {
                    ...this.state.newReport,
                    listCheckBox: listCheck,
                }
            }
        })
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
    }
    render() {
        const { translate, reports, tasktemplates, user, tasks } = this.props;
        const { errorOnNameTaskReport, errorOnDescriptiontTaskReport, newReport } = this.state;
        let listTaskTemplate, units, listTemplateReport;
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


        // Lấy thông tin nhân viên của đơn vị
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        // Lấy ra thong tin tasktemplate theo id cuar taskTemplate trong select box
        if (tasktemplates && tasktemplates.items) {
            listTemplateReport = tasktemplates.items.filter(item1 => {
                return item1._id === newReport.taskTemplate;
            });
        }


        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-task-report" isLoading={reports.isLoading}
                    formID="form-create-task-report"
                    title="Thêm mới báo cáo"
                    func={this.save}
                    size={75}
                    disableSubmit={!this.isFormValidated()}
                >
                    <TaskReportViewForm passState={newReport.listCheckBox} />
                    <div className="row">
                        <div className="col-md-12">
                            <a className="d-flex justify-content-end" onClick={() => this.handleView()} style={{ cursor: 'pointer' }} title="Xem chi tiết"><i className="material-icons">visibility</i></a>
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
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
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
                                <textarea rows={2} type="text" className="form-control" id="Descriptionreport" name="description" value={(newReport.descriptionTaskReport)} onChange={this.handleDesTaskReportChange} />
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
                                            { text: '---chọn---' },
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
                                            (listTemplateReport) ? listTemplateReport.map((item1) => (
                                                item1.taskInformations.map((item2, index) => (
                                                    <tr key={index}>
                                                        <td>{item2.code}</td>
                                                        <td>{item2.name}</td>
                                                        <td>{(item2.type === 'SetOfValues' ? 'Tập dữ liệu' : (item2.type))}</td>
                                                        <td><input style={{ width: '100%' }} type="text" onChange={(e) => this.handleChangeFilter(index, e)} placeholder={(item2.type === 'Number' ? `p${index + 1} > 3000` : (item2.type === 'SetOfValues' ? `p${index + 1} = 3000` : ''))} /></td>
                                                        <td>
                                                            {(item2.type === 'Number') ?
                                                                <div className="checkbox" style={{ paddingLeft: "20%" }}>
                                                                    <label>
                                                                        <input name="showInReport" type="checkbox" value={item2.name} onChange={() => this.handleChangeChecked(item2.name)} />
                                                                    </label>
                                                                </div>
                                                                : ''
                                                            }
                                                        </td>
                                                        <td>
                                                            {(item2.type === 'Number') ?
                                                                <input style={{ width: '100%' }} type="text" onChange={(e) => this.handleChangeNewName(index, e)} /> : ''
                                                            }

                                                        </td>
                                                        <td>
                                                            {(item2.type === 'Number') ?
                                                                <SelectBox
                                                                    id="select-box-calulator"
                                                                    className="form-control select2"
                                                                    style={{ width: "100%" }}
                                                                    onChange={this.handleChangeCalulator}
                                                                    items={
                                                                        [
                                                                            { value: '1', text: 'Trung bình cộng' },
                                                                        ]
                                                                    }
                                                                    multiple={false}
                                                                />
                                                                : ''
                                                            }
                                                        </td>
                                                        <td data-select2-id="1111">
                                                            <SelectBox
                                                                id="select-box-chart"
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                onChange={this.handleChangeChart}
                                                                items={
                                                                    [
                                                                        { text: '-chọn-' },
                                                                        { value: '0', text: 'Đường' },
                                                                        { value: '1', text: 'Cột' },
                                                                        { value: '2', text: 'Tròn' },
                                                                    ]
                                                                }
                                                                multiple={false}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
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
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllTask: taskManagementActions.getAll,
    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
}
const createForm = connect(mapState, actionCreators)(withTranslate(TaskReportCreateForm));

export { createForm as TaskReportCreateForm };
