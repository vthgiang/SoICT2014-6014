import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, ErrorLabel, SelectBox, TreeSelect, ApiImage } from '../../../../../common-components';
import "./addAsset.css";
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetTypeActions } from '../../../admin/asset-type/redux/actions';
import { string2literal } from '../../../../../helpers/handleResponse';
import { generateCode } from "../../../../../helpers/generateCode";
import ValidationHelper from '../../../../../helpers/validationHelper';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function GeneralLotTab(props) {
    const tableId_constructor = "table-asset-lot-create";
    const defaultConfig = { limit: 5 };
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        total: props.assetLot.total,
        price: props.assetLot.price,
        disabledGenButton: false,
        startNumber: 0,
        step: 0,
        detailInfo: [],
        isObj: true,
        defaultAvatar: "image/asset_blank.jpg",
        assetType: [],
        managedBy: [],
        readByRoles: [],

        listAssets: props.listAssets,
        page: 0,
        limit: limit_constructor
    })

    const [prevProps, setPrevProps] = useState({
        id: null,
        assignedToUser: null,
        assignedToOrganizationalUnit: null,
    })

    //function gen mã tài sản 
    const generateAssetCode = () => {
        const assetLot = props.assetLot;
        const { total, step, startNumber } = state;
        // setState({
        //     ...state,
        //     listAssets: listAssets
        // });
        props.handleGenAssetCode(startNumber,step,listAssets,true);
    }

    const regenerateCode = () => {
        let code = generateCode("VVTM");
        setState((state) => ({
            ...state,
            code: code,
        }));
        validateCode(code);
    }

    useEffect(() => {
        window.$('#modal-add-asset-lot').on('shown.bs.modal', regenerateCode);
        return () => {
            window.$('#modal-add-asset').unbind('shown.bs.modal', regenerateCode)
        }
    }, [])



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

    // Function upload avatar
    const handleUpload = (e) => {
        var file = e.target.files[0];

        if (file) {
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                setState(state => {
                    return {
                        ...state,
                        img: fileLoad.result
                    }
                });
                props.handleUpload(fileLoad.result, file)
            };
        }
    }

    // Function lưu các trường thông tin vào state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => {
            return {
                ...state,
                [name]: value,
            }
        })
        props.handleChange(name, value);
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * state.limit;
        await setState({
            ...state,
            page: parseInt(page),
        });

        //props.getAllAssetLots({ ...state, page: parseInt(page) });
    }

    /**
     * Bắt sự kiện thay đổi mã tài sản
     */
    const handleCodeChange = (e) => {
        const { value } = e.target;
        validateCode(value, true);
    }
    const validateCode = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnCode: message,
                    code: value,
                }
            });
            props.handleChange("code", value);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện thay đổi tên tài sản
     */
    const handleAssetNameChange = (e) => {
        const { value } = e.target;
        validateAssetName(value, true);
    }
    const validateAssetName = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnAssetName: message,
                    assetName: value,
                }
            });
            props.handleChange("assetName", value);
        }
        return message === undefined;
    };

    /**
     * Bắt sự kiện thay đổi số lượng
     */
    const handleTotalChange = (e) => {
        const { value } = e.target;
        validateTotal(value, true);
    }
    const validateTotal = (value, willUpdateState = true) => {
        const { assetLot } = props.assetLot;
        const { startNumber, step } = state;
        let { message } = ValidationHelper.validateNumberInputMin(props.translate, value, 1);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnToal: message,
                    total: value,
                }
            });
            props.handleChange("total", value);
        }
        return message === undefined;
    };

    /**
     * Bắt sự kiện thay đổi giá
     */
    const handlePriceChange = (e) => {
        const { value } = e.target;
        validatePrice(value, true);
    }

    const validatePrice = (value, willUpdateState = true) => {
        const { assetLot } = props.assetLot;
        const { startNumber, step } = state;
        let { message } = ValidationHelper.validateNumberInputMin(props.translate, value, 0);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnPrice: message,
                    price: value,
                }
            });
            props.handleChange("price", value);
        }
        return message === undefined;
    };

    const validateInput = (value) => {
        //console.log("vts validateInput value", value, value.length);
        if (value > 0 && value.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Bắt sự kiện thay đổi ký tự bắt đầu
     */
    const handleStarNumber = (e) => {
        const { value } = e.target;
        validateStartNumber(value, true);
    }
    const validateStartNumber = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);
        const { total, step } = state;

        if (willUpdateState) {
            setState({
                ...state,
                errorOnStartNumber: message,
                startNumber: value,
                // disabledGenButton: validate
            });
        }
        return message === undefined;
    };

    /**
     * Bắt sự kiện thay đổi số tự tăng
     */
    const handleStep = (e) => {
        const { value } = e.target;
        validateStep(value, true);
    }
    const validateStep = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);
        const { startNumber, total } = state;

        if (willUpdateState) {
            setState(state => {

                return {
                    ...state,
                    errorOnStep: message,
                    step: value,
                }
            });
        }
        return message === undefined;
    };

    /**
     * Bắt sự kiện thay đổi số serial
     */
    const handleSerialChange = (e) => {
        const { value } = e.target;
        validateSerial(value, true);
    }
    const validateSerial = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnSerial: message,
                    serial: value,
                }
            });
            props.handleChange("serial", value);
        }
        return message === undefined;
    };

    /**
     * Bắt sự kiện thay đổi nhóm tài sản
     */
    const handleGroupChange = (value) => {
        setState(state => {
            return {
                ...state,
                group: value[0]
            }
        })
        props.handleChange('group', value[0]);
    }

    /**
     * Bắt sự kiện thay đổi loại tài sản
     */

    const handleAssetTypeChange = async (value) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value[0]);

        await setState(state => {
            return {
                ...state,
                assetType: JSON.stringify(value),
                isObj: false,
                errorOnAssetType: message,
            }
        });
        props.handleChange("assetType", value)
    }

    /**
     * Bắt sự kiện thay đổi ngày nhập
     */
    const handlePurchaseDateChange = (value) => {
        validatePurchaseDate(value, true)
    }
    const validatePurchaseDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnPurchaseDate: message,
                    purchaseDate: value,
                }
            });
            props.handleChange("purchaseDate", value);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện thay đổi ngày bảo hành
     */
    const handleWarrantyExpirationDateChange = (value) => {
        validateWarrantyExpirationDate(value, true)
    }
    const validateWarrantyExpirationDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnWarrantyExpirationDate: message,
                    warrantyExpirationDate: value,
                }
            });
            props.handleChange("warrantyExpirationDate", value);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện thay đổi người quản lý
     */
    const handleManagedByChange = (value) => {
        //console.log("hang manage",value[0]);
        setState(state => {
            return {
                ...state,
                managedBy: value[0],
            }
        });
        props.handleManageByChange(value[0]);
    }


    /**
     * Bắt sự kiện thay đổi vị trí tài sản
     */
    const handleLocationChange = async (value) => {
        await setState(state => {
            return {
                ...state,
                location: value[0],
            }
        });

        props.handleChange("location", value[0]);
    }

    /**
     * Bắt sự kiện thay đổi trạng thái tài sản
     */
    const handleStatusChange = (value) => {
        setState(state => {
            return {
                ...state,
                status: value[0]
            }
        })
        props.handleStatusChange(value[0]);
    }

    const handleRoles = (value) => {
        //console.log("hang role",value);
        setState(state => {
            return {
                ...state,
                readByRoles: value
            }
        });
        props.handleReadByRolesChange(value);
    }
    /**
     * Bắt sự kiện thay đổi quyền đăng ký sử dụng
     */
    const handleTypeRegisterForUseChange = (value) => {
        setState(state => {
            return {
                ...state,
                typeRegisterForUse: value[0]
            }
        })
        props.handleTypeRegisterChange(value[0]);

    }

    /**
     * Bắt sự kiện click thêm Thông tin chi tiết
     */
    const handleAddDetailInfo = () => {
        var detailInfo = state.detailInfo;

        if (detailInfo.length !== 0) {
            let result;

            for (let n in detailInfo) {
                result = validateNameField(detailInfo[n].nameField, n) && validateValue(detailInfo[n].value, n);
                if (!result) {
                    validateNameField(detailInfo[n].nameField, n);
                    validateValue(detailInfo[n].value, n)
                    break;
                }
            }

            if (result) {
                setState(state => {
                    return {
                        ...state,
                        detailInfo: [...detailInfo, { nameField: "", value: "" }]
                    }
                })
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    detailInfo: [...detailInfo, { nameField: "", value: "" }]
                }
            })
        }

    }

    /**
     * Bắt sự kiện chỉnh sửa tên trường dữ liệu thông tin chi tiết
     */
    const handleChangeNameField = (e, index) => {
        var { value } = e.target;
        validateNameField(value, index);
    }
    const validateNameField = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { detailInfo } = state;
            detailInfo[className] = { ...detailInfo[className], nameField: value }
            setState(state => {
                return {
                    ...state,
                    errorOnNameField: message,
                    errorOnNameFieldPosition: message ? className : null,
                    detailInfo: detailInfo
                }
            });
            props.handleChange("detailInfo", detailInfo);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa giá trị trường dữ liệu thông tin chi tiết
     */
    const handleChangeValue = (e, index) => {
        var { value } = e.target;
        validateValue(value, index);
    }
    const validateValue = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { detailInfo } = state;
            detailInfo[className] = { ...detailInfo[className], value: value }
            setState(state => {
                return {
                    ...state,
                    errorOnValue: message,
                    errorOnValuePosition: message ? className : null,
                    detailInfo: detailInfo
                }
            });
            props.handleChange("detailInfo", detailInfo);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa giá trị trường dữ liệu thông tin tài sản 
     */
    const handleChangeAssetValue = (e, index, name) => {
        let value;
        console.log("hang e",e);
        if (name === 'serial') {
            value = e.target.value;
        } else if (name === 'readByRoles') {
            value = e;
        } else {
            value = e[0];
        }
        listAssets[index][name] = value;
        setState({
            ...state,
            listAssets: listAssets
        });
    }

    const saveListAsset = () => {
        console.log("hang saveListAsset", listAssets);
        props.handleGenAssetCode(0,0,listAssets, false);
    }

    /**
     * Bắt sự kiện xóa thông tin chi tiết
     */
    const delete_function = (index) => {
        listAssets.splice(index, 1);
        setState({
            ...state,
            listAssets: listAssets
        })
    };

    if (prevProps.id !== props.id
        || prevProps.assignedToUser !== props.assignedToUser
        || prevProps.assignedToOrganizationalUnit !== props.assignedToOrganizationalUnit) {
        setState(state => {
            return {
                ...state,
                id: props.id,
                //img: props.img,
                avatar: props.avatar,

                code: props.assetLot.code,
                assetName: props.assetLot.assetName,
                total: props.assetLot.total,
                price: props.assetLot.price,
                //serial: props.serial,
                assetType: props.assetLot.assetType,
                group: props.assetLot.group,
                //location: props.location,
                purchaseDate: props.assetLot.purchaseDate,
                warrantyExpirationDate: props.assetLot.warrantyExpirationDate,
                managedBy: props.assetLot.managedBy,
                // assignedToUser: props.assignedToUser,
                //assignedToOrganizationalUnit: props.assignedToOrganizationalUnit,
                //handoverFromDate: props.handoverFromDate,
                // handoverToDate: props.handoverToDate,
                //description: props.description,
                status: props.status,
                typeRegisterForUse: props.assetLot.typeRegisterForUse,
                // detailInfo: props.detailInfo,
                // usageLogs: props.usageLogs,
                readByRoles: props.assetLot.readByRoles,

                errorOnCode: undefined,
                errorOnAssetName: undefined,
                errorOnTotal: undefined,
                errorOnPrice: undefined,
                errorOnStep: undefined,
                errorOnStartNumber: undefined,
                errorOnSerial: undefined,
                errorOnAssetType: undefined,
                errorOnLocation: undefined,
                errorOnPurchaseDate: undefined,
                errorOnWarrantyExpirationDate: undefined,
                errorOnManagedBy: undefined,
                errorOnNameField: undefined,
                errorOnValue: undefined,
            }
        })
        setPrevProps(props)
    }

    const { id, translate, user, assetsManager, role, department, assetType, } = props;
    const {
        img, defaultAvatar, code, assetName, total, price, step, startNumber, assetTypes, group, serial, purchaseDate, warrantyExpirationDate, managedBy, isObj,
        assignedToUser, assignedToOrganizationalUnit, location, description, status, typeRegisterForUse, detailInfo, disabledGenButton,
        errorOnCode, errorOnAssetName, errorOnTotal, errorOnPrice, errorOnStep, errorOnStartNumber, errorOnSerial, errorOnAssetType, errorOnLocation, errorOnPurchaseDate,
        errorOnWarrantyExpirationDate, errorOnManagedBy, errorOnNameField, errorOnValue, usageLogs, readByRoles, errorOnNameFieldPosition, errorOnValuePosition,

    } = state;

    let listAssets = props.listAssets;

    var userlist = user.list, departmentlist = department.list;
    let startDate = status == "in_use" && usageLogs && usageLogs.length ? formatDate(usageLogs[usageLogs.length - 1].startDate) : '';
    let endDate = status == "in_use" && usageLogs && usageLogs.length ? formatDate(usageLogs[usageLogs.length - 1].endDate) : '';

    let assetbuilding = assetsManager && assetsManager.buildingAssets;
    let assetbuildinglist = assetbuilding && assetbuilding.list;
    let buildingList = assetbuildinglist && assetbuildinglist.map(node => {
        return {
            ...node,
            id: node._id,
            name: node.assetName,
            parent: node.location,
        }
    })
    let assetTypeName = assetType && assetType.listAssetTypes;
    let typeArr = assetTypeName && assetTypeName.map(item => {
        return {
            _id: item._id,
            name: item.typeName,
            parent: item.parent ? item.parent._id : null
        }
    })


    /**
     * Validate disable button
     * 
     */
    useEffect(() => {
        //console.log("vts run effect total, startNumber, step", total, startNumber, step);

        if (validateInput(total) && validateInput(startNumber) && validateInput(step)) {
            setState({ ...state, disabledGenButton: true })
            //console.log("vts run effect true");

        } else {
            setState({ ...state, disabledGenButton: false })
            //console.log("vts run effect false");
        }

    }, [total, startNumber, step])


    return (
        <div id={id} className="tab-pane active">
            <div className="row">
                {/* Ảnh tài sản */}
                <div className="col-md-4" style={{ textAlign: 'center', paddingLeft: '0px' }}>
                    <div>
                        {
                            img ?
                                < ApiImage className="attachment-img avarta" id={`avatar-imform-${id}`} src={img} />
                                :
                                <img className="customer-avatar" src={defaultAvatar} style={{ height: '100%', width: '100%' }} />
                        }
                    </div>
                    <div className="upload btn btn-default ">
                        {translate('manage_asset.upload')}
                        <input className="upload" type="file" name="file" onChange={handleUpload} />
                    </div>
                </div>

                <br />
                {/* Thông tin cơ bản */}
                <div className="col-md-8" style={{ paddingLeft: '0px' }}>
                    <div>
                        <div id="form-create-asset-type" className="col-md-6">
                            {/* Mã lô tài sản */}
                            <div className={`form-group ${!errorOnCode ? "" : "has-error"} `}>
                                <label htmlFor="code">{translate('asset.asset_lot.asset_lot_code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="code" value={code} onChange={handleCodeChange} placeholder={translate('asset.asset_lot.asset_lot_code')}
                                    autoComplete="off" />
                                <ErrorLabel content={errorOnCode} />
                            </div>

                            {/* Tên lô tài sản */}
                            <div className={`form-group ${!errorOnAssetName ? "" : "has-error"} `}>
                                <label htmlFor="assetName">{translate('asset.asset_lot.asset_lot_name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="assetName" value={assetName} onChange={handleAssetNameChange} placeholder={translate('asset.asset_lot.asset_lot_code')}
                                    autoComplete="off" />
                                <ErrorLabel content={errorOnAssetName} />
                            </div>

                            {/* Loại tài sản */}
                            <div className={`form-group ${!errorOnAssetType ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.asset_type')}<span className="text-red">*</span></label>
                                <TreeSelect
                                    data={typeArr}
                                    value={state.assetType}
                                    handleChange={handleAssetTypeChange}
                                    mode="hierarchical"
                                />
                                <ErrorLabel content={errorOnAssetType} />
                            </div>

                            {/* Số lượng tài sản */}
                            <div className={`form-group ${!errorOnTotal ? "" : "has-error"} `}>
                                <label htmlFor="total">{translate('asset.asset_lot.asset_lot_total')} <span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="total" value={total} onChange={handleTotalChange} placeholder={translate('asset.asset_lot.asset_lot_total')}
                                    autoComplete="off" />
                                <ErrorLabel content={errorOnTotal} />
                            </div>

                            {/* Giá 1 tài sản */}
                            <div className={`form-group ${!errorOnTotal ? "" : "has-error"} `}>
                                <label htmlFor="total">{translate('asset.asset_lot.asset_lot_price')} </label>
                                <input type="number" className="form-control" name="price" value={price} onChange={handlePriceChange} placeholder={translate('asset.asset_lot.asset_lot_price')}
                                    autoComplete="off" />
                                <ErrorLabel content={errorOnPrice} />
                            </div>

                            <label>{translate('asset.asset_lot.rule_generate_code')}:
                            </label>

                            {/* Ky tu dau */}
                            <div className={`form-group ${!errorOnStartNumber ? "" : "has-error"} `}>
                                <label htmlFor="startNumber">{translate('asset.asset_lot.start_number')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="startNumber" value={startNumber} onChange={handleStarNumber} placeholder={translate('asset.asset_lot.start_number')}
                                    autoComplete="off" />
                                <ErrorLabel content={errorOnStartNumber} />
                            </div>

                            {/* so tang */}
                            <div className={`form-group ${!errorOnStep ? "" : "has-error"} `}>
                                <label htmlFor="step">{translate('asset.asset_lot.step_number')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="step" value={step} onChange={handleStep} placeholder={translate('asset.asset_lot.step')}
                                    autoComplete="off" />
                                <ErrorLabel content={errorOnStep} />
                            </div>

                            <button type="button" disabled={!disabledGenButton} className="btn btn-success" onClick={generateAssetCode}>{translate('asset.asset_lot.generate_code')}</button>



                        </div>

                        <div className="col-md-6">

                            {/* Trạng thái */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.status')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`status${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={status}
                                    items={[
                                        { value: '', text: '---Chọn trạng thái---' },
                                        { value: 'ready_to_use', text: translate('asset.general_information.ready_use') },
                                        { value: 'in_use', text: translate('asset.general_information.using') },
                                        { value: 'broken', text: translate('asset.general_information.damaged') },
                                        { value: 'lost', text: translate('asset.general_information.lost') },
                                        { value: 'disposed', text: translate('asset.general_information.disposal') },
                                    ]}
                                    onChange={handleStatusChange}
                                />
                            </div>

                            {/* Quyền đăng ký sử dụng */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.can_register_for_use')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`typeRegisterForUse${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={typeRegisterForUse}
                                    items={[
                                        { value: '', text: translate('asset.general_information.select_role_to_use') },
                                        { value: 1, text: translate('asset.general_information.not_for_registering') },
                                        { value: 2, text: translate('asset.general_information.register_by_hour') },
                                        { value: 3, text: translate('asset.general_information.register_for_long_term') },
                                    ]}
                                    onChange={handleTypeRegisterForUseChange}
                                />
                            </div>

                            {/* Nhóm tài sản */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.asset_group')}</label>
                                <SelectBox
                                    id={`group${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={group}
                                    items={[
                                        { value: '', text: `---${translate('asset.asset_info.select_group')}---` },
                                        { value: 'vehicle', text: translate('asset.asset_info.vehicle') },
                                        { value: 'machine', text: translate('asset.asset_info.machine') },
                                        { value: 'other', text: translate('asset.asset_info.other') },
                                    ]}
                                    onChange={handleGroupChange}
                                />
                            </div>

                            {/* Ngày nhập */}
                            <div className={`form-group ${!errorOnPurchaseDate ? "" : "has-error"}`}>
                                <label htmlFor="purchaseDate">{translate('asset.general_information.purchase_date')}</label>
                                <DatePicker
                                    id={`purchaseDate${id}`}
                                    value={purchaseDate ? formatDate(purchaseDate) : ''}
                                    onChange={handlePurchaseDateChange}
                                />
                                <ErrorLabel content={errorOnPurchaseDate} />
                            </div>

                            {/* Ngày bảo hành */}
                            <div className={`form-group ${!errorOnWarrantyExpirationDate ? "" : "has-error"}`}>
                                <label htmlFor="warrantyExpirationDate">{translate('asset.general_information.warranty_expiration_date')}</label>
                                <DatePicker
                                    id={`warrantyExpirationDate${id}`}
                                    value={warrantyExpirationDate ? formatDate(warrantyExpirationDate) : ''}
                                    onChange={handleWarrantyExpirationDateChange}
                                />
                                <ErrorLabel content={errorOnPurchaseDate} />
                            </div>

                            {/* Người quản lý */}
                            <div className={`form-group${!errorOnManagedBy ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.manager')}</label>
                                <div id="managedByBox">
                                    <SelectBox
                                        id={`managedBy${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={userlist.map(x => { return { value: x.id, text: x.name + " - " + x.email } })}
                                        onChange={handleManagedByChange}
                                        value={managedBy}
                                        options={{ placeholder: "" }}
                                        multiple={false}
                                    />
                                </div>
                                <ErrorLabel content={errorOnManagedBy} />
                            </div>
                            {/* Quyền xem tài sản theo role */}
                            <div className="form-group">
                                <label>{translate('system_admin.system_link.table.roles')}</label>
                                <div>
                                    <SelectBox
                                        id={`select-link-default-roles-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={role.list.map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })}
                                        value={readByRoles}
                                        onChange={handleRoles}
                                        multiple={true}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <label>{translate('asset.asset_lot.assets_information')}:
                    <a style={{ cursor: "pointer" }} title={translate('asset.general_information.asset_properties')}><i className="fa fa-save" style={{ color: "#28A745", marginLeft: 5 }}
                        onClick={saveListAsset} /><span onClick={saveListAsset}>Lưu các giá trị vừa thay đổi</span></a>
                </label>
                {/* Bảng thông tin tài sản */}
                <table className="table">
                    <thead>
                        <tr>
                            {/* Mã tài sản  */}
                            <th style={{ paddingLeft: '0px' }}>{translate('asset.general_information.asset_code')}</th>
                            {/* Trạng thái  */}
                            <th style={{ paddingLeft: '0px' }}>{translate('asset.general_information.status')}</th>
                            {/* Quyền đăng kí sử dụng  */}
                            <th style={{ paddingLeft: '0px' }}>{translate('asset.general_information.can_register_for_use')}</th>
                            {/* Số serial */}
                            <th style={{ paddingLeft: '0px' }}>{translate('asset.general_information.serial_number')}</th>
                            {/* Người quản lý  */}
                            <th style={{ paddingLeft: '0px' }}>{translate('asset.general_information.manager')}</th>
                            {/* role có quyền */}
                            <th style={{ paddingLeft: '0px' }}>{translate('system_admin.system_link.table.roles')}</th>
                            {/* vị trí
                            <th style={{ paddingLeft: '0px' }}>{translate('asset.general_information.asset_location')}</th> */}
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!listAssets || listAssets.length === 0) ? <tr>
                            <td colSpan={8}>
                                <center> {translate('table.no_data')}</center>
                            </td>
                        </tr> :
                            listAssets.map((x, index) => {
                                return <tr key={index}>
                                    {/* Mã tài sản */}
                                    <td style={{ paddingLeft: '0px' }}>
                                        {x.code}
                                    </td>
                                    {/* Trạng thái tài sản  */}
                                    <td style={{ paddingLeft: '0px' }}>
                                        <div className="form-group">
                                            <SelectBox
                                                id={`status${index}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={x.status}
                                                items={[
                                                    { value: '', text: '---Chọn trạng thái---' },
                                                    { value: 'ready_to_use', text: translate('asset.general_information.ready_use') },
                                                    { value: 'in_use', text: translate('asset.general_information.using') },
                                                    { value: 'broken', text: translate('asset.general_information.damaged') },
                                                    { value: 'lost', text: translate('asset.general_information.lost') },
                                                    { value: 'disposed', text: translate('asset.general_information.disposal') },
                                                ]}
                                                onChange={(e) =>handleChangeAssetValue(e, index, 'status')}
                                            />
                                        </div>
                                    </td>

                                    {/* Quyền đăng kí sử dụng  */}
                                    <td style={{ paddingLeft: '0px' }}>
                                        <div className="form-group">
                                            <SelectBox
                                                id={`typeRegisterForUse${index}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={x.typeRegisterForUse}
                                                items={[
                                                    { value: '', text: translate('asset.general_information.select_role_to_use') },
                                                    { value: 1, text: translate('asset.general_information.not_for_registering') },
                                                    { value: 2, text: translate('asset.general_information.register_by_hour') },
                                                    { value: 3, text: translate('asset.general_information.register_for_long_term') },
                                                ]}
                                                onChange={(e) => handleChangeAssetValue(e, index, 'typeRegisterForUse')}
                                            />
                                        </div>
                                    </td>

                                    {/* Số serial */}
                                    <td style={{ paddingLeft: '0px' }}>
                                        <div className="form-group">
                                        <input className="form-control" type="text" value={x.serial || ''} name="serial" style={{ width: "100%" }}
                                         onChange={(e) => handleChangeAssetValue(e, index, 'serial')} />
                                        </div>
                                    </td>

                                    {/* Người quản lý */}
                                    <td style={{ paddingLeft: '0px' }}>
                                        <div className="form-group">
                                            <SelectBox
                                                id={`managedBy${index}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => { return { value: x.id, text: x.name + " - " + x.email } })}
                                                onChange={(e) => handleChangeAssetValue(e, index, 'managedBy')}
                                                value={x.managedBy}
                                                options={{ placeholder: "" }}
                                                multiple={false}
                                            />
                                        </div>
                                    </td>

                                    {/* Role có quyền */}
                                    <td style={{ paddingLeft: '0px' }}>
                                        <div className="form-group">
                                            <SelectBox
                                                id={`select-link-default-roles-${index}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={role.list.map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })}
                                                value={x.readByRoles}
                                                onChange={(e) => handleChangeAssetValue(e, index, 'readByRoles')}
                                                multiple={true}
                                            />
                                        </div>
                                    </td>

                                    {/* Vị trí tài sản */}
                                    {/* <td style={{ paddingLeft: '0px' }}>
                                        <div className="form-group">
                                            <TreeSelect data={buildingList} value={[x.location]}
                                                handleChange={(e) => handleChangeAssetValue(e, index, 'location')} mode="radioSelect" />
                                        </div>
                                    </td> */}

                                    <td style={{ textAlign: "center" }}>
                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => delete_function(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function mapState(state) {
    const { assetType, user, assetLotManager, role, department } = state;
    return { assetType, user, assetLotManager, role, department };
};

const actionCreators = {
    getUser: UserActions.get,
    getAssetType: AssetTypeActions.getAssetTypes,
};
const generalLotTab = connect(mapState, actionCreators)(withTranslate(GeneralLotTab));
export { generalLotTab as GeneralLotTab };
