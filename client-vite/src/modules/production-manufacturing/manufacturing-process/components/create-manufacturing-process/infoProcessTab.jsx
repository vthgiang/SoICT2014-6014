import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { TimePicker, SelectBox, ErrorLabel } from '../../../../../common-components';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { ManagerChainActions } from "../../../manage-chain/redux/actions";

const InfoProcessTab = (props) => {

    const [state, setState] = useState({
        errorValidateManager: {
            status: false,
            message: undefined,
        },
        errorValidateSupporter: {
            status: false,
            message: undefined,
        },
        errorValidateQuantity: {
            status: true,
            message: undefined,
        },
        errorValidateProcessName: {
            message: undefined,
            status: true
        },
    })

    const { translate, generalInfo, department, user, manufacturingLineTemplate, manufacturingProcess, taskProcess } = props;
    const { errorValidateManager, errorValidateSupporter, errorValidateQuantity, errorValidateProcessName, info } = state;

    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany()
    }, [])

    useEffect(() => {
        setState({
            ...state,
            info: generalInfo
        })
    }, [props.generalInfo])

    const handleChangeOrganizationalUnit = (event) => {
        let value = event.target.value;
        let newInfo = {...info, organizationalUnit: value}
        setState({
            ...state,
            info: newInfo,
            errorValidateManager: {
                status: true,
                message: undefined,
            },
            errorValidateSupporter: {
                status: false,
                message: undefined,
            },
        })

        props.onChangeGeneralInfo(newInfo)
    }


    const handleChangeProductionLineTemplate = (event) => {
        let value = event.target.value
        //lấy process template id thông qua productionLineTemplate
        let newInfo = {...info, productionLineTemplate: value}
        setState({
            ...state,
            info: newInfo,
        })
        let xmlDiagramTemplate = undefined
        let template = manufacturingLineTemplate.lists.filter((item) => item._id === value)
        let xmlDiagramTemplateId = template[0]?.processTemplate
        if (xmlDiagramTemplateId)
            xmlDiagramTemplate = taskProcess.xmlDiagram.filter(item => item._id === xmlDiagramTemplateId)[0]

        props.onChangeGeneralInfo(newInfo)
        props.onChangeProductionLineTemplate(xmlDiagramTemplate)
    }

    const handleChangeTimeStart = (value) => {
        let newInfo = {...info, startTime: value}

        setState({
            ...state,
            info: newInfo,
        })
        props.onChangeGeneralInfo(newInfo)
    }

    const handleChangeTimeEnd = (value) => {
        let newInfo = {...info, endTime: value}
        setState({
            ...state,
            info: newInfo
        })
        props.onChangeGeneralInfo(newInfo)
    }

    const handleChangeManagerEmployee = (value) => {
        let errorManagerEmpty = ValidationHelper.validateArrayLength(translate, value);
        let newInfo = {...info, manager: value}
        setState({
            ...state,
            info: newInfo,
            errorValidateManager: errorManagerEmpty
        })
        props.onChangeGeneralInfo(newInfo)
    }

    const handleChangeSupporterEmployee = (value) => {
        let errorSupporterEmpty = ValidationHelper.validateArrayLength(translate, value);
        let newInfo = {...info, supporter: value}
        setState({
            ...state,
            info: newInfo,
            errorValidateSupporter: errorSupporterEmpty
        })
        props.onChangeGeneralInfo(newInfo)
    }

    const handleChangeQuantityOfDay = (event) => {
        let value = event.target.value;
        let errorValidateQuantityOfDay = ValidationHelper.validateNumberInputMin(translate, value, 0)
        let newInfo = {...info, quantityOfDay: value}

        setState({
            ...state,
            info: newInfo,
            errorValidateQuantity: errorValidateQuantityOfDay
        })
        props.onChangeGeneralInfo(newInfo)
    }

    const handleChangeProcessName = (event) => {
        event.preventDefault();
        let value = event.target.value;
        let errorValidateName = ValidationHelper.validateLength(translate, value, 6, 255);
        let newInfo = {...info, processManufacturingName: value}

        setState({
            ...state,
            info: newInfo,
            errorValidateProcessName: errorValidateName
        })
        props.onChangeGeneralInfo(newInfo)
    }
    const listDepartment = department.list
    const listProductionLineTemplate = manufacturingLineTemplate.lists

    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }
    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);

    return (
        <React.Fragment>
            <div>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{translate('manufacturing_managerment.manufacturing_process.tab_information')}</legend>
                    <div className="row">
                        <div className="form-group col-lg-6 col-md-6">
                            <label className="control-label" htmlFor="unit-code">{translate('manufacturing_managerment.manufacturing_process.process_id')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" id="unit-code"
                                placeholder={info && info.manufacturingProcessCode ? info.manufacturingProcessCode : ""} disabled></input>
                        </div>
                        <div className="form-group col-lg-3 col-md-3">
                            <label className="control-label">{translate('manufacturing_managerment.manufacturing_process.process_unit')}<span className="text-red">*</span></label>
                            {(listDepartment || listDepartment.length === 0) ? (listDepartment &&
                                <select defaultValue={info && info.organizationalUnit ? info.organizationalUnit : ""} className="form-control" onChange={(event) => handleChangeOrganizationalUnit(event)}>
                                    {listDepartment.map(x => {
                                        return <option key={x._id} value={x._id}>{x.name}</option>
                                    })}
                                </select>) :
                                <select className="form-control">
                                    <option>Organization not found result</option>
                                </select>
                            }
                        </div>
                        <div className="form-group col-lg-3 col-md-3">
                            <div className={`${errorValidateQuantity.status === true ? "" : "has-error"}`}>
                                <label className="control-label">Số lượng thành phẩm/ngày<span className="text-red">*</span></label>
                                <input className="form-control" type="number"
                                    value={info && info.quantityOfDay ? info.quantityOfDay : 0}
                                    onChange={(event) => handleChangeQuantityOfDay(event)} />

                                <ErrorLabel content={errorValidateQuantity.message} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-6 col-md-6">
                            <label className="control-label">Thiết kế chuyền mẫu<span className="text-red">*</span></label>
                            {(listProductionLineTemplate || listProductionLineTemplate.length === 0) ? (listProductionLineTemplate &&
                                <select defaultValue={info && info.productionLineTemplate ? info.productionLineTemplate : ""} className="form-control" onChange={(event) => handleChangeProductionLineTemplate(event)}>
                                    {listProductionLineTemplate.map(x => {
                                        return <option key={x._id} value={x._id}>{x.manufacturingLineName}</option>
                                    })}
                                </select>) :
                                <select className="form-control">
                                    <option>Organization not found result</option>
                                </select>
                            }
                        </div>
                        <div className="form-group col-lg-6 col-md-6">
                            <label className="control-label" htmlFor="start-date">{translate('manufacturing_managerment.manufacturing_process.process_start_date')}<span className="text-red">*</span></label>
                            < TimePicker
                                id={`time-picker-start-process-general`}
                                // ref={`time-picker-start`}
                                value={info && info.startTime ? info.startTime : ""}
                                onChange={(value) => handleChangeTimeStart(value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`form-group col-lg-6 col-md-6 ${errorValidateProcessName.status ? "" : "has-error"}`}>
                            <label className="control-label">{translate('manufacturing_managerment.manufacturing_process.process_name')}<span className="text-red">*</span></label>
                            <input type="text"
                                className="form-control"
                                value={info && info.processManufacturingName ? info.processManufacturingName : ""}
                                onChange={(event) => handleChangeProcessName(event)}></input>
                            <ErrorLabel content={errorValidateProcessName.message} />
                        </div>
                        <div className="form-group col-lg-6 col-md-6">
                            <label className="control-label" htmlFor="end-date">{translate('manufacturing_managerment.manufacturing_process.process_end_date')}<span className="text-red">*</span></label>
                            < TimePicker
                                id={`time-picker-end-process-general`}
                                // ref={`time-picker-end`}
                                value={info && info.endTime ? info.endTime : ""}
                                onChange={(value) => handleChangeTimeEnd(value)}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{translate('manufacturing_managerment.manufacturing_process.assign_employee')}</legend>
                    <div className="row">
                        <div className="form-group col-lg-6 col-md-6">
                            <label className="control-label">{translate('manufacturing_managerment.manufacturing_process.assign_manager')}<span className="text-red">*</span></label>
                            <div className={`form-group ${errorValidateManager.status ? "" : "has-error"}`}>
                                {allUnitsMember &&
                                    <SelectBox
                                        id={`manager-select-box`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={allUnitsMember}
                                        onChange={(value) => handleChangeManagerEmployee(value)}
                                        value={info && info.manager ? info.manager : ""}
                                        multiple={true}
                                        options={{ placeholder: `${translate('manufacturing_managerment.manufacturing_process.assign_manager')}` }}
                                    />
                                }
                                <ErrorLabel content={errorValidateManager.message} />
                            </div>
                        </div>
                        <div className="form-group col-lg-6 col-md-6">
                            <label className="control-label">{translate('manufacturing_managerment.manufacturing_process.assign_supporter')}<span className="text-red">*</span></label>
                            <div className={`form-group ${errorValidateSupporter.status ? "" : "has-error"}`}>
                                {allUnitsMember &&
                                    <SelectBox
                                        id={`supporter-select-box`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={allUnitsMember}
                                        onChange={(value) => handleChangeSupporterEmployee(value)}
                                        value={info && info.supporter ? info.supporter : ""}
                                        multiple={true}
                                        options={{ placeholder: `${translate('manufacturing_managerment.manufacturing_process.assign_supporter')}` }}
                                    />
                                }
                                <ErrorLabel content={errorValidateSupporter.message} />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const { user, department, auth, manufacturingLineTemplate, manufacturingProcess, taskProcess } = state;
    return { user, department, auth, manufacturingLineTemplate, manufacturingProcess, taskProcess }
}

const mapDispatchToProps = {
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getProductionLineTemplateById: ManagerChainActions.getProductionLineTemplateById,
}

const connectInfoProcessTab = connect(mapStateToProps, mapDispatchToProps)(withTranslate(InfoProcessTab));
export { connectInfoProcessTab as InfoProcessTab }