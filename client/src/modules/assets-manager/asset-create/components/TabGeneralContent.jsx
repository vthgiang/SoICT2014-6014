import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel } from '../../../../common-components';
import { AssetCreateValidator } from './AssetCreateValidator';
import { AssetManagerActions } from '../../asset-manager/redux/actions';
import "./add-asset.css";

class TabGeneralContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailInfo: [],
            userIndex: '',
            userIndexPerson: '',
            status: "Sẵn sàng sử dụng",
            isChangeTimDep: false
        };
    }

    /**
     * Function upload avatar
     */
    handleUpload = (e) => {
        var file = e.target.files[0];
        console.log(file);
        if (file !== undefined) {
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);

            fileLoad.onload = () => {
                console.log(fileLoad);
                this.setState({
                    img: fileLoad.result
                });
                this.props.handleUpload(fileLoad.result, file)
            };
        }
    }

    /**
     * Bắt sự kiện thay đổi mã tài sản
     */
    handleCodeChange = (e) => {
        const { value } = e.target;
        this.validateCode(value, true);
    }
    validateCode = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateCode(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnCode: msg,
                    code: value,
                }
            });
            this.props.handleChange("code", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi tên tài sản
     */
    handleAssetNameChange = (e) => {
        const { value } = e.target;
        this.validateAssetName(value, true);
    }
    validateAssetName = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateAssetName(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnAssetName: msg,
                    assetName: value,
                }
            });
            this.props.handleChange("assetName", value);
        }
        return msg === undefined;
    };

    /**
     * Bắt sự kiện thay đổi số serial
     */
    handleSerialChange = (e) => {
        const { value } = e.target;
        this.validateSerial(value, true);
    }
    validateSerial = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateSerial(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnSerial: msg,
                    serial: value,
                }
            });
            this.props.handleChange("serial", value);
        }
        return msg === undefined;
    };

    /**
     * Bắt sự kiện thay đổi loại tài sản
     */
    handleAssetTypeChange = (e) => {
        const { assetType } = this.props,
            selectedIndex = e.target.options.selectedIndex,
            assetTypeIndex = e.target.options[selectedIndex].getAttribute('data-key');
        this.setState({ isChangeTimDep: !this.state.isChangeTimDep }, () => {
            this.props.dispatch(AssetManagerActions.saveTimeDepreciation(assetType.listAssetTypes[assetTypeIndex].timeDepreciation, this.state.isChangeTimDep));
        });


        const { value } = e.target;
        this.validateAssetType(value, true);
    };

    validateAssetType = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateAssetType(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnAssetType: msg,
                    assetType: value,
                }
            });
            this.props.handleChange("assetType", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi ngày nhập
     */
    handleDatePurchaseChange = (value) => {
        this.validateDatePurchase(value, true)
    }
    validateDatePurchase = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateDatePurchase(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnDatePurchase: msg,
                    datePurchase: value,
                }
            });
            this.props.handleChange("datePurchase", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi ngày bảo hành
     */
    handleWarrantyExpirationDateChange = (value) => {
        this.validateWarrantyExpirationDate(value, true)
    }
    validateWarrantyExpirationDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateWarrantyExpirationDate(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnWarrantyExpirationDate: msg,
                    warrantyExpirationDate: value,
                }
            });
            this.props.handleChange("warrantyExpirationDate", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi người quản lý
     */
    handleManagerChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({ userIndex: e.target.options[selectedIndex].getAttribute('data-key') });
        const { value } = e.target;
        this.validateManager(value, true);
    }
    validateManager = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateManager(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnManager: msg,
                    manager: value,
                }
            });
            this.props.handleChange("manager", value);
        }
        return msg === undefined;
    };

    /**
     * Bắt sự kiện thay đổi người sử dụng
     */
    handlePersonChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({ userIndexPerson: e.target.options[selectedIndex].getAttribute('data-key1') });
        const { value } = e.target;
        this.validatePerson(this.string2literal(value), true);
    };

    validatePerson = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validatePerson(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPerson: msg,
                    person: value,
                }
            });
            this.props.handleChange("person", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi ngày bắt đầu sử dụng
     */
    handleDateStartUseChange = (value) => {
        this.validateDateStartUse(value, true)
    }
    validateDateStartUse = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateDateStartUse(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnDateStartUse: msg,
                    dateStartUse: value,
                }
            });
            this.props.handleChange("dateStartUse", value);
        }
        return msg === undefined;
    }

    /**
     * Function bắt sự kiện thay đổi ngày kết thúc sử dụng
     */
    handleDateEndUseChange = (value) => {
        this.validateDateEndUse(value, true)
    }
    validateDateEndUse = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateDateEndUse(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnDateEndUse: msg,
                    dateEndUse: value,
                }
            });
            this.props.handleChange("dateEndUse", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi vị trí tài sản
     */
    handleLocationChange = (e) => {
        const { value } = e.target;
        this.validateLocation(value, true);
    }
    validateLocation = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateLocation(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnLocation: msg,
                    location: value,
                }
            });
            this.props.handleChange("location", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi giá trị ban đầu
     */
    handleInitialPriceChange = (e) => {
        const { value } = e.target;
        this.validateInitialPrice(value, true);
    }
    validateInitialPrice = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateInitialPrice(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnInitialPrice: msg,
                    initialPrice: value,
                }
            });
            this.props.handleChange("initialPrice", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi mô tả
     */
    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                description: value
            }

        });
        this.props.handleChange("description", value);
    }

    /**
     * Bắt sự kiện thay đổi trạng thái tài sản
     */
    handleStatusChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...this.state,
                status: value
            }

        });
        this.props.handleChange("status", value);
    }

    /**
     * Bắt sự kiện click thêm Thông tin chi tiết
     */
    handleAddDetailInfo = () => {
        var detailInfo = this.state.detailInfo;
        if (detailInfo.length !== 0) {
            let result;
            for (let n in detailInfo) {
                result = this.validateNameField(detailInfo[n].nameField, n) &&
                    this.validateValue(detailInfo[n].value, n);
                if (result === false) {
                    this.validateNameField(detailInfo[n].nameField, n);
                    this.validateValue(detailInfo[n].value, n)
                    break;
                }
            }
            if (result === true) {
                this.setState({
                    detailInfo: [...detailInfo, { nameField: "", value: "" }]
                })
            }
        } else {
            this.setState({
                detailInfo: [...detailInfo, { nameField: "", value: "" }]
            })
        }

    }

    /**
     * Bắt sự kiện chỉnh sửa tên trường dữ liệu thông tin chi tiết
     */
    handleChangeNameField = (e) => {
        var { value, className } = e.target;
        this.validateNameField(value, className);
    }
    validateNameField = (value, className, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateNameField(value, this.props.translate);
        if (willUpdateState) {
            var { detailInfo } = this.state;
            detailInfo[className] = { ...detailInfo[className], nameField: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameField: msg,
                    detailInfo: detailInfo
                }
            });
            this.props.handleChange("detailInfo", detailInfo);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa giá trị trường dữ liệu thông tin chi tiết
     */
    handleChangeValue = (e) => {
        var { value, className } = e.target;
        this.validateValue(value, className);
    }
    validateValue = (value, className, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateValue(value, this.props.translate);
        if (willUpdateState) {
            var { detailInfo } = this.state;
            detailInfo[className] = { ...detailInfo[className], value: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnValue: msg,
                    detailInfo: detailInfo
                }
            });
            this.props.handleChange("detailInfo", detailInfo);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện xóa thông tin chi tiết
     */
    delete = (index) => {
        var { detailInfo } = this.state;
        detailInfo.splice(index, 1);
        this.setState({
            detailInfo: detailInfo
        })
        if (detailInfo.length !== 0) {
            for (let n in detailInfo) {
                this.validateNameField(detailInfo[n].nameField, n);
                this.validateValue(detailInfo[n].value, n)
            }
        } else {
            this.setState({
                errorOnValue: undefined,
                errorOnNameField: undefined
            })
        }
    };

    // componentDidMount() {
    //     console.log('didmount', this.props.asset);
    //     let { detailInfo } = this.props.asset;
    //     if (detailInfo.length) {
    //         this.setState({ detailInfo })
    //     }
    // }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                img: nextProps.asset.avatar,
                code: nextProps.asset.code,
                assetName: nextProps.asset.assetName,
                serial: nextProps.asset.serial,
                assetType: nextProps.asset.assetType,
                location: nextProps.asset.location,
                avatar: nextProps.asset.avatar,
                datePurchase: nextProps.asset.datePurchase,
                warrantyExpirationDate: nextProps.asset.warrantyExpirationDate,
                manager: nextProps.asset.manager,
                person: nextProps.asset.person,
                dateStartUse: nextProps.asset.dateStartUse,
                dateEndUse: nextProps.asset.dateEndUse,
                initialPrice: nextProps.asset.initialPrice,
                description: nextProps.asset.description,
                status: nextProps.asset.status,
                detailInfo: nextProps.asset.detailInfo,
                errorOnCode: undefined,
                errorOnAssetName: undefined,
                errorOnSerial: undefined,
                errorOnAssetType: undefined,
                errorOnLocation: undefined,
                errorOnDatePurchase: undefined,
                errorOnWarrantyExpirationDate: undefined,
                errorOnManager: undefined,
                errorOnInitialPrice: undefined,
                errorOnNameField: undefined,
                errorOnValue: undefined,
            }
        } else {
            return null;
        }

    }

    string2literal = (value) => {
        var maps = {
            "NaN": NaN,
            "null": null,
            "undefined": undefined,
            "Infinity": Infinity,
            "-Infinity": -Infinity
        };
        return ((value in maps) ? maps[value] : value);
    };

    render() {
        const { id, translate } = this.props;

        const {
            img, avatar, picture, code, assetName, serial, asssetType, datePurchase, purchaseDate, warrantyExpirationDate, manager, managedBy, person, assignedTo, dateStartUse, handoverFromDate, dateEndUse, handoverToDate, location, initialPrice, description, status, detailInfo,
            errorOnCode, errorOnAssetName, errorOnSerial, errorOnAssetType, errorOnLocation, errorOnDatePurchase, errorOnWarrantyExpirationDate, errorOnDateStartUse, errorOnDateEndUse,
            errorOnManager, errorOnPerson, errorOnInitialPrice, errorOnNameField, errorOnValue,
        } = this.state;
        const user = this.props.user;
        const listAssetTypes = this.props.assetType;
        return (
            <div id={id} className="tab-pane active">
                <div className="box-body">
                    <div className="col-md-12">
                        <div className="col-md-4" style={{ textAlign: 'center' }}>
                            <div>
                                <img className="attachment-img avarta" src={img} alt="Attachment" />
                            </div>
                            <br />
                            <div className="upload btn btn-default ">
                                {translate('manage_employee.upload')}
                                <input className="upload" type="file" name="file" onChange={this.handleUpload} />
                            </div>
                        </div>

                        <br />
                        <div className="col-md-8">
                            <label>Thông tin cơ bản:</label>
                            <div>
                                <div className="col-md-6">
                                    <div className={`form-group ${errorOnCode === undefined ? "" : "has-error"} `}>
                                        <label htmlFor="code">Mã tài sản<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="code" value={code} onChange={this.handleCodeChange} placeholder="Mã tài sản"
                                            autoComplete="off" />
                                        <ErrorLabel content={errorOnCode} />
                                    </div>

                                    <div className={`form-group ${errorOnAssetName === undefined ? "" : "has-error"} `}>
                                        <label htmlFor="assetName">Tên tài sản<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="assetName" value={assetName} onChange={this.handleAssetNameChange} placeholder="Tên tài sản"
                                            autoComplete="off" />
                                        <ErrorLabel content={errorOnAssetName} />
                                    </div>

                                    <div className={`form-group ${errorOnSerial === undefined ? "" : "has-error"} `}>
                                        <label htmlFor="serial">Số serial<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="serial" value={serial} onChange={this.handleSerialChange} placeholder="Số serial"
                                            autoComplete="off" />
                                        <ErrorLabel content={errorOnSerial} />
                                    </div>

                                    <div className={`form-group ${errorOnAssetType === undefined ? "" : "has-error"} `}>
                                        <label htmlFor="assetType">Loại tài sản<span className="text-red">*</span></label>
                                        <select id="drops" className="form-control" name="asssetType" defaultValue={!this.props.asset.assetType ? '' : this.props.assetType._id}
                                            onChange={this.handleAssetTypeChange}>
                                            <option value="" disabled>---Chọn loại tài sản---</option>
                                            {listAssetTypes.listAssetTypes.length ? listAssetTypes.listAssetTypes.map((item, index) => (
                                                <option data-key={index} key={index} value={item._id}>{item.typeNumber + " - " + item.typeName}</option>
                                            )) : null}

                                        </select>

                                        <ErrorLabel content={errorOnAssetType} />
                                    </div>

                                    <div className={`form-group ${errorOnDatePurchase === undefined ? "" : "has-error"}`}>
                                        <label htmlFor="datePurchase">Ngày nhập<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`datePurchase${id}`}
                                            value={datePurchase}
                                            onChange={this.handleDatePurchaseChange}
                                        />
                                        <ErrorLabel content={errorOnDatePurchase} />
                                    </div>

                                    <div className={`form-group ${errorOnWarrantyExpirationDate === undefined ? "" : "has-error"}`}>
                                        <label htmlFor="warrantyExpirationDate">Ngày bảo hành<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`warrantyExpirationDate${id}`}
                                            value={warrantyExpirationDate}
                                            onChange={this.handleWarrantyExpirationDateChange}
                                        />
                                        <ErrorLabel content={errorOnDatePurchase} />
                                    </div>

                                    <div className={`form-group ${errorOnManager === undefined ? "" : "has-error"} `}>

                                        <label htmlFor="manager">Người quản lý<span className="text-red">*</span></label>
                                        <select id="drops" className="form-control" name="manager" defaultValue={!this.props.asset.manager ? '' : this.props.asset.manager._id}
                                            placeholder="Please Select"
                                            onChange={this.handleManagerChange}>
                                            <option value="" disabled>Please Select</option>
                                            {user.list.length ? user.list.map((item, index) => {
                                                return (
                                                    <option data-key={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                                )
                                            }) : null}
                                        </select>
                                        <ErrorLabel content={errorOnManager} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="positionManager">Chức vụ</label>
                                        <input
                                            value={this.state.userIndex !== '' && user.list[this.state.userIndex].roles.length ? user.list[this.state.userIndex].roles[0].roleId.name : this.props.asset.manager ? this.props.asset.manager.position.name : ''}
                                            type="text" className="form-control"
                                            placeholder="Chức vụ" name="positionManager" autoComplete="off" disabled />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className={`form-group`}>
                                        <label htmlFor="person">Người được giao sử dụng tài sản<span className="text-red">*</span></label>
                                        <select id="drops1" className="form-control" name="person"
                                            defaultValue={this.props.asset.person !== null && this.props.asset.person !== undefined ? this.props.asset.person._id : ''}
                                            placeholder="Please Select"
                                            onChange={this.handlePersonChange}>
                                            <option value="" disabled>Please Select</option>
                                            <option value="null">Null</option>
                                            {user.list.length ? user.list.map((item, index) => {
                                                return (
                                                    <option data-key1={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                                )
                                            }) : null}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="positionPerson">Chức vụ</label>
                                        <input
                                            value={this.state.userIndexPerson !== '' && this.state.person !== null && user.list[this.state.userIndexPerson].roles.length ? user.list[this.state.userIndexPerson].roles[0].roleId.name : (this.props.asset.person !== null && this.props.asset.person !== undefined && Object.keys(this.props.asset.person).length) ? this.props.asset.person.position.name : ''}
                                            type="text" className="form-control"
                                            placeholder="Chức vụ" name="positionPerson" autoComplete="off" disabled />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="dateStartUse">Thời gian sử dụng từ ngày</label>
                                        <DatePicker
                                            id={`dateStartUse${id}`}
                                            value={dateStartUse}
                                            onChange={this.handleDateStartUseChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="dateEndUse">Thời gian sử dụng đến ngày</label>
                                        <DatePicker
                                            id={`dateEndUse${id}`}
                                            value={dateEndUse}
                                            onChange={this.handleDateEndUseChange}
                                        />
                                    </div>

                                    <div className={`form-group ${errorOnLocation === undefined ? "" : "has-error"}`}>
                                        <label htmlFor="location">Vị trí tài sản<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="location" value={location} onChange={this.handleLocationChange} placeholder="Vị trí tài sản"
                                            autoComplete="off" />
                                        <ErrorLabel content={errorOnLocation} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Mô tả</label>
                                        <input type="text" className="form-control" name="description" value={description} onChange={this.handleDescriptionChange} placeholder="Mô tả"
                                            autoComplete="off" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="status">Trạng thái</label>
                                        <select className="form-control" name="status" value={status} onChange={this.handleStatusChange}>
                                            <option value="Sẵn sàng sử dụng">Sẵn sàng sử dụng</option>
                                            <option value="Đang sử dụng">Đang sử dụng</option>
                                            <option value="Hỏng hóc">Hỏng hóc</option>
                                            <option value="Mất">Mất</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            <div className="col-md-12">
                                <label>Thông tin chi tiết:<a title="Thông tin chi tiết"><i className="fa fa-plus" style={{ color: "#00a65a", marginLeft: 5 }}
                                    onClick={this.handleAddDetailInfo} /></a></label>
                                <div className={`form-group ${(errorOnNameField === undefined && errorOnValue) === undefined ? "" : "has-error"}`}>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Tên trường dữ liệu</th>
                                                <th>Giá trị</th>
                                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(typeof detailInfo === 'undefined' || detailInfo.length === 0) ? <tr>
                                                <td colSpan={3}>
                                                    <center> {translate('table.no_data')}</center>
                                                </td>
                                            </tr> :
                                                detailInfo.map((x, index) => {
                                                    return <tr key={index}>
                                                        <td><input className={index} type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={this.handleChangeNameField} /></td>
                                                        <td><input className={index} type="text" value={x.value} name="value" style={{ width: "100%" }} onChange={this.handleChangeValue} /></td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                                })}
                                        </tbody>
                                    </table>
                                    <ErrorLabel content={errorOnNameField} />
                                    <ErrorLabel content={errorOnValue} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { assetType, user, assetsManager } = state;
    return { assetType, user, assetsManager };
};
const tabGeneral = connect(mapState)(withTranslate(TabGeneralContent));
export { tabGeneral as TabGeneralContent };
