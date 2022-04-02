import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../common-components";
import { convertJsonObjectToFormData } from "../../../../../helpers/jsonObjectToFormDataObjectConverter";
import { FileTab } from "../../../base/create-tab/components/fileTab";
import { GeneralLotEditTab } from "../../../base/create-tab/components/generalLotEditTab";
import { AssetLotManagerActions } from "../redux/actions";
import _isEqual from 'lodash/isEqual';

function AssetLotEditForm(props) {
    const [state, setState] = useState({
        employeeId: props.employeeId ? props.employeeId : '',
        deleteAssetInLot: [],
    })
    const [prevProps, setPrevProps] = useState({
        _id: null
    })
    const { listAssets } = useSelector(state => state.assetLotManager)
    const { translate, assetsManager, assetLotManager } = props;
    const { _id, img, avatar, code, assetLotName, assetType, group, total, price, supplier,
        archivedRecordNumber,
        files, deleteAssetInLot} = state;

    // Function upload avatar
    const handleUpload = (img, avatar) => {
        setState({
            ...state,
            img: img,
            avatar: avatar
        })
    }

    /**
     * Function xóa 1 tài sản trong lô
     */
    const handleDeleteAsset = (id) => {
        deleteAssetInLot.push(id);
        setState({
            ...state,
            deleteAssetInLot: deleteAssetInLot
        });
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


    // Function thêm thông tin tài liệu đính kèm
    const handleCreateFile = (data) => {
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


    // function kiểm tra các trường bắt buộc phải nhập
    const validatorInput = (value) => {
        if (value !== undefined && value !== null && value.toString().trim() !== '' && value.length > 0) {
            return true;
        }
        return false;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        let { code, assetLotName, assetType, } = state;
        if (state !== {}) {
            let result = validatorInput(code) && validatorInput(assetLotName) &&
                validatorInput(assetType);
            return result;
        }

        return true;
    }

    const save = async () => {
        let { avatar, files, } = state;
        const createFiles = files.filter(x => !x._id);

        const data = {
            ...state,
            createFiles,
            listAssets,
        }
        let formData = convertJsonObjectToFormData(data);
        files.forEach(x => {
            x.files.forEach(item => {
                formData.append("file", item.fileUpload);
            })
        })
        formData.append("fileAvatar", avatar);
       props.updateAssetLot(data._id, formData);
    }

    if (prevProps._id !== props._id || (!_isEqual(prevProps.files, props.files))) {
        setState({
            ...state,
            _id: props._id,
            img: props.avatar ? `.${props.avatar}` : null,
            avatar: "",
            code: props.code,
            assetLotName: props.assetLotName,
            serial: props.serial,
            group: props.group,
            total: props.total,
            price: props.price,
            supplier: props.supplier,
            assetType: props.assetType,
            // Tài liệu tham khảo
            archivedRecordNumber: props.archivedRecordNumber,
            files: props.files,

            editFiles: [],
            deleteFiles: [],
            page: props.page,

            errorOnCode: undefined,
            errorOnAssetLotName: undefined,
            errorOnAssetType: undefined,
        })
        setPrevProps(props);
    }

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID="modal-edit-asset-lot" isLoading={assetLotManager.isLoading}
                formID="form-edit-asset-lot"
                title={translate('asset.asset_lot.edit_info')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Nav-tabs */}
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    <ul className="nav nav-tabs" id="nav-tabs">
                        <li className="active"><a title={translate('asset.general_information.general_information')} data-toggle="tab" href={`#edit_general${_id}`}>{translate('asset.general_information.general_information')}</a></li>
                        <li><a title={translate('asset.general_information.attach_infomation')} data-toggle="tab" href={`#edit_attachments${_id}`}>{translate('asset.general_information.attach_infomation')}</a></li>
                    </ul>

                    < div className="tab-content">
                        {/* Thông tin chung */}
                        <GeneralLotEditTab
                            id={`edit_general${_id}`}
                            img={img}
                            handleChange={handleChange}
                            handleUpload={handleUpload}
                            handleDeleteAsset={handleDeleteAsset}
                            avatar={avatar}
                            code={code}
                            assetLotName={assetLotName}
                            assetTypeEdit={assetType}
                            group={group}
                            total={total}
                            price={price}
                            supplier={supplier}
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
    );
};

function mapState(state) {
    const { assetsInfo, assetsManager, assetLotManager } = state;
    return { assetsInfo, assetsManager, assetLotManager };
};

const actionCreators = {
    updateAssetLot: AssetLotManagerActions.updateAssetLot,
};
const editForm = connect(mapState, actionCreators)(withTranslate(AssetLotEditForm));
export { editForm as AssetLotEditForm };