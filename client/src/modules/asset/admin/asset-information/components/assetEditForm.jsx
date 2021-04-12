import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

import { DialogModal, Scheduler } from '../../../../../common-components';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import {
    GeneralTab, MaintainanceLogTab, UsageLogTab, DepreciationTab, IncidentLogTab, DisposalTab, FileTab
} from '../../../base/create-tab/components/combinedContent';

import { AssetManagerActions } from '../redux/actions';
import { UseRequestActions } from '../../use-request/redux/actions';

function AssetEditForm(props) {
    const [state, setState] = useState({
        employeeId: props.employeeId ? props.employeeId : ''
    })
    const [prevProps, setPrevProps] = useState({
        _id : null
    })

    const { translate, assetsManager } = props;
    const { _id, img, code, assetName, serial, assetType, group, purchaseDate, warrantyExpirationDate, managedBy, assignedToUser, assignedToOrganizationalUnit, handoverFromDate,
    handoverToDate, location, description, status, typeRegisterForUse, detailInfo, usageLogs, maintainanceLogs, cost, residualValue, startDepreciation,
    usefulLife, depreciationType, incidentLogs, disposalDate, disposalType, unitsProducedDuringTheYears, disposalCost, disposalDesc, archivedRecordNumber,
    files, estimatedTotalProduction, readByRoles } = state;

    // Function upload avatar
    const handleUpload = (img, avatar) => {
        setState({
            ...state,
            img: img,
            avatar: avatar
        })
    }

    // Function lưu các trường thông tin vào state
    const handleChange = (name, value) => {
        if (name === 'purchaseDate' || name === 'warrantyExpirationDate' || name === 'handoverFromDate' ||
            name === 'handoverToDate' || name === 'startDepreciation' || name === 'disposalDate') { //
            if (value) {
                var partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            } else {
                value = null
            }
        }
        if (name === "assetType") {
            value = JSON.stringify(value);
        }

        setState({
            ...state,
            [name]: value
        });
    }

    // Function thêm sửa chữa, thay thế, nâng cấp
    const handleCreateMaintainanceLogs = (data, addData) => {
        setState({
            ...state,
            maintainanceLogs: data
        })
    }

    // Function chỉnh sửa sửa chữa, thay thế, nâng cấp
    const handleEditMaintainanceLogs = (data, editData) => {
        if (editData._id) {
            setState({
                ...state,
                editMaintainanceLogs: [...state.editMaintainanceLogs, editData]
            })
        } else {
            setState({
                ...state,
                maintainanceLogs: data
            })
        }
    }

    // Function xoá sửa chữa, thay thế, nâng cấp
    const handleDeleteMaintainanceLogs = (data, deleteData) => {
        if (deleteData._id) {
            setState({
                ...state,
                deleteMaintainanceLogs: [...state.deleteMaintainanceLogs, deleteData],
                editMaintainanceLogs: state.editMaintainanceLogs.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                maintainanceLogs: data
            })
        }
    }

    // Function thêm thông tin cấp phát, điều chuyển, thu hồi
    const handleCreateUsageLogs = async (data, addData) => {
        await setState({
            ...state,
            usageLogs: data.usageLogs,
            assignedToUser: data.assignedToUser,
            assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
            status: "in_use"
        })

    }

    // Function chỉnh sửa thông tin cấp phát, điều chuyển, thu hồi
    const handleEditUsageLogs = (data, editData) => {
        if (editData && editData._id) {
            setState({
                ...state,
                editUsageLogs: [...state.editUsageLogs, editData]
            })
        } else {
            setState({
                ...state,
                usageLogs: data.usageLogs,
                assignedToUser: data.assignedToUser,
                assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
            })
        }
    }

    const handleRecallAsset = async (data) => {
        await setState({
            ...state,
            assignedToUser: data.assignedToUser,
            assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
            status: data.status
        })
    }

    // Function xoá thông tin cấp phát, điều chuyển, thu hồi
    const handleDeleteUsageLogs = (data, deleteData) => {
        if (deleteData._id) {
            setState({
                ...state,
                deleteUsageLogs: [...state.deleteUsageLogs, deleteData],
                editUsageLogs: state.editUsageLogs.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                usageLogs: data
            })
        }
    }

    // Function thêm thông tin sự cố tài sản
    const handleCreateIncidentLogs = (data, addData) => {
        setState({
            ...state,
            incidentLogs: data
        })
    }

    // Function chỉnh sửa thông tin sự cố tài sản
    const handleEditIncidentLogs = (data, editData) => {
        if (editData._id) {
            setState({
                ...state,
                editIncidentLogs: [...state.editIncidentLogs, editData]
            })
        } else {
            setState({
                ...state,
                incidentLogs: data
            })
        }
    }

    // Function xoá thông tin sự cố tài sản
    const handleDeleteIncidentLogs = (data, deleteData) => {
        if (deleteData._id) {
            setState({
                ...state,
                deleteIncidentLogs: [...state.deleteIncidentLogs, deleteData],
                editIncidentLogs: state.editIncidentLogs.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                incidentLogs: data
            })
        }
    }

    // Function thêm thông tin tài liệu đính kèm
    const handleCreateFile = (data) => {
        console.log(data)
        setState({
            ...state,
            files: data
        })
    }

    // Function chỉnh sửa thông tin tài liệu đính kèm
    const handleEditFile = (data, editData) => {
        if (editData._id) {
            setState({
                ...state,
                editFiles: [...state.editFiles, editData]
            })
        } else {
            setState({
                ...state,
                files: data
            })
        }
    }

    // Function xoá thông tin tài liệu đính kèm
    const handleDeleteFile = (data, deleteData) => {
        if (deleteData._id) {
            setState({
                ...state,
                deleteFiles: [...state.deleteFiles, deleteData],
                editFiles: state.editFiles.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                files: data
            })
        }
    }

    // TODO: function
    const handleChangeCourse = (data) => {
        const { assetNew } = state;
        setState({
            ...state,
            assetNew: {
                ...state,
                ...assetNew
            }
        })
    }

    // function kiểm tra các trường bắt buộc phải nhập
    const validatorInput = (value) => {
        if (value !== undefined && value !== null && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        let { code, assetName, assetType, purchaseDate, status, typeRegisterForUse, depreciationType, estimatedTotalProduction } = state;

        if (state !== {}) {
            let unitProductionValidate = true;
            if (depreciationType === "units_of_production") {
                unitProductionValidate = validatorInput(estimatedTotalProduction);
            }

            let result = validatorInput(code) && validatorInput(assetName) &&
                validatorInput(assetType) &&
                validatorInput(status) &&
                validatorInput(typeRegisterForUse) &&
                unitProductionValidate;
            return result;
        }

        return true;
    }

    const save = async () => {
        let { avatar, maintainanceLogs, usageLogs, incidentLogs, files, assignedToUser,
            assignedToOrganizationalUnit, handoverFromDate, handoverToDate, employeeId, page } = state;

        const createMaintainanceLogs = maintainanceLogs.filter(x => !x._id);
        const createUsageLogs = usageLogs.filter(x => !x._id);
        const createIncidentLogs = incidentLogs.filter(x => !x._id);
        const createFiles = files.filter(x => !x._id);

        const data = {
            ...state,
            createMaintainanceLogs,
            createUsageLogs,
            createIncidentLogs,
            createFiles
        }

        console.log(data)
        let formData = convertJsonObjectToFormData(data);
        files.forEach(x => {
            x.files.forEach(item => {
                formData.append("file", item.fileUpload);
            })
        })
        formData.append("fileAvatar", avatar);

        props.updateInformationAsset(data._id, formData);

        // Thêm vào thông tin sử dụng
        if (assignedToUser !== props.assignedToUser || assignedToOrganizationalUnit !== props.assignedToOrganizationalUnit || handoverFromDate !== props.handoverFromDate || handoverToDate !== props.handoverToDate) {
            props.createUsage(data._id, {
                usageLogs: {
                    usedByUser: data.assignedToUser,
                    startDate: data.handoverFromDate,
                    endDate: data.handoverToDate,
                    description: '',
                },
                assignedToUser: data.assignedToUser,
                assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
                status: "in_use",
            });
        }

        setState({
            ...data,
        })
    }

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
        if (!date) return null;
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    const addMonth = (date, month) => {
        if (!date) return null;
        date = new Date(date);
        let newDate = new Date(date.setMonth(date.getMonth() + month));

        return formatDate(newDate);
    };

    if(prevProps._id !== props._id){
        setState({
            ...state,
            _id: props._id,
            img: props.avatar ? `.${props.avatar}` : null,
            avatar: "",
            code: props.code,
            assetName: props.assetName,
            serial: props.serial,
            assetType: props.assetType && JSON.parse(props.assetType).map(o => o._id||o),
            group: props.group,
            purchaseDate: props.purchaseDate,
            warrantyExpirationDate: props.warrantyExpirationDate,
            managedBy: props.managedBy,
            assignedToUser: props.assignedToUser,
            assignedToOrganizationalUnit: props.assignedToOrganizationalUnit,
            handoverFromDate: props.handoverFromDate,
            handoverToDate: props.handoverToDate,
            location: props.location,
            description: props.description,
            status: props.status,
            typeRegisterForUse: props.typeRegisterForUse,
            detailInfo: props.detailInfo,
            readByRoles: props.readByRoles,
            // Khấu hao
            cost: props.cost,
            residualValue: props.residualValue,
            usefulLife: props.usefulLife,
            startDepreciation: props.startDepreciation,
            depreciationType: props.depreciationType,
            estimatedTotalProduction: props.estimatedTotalProduction,
            unitsProducedDuringTheYears: props.unitsProducedDuringTheYears,
            // Thanh lý
            disposalDate: props.disposalDate,
            disposalType: props.disposalType,
            disposalCost: props.disposalCost,
            disposalDesc: props.disposalDesc,
            // Bảo trì
            maintainanceLogs: props.maintainanceLogs,
            // Sử dụng
            usageLogs: props.usageLogs,
            // Sự cố
            incidentLogs: props.incidentLogs,
            // Tài liệu tham khảo
            archivedRecordNumber: props.archivedRecordNumber,
            files: props.files,

            editUsageLogs: [],
            deleteUsageLogs: [],
            editMaintainanceLogs: [],
            deleteMaintainanceLogs: [],
            editIncidentLogs: [],
            deleteIncidentLogs: [],
            editFiles: [],
            deleteFiles: [],
            page: props.page,

            errorOnCode: undefined,
            errorOnAssetName: undefined,
            errorOnSerial: undefined,
            errorOnAssetType: undefined,
            errorOnLocation: undefined,
            errorOnPurchaseDate: undefined,
            errorOnWarrantyExpirationDate: undefined,
            errorOnManagedBy: undefined,
            errorOnAssignedToUser: undefined,
            errorOnAssignedToOrganizationalUnit: undefined,
            errorOnNameField: undefined,
            errorOnValue: undefined,
        })
        setPrevProps(props)
    }
    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID="modal-edit-asset" isLoading={assetsManager.isLoading}
                formID="form-edit-asset"
                title={translate('asset.general_information.edit_info')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Nav-tabs */}
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    <ul className="nav nav-tabs" id = "nav-tabs">
                        <li className="active"><a title={translate('asset.general_information.general_information')} data-toggle="tab" href={`#edit_general${_id}`}>{translate('asset.general_information.general_information')}</a></li>
                        <li><a title={translate('asset.general_information.depreciation_information')} data-toggle="tab" href={`#edit_depreciation${_id}`}>{translate('asset.general_information.depreciation_information')}</a></li>
                        <li><a title={translate('asset.general_information.usage_information')} data-toggle="tab" href={`#edit_usage${_id}`} onClick={() => { Scheduler.triggerOnActiveEvent(".asset-usage-scheduler") }}>{translate('asset.general_information.usage_information')}</a></li>
                        <li><a title={translate('asset.general_information.incident_information')} data-toggle="tab" href={`#edit_incident${_id}`}>{translate('asset.general_information.incident_information')}</a></li>
                        <li><a title={translate('asset.general_information.maintainance_information')} data-toggle="tab" href={`#edit_maintainance${_id}`}>{translate('asset.general_information.maintainance_information')}</a></li>
                        <li><a title={translate('asset.general_information.disposal_information')} data-toggle="tab" href={`#edit_disposal${_id}`}>{translate('asset.general_information.disposal_information')}</a></li>
                        <li><a title={translate('asset.general_information.attach_infomation')} data-toggle="tab" href={`#edit_attachments${_id}`}>{translate('asset.general_information.attach_infomation')}</a></li>
                    </ul>

                    < div className="tab-content">
                        {/* Thông tin chung */}
                        <GeneralTab
                            id={`edit_general${_id}`}
                            img={img}
                            handleChange={handleChange}
                            handleUpload={handleUpload}
                            // avatar={avatar}
                            code={code}
                            assetName={assetName}
                            serial={serial}
                            assetTypeEdit={assetType}
                            group={group}
                            purchaseDate={purchaseDate}
                            warrantyExpirationDate={warrantyExpirationDate}
                            managedBy={managedBy}
                            assignedToUser={assignedToUser}
                            assignedToOrganizationalUnit={assignedToOrganizationalUnit}
                            handoverFromDate={handoverFromDate}
                            handoverToDate={handoverToDate}
                            location={location}
                            description={description}
                            status={status}
                            typeRegisterForUse={typeRegisterForUse}
                            detailInfo={detailInfo}
                            usageLogs={usageLogs}
                            readByRoles={readByRoles}
                        />

                        {/* Thông tin khấu hao */}
                        <DepreciationTab
                            id={`edit_depreciation${_id}`}
                            handleChange={handleChange}
                            cost={cost}
                            residualValue={residualValue}
                            startDepreciation={startDepreciation && moment(startDepreciation).format('DD-MM-YYYY')}
                            endDepreciation={addMonth(startDepreciation, usefulLife)}
                            usefulLife={usefulLife}
                            depreciationType={depreciationType}
                            estimatedTotalProduction={estimatedTotalProduction}
                            unitsProducedDuringTheYears={unitsProducedDuringTheYears}
                        />

                        {/* Thông tin sử dụng */}
                        <UsageLogTab
                            id={`edit_usage${_id}`}
                            assetId={_id}
                            assignedToUser={assignedToUser}
                            assignedToOrganizationalUnit={assignedToOrganizationalUnit}
                            usageLogs={usageLogs}
                            typeRegisterForUse={typeRegisterForUse}
                            managedBy={managedBy}
                            handleAddUsage={handleCreateUsageLogs}
                            handleEditUsage={handleEditUsageLogs}
                            handleDeleteUsage={handleDeleteUsageLogs}
                            handleRecallAsset={handleRecallAsset}
                            linkPage={props.linkPage}
                        />

                        {/* Thông tin sự cố */}
                        <IncidentLogTab
                            id={`edit_incident${_id}`}
                            assetId={_id}
                            incidentLogs={incidentLogs}
                            handleAddIncident={handleCreateIncidentLogs}
                            handleEditIncident={handleEditIncidentLogs}
                            handleDeleteIncident={handleDeleteIncidentLogs}
                        />

                        {/* Thông tin bảo trì */}
                        <MaintainanceLogTab
                            id={`edit_maintainance${_id}`}
                            maintainanceLogs={maintainanceLogs}
                            handleAddMaintainance={handleCreateMaintainanceLogs}
                            handleEditMaintainance={handleEditMaintainanceLogs}
                            handleDeleteMaintainance={handleDeleteMaintainanceLogs}
                        />

                        {/* Thông tin thanh lý */}
                        <DisposalTab
                            id={`edit_disposal${_id}`}
                            handleChange={handleChange}
                            disposalDate={disposalDate}
                            disposalType={disposalType}
                            disposalCost={disposalCost}
                            disposalDesc={disposalDesc}
                        />

                        {/* Tài liệu đính kèm */}
                        <FileTab
                            id={`edit_attachments${_id}`}
                            handleChange={handleChange}
                            handleAddFile={handleCreateFile}
                            handleEditFile={handleEditFile}
                            handleDeleteFile={handleDeleteFile}
                            archivedRecordNumber={archivedRecordNumber}
                            files={files}
                        />
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
};

function mapState(state) {
    const { assetsInfo, assetsManager } = state;
    return { assetsInfo, assetsManager };
};

const actionCreators = {
    updateInformationAsset: AssetManagerActions.updateInformationAsset,
    createUsage: UseRequestActions.createUsage,
};
const editForm = connect(mapState, actionCreators)(withTranslate(AssetEditForm));
export { editForm as AssetEditForm };
