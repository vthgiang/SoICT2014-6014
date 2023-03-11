import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components'
import { getStorage } from '../../../../config'
import ValidationHelper from '../../../../helpers/validationHelper'
import { UserActions } from '../../../super-admin/user/redux/actions'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import { ProjectActions } from "../../projects/redux/actions";
import { convertUserIdToUserName, getAmountOfWeekDaysInMonth, getCurrentProjectDetails, getEstimateHumanCostFromParams, getEstimateMemberCost, getNearestIntegerNumber, getProjectParticipants, getProjectParticipantsByArrId } from '../../projects/components/functionHelper';

const ModalEditRowPhase = (props) => {
    const { currentPhase, translate, project, currentEditPhaseIndex, user } = props;

    const [projectData, setProjectData] = useState(props.projectData);
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const projectDetail = projectData ?? getCurrentProjectDetails(project);
    const userId = getStorage("userId");
    const [currentPhaseCode, setCurrentPhaseCode] = useState(undefined);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(undefined);
    const [currentDescription, setCurrentDescription] = useState(currentPhase?.description);
    const [currentResponsibleEmployees, setCurrentResponsibleEmployees] = useState([]);
    const [currentAccountableEmployees, setCurrentAccountableEmployees] = useState([]);

    const [error, setError] = useState({
        errorOnResponsibleEmployees: undefined,
        errorOnAccountableEmployees: undefined
    })

    useEffect(() => {
        setProjectData(props.projectData)
    }, [JSON.stringify(props.projectData)])

    // Điều kiện để rerender lại modal khi thay đổi id của row
    if (currentPhase.code !== currentPhaseCode) {
        setCurrentPhaseCode(currentPhase.code);
        setCurrentDescription(currentPhase.description);
        setCurrentResponsibleEmployees(currentPhase?.currentResponsibleEmployees || []);
        setCurrentAccountableEmployees(currentPhase?.currentAccountableEmployees || []);
    }
    
    if (currentEditPhaseIndex !== currentPhaseIndex) {
        setCurrentPhaseIndex(currentEditPhaseIndex);
    }

    // Hàm thay đổi responsible arr
    const handleChangePhaseResponsibleEmployees = (value) => {
        validatePhaseResponsibleEmployees(value, true);
    }

    const validatePhaseResponsibleEmployees = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);
        
        if (willUpdateState) {
            setCurrentResponsibleEmployees(value)
            setTimeout(() => {
                setError({
                    ...error,
                    errorOnResponsibleEmployees: message,
                })
            }, 10);
        }
        return message === undefined;
    }

    // Hàm thay đổi accountable arr
    const handleChangePhaseAccountableEmployees = (value) => {
        validatePhaseAccountableEmployees(value, true);
    }
    const validatePhaseAccountableEmployees = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);


        if (willUpdateState) {
            setCurrentAccountableEmployees(value)
            setTimeout(() => {
                setError({
                    ...error,
                    errorOnAccountableEmployees: message,
                })
            }, 10);
        }
        return message === undefined;
    }

    const save = () => {
        const newPhaseData = {
            code: currentPhase?.code,
            name: currentPhase?.name,
            description: currentDescription,
            currentResponsibleEmployees,
            currentAccountableEmployees
        }
        props.handleSave(newPhaseData, currentEditPhaseIndex);
    }

    const isFormValidated = useMemo(() => {
        return currentAccountableEmployees.length > 0 && currentResponsibleEmployees.length
    }, [currentAccountableEmployees, currentResponsibleEmployees ])

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "user_all", userId });
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-row-phase-${currentPhase.code}`} isLoading={false}
                formID={`form-modal-edit-row-phase`}
                title="Chỉnh sửa dòng công việc"
                func={save}
                disableSubmit={!isFormValidated}
                size={60}
            >
                <div className="row">
                    {/* Thông tin công việc */}
                    <div className="col-xs-12">
                        <fieldset className="scheduler-border" style={{ lineHeight: 1.5 }}>
                            <legend className="scheduler-border">Thông tin giai đoạn</legend>
                            {/* Dong 1 */}
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Mã giai đoạn</strong>
                                            <div className="col-sm-8">
                                                <span>{currentPhase?.code}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Dòng 2 */}
                            <div className = "row">
                                <div className="col-md-12">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Tên giai đoạn</strong>
                                            <div className="col-sm-8">
                                                <span>{currentPhase?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Các tác nhân trong giai đoạn */}
                            <div className="row">
                                {/* Những người thực hiện */}
                                <div className={`col-md-12 col-lg-12 form-group ${error.errorOnResponsibleEmployees === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('task.task_management.responsible')}<span className="text-red">*</span></label>
                                    {getProjectParticipants(projectDetail) &&
                                        <SelectBox
                                            id={`responsible-select-box-edit-row-phase-${currentPhaseCode}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={projectData ? getProjectParticipantsByArrId(projectDetail, listUsers) : getProjectParticipants(projectDetail)}
                                            onChange={handleChangePhaseResponsibleEmployees}
                                            value={currentResponsibleEmployees}
                                            multiple={true}
                                            options={{ placeholder: translate('task.task_management.add_resp') }}
                                        />
                                    }
                                    <ErrorLabel content={error.errorOnResponsibleEmployees} />
                                </div>
                            </div>

                            <div className='row'>
                                {/* Những người quản lý/phê duyệt*/}
                                <div className={`col-md-12 col-lg-12 form-group ${error.errorOnAccountableEmployees === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('task.task_management.accountable')}<span className="text-red">*</span></label>
                                    {getProjectParticipants(projectDetail) &&
                                        <SelectBox
                                            id={`accountable-select-box-edit-row-phase-${currentPhaseCode}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={projectData ? getProjectParticipantsByArrId(projectDetail, listUsers) : getProjectParticipants(projectDetail)}
                                            onChange={handleChangePhaseAccountableEmployees}
                                            value={currentAccountableEmployees}
                                            multiple={true}
                                            options={{ placeholder: translate('task.task_management.add_acc') }}
                                        />
                                    }
                                    <ErrorLabel content={error.errorOnAccountableEmployees} />
                                </div>
                            </div>

                            {/* Chỉnh sửa mô tả giai đoạn */}
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label className="control-label">Mô tả</label>
                                    <textarea type="text" rows={3} style={{ minHeight: '103.5px' }}
                                        name={`task_description`}
                                        onChange={(e) => setCurrentDescription(e.target?.value)}
                                        value={currentDescription}
                                        className="form-control"
                                        placeholder="Mô tả"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalEditRowPhase))
