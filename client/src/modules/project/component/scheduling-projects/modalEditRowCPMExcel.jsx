import moment from 'moment'
import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components'
import { getStorage } from '../../../../config'
import ValidationHelper from '../../../../helpers/validationHelper'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { checkIfHasCommonItems, getSalaryFromUserId, numberWithCommas } from '../../../task/task-management/component/functionHelpers'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from '../../redux/actions'
import { getAmountOfWeekDaysInMonth, getCurrentProjectDetails, getNearestIntegerNumber } from '../projects/functionHelper'

const ModalEditRowCPMExcel = (props) => {
    const { currentRow, translate, project, currentEditRowIndex } = props;
    const projectDetail = getCurrentProjectDetails(project);
    const userId = getStorage("userId");
    const [currentRowCode, setCurrentRowCode] = useState(undefined);
    const [currentRowIndex, setCurrentRowIndex] = useState(undefined);
    const [currentEstimateNormalCost, setCurrentEstimateNormalCost] = useState(numberWithCommas(currentRow?.estimateNormalCost));
    const [currentEstimateMaxCost, setCurrentEstimateMaxCost] = useState(numberWithCommas(currentRow?.estimateMaxCost));
    const [currentEstimateNormalTime, setCurrentEstimateNormalTime] = useState(numberWithCommas(currentRow?.estimateNormalTime));
    const [currentAssetCost, setCurrentAssetCost] = useState('');
    const [currentHumanCost, setCurrentHumanCost] = useState('');
    const [currentResponsibleEmployees, setCurrentResponsibleEmployees] = useState([]);
    const [currentAccountableEmployees, setCurrentAccountableEmployees] = useState([]);
    const [error, setError] = useState({
        errorOnResponsibleEmployees: undefined,
        errorOnAccountableEmployees: undefined,
        errorOnAssetCode: undefined,
        errorOnBudget: undefined,
        errorOnNormalTime: undefined,
    })
    // Điều kiện để rerender lại modal khi thay đổi id của row
    if (currentRow.code !== currentRowCode) {
        setCurrentRowCode(currentRow.code);
        setCurrentAssetCost(currentRow?.currentAssetCost || '1,000,000');
        setCurrentHumanCost(currentRow?.currentHumanCost || '');
        setCurrentEstimateMaxCost(currentRow?.estimateMaxCost || '');
        setCurrentEstimateNormalTime(currentRow?.estimateNormalTime || '');
        setCurrentResponsibleEmployees(currentRow?.currentResponsibleEmployees || []);
        setCurrentAccountableEmployees(currentRow?.currentAccountableEmployees || []);
    }
    if (currentEditRowIndex !== currentRowIndex) {
        setCurrentRowIndex(currentEditRowIndex);
    }


    useEffect(() => {
        props.getProjectsDispatch({ calledId: "all", userId });
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    useEffect(() => {
        let result = 0;
        const resWeight = 0.8, accWeight = 0.2;
        const currentMonthWorkDays = getAmountOfWeekDaysInMonth(moment());
        const projectDetail = getCurrentProjectDetails(project);
        console.log('projectDetail?.unitTime', projectDetail?.unitTime)
        if (projectDetail?.unitTime === 'days') {
            for (let resItem of currentResponsibleEmployees) {
                result += resWeight * getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, resItem) / currentMonthWorkDays * currentEstimateNormalTime;
            }
            for (let accItem of currentAccountableEmployees) {
                result += accWeight * getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accItem) / currentMonthWorkDays * currentEstimateNormalTime;
            }
        }
        if (projectDetail?.unitTime === 'hours') {
            for (let resItem of currentResponsibleEmployees) {
                result += resWeight * getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, resItem) / currentMonthWorkDays / 8 * currentEstimateNormalTime;
            }
            for (let accItem of currentAccountableEmployees) {
                result += accWeight * getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accItem) / currentMonthWorkDays / 8 * currentEstimateNormalTime;
            }
        }
        setCurrentHumanCost(numberWithCommas(result));
        result += Number(currentAssetCost.replace(/,/g, ''));
        setCurrentEstimateNormalCost(numberWithCommas(result));
        setCurrentEstimateMaxCost(numberWithCommas(getNearestIntegerNumber(result)));

    }, [currentResponsibleEmployees, currentAccountableEmployees, currentAssetCost, currentEstimateNormalTime])

    // Hàm thay đổi responsible arr
    const handleChangeTaskResponsibleEmployees = (value) => {
        validateTaskResponsibleEmployees(value, true);
    }
    const validateTaskResponsibleEmployees = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);
        if (checkIfHasCommonItems(currentAccountableEmployees, value)) {
            message = 'Người thực hiện và Người phê duyệt không được trùng nhau';
        }

        if (willUpdateState) {
            setCurrentResponsibleEmployees(value)
            setError({
                ...error,
                errorOnResponsibleEmployees: message,
            })
        }
        return message === undefined;
    }

    // Hàm thay đổi accountable arr
    const handleChangeTaskAccountableEmployees = (value) => {
        validateTaskAccountableEmployees(value, true);
    }
    const validateTaskAccountableEmployees = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);
        if (checkIfHasCommonItems(currentResponsibleEmployees, value)) {
            message = 'Người thực hiện và Người phê duyệt không được trùng nhau';
        }

        if (willUpdateState) {
            setCurrentAccountableEmployees(value)
            setError({
                ...error,
                errorOnAccountableEmployees: message,
            })
        }
        return message === undefined;
    }

    const getProjectParticipants = () => {
        const { project } = props;
        const projectDetail = getCurrentProjectDetails(project);
        let projectParticipants = [];
        const formattedManagerArr = projectDetail?.projectManager?.map(item => {
            return ({
                text: item.name,
                value: item._id
            })
        })
        let formattedEmployeeArr = [];
        if (Array.isArray(projectDetail?.responsibleEmployees)) {
            for (let item of projectDetail?.responsibleEmployees) {
                if (!projectDetail?.projectManager.find(managerItem => managerItem.name === item.name)) {
                    formattedEmployeeArr.push({
                        text: item.name,
                        value: item._id
                    })
                }
            }
        }

        if (!projectParticipants || !formattedManagerArr || !formattedEmployeeArr) {
            return []
        }
        projectParticipants = formattedManagerArr.concat(formattedEmployeeArr)
        if (projectParticipants.find(item => String(item.value) === String(projectDetail?.creator?._id))) {
            return projectParticipants;
        }
        projectParticipants.push({
            text: projectDetail?.creator?.name,
            value: projectDetail?.creator?._id
        })
        return projectParticipants;
    }

    // Hàm thay đổi chi phí tài sản
    const handleChangeAssetCost = (event) => {
        let value = event.target.value;
        validateAssetCode(value, true);
    }
    const validateAssetCode = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateNumericInputMandatory(translate, value);

        if (willUpdateState) {
            setCurrentAssetCost(value);
            setError({
                ...error,
                errorOnAssetCode: message,
            });
        }
        return message === undefined;
    }

    // Hàm thay đổi chi phí thoả hiệp tối đa - ngân sách
    const handleChangeBudget = (event) => {
        let value = event.target.value;
        validateBudget(value, true);
    }
    const validateBudget = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateNumericInputMandatory(translate, value);

        if (willUpdateState) {
            setCurrentEstimateMaxCost(value);
            setError({
                ...error,
                errorOnBudget: message,
            });
        }
        return message === undefined;
    }

    // Hàm thay đổi thời gian ước lượng
    const handleChangeNormalTime = (event) => {
        let value = event.target.value;
        validateNormalTime(value, true);
    }
    const validateNormalTime = (value, willUpdateState = true) => {
        let { translate } = props;
        let message = undefined;
        if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/) || isDurationNotSuitable(Number(value))) {
            message = projectDetail?.unitTime === 'days' ? "Không được bỏ trống và chỉ được điền số <= 7 và >= 1/6"
                : "Không được bỏ trống và chỉ được điền số <= 56 và >= 4"
        }
        if (willUpdateState) {
            setCurrentEstimateNormalTime(value);
            setError({
                ...error,
                errorOnNormalTime: message,
            });
        }
        return message === undefined;
    }

    const save = () => {
        const newRowData = {
            code: currentRow?.code,
            name: currentRow?.name,
            preceedingTasks: currentRow?.preceedingTasks,
            estimateNormalTime: currentEstimateNormalTime,
            estimateOptimisticTime: currentRow?.estimateOptimisticTime,
            estimatePessimisticTime: currentRow?.estimatePessimisticTime,
            estimateNormalCost: currentEstimateNormalCost,
            estimateMaxCost: currentEstimateMaxCost,
            currentResponsibleEmployees,
            currentAccountableEmployees,
            currentAssetCost,
            currentHumanCost,
        }
        props.handleSave(newRowData, currentEditRowIndex);
    }

    const isFormValidated = useMemo(() => {
        return !checkIfHasCommonItems(currentAccountableEmployees, currentResponsibleEmployees) && currentAccountableEmployees.length > 0 && currentResponsibleEmployees.length > 0
            && Number(currentEstimateMaxCost.replace(/,/g, '')) >= Number(currentEstimateNormalCost.replace(/,/g, ''))
            && currentEstimateNormalTime.toString().trim().length > 0;
    }, [currentAccountableEmployees, currentResponsibleEmployees, currentEstimateMaxCost, currentEstimateNormalCost, currentEstimateNormalTime])

    // Hàm check xem duration có phù hợp không?
    const isDurationNotSuitable = (estimateNormalTime) => {
        if (projectDetail?.unitTime === 'days') return estimateNormalTime > 7 || estimateNormalTime < 1 / 6
        return estimateNormalTime < 4 || estimateNormalTime > 56
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-row-cpm-excel-${currentRow.code}`} isLoading={false}
                formID={`form-modal-edit-row-cpm-excel`}
                title="Chỉnh sửa dòng công việc"
                func={save}
                disableSubmit={!isFormValidated}
                size={75}
            >
                <div>
                    <div className="description-box" style={{ lineHeight: 1.5 }}>
                        {/* Dong 1 */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Mã công việc</strong>
                                        <div className="col-sm-8">
                                            <span>{currentRow?.code}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Tên công việc</strong>
                                        <div className="col-sm-8">
                                            <span>{currentRow?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dong 2 */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Công việc tiền nhiệm</strong>
                                        <div className="col-sm-8">
                                            <span>{currentRow?.preceedingTasks.join(', ')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className={`form-group  ${error.errorOnNormalTime === undefined ? "" : 'has-error'}`}>
                                        <strong className="col-sm-4">Thời gian ước lượng ({translate(`project.unit.${projectDetail?.unitTime}`)})</strong>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={currentEstimateNormalTime}
                                                onChange={handleChangeNormalTime}
                                            />
                                            <ErrorLabel content={error.errorOnNormalTime} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dong 3 */}
                        <div className="row">
                            {/* Chi phí ước lượng tài sản */}
                            <div className={`col-md-12 form-group ${error.errorOnAssetCode === undefined ? "" : 'has-error'}`}>
                                <label className="control-label">Chi phí ước lượng tài sản<span className="text-red">*</span> (VND)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={currentAssetCost}
                                    onChange={handleChangeAssetCost}
                                    onFocus={() => {
                                        setCurrentAssetCost(currentAssetCost.replace(/,/g, ''))
                                    }}
                                    onBlur={() => {
                                        setCurrentAssetCost(numberWithCommas(currentAssetCost))
                                    }}
                                />
                                <ErrorLabel content={error.errorOnAssetCode} />
                            </div>
                        </div>

                        {/* Dòng các tác nhân trong công việc */}
                        <div className="row">
                            {/* Những người thực hiện công việc */}
                            <div className={`col-md-6 form-group ${error.errorOnResponsibleEmployees === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.responsible')}<span className="text-red">*</span></label>
                                {getProjectParticipants() &&
                                    <SelectBox
                                        id={`responsible-select-box-edit-row-cpm-excel-${currentRowCode}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={getProjectParticipants()}
                                        onChange={handleChangeTaskResponsibleEmployees}
                                        value={currentResponsibleEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_resp') }}
                                    />
                                }
                                <ErrorLabel content={error.errorOnResponsibleEmployees} />
                            </div>

                            {/* Những người quản lý/phê duyệt công việc */}
                            <div className={`col-md-6  form-group ${error.errorOnAccountableEmployees === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.accountable')}<span className="text-red">*</span></label>
                                {getProjectParticipants() &&
                                    <SelectBox
                                        id={`accounatable-select-box-edit-row-cpm-excel-${currentRowCode}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={getProjectParticipants()}
                                        onChange={handleChangeTaskAccountableEmployees}
                                        value={currentAccountableEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_acc') }}
                                    />
                                }
                                <ErrorLabel content={error.errorOnAccountableEmployees} />
                            </div>
                        </div>

                        {/* Chi phí thoả hiệp tối đa (VND) */}
                        <div className="row">
                            <div className="col-md-12 form-group">
                                <label className="control-label">Chi phí thoả hiệp tối đa<span className="text-red">*</span> (VND)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={currentEstimateMaxCost}
                                    onChange={handleChangeBudget}
                                    onFocus={() => {
                                        setCurrentEstimateMaxCost(currentEstimateMaxCost.replace(/,/g, ''))
                                    }}
                                    onBlur={() => {
                                        setCurrentEstimateMaxCost(numberWithCommas(currentEstimateMaxCost))
                                    }}
                                />
                                <ErrorLabel content={error.errorOnBudget} />
                            </div>
                        </div>

                        {/* Dòng chi phí ước lượng */}
                        <div className="row">
                            {/* Chi phí ước lượng nhân sự */}
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group`}>
                                <label className="control-label">Chi phí ước lượng nhân sự <span className="text-red">*</span> (VND)</label>
                                <div className="form-control">
                                    {currentHumanCost}
                                </div>
                            </div>
                            {/* Chi phí ước lượng tổng quan */}
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${Number(currentEstimateNormalCost.replace(/,/g, '')) > Number(currentEstimateMaxCost.replace(/,/g, '')) ? 'has-error' : ''}`}>
                                <label className="control-label">Chi phí ước lượng tổng quan <span className="text-red">*</span> (VND)</label>
                                <div className="form-control">
                                    {currentEstimateNormalCost}
                                </div>
                                <ErrorLabel content={Number(currentEstimateNormalCost.replace(/,/g, '')) > Number(currentEstimateMaxCost.replace(/,/g, '')) && "Ngân sách đang thấp hơn chi phí ước lượng"} />
                            </div>
                        </div>
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
    getTasksByProject: taskManagementActions.getTasksByProject,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalEditRowCPMExcel))
