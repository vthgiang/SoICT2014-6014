import moment from 'moment'
import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components'
import { getStorage } from '../../../../config'
import ValidationHelper from '../../../../helpers/validationHelper'
import { UserActions } from '../../../super-admin/user/redux/actions'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import { checkIfHasCommonItems, getSalaryFromUserId, numberWithCommas } from '../../../task/task-management/component/functionHelpers'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from "../../projects/redux/actions";
import { convertUserIdToUserName, getAmountOfWeekDaysInMonth, getCurrentProjectDetails, getEstimateHumanCostFromParams, getEstimateMemberCost, getNearestIntegerNumber, getProjectParticipants, getProjectParticipantsByArrId } from '../../projects/components/functionHelper';

const ModalEditRowCPMExcel = (props) => {
    const { currentRow, translate, project, currentEditRowIndex, user } = props;
    const [projectData, setProjectData] = useState(props.projectData);
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const projectDetail = projectData ?? getCurrentProjectDetails(project);
    const userId = getStorage("userId");
    const [currentRowCode, setCurrentRowCode] = useState(undefined);
    const [currentRowIndex, setCurrentRowIndex] = useState(undefined);
    const [currentEstimateNormalCost, setCurrentEstimateNormalCost] = useState(numberWithCommas(currentRow?.estimateNormalCost));
    const [currentEstimateMaxCost, setCurrentEstimateMaxCost] = useState(numberWithCommas(currentRow?.estimateMaxCost));
    const [currentEstimateNormalTime, setCurrentEstimateNormalTime] = useState(numberWithCommas(currentRow?.estimateNormalTime));
    const [currentDescription, setCurrentDescription] = useState(currentRow?.description);
    const [currentAssetCost, setCurrentAssetCost] = useState('');
    const [currentHumanCost, setCurrentHumanCost] = useState('');
    const [currentResponsibleEmployees, setCurrentResponsibleEmployees] = useState([]);
    const [currentAccountableEmployees, setCurrentAccountableEmployees] = useState([]);
    const [currentTotalResWeight, setCurrentTotalResWeight] = useState();
    const [currentTotalAccWeight, setCurrentTotalAccWeight] = useState();
    const [currentResWeightArr, setCurrentResWeightArr] = useState([]);
    const [currentAccWeightArr, setCurrentAccWeightArr] = useState([]);
    const [error, setError] = useState({
        errorOnResponsibleEmployees: undefined,
        errorOnAccountableEmployees: undefined,
        errorOnAssetCode: undefined,
        errorOnBudget: undefined,
        errorOnNormalTime: undefined,
        errorOnTotalWeight: undefined,
    })

    useEffect(() => {
        setProjectData(props.projectData)
    }, [JSON.stringify(props.projectData)])

    // Điều kiện để rerender lại modal khi thay đổi id của row
    if (currentRow.code !== currentRowCode) {
        setCurrentRowCode(currentRow.code);
        setCurrentDescription(currentRow.description);
        setCurrentAssetCost(currentRow?.currentAssetCost || '1,000,000');
        setCurrentHumanCost(currentRow?.currentHumanCost || '');
        setCurrentEstimateMaxCost(currentRow?.estimateMaxCost || '');
        setCurrentEstimateNormalTime(currentRow?.estimateNormalTime || '');
        setCurrentResponsibleEmployees(currentRow?.currentResponsibleEmployees || []);
        setCurrentAccountableEmployees(currentRow?.currentAccountableEmployees || []);
        setCurrentTotalResWeight(currentRow?.totalResWeight || 80);
        setCurrentTotalAccWeight(currentRow?.totalAccWeight || (100 - (currentRow?.totalResWeight || 80)));
        setCurrentResWeightArr(currentRow?.currentResWeightArr || currentRow?.currentResponsibleEmployees?.map(resItem => {
            return {
                userId: resItem,
                weight: (Number(currentRow?.currentTotalResWeight) || 80) / currentRow?.currentResponsibleEmployees?.length,
            }
        }));
        setCurrentAccWeightArr(currentRow?.currentAccWeightArr || currentRow?.currentAccountableEmployees?.map(accItem => {
            return {
                userId: accItem,
                weight: (Number(currentRow?.currentTotalAccWeight) || 20) / currentRow?.currentAccountableEmployees?.length,
            }
        }));
    }
    
    if (currentEditRowIndex !== currentRowIndex) {
        setCurrentRowIndex(currentEditRowIndex);
    }

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
            setTimeout(() => {
                setError({
                    ...error,
                    errorOnAccountableEmployees: message,
                })
            }, 10);
        }
        return message === undefined;
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

    // Hàm thay đổi total trọng số của thành viên Thực Hiện
    const handleChangeTotalResWeight = (event) => {
        let value = event.target.value;
        validateTotalResWeight(value, true);
    }
    const validateTotalResWeight = (value, willUpdateState = true) => {
        let message = undefined;
        if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/)) {
            message = "Không được bỏ trống và chỉ được điền số";
        }
        else if (Number(currentTotalAccWeight) + Number(value) !== 100) {
            message = "Trọng số Thực hiện + Trọng số Phê duyệt phải bằng 100";
        }
        if (willUpdateState) {
            setCurrentTotalResWeight(value);
            setTimeout(() => {
                setError({
                    ...error,
                    errorOnTotalWeight: message,
                });
            }, 10);
        }
        return message === undefined;
    }

    // Hàm thay đổi total trọng số của thành viên Phê Duyệt
    const handleChangeTotalAccWeight = (event) => {
        let value = event.target.value;
        validateTotalAccWeight(value, true);
    }
    const validateTotalAccWeight = (value, willUpdateState = true) => {
        let message = undefined;
        if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/)) {
            message = "Không được bỏ trống và chỉ được điền số";
        }
        else if (Number(currentTotalResWeight) + Number(value) !== 100) {
            message = "Trọng số Thực hiện + Trọng số Phê duyệt phải bằng 100";
        }
        if (willUpdateState) {
            setCurrentTotalAccWeight(value);
            setTimeout(() => {
                setError({
                    ...error,
                    errorOnTotalWeight: message,
                });
            }, 10);
        }
        return message === undefined;
    }

    const save = () => {
        console.log('currentResWeightArr', currentResWeightArr, 'currentAccWeightArr', currentAccWeightArr)
        const newRowData = {
            code: currentRow?.code,
            name: currentRow?.name,
            preceedingTasks: currentRow?.preceedingTasks,
            estimateNormalTime: currentEstimateNormalTime,
            estimateOptimisticTime: currentRow?.estimateOptimisticTime,
            estimateNormalCost: currentEstimateNormalCost,
            estimateMaxCost: currentEstimateMaxCost,
            description: currentDescription,
            currentResponsibleEmployees,
            currentAccountableEmployees,
            currentAssetCost,
            currentHumanCost,
            currentResWeightArr,
            currentAccWeightArr,
            totalResWeight: currentTotalResWeight,
            totalAccWeight: currentTotalAccWeight,
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

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "user_all", userId });
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    useEffect(() => {
        let result = 0;
        console.log(266, projectData);
        const projectDetail = projectData ?? getCurrentProjectDetails(project);

        setCurrentResWeightArr(currentResponsibleEmployees.map((resItem, resIndex) => {
            return {
                userId: resItem,
                weight: Number(currentTotalResWeight) / currentResponsibleEmployees.length,
            }
        }))
        setCurrentAccWeightArr(currentAccountableEmployees.map((accItem, accIndex) => {
            return {
                userId: accItem,
                weight: Number(currentTotalAccWeight) / currentAccountableEmployees.length,
            }
        }))

        result += getEstimateHumanCostFromParams(
            projectDetail,
            currentEstimateNormalTime,
            currentResponsibleEmployees,
            currentAccountableEmployees,
            projectDetail?.unitTime,
            currentResponsibleEmployees.map((resItem, resIndex) => {
                return {
                    userId: resItem,
                    weight: Number(currentTotalResWeight) / currentResponsibleEmployees.length,
                }
            }),
            currentAccountableEmployees.map((accItem, accIndex) => {
                return {
                    userId: accItem,
                    weight: Number(currentTotalAccWeight) / currentAccountableEmployees.length,
                }
            }),
        );

        setCurrentHumanCost(numberWithCommas(result));
        result += Number(currentAssetCost.replace(/,/g, ''));
        setCurrentEstimateNormalCost(numberWithCommas(result));
        setCurrentEstimateMaxCost(numberWithCommas(getNearestIntegerNumber(result)));

        let messageNormalTime;
        if (currentEstimateNormalTime.toString()?.length === 0
            || currentEstimateNormalTime.toString()?.match(/.*[a-zA-Z]+.*/)
            || isDurationNotSuitable(Number(currentEstimateNormalTime))) {
            messageNormalTime = projectDetail?.unitTime === 'days'
                ? "Không được bỏ trống và chỉ được điền số <= 7 và >= 1/6"
                : "Không được bỏ trống và chỉ được điền số <= 56 và >= 4"
        }
        setError({
            ...error,
            errorOnNormalTime: messageNormalTime,
        })
    }, [currentResponsibleEmployees, currentAccountableEmployees, currentAssetCost, currentEstimateNormalTime,
        currentTotalResWeight, currentTotalAccWeight, projectData])

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-row-cpm-excel-${currentRow.code}`} isLoading={false}
                formID={`form-modal-edit-row-cpm-excel`}
                title="Chỉnh sửa dòng công việc"
                func={save}
                disableSubmit={!isFormValidated}
                size={100}
            >
                <div className="row">
                    {/* Thông tin công việc */}
                    <div className="col-xs-12 col-ms-6 col-md-6">
                        <fieldset className="scheduler-border" style={{ lineHeight: 1.5 }}>
                            <legend className="scheduler-border">Thông tin công việc</legend>
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
                                    {getProjectParticipants(projectDetail) &&
                                        <SelectBox
                                            id={`responsible-select-box-edit-row-cpm-excel-${currentRowCode}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={projectData ? getProjectParticipantsByArrId(projectDetail, listUsers) : getProjectParticipants(projectDetail)}
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
                                    {getProjectParticipants(projectDetail) &&
                                        <SelectBox
                                            id={`accounatable-select-box-edit-row-cpm-excel-${currentRowCode}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={projectData ? getProjectParticipantsByArrId(projectDetail, listUsers) : getProjectParticipants(projectDetail)}
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

                            {/* Chỉnh sửa mô tả công việc */}
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label className="control-label">Mô tả công việc</label>
                                    <textarea type="text" rows={3} style={{ minHeight: '103.5px' }}
                                        name={`task_description`}
                                        onChange={(e) => setCurrentDescription(e.target?.value)}
                                        value={currentDescription}
                                        className="form-control"
                                        placeholder="Mô tả công việc"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {/* Trọng số thành viên công việc */}
                    <div className="col-xs-12 col-ms-6 col-md-6">
                        <fieldset className="scheduler-border" style={{ lineHeight: 1.5 }}>
                            <legend className="scheduler-border">Trọng số thành viên công việc</legend>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <h4 style={{ width: '50%' }}><strong>Thành viên thực hiện (%)</strong></h4>
                                <div className={`col-md-12 ${error.errorOnTotalWeight === undefined ? "" : "has-error"}`}
                                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        onChange={handleChangeTotalResWeight}
                                        value={`${currentTotalResWeight}`}
                                        style={{ width: '20%' }}
                                    />
                                    <ErrorLabel content={error.errorOnTotalWeight} />
                                </div>
                            </div>
                            <table id="res-emp-weight-table" className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Họ và tên</th>
                                        <th>Trọng số (%)</th>
                                        <th>Lương tháng (VND)</th>
                                        <th>Ước lượng chi phí thành viên (VND)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(currentResponsibleEmployees && currentResponsibleEmployees.length !== 0 && currentResWeightArr && currentResWeightArr.length !== 0) &&
                                        currentResponsibleEmployees.map((resItem, resIndex) => (
                                            <tr key={resIndex}>
                                                <td>{convertUserIdToUserName(listUsers, resItem)}</td>
                                                <td>{currentResWeightArr?.[resIndex]?.weight}</td>
                                                <td>{numberWithCommas(getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, resItem))}</td>
                                                <td>{
                                                    numberWithCommas(getEstimateMemberCost(
                                                        projectDetail,
                                                        resItem,
                                                        Number(currentEstimateNormalTime),
                                                        projectDetail?.unitTime,
                                                        Number(currentResWeightArr?.[resIndex]?.weight)))
                                                }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <h4 style={{ width: '50%' }}><strong>Thành viên phê duyệt (%)</strong></h4>
                                <div className={`col-md-12 ${error.errorOnTotalWeight === undefined ? "" : "has-error"}`}
                                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        onChange={handleChangeTotalAccWeight}
                                        value={`${currentTotalAccWeight}`}
                                        style={{ width: '20%' }}
                                    />
                                    <ErrorLabel content={error.errorOnTotalWeight} />
                                </div>
                            </div>
                            <table id="res-emp-weight-table" className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Họ và tên</th>
                                        <th>Trọng số (%)</th>
                                        <th>Lương tháng (VND)</th>
                                        <th>Ước lượng chi phí thành viên (VND)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(currentAccountableEmployees && currentAccountableEmployees.length !== 0) &&
                                        currentAccountableEmployees.map((accItem, accIndex) => (
                                            <tr key={accIndex}>
                                                <td>{convertUserIdToUserName(listUsers, accItem)}</td>
                                                <td>{currentAccWeightArr?.[accIndex]?.weight}</td>
                                                <td>{numberWithCommas(getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accItem))}</td>
                                                <td>{
                                                    numberWithCommas(getEstimateMemberCost(
                                                        projectDetail,
                                                        accItem,
                                                        Number(currentEstimateNormalTime),
                                                        projectDetail?.unitTime,
                                                        Number(currentAccWeightArr?.[accIndex]?.weight)))
                                                }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalEditRowCPMExcel))
