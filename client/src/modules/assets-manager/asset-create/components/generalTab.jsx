import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel, SelectBox } from '../../../../common-components';
import { AssetCreateValidator } from './combinedContent';
import { LOCAL_SERVER_API } from '../../../../env';
import "./addAsset.css";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { AssetTypeActions } from '../../asset-type/redux/actions';
import { string2literal } from '../../../../helpers/handleResponse';

class GeneralTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailInfo: [],
            // status: "Sẵn sàng sử dụng",
            // canRegisterForUse: "Được phép đăng ký sử dụng",
        };
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    // Function upload avatar
    handleUpload = (e) => {
        var file = e.target.files[0];
        if (file !== undefined) {
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    img: fileLoad.result
                });
                this.props.handleUpload(fileLoad.result, file)
            };
        }
    }

    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
        this.props.handleChange(name, value);
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
            this.setState({
                errorOnCode: msg,
                code: value,
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
    handleAssetTypeChange = (value) => {
        this.setState({
            assetType: value[0]
        });
        this.props.handleChange("assetType", value[0]);
    }

    /**
     * Bắt sự kiện thay đổi ngày nhập
     */
    handlePurchaseDateChange = (value) => {
        this.validatePurchaseDate(value, true)
    }
    validatePurchaseDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validatePurchaseDate(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnPurchaseDate: msg,
                    purchaseDate: value,
                }
            });
            this.props.handleChange("purchaseDate", value);
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
    handleManagedByChange = (value) => {
        this.setState({
            managedBy: value[0]
        });
        this.props.handleChange("managedBy", value[0]);
    }



    /**
     * Bắt sự kiện thay đổi người sử dụng
     */
    handleAssignedToChange = (value) => {
        this.setState({
            assignedTo: string2literal(value[0])
        });
        this.props.handleChange("assignedTo", string2literal(value[0]));
    }


    /**
     * Bắt sự kiện thay đổi ngày bắt đầu sử dụng
     */
    handleHandoverFromDateChange = (value) => {
        this.validateHandoverFromDate(value, true)
    }
    validateHandoverFromDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateHandoverFromDate(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnHandoverFromDate: msg,
                    handoverFromDate: value,
                }
            });
            this.props.handleChange("handoverFromDate", value);
        }
        return msg === undefined;
    }

    /**
     * Function bắt sự kiện thay đổi ngày kết thúc sử dụng
     */
    handleHandoverToDateChange = (value) => {
        this.validateHandoverToDate(value, true)
    }
    validateHandoverToDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateHandoverToDate(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnHandoverToDate: msg,
                    handoverToDate: value,
                }
            });
            this.props.handleChange("handoverToDate", value);
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
    handleStatusChange = (value) => {
        this.setState({
            status: value[0]
        })
        this.props.handleChange('status', value[0]);
    }

    /**
     * Bắt sự kiện thay đổi quyền đăng ký sử dụng
     */
    handleCanRegisterForUseChange = (value) => {
        this.setState({
            canRegisterForUse: value[0]
        })
        this.props.handleChange('canRegisterForUse', value[0]);
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                img: nextProps.img,
                avatar: nextProps.avatar,
                code: nextProps.code,
                assetName: nextProps.assetName,
                serial: nextProps.serial,
                assetTypes: nextProps.assetTypes,
                location: nextProps.location,
                purchaseDate: nextProps.purchaseDate,
                warrantyExpirationDate: nextProps.warrantyExpirationDate,
                managedBy: nextProps.managedBy,
                assignedTo: nextProps.assignedTo,
                handoverFromDate: nextProps.handoverFromDate,
                handoverToDate: nextProps.handoverToDate,
                description: nextProps.description,
                status: nextProps.status,
                canRegisterForUse: nextProps.canRegisterForUse,
                detailInfo: nextProps.detailInfo,

                errorOnCode: undefined,
                errorOnAssetName: undefined,
                errorOnSerial: undefined,
                errorOnAssetType: undefined,
                errorOnLocation: undefined,
                errorOnPurchaseDate: undefined,
                errorOnWarrantyExpirationDate: undefined,
                errorOnManagedBy: undefined,

                errorOnNameField: undefined,
                errorOnValue: undefined,
            }
        } else {
            return null;
        }

    }

    render() {
        const { _id, translate, user, assetType } = this.props;

        const {
            img, code, assetName, assetTypes, serial, purchaseDate, warrantyExpirationDate, managedBy,
            assignedTo, handoverFromDate, handoverToDate, location, description, status, canRegisterForUse, detailInfo,
            errorOnCode, errorOnAssetName, errorOnSerial, errorOnAssetType, errorOnLocation, errorOnPurchaseDate,
            errorOnWarrantyExpirationDate, errorOnManagedBy, errorOnNameField, errorOnValue,
        } = this.state;
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        console.log(this.state, 'this.state-general')
        return (
            <div id={_id} className="tab-pane active">
                <div className="box-body">
                    <div className="col-md-12">
                        <div className="col-md-4" style={{ textAlign: 'center' }}>
                            <div>
                                <a href={img} target="_blank">
                                    <img className="attachment-img avarta" src={img} alt="Attachment" />
                                </a>
                            </div>
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

                                    <div className={`form-group${errorOnAssetType === undefined ? "" : "has-error"}`}>
                                        <label>Loại tài sản<span className="text-red">*</span></label>
                                        <div>
                                            <div id="assetTypeBox">
                                                <SelectBox
                                                    id={`assetType${_id}`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={[{ value: '', text: '---Chọn loại tài sản---' }, ...assettypelist.map(x => { return { value: x._id, text: x.typeNumber + " - " + x.typeName } })]}
                                                    onChange={this.handleAssetTypeChange}
                                                    value={assetTypes}
                                                    multiple={false}
                                                />
                                            </div>
                                            <ErrorLabel content={errorOnAssetType} />
                                        </div>
                                    </div>

                                    <div className={`form-group ${errorOnPurchaseDate === undefined ? "" : "has-error"}`}>
                                        <label htmlFor="purchaseDate">Ngày nhập<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`purchaseDate${_id}`}
                                            value={purchaseDate ? this.formatDate(purchaseDate): ''}
                                            onChange={this.handlePurchaseDateChange}
                                        />
                                        <ErrorLabel content={errorOnPurchaseDate} />
                                    </div>

                                    <div className={`form-group ${errorOnWarrantyExpirationDate === undefined ? "" : "has-error"}`}>
                                        <label htmlFor="warrantyExpirationDate">Ngày bảo hành<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`warrantyExpirationDate${_id}`}
                                            value={warrantyExpirationDate ? this.formatDate(warrantyExpirationDate): ''}
                                            onChange={this.handleWarrantyExpirationDateChange}
                                        />
                                        <ErrorLabel content={errorOnPurchaseDate} />
                                    </div>

                                    <div className={`form-group${errorOnManagedBy === undefined ? "" : "has-error"}`}>
                                        <label>Người quản lý<span className="text-red">*</span></label>
                                        <div id="managedByBox">
                                            <SelectBox
                                                id={`managedBy${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })}
                                                onChange={this.handleManagedByChange}
                                                value={managedBy}
                                                multiple={false}
                                            />
                                        </div>
                                        <ErrorLabel content={errorOnManagedBy} />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className={`form-group`}>
                                        <label>Người sử dụng</label>
                                        <div>
                                            <div id="assignedToBox">
                                                <SelectBox
                                                    id={`assignedTo${_id}`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={[{ value: 'null', text: '---Chọn người được giao sử dụng---' }, ...userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })]}
                                                    onChange={this.handleAssignedToChange}
                                                    value={assignedTo}
                                                    multiple={false}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="handoverFromDate">Thời gian sử dụng từ ngày</label>
                                        <DatePicker
                                            id={`handoverFromDate${_id}`}
                                            value={handoverFromDate ? this.formatDate(handoverFromDate) : ''}
                                            onChange={this.handleHandoverFromDateChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="handoverToDate">Thời gian sử dụng đến ngày</label>
                                        <DatePicker
                                            id={`handoverToDate${_id}`}
                                            value={handoverToDate ? this.formatDate(handoverToDate) : ''}
                                            onChange={this.handleHandoverToDateChange}
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
                                        <label>Trạng thái<span className="text-red">*</span></label>
                                        <SelectBox
                                            id={`status${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={status}
                                            items={[
                                                { value: '', text: '---Chọn trạng thái---' },
                                                { value: 'Sẵn sàng sử dụng', text: 'Sẵn sàng sử dụng' },
                                                { value: 'Đang sử dụng', text: 'Đang sử dụng' },
                                                { value: 'Hỏng hóc', text: 'Hỏng hóc' },
                                                { value: 'Mất', text: 'Mất' },
                                                { value: 'Thanh lý', text: 'Thanh lý' },
                                            ]}
                                            onChange={this.handleStatusChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Quyền đăng ký sử dụng<span className="text-red">*</span></label>
                                        <SelectBox
                                            id={`canRegisterForUse${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={canRegisterForUse}
                                            items={[
                                                { value: '', text: '---Chọn quyền sử dụng---' },
                                                { value: 'Được phép đăng ký sử dụng', text: 'Được phép đăng ký sử dụng' },
                                                { value: 'Không được phép đăng ký sử dụng', text: 'Không được phép đăng ký sử dụng' },
                                            ]}
                                            onChange={this.handleCanRegisterForUseChange}
                                        />
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

const actionCreators = {
    getUser: UserActions.get,
    getAssetType: AssetTypeActions.searchAssetTypes
};
const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralTab));
export { generalTab as GeneralTab };
