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

function GeneralLotTab(props) {
    const [state, setState] = useState({
        //total: '',
        //price: '',
        disabledGenButton: false,
        startNumber: 0,
        step: 0,
        detailInfo: [],
        isObj: true,
        defaultAvatar: "image/asset_blank.jpg",
        assetType: []
    })

    const [prevProps, setPrevProps] = useState({
        id: null,
        assignedToUser: null,
        assignedToOrganizationalUnit: null,
    })

    //function gen mã tài sản 
    const generateAssetCode = () => {
        let listAssets = props.listAssets;
        const assetLot = props.assetLot;
        const { total, step, startNumber } = state;
        //console.log("hang:", startNumber);

        if (listAssets) {
            //console.log(assetLot);
            //var listAssetsGen = [];
            var number;
            if (total >= listAssets.length) {
                listAssets = listAssets.map((item, index) => {
                    number = startNumber + step * index;
                    return {
                        ...item,
                        code: assetLot.code + number
                    }
                });
                let add = total - listAssets.length;
                for (let i = 0; i < add; i++) {
                    number = startNumber + step * i;
                    listAssets.push({
                        code: assetLot.code + number,
                        status: assetLot.status,
                        typeRegisterForUse: assetLot.typeRegisterForUse,
                    });
                }
                //listAssets = listAssets;
            } else {
                listAssets = listAssets.splice(0, total).map((item, index) => {
                    number = startNumber + step * index;
                    return {
                        ...item,
                        status: assetLot.status,
                        typeRegisterForUse: assetLot.typeRegisterForUse,
                        code: assetLot.code + number
                    }
                });
            }
        } else {
            for (let i = 0; i < total; i++) {
                var number = startNumber + step * i;
                listAssets.push({
                    code: assetLot.code + number,
                    status: assetLot.status,
                    typeRegisterForUse: assetLot.typeRegisterForUse,
                });
            }
            
        }
        props.handleGenAssetCode(listAssets);
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
        const { startNumber, step} = state;
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                var validate = false;
                if(value){
                    validate = true && validateInput(startNumber) && validateInput(step);
                } else {
                    validate = false;
                }
                return {
                    ...state,
                    errorOnToal: message,
                    total: value,
                    disabledGenButton: validate,
                }
            });
            props.handleChange("total", value);
        }
        return message === undefined;
    };

    /**
     * Bắt sự kiện thay đổi giá
     */
    const handlePriceChange = (value) => {
        setState(state => {
            return {
                ...state,
                price: value
            }
        })
        props.handleChange('price', value);
    }

    const validateInput = (value) => {
        if (value && value.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // const isDisplayGenButton = () => {
    //     const { disabledGenButton, total, startNumber, step} = state;
    //     let test = validateInput(total) && validateInput(startNumber) && validateInput(step);
    //     setState(state => {
    //         return {
    //             ...state,
    //             disabledGenButton: test
    //         }
    //     })
    // }

    /**
     * Bắt sự kiện thay đổi ký tự bắt đầu
     */
    const handleStarNumber = (e) => {
        const { value } = e.target;
        validateStartNumber(value, true);
    }
    const validateStartNumber = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);
        const {total, step} = state;

        if (willUpdateState) {
            var validate = false;
                if(value){
                    validate = true && validateInput(total) && validateInput(step);
                } else {
                    validate = false;
                }
            setState(state => {
                return {
                    ...state,
                    errorOnStartNumber: message,
                    startNumber: value,
                    disabledGenButton: validate
                }
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
        const {startNumber, total} = state;

        if (willUpdateState) {
            setState(state => {
                var validate = false;
                if(value){
                    validate = true && validateInput(total) && validateInput(startNumber);
                } else {
                    validate = false;
                }
                return {
                    ...state,
                    errorOnStep: message,
                    step: value,
                    disabledGenButton: validate
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

    const handleAddDefaultInfo = () => {
        const { assetType } = state
        let listAssetTypes = []
        if (assetType) {
            listAssetTypes = props.assetType.listAssetTypes.filter((type) => {
                return assetType.indexOf(type.id) > -1
            })
        }
        let defaultInfo = []
        let nameFieldList = []

        for (let i = 0; i < listAssetTypes.length; i++) {
            for (let j = 0; j < listAssetTypes[i].defaultInformation.length; j++)
                if (nameFieldList.indexOf(listAssetTypes[i].defaultInformation[j].nameField) === -1) {
                    defaultInfo.push({ nameField: listAssetTypes[i].defaultInformation[j].nameField, value: listAssetTypes[i].defaultInformation[j].value })
                    nameFieldList.push(listAssetTypes[i].defaultInformation[j].nameField)
                }
        }

        setState(state => {
            return {
                ...state,
                detailInfo: defaultInfo
            }
        })
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
        setState(state => {
            return {
                ...state,
                managedBy: value[0]
            }
        });
        props.handleChange("managedBy", value[0]);
    }



    /**
     * Bắt sự kiện thay đổi người sử dụng
     */
    const handleAssignedToUserChange = (value) => {
        setState(state => {
            return {
                ...state,
                assignedToUser: string2literal(value[0])
            }
        });
        props.handleChange("assignedToUser", string2literal(value[0]));
    }

    const handleAssignedToOrganizationalUnitChange = (value) => {
        setState(state => {
            return {
                ...state,
                assignedToOrganizationalUnit: string2literal(value[0])
            }
        });
        props.handleChange("assignedToOrganizationalUnit", string2literal(value[0]));
    }

    /**
     * Bắt sự kiện thay đổi ngày bắt đầu sử dụng
     */
    const handleHandoverFromDateChange = (value) => {
        validateHandoverFromDate(value, true)
    }
    const validateHandoverFromDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnHandoverFromDate: message,
                    handoverFromDate: value,
                }
            });
            props.handleChange("handoverFromDate", value);
        }
        return message === undefined;
    }

    /**
     * Function bắt sự kiện thay đổi ngày kết thúc sử dụng
     */
    const handleHandoverToDateChange = (value) => {
        validateHandoverToDate(value, true)
    }
    const validateHandoverToDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnHandoverToDate: message,
                    handoverToDate: value,
                }
            });
            props.handleChange("handoverToDate", value);
        }
        return message === undefined;
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
     * Bắt sự kiện thay đổi mô tả
     */
    const handleDescriptionChange = (e) => {
        let value = e.target.value;
        setState(state => {
            return {
                ...state,
                description: value
            }
        });
        props.handleChange("description", value);
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
        setState(state => {
            return {
                ...state,
                readByRoles: value
            }
        });
        props.handleChange("readByRoles", value);
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
        props.handleStatusChange(value[0]);
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
     * Bắt sự kiện xóa thông tin chi tiết
     */
    const delete_function = (index) => {
        var { detailInfo } = state;
        detailInfo.splice(index, 1);
        if (detailInfo.length !== 0) {
            for (let n in detailInfo) {
                validateNameField(detailInfo[n].nameField, n);
                validateValue(detailInfo[n].value, n)
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    detailInfo: detailInfo,
                    errorOnValue: undefined,
                    errorOnNameField: undefined
                }
            })
        }
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
                //managedBy: props.managedBy,
                // assignedToUser: props.assignedToUser,
                //assignedToOrganizationalUnit: props.assignedToOrganizationalUnit,
                //handoverFromDate: props.handoverFromDate,
                // handoverToDate: props.handoverToDate,
                //description: props.description,
                status: props.status,
                typeRegisterForUse: props.assetLot.typeRegisterForUse,
                // detailInfo: props.detailInfo,
                // usageLogs: props.usageLogs,
                // readByRoles: props.readByRoles,

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

    const { id, translate, user, assetsManager, role, department, assetType } = props;
    const {
        img, defaultAvatar, code, assetName, total, price, step, startNumber, assetTypes, group, serial, purchaseDate, warrantyExpirationDate, managedBy, isObj,
        assignedToUser, assignedToOrganizationalUnit, location, description, status, typeRegisterForUse, detailInfo, disabledGenButton,
        errorOnCode, errorOnAssetName, errorOnTotal, errorOnPrice, errorOnStep, errorOnStartNumber, errorOnSerial, errorOnAssetType, errorOnLocation, errorOnPurchaseDate,
        errorOnWarrantyExpirationDate, errorOnManagedBy, errorOnNameField, errorOnValue, usageLogs, readByRoles, errorOnNameFieldPosition, errorOnValuePosition
    } = state;

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

                            {/* Số lượng tài sản */}
                            <div className={`form-group ${!errorOnTotal ? "" : "has-error"} `}>
                                <label htmlFor="total">{translate('asset.asset_lot.asset_lot_total')}</label>
                                <input type="number" className="form-control" name="total" value={total} onChange={handleTotalChange} placeholder={translate('asset.asset_lot.asset_lot_total')}
                                    autoComplete="off" />
                                <ErrorLabel content={errorOnTotal} />
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

                            {/* Người quản lý */}
                            {/* <div className={`form-group${!errorOnManagedBy ? "" : "has-error"}`}>
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
                            </div> */}
                            {/* Quyền xem tài sản theo role */}
                            {/* <div className="form-group">
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
                            </div> */}
                        </div>

                        <div className="col-md-6">

                            {/* Vị trí tài sản */}
                            {/* <div className={`form-group ${!errorOnLocation ? "" : "has-error"}`}>
                                <label htmlFor="location">{translate('asset.general_information.asset_location')}</label>
                                <TreeSelect data={buildingList} value={[location]} handleChange={handleLocationChange} mode="radioSelect" />
                                <ErrorLabel content={errorOnLocation} />
                            </div> */}

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



                            {/* Người sử dụng */}
                            {/* <div className={`form-group`}>
                                <label>{translate('asset.general_information.user')}</label>
                                <SelectBox
                                    id={`assignedToUserBox${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={assignedToUser ?? -1}
                                    items={[{ value: -1, text: 'Chưa có người được giao sử dụng' }, ...userlist.map(x => { return { value: x.id, text: x.name + " - " + x.email } })]}
                                    disabled
                                />
                            </div> */}

                            {/* Đơn vị sử dụng */}
                            {/* <div className="form-group">
                                <label>{translate('asset.general_information.organization_unit')}</label>
                                <div id="assignedToOrganizationalUnitBox">
                                    <SelectBox
                                        id={`assignedToOrganizationalUnitBox${assignedToOrganizationalUnit}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[{ value: -1, text: 'Chưa có đơn vị được giao sử dụng' }, ...departmentlist.map(x => { return { value: x._id, text: x.name } })]}
                                        value={assignedToOrganizationalUnit ?? -1}
                                        multiple={false}
                                        disabled
                                    />
                                </div>
                            </div> */}

                            {/* Thời gian bắt đầu sử dụng */}
                            {/* <div className="form-group">
                                <label>{translate('asset.general_information.handover_from_date')}</label>
                                < DatePicker
                                    id={`start-date-${id}`}
                                    value={startDate}
                                    disabled
                                />
                            </div> */}

                            {/* Thời gian kết thúc sử dụng */}
                            {/* <div className="form-group">
                                <label>{translate('asset.general_information.handover_to_date')}</label>
                                < DatePicker
                                    id={`end-date-${id}`}
                                    value={endDate}
                                    disabled
                                />
                            </div> */}

                            {/* Mô tả */}
                            {/* <div className="form-group">
                                <label htmlFor="description">{translate('asset.general_information.description')}</label>
                                <textarea className="form-control" rows="3" name="description" value={description} onChange={handleDescriptionChange} placeholder="Enter ..." autoComplete="off" ></textarea>
                            </div> */}

                        </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="col-md-12">


                        {/* Bảng thông tin chi tiết */}
                        {/* <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.field_name')}</th>
                                    <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.value')}</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!detailInfo || detailInfo.length === 0) ? <tr>
                                    <td colSpan={3}>
                                        <center> {translate('table.no_data')}</center>
                                    </td>
                                </tr> :
                                    detailInfo.map((x, index) => {
                                        return <tr key={index}>
                                            <td style={{ paddingLeft: '0px' }}>
                                                <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                    <input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => handleChangeNameField(e, index)} />
                                                    {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                                </div>
                                            </td>

                                            <td style={{ paddingLeft: '0px' }}>
                                                <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                                    <input className="form-control" type="text" value={x.value} name="value" style={{ width: "100%" }} onChange={(e) => handleChangeValue(e, index)} />
                                                    {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                                </div>
                                            </td>

                                            <td style={{ textAlign: "center" }}>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => delete_function(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    })}
                            </tbody>
                        </table> */}
                    </div>
                </div>
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
