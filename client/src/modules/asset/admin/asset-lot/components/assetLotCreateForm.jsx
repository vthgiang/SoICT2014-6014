import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../common-components";
import { convertJsonObjectToFormData } from "../../../../../helpers/jsonObjectToFormDataObjectConverter";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { AssetLotManagerActions } from "../redux/actions";
import {
    GeneralTab, UsageLogTab, MaintainanceLogTab, DepreciationTab, IncidentLogTab, DisposalTab, FileTab
} from '../../../base/create-tab/components/combinedContent';
import { GeneralLotTab } from "../../../base/create-tab/components/generalLotTab";

function AssetLotCreateForm(props) {
    const [state, setState] = useState({
        assetLot: {
            code: "",
            assetName: "",
            assetType: "",
            //group: null,
            total: 0,
            price: 0,
            supplier: "",
            purchaseDate: null,
            warrantyExpirationDate: null,

            status: "",
            typeRegisterForUse: "",
            // managedBy: null,
            // readByRoles: null,

            //khấu hao của các tài sản trong lô là giống nhau
            cost: null,
            usefulLife: null,
            residualValue: null,
            startDepreciation: null,
            depreciationType: null,
        },
        avatar: "",
        listAssets: [],
        files: [],
    });

    const { translate, assetLotManager } = props;
    const { assetLot, files, avatar, listAssets } = state;

    useEffect(() => {
        props.getAllUsers();
    }, [])

    // Function format dữ liệu Date thành string
    const formatDate2 = (date, monthYear = false) => {
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
            return [year, month].join('-');
        } else {
            return [year, month, day].join('-');
        }
    }

    // Function upload avatar 
    const handleUpload = (img, avatar) => {
        setState({
            ...state,
            img: img,
            avatar: avatar,
            listAssets: listAssets,
        });
    }

    //lưu các trường thông tin chung của lô tài sản vào state
    const handleChange = (name, value) => {
        const { assetLot } = state;
        if (name === 'purchaseDate' || name === 'warrantyExpirationDate' ||
            name === 'startDepreciation' || name === 'disposalDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            } else {
                value = null
            }
        }

        assetLot[name] = value;
        setState({
            ...state,
            assetLot: assetLot
        });
    }

    //thêm trạng thái chung cho các tài sản
    const handleStatusChange = (value) => {
        let { listAssets, assetLot } = state;
        if (listAssets && listAssets.length > 0) {
            listAssets = listAssets.map(item => {
                return {
                    ...item,
                    status: value
                }
            });
        }

        assetLot.status = value;
        setState({
            ...state,
            assetLot: assetLot,
            listAssets: listAssets
        });
    }

    //thêm trạng thái chung cho các tài sản
    const handleTypeRegisterChange = (value) => {
        //console.log("hang typeRegister",value);
        let { listAssets, assetLot } = state;
        if (listAssets && listAssets.length > 0) {
            listAssets = listAssets.map(item => {
                return {
                    ...item,
                    typeRegisterForUse: value
                }
            });
        }
        assetLot.typeRegisterForUse = value;

        setState({
            ...state,
            assetLot: assetLot,
            listAssets: listAssets
        });
    }

    //thêm người quản lý cho các tài sản
    const handleManageByChange = (value) => {
        // console.log("hang manageBy",value);
        let { listAssets, assetLot } = state;
        if (value === "" || value.length === 0) {
            value = null;
        }
        if (listAssets && listAssets.length > 0) {
            listAssets = listAssets.map(item => {
                return {
                    ...item,
                    managedBy: value ? value : undefined
                }
            });
        }
        assetLot.managedBy = value ? value : undefined;

        setState({
            ...state,
            assetLot: assetLot,
            listAssets: listAssets
        });
    }

    //thêm quyền xem cho các tài sản
    const handleReadByRolesChange = (value) => {
        //console.log("hang typeRegister",value);
        if (value === "" || value.length === 0) {
            value = null;
        }
        let { listAssets, assetLot } = state;
        if (listAssets && listAssets.length > 0) {
            listAssets = listAssets.map(item => {
                return {
                    ...item,
                    readByRoles: value ? value : undefined
                }
            });
        }
        assetLot.readByRoles = value ? value : undefined;

        setState({
            ...state,
            assetLot: assetLot,
            listAssets: listAssets
        });
    }

    //Thêm, chỉnh sửa thông tin bảo trì
    const handleChangeMaintainanceLog = (assetCode, addData) => {
        let { listAssets } = state;
        listAssets.find(asset => asset.code === assetCode).maintainanceLogs.push(addData);
        setState({
            ...state,
            listAssets: listAssets
        })
    }

    //Thêm, chỉnh sửa thông tin cấp phát, điều chuyển, thu hồi
    const handleChangeUsageLog = (assetCode, addData) => {
        let { listAssets } = state;
        listAssets.find(asset => asset.code === assetCode).usageLogs.push(addData);
        setState({
            ...state,
            listAssets: listAssets
        });
    }

    // Function thêm, chỉnh sửa thông tin sự cố thiết bị
    const handleChangeIncidentLog = (assetCode, addData) => {
        let { listAssets } = state;
        listAssets.find(asset => asset.code === assetCode).incidentLogs.push(addData);
        setState({
            ...state,
            listAssets: listAssets
        });
    }

    // Function thêm thông tin tài liệu đính kèm
    const handleChangeFile = (data, addData) => {
        const { files } = state
        files.push(addData)
        setState({
            ...state,
            files: files
        })
    }

    // function kiểm tra các trường bắt buộc phải nhập
    const validatorInput = (value) => {
        if (value && value.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    //function cập nhật danh sách tài sản cho lô
    const handleGenAssetCode = (startNumber, step, data, gen) => {
        //console.log("hang qlcv listasset:", data);
        let {listAssets} = state;
        const {assetLot} = state;
        let total = assetLot.total;
        if(gen){
            if (listAssets) {
                var number;
                if (total >= listAssets.length) {
                    listAssets = listAssets.map((item, index) => {
                        number = parseInt(startNumber) + step * index;
                        return {
                            ...item,
                            code: assetLot.code + number
                        }
                    });
                    let add = total - listAssets.length;
                    for (let i = 0; i < add; i++) {
                        number = parseInt(startNumber) + step * i;
                        listAssets.push({
                            code: assetLot.code + number,
                            status: assetLot.status,
                            typeRegisterForUse: assetLot.typeRegisterForUse,
                            managedBy: assetLot.managedBy,
                            readByRoles: assetLot.readByRoles
                        });
                    }
                    //listAssets = listAssets;
                } else {
                    listAssets = listAssets.splice(0, total).map((item, index) => {
                        number = parseInt(startNumber) + step * index;
                        return {
                            ...item,
                            status: assetLot.status,
                            typeRegisterForUse: assetLot.typeRegisterForUse,
                            managedBy: assetLot.managedBy,
                            readByRoles: assetLot.readByRoles,
                            code: assetLot.code + number
                        }
                    });
                }
            } else {
                for (let i = 0; i < total; i++) {
                    var number = parseInt(startNumber) + step * i;
                    listAssets.push({
                        code: assetLot.code + number,
                        status: assetLot.status,
                        typeRegisterForUse: assetLot.typeRegisterForUse,
                        managedBy: assetLot.managedBy,
                        readByRoles: assetLot.readByRoles,
                    });
                }
    
            }
            setState({
                ...state,
                listAssets: listAssets
            });
        } else {
            setState({
                ...state,
                listAssets: data
            });
        }
    }

    //function thêm các thông tin chung của tài sản trong lô tài sản
    const handleChangeGeneral = (assetCode, addData) => {
        const { listAssets } = state;
        listAssets.find(asset => asset.code === assetCode).incidentLogs.push(addData);
        setState({
            ...state,
            listAssets: listAssets
        });
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        let { assetLot } = state;

        let result =
            validatorInput(assetLot.code) &&
            validatorInput(assetLot.assetName) &&
            validatorInput(assetLot.assetType) &&
            validatorInput(assetLot.total) &&
            validatorInput(assetLot.status) &&
            validatorInput(assetLot.typeRegisterForUse) &&
            validatorInput(listAssets)

        return result;
    }

    //function thêm mới thông tin lô tài sản
    const save = () => {
        let { avatar, files, assetLot, listAssets } = state;
        let assetLotCreate = {
            avatar: avatar,
            files: files,
            code: assetLot.code,
            assetLotName: assetLot.assetName,
            assetType: assetLot.assetType,
            group: assetLot.group,
            total: assetLot.total,
            price: assetLot.price,
            supplier: assetLot.supplier,
            purchaseDate: assetLot.purchaseDate,
            warrantyExpirationDate: assetLot.warrantyExpirationDate,
            //khấu hao của các tài sản trong lô là giống nhau
            cost: assetLot.cost,
            usefulLife: assetLot.usefulLife,
            residualValue: assetLot.residualValue,
            startDepreciation: assetLot.startDepreciation,
            depreciationType: assetLot.depreciationType,
            listAssets: listAssets
        }
        console.log("hang save listasset: ", listAssets);
        let formData = convertJsonObjectToFormData(assetLotCreate);
        files.forEach(x => {
            if (x.hasOwnProperty('fileUpload')) {
                formData.append("file", x.fileUpload);
            }
        });
        formData.append("fileAvatar", avatar);
        props.createAssetLot(formData);
    }

    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-add-asset-lot" button_name={translate('menu.add_asset_lot')} title={translate('menu.add_asset_lot')} /> */}
            <DialogModal
                size='75' modalID="modal-add-asset-lot" isLoading={assetLotManager.isLoading}
                formID="form-add-asset-lot"
                title={translate('menu.add_asset_lot')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('asset.general_information.general_information')} data-toggle="tab" href={`#create_general`}>{translate('asset.general_information.general_information')}</a></li>
                        <li><a title={translate('asset.general_information.depreciation_information')} data-toggle="tab" href={`#depreciation`}>{translate('asset.general_information.depreciation_information')}</a></li>
                        <li><a title={translate('asset.general_information.attach_infomation')} data-toggle="tab" href={`#attachments`}>{translate('asset.general_information.attach_infomation')}</a></li>
                    </ul>

                    <div className="tab-content">
                        {/* Thông tin chung */}
                        <GeneralLotTab
                            id={`create_general`}
                            avatar={avatar}
                            handleChange={handleChange}
                            handleUpload={handleUpload}
                            handleGenAssetCode={handleGenAssetCode}
                            handleStatusChange={handleStatusChange}
                            handleTypeRegisterChange={handleTypeRegisterChange}
                            handleManageByChange={handleManageByChange}
                            handleReadByRolesChange={handleReadByRolesChange}
                            listAssets={listAssets}
                            assetLot={assetLot}
                            status={assetLot.status}

                        />

                        {/* Thông tin khấu hao */}
                        <DepreciationTab
                            id={`depreciation`}
                            asset={assetLot}
                            handleChange={handleChange}
                        />
                        
                        {/* Tài liệu đính kèm */}
                        <FileTab
                            id="attachments"
                            files={files}
                            asset={assetLot}
                            handleChange={handleChange}
                            handleAddFile={handleChangeFile}
                            handleEditFile={handleChangeFile}
                            handleDeleteFile={handleChangeFile}
                        />
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { assetLotManager, auth } = state;
    return { assetLotManager, auth };
};

const actionCreators = {
    createAssetLot: AssetLotManagerActions.createAssetLot,
    getAllUsers: UserActions.get
};

const createForm = connect(mapState, actionCreators)(withTranslate(AssetLotCreateForm));
export { createForm as AssetLotCreateForm };