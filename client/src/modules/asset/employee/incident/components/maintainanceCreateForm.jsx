import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { MaintainanceFormValidator } from '../../../admin/maintainance/components/maintainanceFormValidator';

import { MaintainanceActions } from '../../../admin/maintainance/redux/actions';
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';

class MaintainanceCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maintainanceCode: "",
            createDate: this.formatDate(Date.now()),
            type: "Sửa chữa",
            asset: "",
            description: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            expense: "",
            status: "Đang thực hiện",
        };
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
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

    // Bắt sự kiện thay đổi mã phiếu
    handleMaintainanceCodeChange = (e) => {
        let { value } = e.target;
        this.validateMaintainanceCode(value, true);
    }
    validateMaintainanceCode = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateMaintainanceCode(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMaintainanceCode: msg,
                    maintainanceCode: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleCreateDateChange = (value) => {
        this.validateCreateDate(value, true);
    }
    validateCreateDate = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateCreateDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCreateDate: msg,
                    createDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi loại phiếu
    handleTypeChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            type: value
        })
    }

    /**
     * Bắt sự kiện thay đổi Mã tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Nội dung"
    handleDescriptionChange = (e) => {
        let { value } = e.target;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateDescription(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescription: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày thực hiện"
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateStartDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày hoàn thành"
    handleEndDateChange = (value) => {
        this.setState({
            ...this.state,
            endDate: value
        })
    }

    // Bắt sự kiện thay đổi "Chi phí"
    handleExpenseChange = (e) => {
        let { value } = e.target;
        this.validateExpense(value, true);
    }
    validateExpense = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateExpense(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnExpense: msg,
                    expense: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Trạng thái phiếu"
    handleStatusChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateMaintainanceCode(this.state.maintainanceCode, false) &&
            this.validateCreateDate(this.state.createDate, false) &&
            this.validateDescription(this.state.description, false) &&
            this.validateStartDate(this.state.startDate, false) &&
            this.validateExpense(this.state.expense, false)
        
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        var partCreate = this.state.createDate.split('-');
        var createDate = [partCreate[2], partCreate[1], partCreate[0]].join('-');
        var partStart = this.state.startDate.split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.state.endDate.split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        let assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset._id;

        if (this.isFormValidated()) {
            let dataToSubit = {
                maintainanceCode: this.state.maintainanceCode,
                createDate: createDate,
                type: this.state.type,
                description: this.state.description,
                startDate: startDate,
                endDate: endDate,
                expense: this.state.expense,
                status: this.state.status,
                assetId

            }

            return this.props.createMaintainance(assetId, dataToSubit, this.props._id)
                .then(({ response }) => {
                    if (response.data.success) {
                        this.props.getAllAsset({
                            code: "",
                            assetName: "",
                            month: null,
                            status: "",
                            page: 0,
                        });
                    }
                });
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset
            }
        } else {
            return null;
        }
    }

    render() {
        const { _id } = this.props;
        const { translate, assetsManager } = this.props;
        const {
            maintainanceCode, createDate, type, asset, description, startDate, endDate, expense, status,
            errorOnMaintainanceCode, errorOnCreateDate, errorOnDescription, errorOnStartDate, errorOnExpense
        } = this.state;

        var assetlist = assetsManager.listAssets;
        console.log(this.state, 'tungstate1')

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-create-maintainance"
                    formID="form-create-maintainance"
                    title={translate('asset.asset_info.add_maintenance_card')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm phiếu bảo trì */}
                    <form className="form-group" id="form-create-maintainance">
                        <div className="col-md-12">
                            
                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group ${!errorOnMaintainanceCode ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.form_code')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="maintainanceCode" value={maintainanceCode} onChange={this.handleMaintainanceCodeChange} autoComplete="off"
                                        placeholder={translate('asset.general_information.form_code')} />
                                    <ErrorLabel content={errorOnMaintainanceCode} />
                                </div>

                                {/* Ngày lập */}
                                <div className={`form-group ${!errorOnCreateDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`add-create-date${_id}`}
                                        value={createDate}
                                        onChange={this.handleCreateDateChange}
                                    />
                                    <ErrorLabel content={errorOnCreateDate} />
                                </div>

                                {/* Phân loại */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.type')}</label>
                                    <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                        <option value="Sửa chữa">{translate('asset.asset_info.repair')}</option>
                                        <option value="Thay thế">{translate('asset.asset_info.replace')}</option>
                                        <option value="Nâng cấp">{translate('asset.asset_info.upgrade')}</option>
                                    </select>
                                </div>

                                {/* Tài sản */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.asset')}</label>
                                    <div>
                                        <div id="add-assetBox">
                                            <SelectBox
                                                id={`add-asset${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={assetlist.map(x => {
                                                    return { value: x._id, text: x.code + " - " + x.assetName }
                                                })}
                                                onChange={this.handleAssetChange}
                                                value={asset._id}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Nội dung */}
                                <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                        placeholder={translate('asset.general_information.content')}></textarea>
                                    <ErrorLabel content={errorOnDescription} />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Ngày thực hiện */}
                                <div className={`form-group ${!errorOnStartDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.start_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`add-start-date${_id}`}
                                        value={startDate}
                                        onChange={this.handleStartDateChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>

                                {/* Ngày hoàn thành */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.end_date')}</label>
                                    <DatePicker
                                        id={`add-end-date${_id}`}
                                        value={endDate}
                                        onChange={this.handleEndDateChange}
                                    />
                                </div>

                                {/* Chi phí */}
                                <div className={`form-group ${!errorOnExpense ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.expense')} (VNĐ)<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="expense" value={expense} onChange={this.handleExpenseChange} autoComplete="off" placeholder="Chi phí" />
                                    <ErrorLabel content={errorOnExpense} />
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.status')}</label>
                                    <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                        <option value="Đã thực hiện">{translate('asset.asset_info.made')}</option>
                                        <option value="Đang thực hiện">{translate('asset.asset_info.processing')}</option>
                                        <option value="Chưa thực hiện">{translate('asset.asset_info.unfulfilled')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { maintainance, assetsManager } = state;
    return { maintainance, assetsManager };
};

const actionCreators = {
    getAllAsset: AssetManagerActions.getAllAsset,
    createMaintainance: MaintainanceActions.createMaintainance,
};

const createForm = connect(mapState, actionCreators)(withTranslate(MaintainanceCreateForm));
export { createForm as MaintainanceCreateForm };