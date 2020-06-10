import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { MaintainanceFormValidator } from './maintainanceFormValidator';
import { MaintainanceActions } from '../redux/actions';
import { AssetManagerActions } from '../../asset-management/redux/actions';

class MaintainanceCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maintainanceCode: "",
            createDate: this.formatDate(Date.now()),
            type: "Sửa chữa",
            code: "",
            description: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            expense: "",
            status: "Đang thực hiện",
            // assetIndex: ""
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

    // // Bắt sự kiện thay đổi "Mã tài sản"
    // handleCodeChange = (e) => {
    //     const selectedIndex = e.target.options.selectedIndex;
    //     this.setState({ assetIndex: e.target.options[selectedIndex].getAttribute('data-key') });
    //     let value = e.target.value;
    //     this.validateCode(value, true);
    // }
    // validateCode = (value, willUpdateState = true) => {
    //     let msg = MaintainanceFormValidator.validateCode(value, this.props.translate)
    //     if (willUpdateState) {
    //         this.setState(state => {
    //             return {
    //                 ...state,
    //                 errorOnCode: msg,
    //                 asset: value,
    //             }
    //         });
    //     }
    //     return msg === undefined;
    // }

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
        let result =
            this.validateMaintainanceCode(this.state.maintainanceCode, false) &&
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
        if (this.isFormValidated()) {
            return this.props.createNewMaintainance({ ...this.state, createDate: createDate, startDate: startDate, endDate: endDate });
        }
    };

    render() {
        const { id, translate, maintainance, assetsManager } = this.props;
        // var lists = "";
        // if (assetsManager.listAssets) {
        //     lists = assetsManager.listAssets;
        // }
        var assetlist = assetsManager.listAssets;

        const {
            maintainanceCode, createDate, type, asset, code, assetName, description, startDate, endDate, expense, status,
            errorOnMaintainanceCode, errorOnCreateDate, errorOnCode, errorOnDescription, errorOnStartDate, errorOnExpense
        } = this.state;
        console.log(this.state, 'tungstate')
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-maintainance" button_name="Thêm mới phiếu" title="Thêm mới phiếu bảo trì" />
                <DialogModal
                    // size='75' modalID="modal-create-maintainance" isLoading={maintainance.isLoading}
                    size='75' modalID="modal-create-maintainance"
                    formID="form-create-maintainance"
                    title="Thêm mới phiếu bảo trì"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-maintainance">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnMaintainanceCode === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="maintainanceCode" value={maintainanceCode} onChange={this.handleMaintainanceCodeChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnMaintainanceCode} />
                                </div>
                                <div className={`form-group ${errorOnCreateDate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`add-create-date${id}`}
                                        value={createDate}
                                        onChange={this.handleCreateDateChange}
                                    />
                                    <ErrorLabel content={errorOnCreateDate} />
                                </div>
                                <div className="form-group">
                                    <label>Phân loại</label>
                                    <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                        <option value="Sửa chữa">Sửa chữa</option>
                                        <option value="Thay thế">Thay thế</option>
                                        <option value="Nâng cấp">Nâng cấp</option>
                                    </select>
                                </div>

                                {/* <div className={`form-group ${errorOnCode === undefined ? "" : "has-error"}`}> */}
                                {/* <div className="form-group">
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="asset" defaultValue=""
                                        placeholder="Please Select"
                                        onChange={this.handleCodeChange}>
                                        <option value="" disabled>Please Select</option>
                                        {assetsManager.listAssets ? assetsManager.listAssets.map((item, index) => {
                                            return (
                                                <option data-key={index} key={index} value={item.assets._id}>{item.assets.code}</option>
                                            )
                                        }) : null}
                                    </select>
                                    
                                </div>
                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input disabled type="text" className="form-control" name="assetName"
                                        value={this.state.assetIndex !== '' ? assetsManager.listAssets[this.state.assetIndex].asset.assetName : ''} />
                                </div> */}

                                <div className={`form-group`}>
                                    <label>Tài sản</label>
                                    <div>
                                        <div id="add-assetBox">
                                            <SelectBox
                                                id={`add-asset${id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={assetlist.map(x => { return { value: x.assets[0]._id, text: x.assets[0].code + " - " + x.assets[0].assetName } })}
                                                onChange={this.handleAssetChange}
                                                value={asset}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={`form-group ${errorOnDescription === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off" placeholder="Nội dung"></textarea>
                                    <ErrorLabel content={errorOnDescription} />
                                </div>

                                
                            </div>
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày thực hiện<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`add-start-date${id}`}
                                        value={startDate}
                                        onChange={this.handleStartDateChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>
                                <div className="form-group">
                                    <label>Ngày hoàn thành</label>
                                    <DatePicker
                                        id={`add-end-date${id}`}
                                        value={endDate}
                                        onChange={this.handleEndDateChange}
                                    />
                                </div>
                                <div className={`form-group ${errorOnExpense === undefined ? "" : "has-error"}`}>
                                    <label>Chi phí (VNĐ)<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="expense" value={expense} onChange={this.handleExpenseChange} autoComplete="off" placeholder="Chi phí" />
                                    <ErrorLabel content={errorOnExpense} />
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                        <option value="Đã thực hiện">Đã thực hiện</option>
                                        <option value="Đang thực hiện">Đang thực hiện</option>
                                        <option value="Chưa thực hiện">Chưa thực hiện</option>
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
    // createNewMaintainance: MaintainanceActions.createNewMaintainance,

};

const createForm = connect(mapState, actionCreators)(withTranslate(MaintainanceCreateForm));
export { createForm as MaintainanceCreateForm };
