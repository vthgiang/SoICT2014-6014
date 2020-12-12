import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { AssetManagerActions } from '../../asset-information/redux/actions';
import { MaintainanceActions } from '../redux/actions';

import ValidationHelper from '../../../../../helpers/validationHelper';

class MaintainanceCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newMaintainance: {
                maintainanceCode: "",
                createDate: this.formatDate(Date.now()),
                type: "",
                asset: "",
                description: "",
                startDate: this.formatDate(Date.now()),
                endDate: this.formatDate(Date.now()),
                expense: "",
                status: "",
            }
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
        const { newMaintainance } = this.state;
        const { translate } = this.props;
        let { value } = e.target;

        let { message } = ValidationHelper.validateName(translate, value, 4, 255);

        this.setState({
            newMaintainance: {
                ...newMaintainance,
                maintainanceCode: value,
            },
            errorOnMaintainanceCode: message
        })
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleCreateDateChange = (value) => {
        const { newMaintainance } = this.state;
        const { translate } = this.props;

        let { message } = ValidationHelper.validateEmpty(translate, value);

        this.setState({
            newMaintainance: {
                ...newMaintainance,
                createDate: value,
            },
            errorOnCreateDate: message
        })
    }

    // Bắt sự kiện thay đổi loại phiếu
    handleTypeChange = (e) => {
        const { newMaintainance } = this.state;
        let { value } = e.target;

        this.setState({
            newMaintainance: {
                ...newMaintainance,
                type: value,
            }
        })
    }

    /**
     * Bắt sự kiện thay đổi Mã tài sản
     */
    handleAssetChange = (value) => {
        const { newMaintainance } = this.state;
        const { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value[0], 4, 255);

        this.setState({
            newMaintainance: {
                ...newMaintainance,
                asset: value[0]
            },
            assetError: message
        });
    }

    // Bắt sự kiện thay đổi "Nội dung"
    handleDescriptionChange = (e) => {
        const { newMaintainance } = this.state;
        let { value } = e.target;

        this.setState({
            newMaintainance: {
                ...newMaintainance,
                description: value,
            }
        })
    }

    // Bắt sự kiện thay đổi "Ngày thực hiện"
    handleStartDateChange = (value) => {
        const { newMaintainance } = this.state;
        const { translate } = this.props;

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({
            newMaintainance: {
                ...newMaintainance,
                startDate: value,
            },
            errorOnStartDate: message
        })
    }

    // Bắt sự kiện thay đổi "Ngày hoàn thành"
    handleEndDateChange = (value) => {
        const { newMaintainance } = this.state;

        this.setState({
            newMaintainance: {
                ...newMaintainance,
                endDate: value,
            }
        })
    }

    // Bắt sự kiện thay đổi "Chi phí"
    handleExpenseChange = (e) => {
        let { value } = e.target;
        const { newMaintainance } = this.state;

        this.setState({
            newMaintainance: {
                ...newMaintainance,
                expense: value,
            }
        })
    }

    // Bắt sự kiện thay đổi "Trạng thái phiếu"
    handleStatusChange = (e) => {
        const { newMaintainance } = this.state;
        let { value } = e.target;

        this.setState({
            newMaintainance: {
                ...newMaintainance,
                status: value
            }
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        const { maintainanceCode, asset, startDate } = this.state.newMaintainance;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, maintainanceCode).status
            || !ValidationHelper.validateName(translate, asset).status
            || !ValidationHelper.validateName(translate, startDate).status)
            return false;
        return true;
    }


    // Bắt sự kiện submit form
    save = () => {
        let { maintainanceCode, createDate, type, asset, description, startDate, endDate, expense, status } = this.state.newMaintainance

        const partCreate = createDate.split('-');
        const createDateConverted = [partCreate[2], partCreate[1], partCreate[0]].join('-');

        const partStart = startDate.split('-');
        const startDateConverted = [partStart[2], partStart[1], partStart[0]].join('-');

        const partEnd = endDate.split('-');
        const endDateConverted = [partEnd[2], partEnd[1], partEnd[0]].join('-');

        if (this.isFormValidated()) {
            let dataToSubit = {
                maintainanceCode: maintainanceCode,
                createDate: createDateConverted,
                type: type,
                description: description,
                startDate: startDateConverted,
                endDate: endDateConverted,
                expense: expense,
                status: status,

            }

            return this.props.createMaintainance(asset, dataToSubit);
        }
    };

    onSearch = (value) => {
        this.props.getAllAsset({ assetName: value, page: 0, limit: 10 });
    }

    componentDidMount() {
        this.props.getAllAsset({ page: 0, limit: 20 })
    }

    render() {
        const { id, translate, assetsManager } = this.props;
        const { errorOnMaintainanceCode, errorOnCreateDate, errorOnStartDate, assetError } = this.state;
        const { maintainanceCode, createDate, type, asset, description, startDate, endDate, expense, status } = this.state.newMaintainance

        let assetlist = assetsManager.listAssets;
        if (assetlist) {
            assetlist = assetlist.map(x => { return { value: x._id, text: x.code + " - " + x.assetName } })
            assetlist.unshift({ value: '', text: `---${translate('asset.general_information.choose_asset')}---` });
        }

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-maintainance" button_name={translate('asset.general_information.add')} title={translate('asset.asset_info.add_maintenance_card')} />
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
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="maintainanceCode" value={maintainanceCode} onChange={this.handleMaintainanceCodeChange} autoComplete="off" placeholder={translate('asset.general_information.form_code')} />
                                    <ErrorLabel content={errorOnMaintainanceCode} />
                                </div>

                                {/* Ngày lập */}
                                <div className={`form-group ${!errorOnCreateDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`add-create-date${id}`}
                                        value={createDate}
                                        onChange={this.handleCreateDateChange}
                                    />
                                    <ErrorLabel content={errorOnCreateDate} />
                                </div>

                                {/* Phân loại */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.type')}</label>
                                    <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                        <option value="">{`---${translate('asset.general_information.choose_type')}---`}</option>
                                        <option value="1">{translate('asset.asset_info.repair')}</option>
                                        <option value="2">{translate('asset.asset_info.replace')}</option>
                                        <option value="3">{translate('asset.asset_info.upgrade')}</option>
                                    </select>
                                </div>

                                {/* Tài sản */}
                                <div className={`form-group ${!assetError ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.asset')} <span className="text-red">*</span></label>
                                    <SelectBox
                                        id={`create-timesheets-employee`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={assetlist}
                                        onChange={this.handleAssetChange}
                                        value={asset}
                                        multiple={false}
                                        onSearch={this.onSearch}
                                    />
                                    <ErrorLabel content={assetError} />
                                </div>

                                {/* Nội dung */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.content')}</label>
                                    <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off" placeholder={translate('asset.general_information.content')}></textarea>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Ngày thực hiện */}
                                <div className={`form-group ${!errorOnStartDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.start_date')}</label>
                                    <DatePicker
                                        id={`add-start-date${id}`}
                                        value={startDate}
                                        onChange={this.handleStartDateChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>

                                {/* Ngày hoàn thành */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.end_date')}</label>
                                    <DatePicker
                                        id={`add-end-date${id}`}
                                        value={endDate}
                                        onChange={this.handleEndDateChange}
                                    />
                                </div>

                                {/* Chi phí */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.expense')} (VNĐ)</label>
                                    <input type="number" className="form-control" name="expense" value={expense} onChange={this.handleExpenseChange} autoComplete="off" placeholder={translate('asset.general_information.expense')} />
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.status')}</label>
                                    <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                        <option value="">{`---${translate('asset.general_information.choose_status')}---`}</option>
                                        <option value="1">{translate('asset.asset_info.unfulfilled')}</option>
                                        <option value="2">{translate('asset.asset_info.processing')}</option>
                                        <option value="3">{translate('asset.asset_info.made')}</option>
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

