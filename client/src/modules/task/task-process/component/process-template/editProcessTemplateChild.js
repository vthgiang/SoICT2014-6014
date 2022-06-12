import React, { Component, useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { TaskProcessActions } from '../../redux/actions';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { DatePicker, ErrorLabel, QuillEditor, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { TaskFormValidator } from '../../../task-management/component/taskFormValidator';
import getEmployeeSelectBoxItems from "../../../organizationalUnitHelper";
function EditProcessTemplateChild(props) {
    // let userId = getStorage
    let userId = getStorage("userId")

    const [state, setState] = useState({
        manager:[],
        processDescription:"",
        processName:"",
        viewer:[],
        currentRole: localStorage.getItem('currentRole'),
    })
    useEffect(() => {
        const {infoTemplate} = props
        // console.log(infoTemplate);
        props.getAllDepartments()
        setState({
            ...state,
            creator:getStorage("userId"),
            manager:infoTemplate.manager,
            processDescription:infoTemplate.processDescription,
            processName:infoTemplate.processName,
            viewer:infoTemplate.viewer,
        })
        // props.getRoles();
    }, [props.id])
   
 const handleProcessTemplateName = (e) => {
        let { value } = e.target;
        let { isProcess, translate } = props
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        props.handleChangeNameProcessChild(value)
        // props.onChangeTemplateData(newTemplate);
        setState({
            ...state,
            processName : value,
            errorOnName : message
        });
    }
    const handleProcessTemplateDescProcessChild = async(e) => {
        
        let { value } = e.target;
        let { message } = ValidationHelper.validateEmpty(props.translate, value);
        props.handleProcessTemplateDescProcessChild(value)
        await setState(state => {
            return {
                ...state,
                processDescription: value,
                errorOnProcessDescription: message,
            }
        });
    }
    
    // Hàm cập nhật người được xem quy trình
    const handleChangeViewer = async (value) => {
		let { message } = ValidationHelper.validateArrayLength(props.translate, value);
        props.handleChangeViewerProcessChild(value)
		await setState(state => {
			return {
				...state,
                viewer: value,
                errorOnViewer: message,
                }
			})
    }

    // Hàm cập nhật người quản lý quy trình
	const handleChangeManager = async (value) => {
		let { message } = ValidationHelper.validateArrayLength(props.translate, value);
        props.handleChangeManagerProcessChild(value)
		await setState(state => {
			return {
				...state,
                manager: value,
                errorOnManager: message,
			}
		})
	}

    const handleChangeTaskStartDate = (value) => {
        validateTaskStartDate(value, true);
    }
    const validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msgStart = TaskFormValidator.validateTaskStartDate(value, state.endDate ? state.endDate : "", translate);
        let msgEnd = TaskFormValidator.validateTaskEndDate(value, state.endDate ? state.endDate : "", translate);

        if (willUpdateState) {
            state.startDate = value;
            state.errorOnStartDate = msgStart;
            // state.errorOnEndDate = msgEnd;
            props.handleDataProcessChild('startDate', value)
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msgStart === undefined;
    }

    const handleChangeTaskEndDate = (value) => {
        validateTaskEndDate(value, true);
    }
    const validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msgEnd = TaskFormValidator.validateTaskEndDate(state.startDate ? state.startDate : "", value, translate);
        let msgStart = TaskFormValidator.validateTaskStartDate(state.startDate ? state.startDate : "", value, translate);

        if (willUpdateState) {
            state.endDate = value;
            state.errorOnEndDate = msgEnd;
            // state.errorOnStartDate = msgStart;
            props.handleDataProcessChild('endDate', value)
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msgEnd === undefined;
    }
    const {translate, taskProcess, role,infoTemplate, user} = props
    const {newProcessTemplate,show} = state
    const { currentDiagram} = taskProcess
    let listRole = [];
    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }
    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
    if (role && role.list.length !== 0) listRole = role.list;
    let listItem = listRole.filter(e => ['Admin', 'Super Admin', 'Manager', 'Deputy Manager', 'Employee'].indexOf(e.name) === -1)
        .map(item => { return { text: item.name, value: item._id } });
    // console.log(props);
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-12">
                    <div>
                        {/**Tên mẫu quy trình */}
                        <div className={`form-group ${state.errorOnName === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task.task_template.process_template_name')} <span style={{ color: "red" }}>*</span></label>
                            <input type="text"
                                value={state.processName}
                                className="form-control" placeholder={translate("task.task_process.process_name")}
                                onChange={handleProcessTemplateName}
                            />
                        </div>
                        {/* Mô tả quy trình */}
                        <div className={`form-group ${state.errorOnProcessDescription === undefined ? "" : "has-error"}`}>
                            <label className="control-label">{translate('task.task_process.process_description')}</label>
                            <textarea type="text" rows={4}
                                value={state.processDescription}
                                className="form-control" placeholder={translate("task.task_process.process_description")}
                                onChange={handleProcessTemplateDescProcessChild}
                            />
                        </div>
                        <div className="row form-group">
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${state.errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.start_date')} <span style={{ color: "red" }}>*</span></label>
                                <DatePicker
                                    id={`datepicker1-process-${infoTemplate._id}`}
                                    dateFormat="day-month-year"
                                    value={state.startDate}
                                    onChange={handleChangeTaskStartDate}
                                />
                                <ErrorLabel content={state.errorOnStartDate} />
                            </div>
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${state.errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.end_date')} <span style={{ color: "red" }}>*</span></label>
                                <DatePicker
                                    id={`datepicker2-process-${infoTemplate._id}`}
                                    value={state.endDate}
                                    onChange={handleChangeTaskEndDate}
                                />
                                <ErrorLabel content={state.errorOnEndDate} />
                            </div>
                        </div>
                        <div className="description-box">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '17px', marginRight: '5px' }} className="material-icons">
                                    people_alt
                                </span>
                                <h4>
                                    {translate('task.task_management.role')}
                                </h4>
                                
                            </div>
                            {/* Người quản lý mẫu quy trình */}
                            <strong>{translate("task.task_process.manager")}:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {allUnitsMember &&
                                <SelectBox
                                    id={`select-manager-employee-create-${infoTemplate._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={handleChangeManager}
                                    multiple={true}
                                    value={state.manager}
                                />
                            }
                            </div>

                            {/* Người được xem mẫu quy trình */}
                            <strong>{translate("task.task_process.viewer")}:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {allUnitsMember &&
                                <SelectBox
                                    id={`select-viewer-employee-create-${infoTemplate._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={handleChangeViewer}
                                    multiple={true}
                                    value={state.viewer}
                                />
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { taskProcess, role } = state;
    return {taskProcess, role};
}

const actionCreators = {
    getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
    getAllDepartments: DepartmentActions.get,
};
const connectedAddProcessTemplate = connect(mapState, actionCreators)(withTranslate(EditProcessTemplateChild));
export { connectedAddProcessTemplate as EditProcessTemplateChild };