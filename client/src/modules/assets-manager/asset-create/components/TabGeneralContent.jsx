import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel } from '../../../../common-components';
import { AssetCreateValidator } from './AssetCreateValidator';
import "./add-asset.css";
class TabGeneralContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailInfo: [],

        };
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
        this.props.handleChange(name, value);
    }

    // Function bắt sự kiện thay đổi mã tài sản
    handleAssetNumberChange = (e) => {
        const { value } = e.target;
        this.validateAssetNumber(value, true);
    }
    validateAssetNumber = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateAssetNumber(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnAssetNumber: msg,
                    assetNumber: value,
                }
            });
            this.props.handleChange("assetNumber", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi tên tài sản
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
    }

    // Function bắt sự kiện thay đổi loại tài sản
    handleAssetTypeChange = (e) => {
        const { value } = e.target;
        this.validateAssetType(value, true);
    }
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

    // Function bắt sự kiện thay đổi vị trí tài sản
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

    // Function bắt sự kiện thay đổi ngày nhập
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

    // Function bắt sự kiện người quản lý
    handleManagerChange = (e) => {
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
    }

    // Function bắt sự kiện thay đổi giá trị ban đầu
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

    // Function bắt sự kiện thay đổi mô tả
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

    // Bắt sự kiện thay đổi trạng thái tài sản
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

    // Bắt sự kiện click thêm thông tin chi tiết
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

    // Bắt sự kiện chỉnh sửa tên trường dữ liệu thông tin chi tiết 
    handleChangeNameField = (e) => {
        var { value, className } = e.target;
        this.validateNameField(value, className);
    }
    // Function kiểm tra tên trường dữ liệu thông tin chi tiết nhập vào có hợp lệ không
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
            this.props.handleChange("description", value);
        }
        return msg === undefined;
    }

    // Bắt sự kiện chỉnh sửa giá trị trường dữ liệu thông tin chi tiết 
    handleChangeValue = (e) => {
        var { value, className } = e.target;
        this.validateValue(value, className);
    }
    // Kiểm tra giá trị trường dữ liệu thông tin chi tiết nhập vào có hợp lệ hay không
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
        }
        return msg === undefined;
    }

    // Function xoá thông tin chi tiết
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
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                img: nextProps.img,
                // assetNumber: nextProps.asset.assetNumber,
                // assetName: nextProps.asset.assetName,
                // assetType: nextProps.asset.assetType,
                // location: nextProps.asset.location,
                // datePurchase: nextProps.asset.datePurchase,
                // manager: nextProps.asset.manager,
                // initialPrice: nextProps.asset.initialPrice,
                // description: nextProps.asset.description,
                // status: nextProps.asset.status,
                // status: nextProps.asset.status,

                errorOnAssetNumber: undefined,
                errorOnAssetName: undefined,
                errorOnAssetType: undefined,
                errorOnLocation: undefined,
                errorOnDatePurchase: undefined,
                errorOnManager: undefined,
                errorOnInitialPrice: undefined,
                errorOnNameField: undefined,
                errorOnValue: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { img, assetNumber, assetName, asssetType, location, datePurchase,
            manager, department, initialPrice, description, status, detailInfo,
            errorOnAssetNumber, errorOnAssetName, errorOnAssetType, errorOnLocation, errorOnDatePurchase,
            errorOnManager, errorOnInitialPrice, errorOnNameField, errorOnValue,
        } = this.state;
        return (
            <div id={id} className="tab-pane active">
                <div className="box-body">
                    <div className="col-md-12">
                        <div className="col-md-4" style={{ textAlign: 'center' }}>
                            <div>
                                <img className="attachment-img avarta" src={img} alt="Attachment" />
                            </div><br />
                            <div className="upload btn btn-default ">
                                {translate('manage_employee.upload')}
                                <input className="upload" type="file" name="file" onChange={this.handleUpload} />
                            </div>
                        </div>
                        <label >Thông tin cơ bản:</label>
                        <br />
                        <div className="col-md-8" >
                            <div>
                                <div className="col-md-6">
                                    <div className={`form-group ${errorOnAssetNumber === undefined ? "" : "has-error"} `}>
                                        <label htmlFor="assetNumber">Mã tài sản<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="assetNumber" value={assetNumber} onChange={this.handleAssetNumberChange} placeholder="Mã tài sản" autoComplete="off" />
                                        <ErrorLabel content={errorOnAssetNumber} />
                                    </div>
                                    <div className={`form-group ${errorOnAssetName === undefined ? "" : "has-error"} `}>
                                        <label htmlFor="assetName">Tên tài sản<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="assetName" value={assetName} onChange={this.handleAssetNameChange} placeholder="Tên tài sản" autoComplete="off" />
                                        <ErrorLabel content={errorOnAssetName} />
                                    </div>
                                    <div className={`form-group ${errorOnAssetType === undefined ? "" : "has-error"} `}>
                                        <label htmlFor="assetType">Loại tài sản<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="assetType" value={asssetType} onChange={this.handleAssetTypeChange} placeholder="Loại tài sản" autoComplete="off" />
                                        <ErrorLabel content={errorOnAssetType} />
                                    </div>
                                    <div className={`form-group ${errorOnLocation === undefined ? "" : "has-error"}`}>
                                        <label htmlFor="location">Vị trí tài sản<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="location" value={location} onChange={this.handleLocationChange} placeholder="Vị trí tài sản" autoComplete="off" />
                                        <ErrorLabel content={errorOnLocation} />
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
                                </div>

                                <div className="col-md-6">
                                    <div className={`form-group ${errorOnManager === undefined ? "" : "has-error"} `}>
                                        <label htmlFor="manager">Người quản lý<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="manager" value={manager} onChange={this.handleManagerChange} placeholder="Người quản lý" autoComplete="off" />
                                        <ErrorLabel content={errorOnManager} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="department">Đơn vị</label>
                                        <input type="text" className="form-control" placeholder="Đơn vị" name="department" placeholder="Đơn vị" autoComplete="off" />
                                    </div>
                                    <div className={`form-group ${errorOnInitialPrice === undefined ? "" : "has-error"} `}>
                                        <label htmlFor="initialPrice">Giá trị ban đầu<span className="text-red">*</span></label>
                                        <input style={{ display: "inline", width: "88%" }} type="number" className="form-control" name="initialPrice" value={initialPrice} onChange={this.handleInitialPriceChange} placeholder="Giá trị ban đầu" autoComplete="off" />
                                        <label style={{ height: 34, display: "inline", width: "5%" }}>&nbsp; VNĐ</label>
                                        <ErrorLabel content={errorOnInitialPrice} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Mô tả</label>
                                        <input type="text" className="form-control" name="description" value={description} onChange={this.handleDescriptionChange} placeholder="Mô tả" autoComplete="off" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Trạng thái</label>
                                        <select className="form-control" name="status" value={status} onChange={this.handleStatusChange}>
                                            <option value="available">Sẵn sàng sử dụng</option>
                                            <option value="using">Đang sử dụng</option>
                                            <option value="broken">Hỏng hóc</option>
                                            <option value="lost">Mất</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* <hr/> */}
                            <div>

                                <div className={`form-group ${(errorOnNameField === undefined && errorOnValue) === undefined ? "" : "has-error"}`}>
                                    <label>Thông tin chi tiết:<a title="Thông tin chi tiết"><i className="fa fa-plus" style={{ color: "#00a65a", marginLeft: 5 }} onClick={this.handleAddDetailInfo} /></a></label>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Tên trường dữ liệu</th>
                                                <th>Giá trị</th>
                                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(typeof detailInfo === 'undefined' || detailInfo.length === 0) ? <tr><td colSpan={3}><center> {translate('table.no_data')}</center></td></tr> :
                                                detailInfo.map((x, index) => (
                                                    <tr key={index}>
                                                        <td><input className={index} type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={this.handleChangeNameField} /></td>
                                                        <td><input className={index} type="text" value={x.value} name="value" style={{ width: "100%" }} onChange={this.handleChangeValue} /></td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                                ))}
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
const tabGeneral = connect(null, null)(withTranslate(TabGeneralContent));
export { tabGeneral as TabGeneralContent };