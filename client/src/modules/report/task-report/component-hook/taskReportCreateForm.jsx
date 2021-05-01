import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from '../../../../common-components';

import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { TaskReportViewForm } from './taskReportViewForm';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../../task/task-template/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { TaskReportActions } from '../redux/actions';

import ValidationHelper from '../../../../helpers/validationHelper';

import './transferList.css';

function TaskReportCreateForm(props) {
    const [state, setState] = useState({
        newReport: {
            nameTaskReport: '',
            descriptionTaskReport: '',
            organizationalUnit: '',
            taskTemplate: '',
            status: 0,
            responsibleEmployees: [],
            accountableEmployees: [],
            readByEmployees: [],
            startDate: '',
            endDate: '',
            frequency: 'month',
            itemListBoxLeft: [
                { id: 1, name: 'Thời gian', checked: false },
                { id: 2, name: 'Người thực hiện', checked: false },
                { id: 3, name: 'Người phê duyệt', checked: false },
            ],
            taskInformations: [],
            itemListBoxRight: [],
            itemListTempLeft: [],
            itemListTempRight: [],
        },
        currentRole: getStorage('currentRole'),
    })


    /**
    * Hàm bắt sự kiên thay đổi input NameTaskReport
    * @param {*} e 
    */
    const handleNameTaskReportChange = (e) => {
        let { newReport } = state;
        const { translate } = props;
        let { value } = e.target;

        setState({
            newReport: {
                ...newReport,
                nameTaskReport: value,
            },
        });
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState({ nameErrorCreateForm: message });
    }

    /**
     * Bắt sự kiện thay đổi cho ô input mô tả báo cáo
     * @param {*} e 
     */
    const handleDesTaskReportChange = (e) => {
        let { newReport } = state;
        const { translate } = props;
        let { value } = e.target;

        setState({
            newReport: {
                ...newReport,
                descriptionTaskReport: value,
            },
        });

        let { message } = ValidationHelper.validateDescription(translate, value);
        setState({ descriptionErrorCreateForm: message });

    }

    /**
     * Hàm xử lý khi thay đổi đơn vị
     * @param {*} e 
     */
    const handleChangeReportOrganizationalUnit = e => {
        let { newReport } = state;
        let { value } = e.target;
        if (value) {
            // this.props.getAllUserOfDepartment(value);
            props.getChildrenOfOrganizationalUnits(value);
            setState({
                newReport: {
                    ...newReport,
                    nameTaskReport: '',
                    descriptionTaskReport: '',
                    organizationalUnit: value,
                    responsibleEmployees: [],
                    accountableEmployees: [],
                    taskTemplate: '',
                },
                nameErrorCreateForm: undefined,
                descriptionErrorCreateForm: undefined,
                startDateErrorCreateForm: undefined,
                readByEmployeeErrorCreateForm: undefined,
                taskTemplateErrorCreateForm: undefined,
            });
        }
    }

    /**
     * Hàm xử lý khi thay đổi mẫu công việc
     * @param {*} e 
     */
    const handleChangeTaskTemplate = (value) => {
        let { newReport } = state;
        const { translate } = props;
        value = value[0];

        if (value === '') { // Reset các input nhận giá trị tự động khi mẫu công việc trống
            setState({
                newReport: {
                    ...newReport,
                    nameTaskReport: '',
                    descriptionTaskReport: '',
                    taskTemplate: '',
                    status: '',
                    responsibleEmployees: [],
                    accountableEmployees: [],
                    readByEmployees: [],
                },
                nameErrorCreateForm: undefined,
                descriptionErrorCreateForm: undefined,
                startDateErrorCreateForm: undefined,
                readByEmployeeErrorCreateForm: undefined,
                taskTemplateErrorCreateForm: undefined,
            });
        } else {
            let taskTemplate = props.tasktemplates.items.find((taskTemplate) =>
                taskTemplate._id === value
            );

            let taskInformations = [];
            if (taskTemplate.taskInformations) {
                // Set các giá trị mặc định khi người dùng không chọn các trường này
                for (let [index, value] of taskTemplate.taskInformations.entries()) {
                    taskInformations[index] = {
                        ...value,
                        chartType: '0',
                        aggregationType: '0',
                        coefficient: 1,
                        showInReport: false,
                    }
                }
            }

            setState({
                newReport: {
                    ...newReport,
                    nameTaskReport: taskTemplate.name,
                    descriptionTaskReport: taskTemplate.description,
                    taskTemplate: taskTemplate._id,
                    responsibleEmployees: taskTemplate.responsibleEmployees.map(item => item._id),
                    accountableEmployees: taskTemplate.accountableEmployees.map(item => item._id),
                    taskInformations: taskInformations,
                }
            })
        }
        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({ taskTemplateErrorCreateForm: message });
    }

    useEffect(() => {
        async function fetchData() {
            const { user } = props;
            let { newReport, currentRole } = state;

            if (newReport.organizationalUnit === '' && user.organizationalUnitsOfUser) {
                let defaultUnit = await user.organizationalUnitsOfUser.find(item =>
                    item.managers.toString() === currentRole
                    || item.deputyManagers.toString() === currentRole
                    || item.employees.toString() === currentRole);

                // Lấy người dùng của đơn vị hiện tại và người dùng của đơn vị con
                if (defaultUnit) {
                    props.getChildrenOfOrganizationalUnits(defaultUnit._id);
                }

                setState({
                    ...state,
                    newReport: {
                        ...newReport,
                        organizationalUnit: defaultUnit && defaultUnit._id,
                    },
                    units: user.organizationalUnitsOfUser
                });
            }
        }
        fetchData();
    })


    /**
     * Hàm xử lý ngày bắt đầu thay đổi
     * @param {*} value 
     */
    const handleChangeStartDate = (value) => {
        let { newReport } = state;
        const { translate } = props;

        setState({
            newReport: {
                ...newReport,
                startDate: value,
            },
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({ startDateErrorCreateForm: message });
    }

    /**
     * Hàm xử lý ngày kết thúc thay đổi
     * @param {*} value 
     */
    const handleChangeEndDate = (value) => {
        let { newReport } = state;
        setState({
            newReport: {
                ...newReport,
                endDate: value,
            }
        })
    }

    /**
     * Hàm xử lý khi chọn đặc thù công việc
     * @param {*} value 
     */
    const handleChangeStatus = (value) => {
        let { newReport } = state;
        setState({
            newReport: {
                ...newReport,
                status: value[0],
            }
        })
    }


    /**
     * Hàm xử lý khi chọn tần suất
     * @param {*} value 
     */
    const handleChangeFrequency = (value) => {
        let { newReport } = state;
        setState({
            newReport: {
                ...newReport,
                frequency: value[0],
            }
        })
    }


    /**
     * Hàm xử lý khi nhập hệ số
     * @param {*} e 
     */
    const handleChangeCoefficient = (index, e) => {
        let { value } = e.target;
        let { newReport } = state;
        let taskInformations = newReport.taskInformations;
        // gán hệ số của riêng từng trường thông tin vào taskInformations
        taskInformations[index] = { ...taskInformations[index], coefficient: value }

        // set lại state với giá trị taskInformations mới
        setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * hàm xử lý khi chọn cách tính
     * @param {*} value 
     */
    const handleChangeAggregationType = (index, value) => {
        let { newReport } = state;
        let taskInformations = newReport.taskInformations;

        taskInformations[index] = { ...taskInformations[index], aggregationType: value.toString() }

        setState({
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
    const handleChangeChart = (index, value) => {
        let { newReport } = state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], chartType: value.toString() };

        setState({
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
    const handleChangeFilter = (index, e) => {
        let { value } = e.target;
        let { newReport } = state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], filter: value };

        setState({
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
    const handleChangeNewName = (index, e) => {
        let { value } = e.target;
        let { newReport } = state;
        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], newName: value }

        setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý khi người thực hiện thay đổi
     * @param {*} value : tên người thực hiện
     */
    const handleChangeReportResponsibleEmployees = (value) => {
        let { newReport } = state;
        setState({
            newReport: {
                ...newReport,
                responsibleEmployees: value,
            }
        })
    }


    /**
     * Hàm xử lý khi người phê duyệt thay đổi
     * @param {*} value 
     */
    const handleChangeReportAccountableEmployees = (value) => {
        let { newReport } = state;
        setState({
            newReport: {
                ...newReport,
                accountableEmployees: value,
            }
        })
    }

    const handleTaskReportRead = value => {
        let { newReport } = state;
        const { translate } = props;
        setState({
            newReport: {
                ...newReport,
                readByEmployees: value,
            }
        });

        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({ readByEmployeeErrorCreateForm: message });
    }

    /**
     * Hàm xử lý khi click vào checkbox
     * @param {*} item 
     */
    const handleChangeShowInReport = (index, item) => {
        let { newReport } = state;
        let value = item.target.checked;

        let taskInformations = newReport.taskInformations;
        taskInformations[index] = { ...taskInformations[index], showInReport: value };

        setState({
            newReport: {
                ...newReport,
                taskInformations: taskInformations,
            }
        })
    }


    /**
     * Hàm xử lý khi listbox chọn chiều dữ liệu thay đổi
     * @param {} e 
     */
    const handleLeftListChange = (e) => {
        const { newReport } = state;
        let { value, name, checked } = e.target;
        let { itemListTempLeft, itemListBoxLeft } = newReport;

        // Kiểm tra xem item nào được click 
        let listBoxLeftLength = itemListBoxLeft.length;

        for (let i = 0; i < listBoxLeftLength; i++) {
            if (itemListBoxLeft[i].name === value) {
                itemListBoxLeft[i].checked = checked;
                break;
            }
        }

        // set lại giá trị cho State 
        setState({
            newReport: {
                ...newReport,
                itemListBoxLeft,
            }
        });

        // Nếu click 2 lần vào check bõ thì xóa item đó trong biến tạm itemListTempLeft
        // kiểm tra xem trong mảng itemListTempLeft đã tồn tại item được click hay chưa: false = -1, nếu tồn tại nghĩa là click 2 lần thì xóa nó đi
        const findIndexItem = itemListTempLeft.findIndex(x => x.id === parseInt(name)); // name là id get từ input 

        // Nếu trong mảng có tồn tại item được click thì xóa nó đi, dùng slice cắt lấy các item khác item dc click
        if (findIndexItem > -1) {
            itemListTempLeft = [...itemListTempLeft.slice(0, findIndexItem), ...itemListTempLeft.slice(findIndexItem + 1)]
        }
        else {
            // Nếu chưa có trong mảng thì thêm nó vào itemListTempLeft
            itemListTempLeft.push({ id: parseInt(name), name: value, checked: false });
        }

        setState({
            newReport: {
                ...newReport,
                itemListTempLeft: itemListTempLeft,
            }
        })
    }

    // Bắt sự kiện click nút chuyển data sang listBox dữ liệu được đưa vào biểu đồ
    const handleClickTransferRightList = () => {
        const { newReport } = state;
        let { itemListTempLeft, itemListBoxLeft, itemListBoxRight } = newReport;

        let idInListBoxLeft = itemListBoxLeft.map(x => x.id); // array id in itemListBoxLeft
        let idInListTemp = itemListTempLeft.map(x => parseInt(x.id)); // array id khi mình chọn vào checkbox của listBoxLeft

        /**
         * Check xem id khi mình chọn checkbox thì item đó có trong list item box left hay ko
         * mục đích: phần setState
         * nếu trùng thì xóa đi item đó trong listBoxleft 
         * nếu không trùng thì add thêm vào 
         */
        // const checkId = idInListBoxLeft.includes(parseInt(idInListTemp));
        const checkId = idInListTemp.some(item => idInListBoxLeft.indexOf(item) >= 0);

        // Lọc Lấy item khác với item đã chọn--> mục đích remove item đó bên listLeft 
        idInListTemp.forEach(x => {
            itemListBoxLeft = itemListBoxLeft.filter(y => y.id !== x)
        })

        // 
        setState({
            newReport: {
                ...newReport,
                itemListBoxLeft: checkId ? itemListBoxLeft
                    : itemListBoxLeft,

                itemListBoxRight: checkId ? [...itemListBoxRight, itemListTempLeft].flat(1) : itemListBoxRight,
                itemListTempLeft: [],
            }
        })
    }

    /**
     * Hàm xử lý khi listbox chiều dữ liệu được đưa vào biểu đồ thay đổi
     * @param {} e
     */
    const handleRightListChange = (e) => {
        const { newReport } = state;

        let { value, name, checked } = e.target;
        let { itemListTempRight, itemListBoxRight } = newReport;
        let listBoxRightLength = itemListBoxRight.length;

        for (let i = 0; i < listBoxRightLength; i++) {
            if (itemListBoxRight[i].name === value) {
                itemListBoxRight[i].checked = checked;
                break;
            }
        }

        // set lại giá trị cho State 
        setState({
            newReport: {
                ...newReport,
                itemListBoxRight,
            }
        });

        // kiểm tra xem trong mảng itemListTempRight đã tồn tại item được click hay chưa: false = -1
        const findIndexItem = itemListTempRight.findIndex(x => x.id === parseInt(name)); // name là id get từ input 

        // Nếu trong mảng có tồn tại item được click thì xóa nó đi, dùng slice cắt lấy các item khác item dc click
        if (findIndexItem > -1) {
            itemListTempRight = [...itemListTempRight.slice(0, findIndexItem), ...itemListTempRight.slice(findIndexItem + 1)]
        } else {
            // Nếu chưa có trong mảng thì thêm nó vào itemListTempRight
            itemListTempRight.push({ id: parseInt(name), name: value, checked: false });
        }

        setState({
            newReport: {
                ...newReport,
                itemListTempRight: itemListTempRight,
            }
        })
    }


    // Hàm bắt sự kiện click nút chuyển data sang listBox chiều dữ liệu trong biểu đồ 
    const handleClickTransferLeftList = () => {
        const { newReport } = state;
        let { itemListTempRight, itemListBoxLeft, itemListBoxRight } = newReport;

        let idInListBoxRight = itemListBoxRight.map(x => x.id); // array id in itemListBoxRight
        let idInListTemp = itemListTempRight.map(x => parseInt(x.id)); // array id khi mình chọn vào checkbox của listBoxRight

        // const checkId = idInListBoxRight.includes(parseInt(idInListTemp)); // true or false
        const checkId = idInListTemp.some(item => idInListBoxRight.indexOf(item) >= 0); // true or false

        // Lọc item khác với item đã chọn
        idInListTemp.forEach(x => {
            itemListBoxRight = itemListBoxRight.filter(y => y.id !== x)
        })


        setState({
            newReport: {
                ...newReport,
                itemListBoxRight: checkId ? itemListBoxRight
                    : itemListBoxRight,

                itemListBoxLeft: checkId ? [...itemListBoxLeft, itemListTempRight].flat(1) : itemListBoxLeft,
                itemListTempRight: [],
            }
        })
    }


    /**
     * Xử lý hiện form view
     */
    const handleView = async () => {
        const { newReport } = state;
        if (isFormValidated()) {
            await props.getTaskEvaluations(newReport);
            setState({
                modal: 'view'
            })
            window.$('#modal-view-taskreport').modal('show');
        }
    }

    /**
    * Hàm kiểm tra đã validate chưa
    */
    const isFormValidated = () => {
        let { newReport } = state;
        let { nameTaskReport, descriptionTaskReport, startDate, readByEmployees } = newReport;
        const { translate } = props;

        if (!ValidationHelper.validateName(translate, nameTaskReport).status
            || !ValidationHelper.validateDescription(translate, descriptionTaskReport).status
            || !ValidationHelper.validateEmpty(translate, startDate).status
            || !ValidationHelper.validateEmpty(translate, readByEmployees).status)
            return false;
        return true;
    }


    /**
     * Hàm xử lý khi ấn lưu
     */
    const save = () => {
        const { newReport } = state;
        if (isFormValidated()) {
            props.createTaskReport(newReport);
        }
    }


    useEffect(() => {
        props.getTaskTemplateByUser(1, 0, []);
        props.getAllUserInAllUnitsOfCompany();
        props.getRoleSameDepartment(localStorage.getItem("currentRole"));
    }, [])

    const { translate, reports, tasktemplates, user } = props;
    const { newReport,
        modal,
        units,
        nameErrorCreateForm,
        descriptionErrorCreateForm,
        startDateErrorCreateForm,
        readByEmployeeErrorCreateForm,
        taskTemplateErrorCreateForm,
    } = state;
    // let { itemListBoxLeft, itemListBoxRight } = state.newReport;
    let listTaskTemplate, listRole, listRoles = [];

    // Lấy ra list task template theo đơn vị
    if (tasktemplates.items && newReport.organizationalUnit) {
        listTaskTemplate = tasktemplates.items.filter(function (taskTemplate) {
            return taskTemplate.organizationalUnit._id === newReport.organizationalUnit
        })
    }

    let usersOfChildrenOrganizationalUnit, unitMembers = [];
    if (user.usersOfChildrenOrganizationalUnit) {
        usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);
    }

    // lấy list chức danh theo đơn vị hiện tại
    if (user.usersInUnitsOfCompany) {
        listRole = user.usersInUnitsOfCompany;
        listRole.forEach(item => {
            listRoles.push(Object.values(item.managers));
            listRoles.push(Object.values(item.deputyManagers));
            listRoles.push(Object.values(item.employees));
        })
        listRoles = listRoles.flat(1);
    }

    // Lấy thông tin nhân viên của đơn vị

    if (listTaskTemplate) {
        listTaskTemplate = listTaskTemplate.map(x => {
            return { value: x._id, text: x.name }
        })
        listTaskTemplate.unshift({ value: '', text: '---Chọn---' });
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-task-report" isLoading={reports.isLoading && user.isLoading && tasktemplates.isLoading}
                formID="form-create-task-report"
                title="Thêm mới báo cáo"
                func={save}
                size={100}
                disableSubmit={!isFormValidated()}
            >
                <TaskReportViewForm modal={modal} />

                <div className="row" >
                    <div className="col-md-12 col-lg-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="form-inline d-flex justify-content-end">
                            {
                                !isFormValidated() ?
                                    <button disabled id="exportButton" className="btn btn-sm btn-success " title="Xem biểu đồ" style={{ marginBottom: '6px' }}><span className="fa fa-fw fa-line-chart" style={{ color: 'rgb(66 65 64)', fontSize: '15px', marginRight: '5px' }}></span></button>
                                    :
                                    <button id="exportButton" className="btn btn-sm btn-success " title="Xem biểu đồ" style={{ marginBottom: '6px' }} onClick={() => handleView()} ><span className="fa fa-fw fa-line-chart" style={{ color: 'rgb(66 65 64)', fontSize: '15px', marginRight: '5px' }}></span></button>
                            }
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        {/* Chọn đơn vị */}
                        <div className={'form-group'}>
                            <label className="control-label">Chọn đơn vị</label>
                            {units &&
                                <select value={newReport.organizationalUnit} className="form-control" onChange={handleChangeReportOrganizationalUnit}>
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
                                    id={`read-select-box-create-${newReport.organizationalUnit}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listRoles.map(x => { return { value: x._id, text: x.name } })
                                    }
                                    value={newReport.readByEmployees}
                                    onChange={handleTaskReportRead}
                                    multiple={true}
                                    options={{ placeholder: "Người được xem" }}
                                />
                            }
                            <ErrorLabel content={readByEmployeeErrorCreateForm} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className={`col-md-6`}>
                        {/* Chọn mẫu công việc */}
                        <div className={`form-group ${!taskTemplateErrorCreateForm ? "" : "has-error"}`}>
                            <label className="control-label">Mẫu công việc <span className="text-red">*</span></label>
                            {
                                listTaskTemplate && listTaskTemplate.length > 0 &&
                                <SelectBox
                                    id={`taskTemplateId-create-form-${newReport.organizationalUnit}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={newReport.taskTemplate}
                                    onChange={handleChangeTaskTemplate}
                                    items={
                                        listTaskTemplate
                                    }
                                    multiple={false}
                                />
                            }
                            <ErrorLabel content={taskTemplateErrorCreateForm} />
                        </div>

                        {/* Tên báo cáo */}
                        <div className={`form-group ${!nameErrorCreateForm ? "" : "has-error"}`}>
                            <label>{translate('report_manager.name')}
                                <span className="text-red">*</span>
                            </label>
                            <input type="Name" className="form-control" value={(newReport.nameTaskReport)} onChange={handleNameTaskReportChange} placeholder="Nhập tên báo cáo" />
                            <ErrorLabel content={nameErrorCreateForm} />
                        </div>
                    </div>

                    <div className="col-md-6">
                        {/* Mô tả báo cáo */}
                        <div className={`form-group ${!descriptionErrorCreateForm ? "" : "has-error"}`}>
                            <label htmlFor="Descriptionreport">{translate('report_manager.description')}
                                <span className="text-red">*</span>
                            </label>
                            <textarea rows={5} type="text" className="form-control" id="Descriptionreport" name="description" value={(newReport.descriptionTaskReport)} onChange={handleDesTaskReportChange} />
                            <ErrorLabel content={descriptionErrorCreateForm} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        {/* Đặc thù công việc */}
                        <div className={`form-group `}>
                            <label className="control-label">Đặc thù công việc</label>
                            <SelectBox
                                id={`status-create-form-${newReport.organizationalUnit}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                onChange={handleChangeStatus}
                                value={newReport.status}
                                items={
                                    [
                                        { value: 0, text: 'Tất cả' },
                                        { value: 1, text: 'Đã hoàn thành' },
                                        { value: 2, text: 'Đang thực hiện' },
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
                                id={`frequency-create-form-${newReport.organizationalUnit}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                onChange={handleChangeFrequency}
                                value={newReport.frequency}
                                items={
                                    [
                                        { value: 'month', text: 'Tháng' },
                                        { value: 'quarter', text: 'Quý' },
                                        { value: 'year', text: 'Năm' },
                                    ]
                                }
                                multiple={false}
                                options={{ minimumResultsForSearch: 100 }}
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
                                    id={`responsible-create-form-${newReport.organizationalUnit}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={unitMembers}
                                    onChange={handleChangeReportResponsibleEmployees}
                                    value={newReport.responsibleEmployees ? newReport.responsibleEmployees : []}
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
                                    id={`accountableEmployees-create-form-${newReport.organizationalUnit}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={unitMembers}
                                    onChange={handleChangeReportAccountableEmployees}
                                    value={newReport.accountableEmployees ? newReport.accountableEmployees : []}
                                    multiple={true}
                                    options={{ placeholder: "Chọn người phê duyệt" }}
                                />
                            }
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className={`col-md-6 ${!startDateErrorCreateForm ? "" : "has-error"}`}>
                        {/* Thống kê từ ngày */}
                        <div className={`form-group`}>
                            <label className="control-label ">Thống kê từ ngày <span className="text-red">*</span></label>
                            <DatePicker
                                id="start-date-form-create"
                                value={newReport.startDate}
                                onChange={handleChangeStartDate}
                                disabled={false}
                            />
                            <ErrorLabel content={startDateErrorCreateForm} />
                        </div>
                    </div>

                    <div className="col-md-6">
                        {/* Thống kê đến ngày */}
                        <div className="form-group">
                            <label>Thống kê đến ngày </label>
                            <DatePicker
                                id="end-date-form-create"
                                value={newReport.endDate}
                                onChange={handleChangeEndDate}
                                disabled={false}
                            />
                        </div>
                    </div>
                </div>

                {/* Form show thông tin mẫu công việc */}
                {
                    (newReport.taskTemplate !== '') &&
                    <React.Fragment>
                        <div className="row" id="showTable" style={{ marginTop: '15px' }}>
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
                                            <th>Hệ số</th>
                                            <th>Cách tính</th>
                                            <th>Dạng biểu đồ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            state.taskInformations ? state.taskInformations.map((item2, index) => (
                                                <tr key={index}>
                                                    <td>{item2.code}</td>
                                                    <td>{item2.name}</td>
                                                    <td>{(item2.type === 'set_of_values' ? 'Tập dữ liệu' : (item2.type))}</td>
                                                    <td><input className="form-control" style={{ width: '100%' }} type="text" onChange={(e) => handleChangeFilter(index, e)} placeholder={(item2.type === 'number' ? `p${index + 1} > 3000` : (item2.type === 'set_of_values' ? `p${index + 1} = 3000` : ''))} /></td>
                                                    <td>
                                                        {(item2.type === 'number') ?
                                                            <div className="checkbox" style={{ paddingLeft: "20%" }}>
                                                                <label>
                                                                    <input name="showInReport" type="checkbox" value={item2.name} onChange={(e) => handleChangeShowInReport(index, e)} />
                                                                </label>
                                                            </div>
                                                            : ''
                                                        }
                                                    </td>
                                                    <td>
                                                        {(item2.type === 'number') ?
                                                            <input className="form-control" style={{ width: '100%' }} type="text" onChange={(e) => handleChangeNewName(index, e)} /> : ''
                                                        }

                                                    </td>
                                                    <td>
                                                        {(item2.type === 'number') ?
                                                            <input type="text" className="form-control" style={{ width: '100%' }} onChange={(e) => handleChangeCoefficient(index, e)} /> : ''
                                                        }
                                                    </td>
                                                    <td>
                                                        {(item2.type === 'number') ?
                                                            <SelectBox
                                                                id={`select-box-calulator-${item2.code}`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                onChange={(e) => handleChangeAggregationType(index, e)}
                                                                items={
                                                                    [
                                                                        { value: 0, text: 'Trung bình cộng' },
                                                                        { value: 1, text: 'Tổng' },
                                                                    ]
                                                                }
                                                                multiple={false}
                                                            />
                                                            : ''
                                                        }
                                                    </td>
                                                    <td data-select2-id="1111">
                                                        {
                                                            (item2.type === 'number') ?
                                                                <SelectBox
                                                                    id={`select-box-chart-${item2.code}`}
                                                                    className="form-control select2"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(e) => handleChangeChart(index, e)}
                                                                    items={
                                                                        [
                                                                            { value: 0, text: 'Cột' },
                                                                            { value: 1, text: 'Đường' },
                                                                            { value: 2, text: 'Tròn' },
                                                                        ]
                                                                    }
                                                                    multiple={false}
                                                                />
                                                                : ''
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                                : <tr><td colSpan={8}><center>{translate('report_manager.no_data')}</center></td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* form chọn chiều dữ liệu đưa vào biểu đồ */}
                        <div className="row" style={{ marginTop: '15px' }}>
                            <div className="col-md-6 col-sm-12">
                                <div className="row">
                                    <div className="box-display" >
                                        <div className="col-md-5 ">
                                            <div className="border">
                                                <div className="box-title">
                                                    <span><b>Chọn chiều dữ liệu trong biểu đồ</b></span>
                                                </div>
                                                <div className="box-body box-size">
                                                    <div className="listItem-left">
                                                        {
                                                            state.itemListBoxLeft && state.itemListBoxLeft.map((x, index) => (
                                                                <div className="item" key={index}>
                                                                    <input className="checkbox-input" type="checkbox" id={`myCheckBoxId${index}-left`} name={x.id} value={x.name} checked={!!x.checked} onChange={handleLeftListChange} />
                                                                    <div className=" checkbox-text">
                                                                        <label htmlFor={`myCheckBoxId${index}-left`}>{x.name}</label>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-2 " align="center" style={{ margin: 'auto' }} >
                                            {/* Button khi hiển thị trên giao diện tren pc */}
                                            <div className="only-pc">
                                                <div className="listButton ">
                                                    <div className="item-button">
                                                        <button type="button" className="btn btn-sm btn-default" onClick={handleClickTransferRightList}>
                                                            <span className="material-icons">
                                                                keyboard_arrow_right
                                                                </span>
                                                        </button>
                                                    </div>
                                                    <div className="item-button">
                                                        <button type="button" className="btn btn-sm btn-default" onClick={handleClickTransferLeftList}>
                                                            <span className="material-icons">
                                                                keyboard_arrow_left
                                                                </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* end */}

                                            {/* Giao diện trên mobile  */}
                                            <div className="only-mobile">
                                                <div className="listButton ">
                                                    <div className="item-button">
                                                        <button type="button" ref="btn-down" className="btn btn-sm btn-default" onClick={handleClickTransferRightList}>
                                                            <span className="material-icons">
                                                                keyboard_arrow_down
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <div className="item-button">
                                                        <button type="button" ref="btn-up" className="btn btn-sm btn-default" onClick={handleClickTransferLeftList}>
                                                            <span className="material-icons">
                                                                keyboard_arrow_up
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-5 ">
                                            <div className="border">
                                                <div className="box-title">
                                                    <span><b>Dữ liệu được đưa vào biểu đồ</b></span>
                                                </div>
                                                <div className="box-body box-size">
                                                    <div className="listItem-left">
                                                        {
                                                            state.itemListBoxRight && state.itemListBoxRight.map((x, index) => (
                                                                <div className="item" key={index} >
                                                                    <input className="checkbox-input" type="checkbox" id={`myCheckBoxId${index}-right`} name={x.id} value={x.name} checked={!!x.checked} onChange={handleRightListChange} />
                                                                    <div className=" checkbox-text">
                                                                        <label htmlFor={`myCheckBoxId${index}-right`}>{`${index + 1}. ${x.name}`}</label>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { user, reports, tasktemplates } = state;
    return { user, reports, tasktemplates };
}

const actionCreators = {
    createTaskReport: TaskReportActions.createTaskReport,

    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,

    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,

    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
}
const createForm = connect(mapState, actionCreators)(withTranslate(TaskReportCreateForm));
export { createForm as TaskReportCreateForm };
