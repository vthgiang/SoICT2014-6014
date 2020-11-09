import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../common-components';
import QuantityCreateForm from './quantityCreateForm';
import { generateCode } from '../../../../../helpers/generateCode';

class BillCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            good: '',
            list: [],
            code: generateCode("ST"),
        }
    }

    getAllGoods = () => {
        let { translate } = this.props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_good') }];

        this.props.goods.listALLGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.code + " -- " + item.name
            })
        })

        return goodArr;
    }

    handleGoodChange = async (value) => {
        this.setState(state => {
            return {
                ...state,
                good: value[0]
            }
        })
    }

    addQuantity = async () => {
        window.$('#modal-add-quantity').modal('show');
    }

    handleClickCreate = () => {
        const value = generateCode("BI");
        this.setState({
            code: value
        });
    }

    render() {
        const { translate } = this.props;
        const { list, good, code } = this.state;
        const listGoods = this.getAllGoods();

        return (
            <React.Fragment>
                <ButtonModal onButtonCallBack={this.handleClickCreate} modalID={`modal-create-bill`} button_name={translate('manage_warehouse.good_management.add')} title={translate('manage_warehouse.good_management.add_title')} />
        
                <DialogModal
                    modalID={`modal-create-bill`}
                    formID={`form-create-bill`}
                    title={translate('manage_warehouse.bill_management.add_title')}
                    msg_success={translate('manage_warehouse.bill_management.add_success')}
                    msg_faile={translate('manage_warehouse.bill_management.add_faile')}
                    size={75}
                >
                    <form id={`form-create-bill`}>
                    <QuantityCreateForm />
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.code')}</label>
                                    <input type="text" className="form-control" value={code} disabled/>
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.type')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-type-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
                                        items={[
                                            { value: '1', text: "Phiếu xuất bán hàng"},
                                            { value: '2', text: "Phiếu xuất sử dụng"},
                                            { value: '3', text: "Phiếu xuất sản xuất"},
                                        ]}
                                        onChange={this.handleDepartmentChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.proposal')}</label>
                                    <SelectBox
                                        id={`select-proposal-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
                                        items={[
                                            { value: '', text: "Chọn phiếu đề nghị"},
                                            { value: '1', text: "BP023"},
                                            { value: '2', text: "BP024"},
                                            { value: '3', text: "BP025"},
                                        ]}
                                        onChange={this.handleDepartmentChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.stock')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="Tạ Quang Bửu" disabled onChange={this.handleAddressChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.creator')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="Nguyễn Văn Thắng" disabled onChange={this.handleNameChange} />
                                </div>
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.approved')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-approved-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
                                        items={[
                                            { value: '', text: "Chọn người phê duyệt"},
                                            { value: '1', text: "Nguyễn Văn Thắng"},
                                            { value: '2', text: "Phạm Đại Tài"},
                                            { value: '3', text: "Nguyễn Anh Phương"},
                                        ]}
                                        onChange={this.handleDepartmentChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.customer')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-customer-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
                                        items={[
                                            { value: '', text: "Chọn khách hàng"},
                                            { value: '1', text: "Công ty TNHH ABC"},
                                            { value: '2', text: "Công ty Việt Anh"},
                                            { value: '3', text: "Công ty A"},
                                        ]}
                                        onChange={this.handleManagementLocationtChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.receiver')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="" onChange={this.handleNameChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.description')}</label>
                                    <textarea type="text" className="form-control" value="Nơi lưu trữ kho số 1" onChange={this.handleDescriptionChange} />
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label>{translate('manage_warehouse.bill_management.choose_good')}</label>
                                            <SelectBox
                                                id={`select-good-issue-create`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value=""
                                                items={listGoods}
                                                onChange={this.handleGoodChange}    
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label>{translate('manage_warehouse.bill_management.number')}</label>
                                            <div style={{display: "flex"}}><input className="form-control" type="number" disabled={true}/><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: '5px', marginTop: '9px', cursor:'pointer' }} onClick={() => this.addQuantity()}></i></div>
                                        </div>
                                    </div>
                                    <div className="pull-right" style={{marginBottom: "10px"}}>
                                        {this.state.editInfo ?
                                            <React.Fragment>
                                                <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                                <button className="btn btn-success" onClick={this.handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                            </React.Fragment>:
                                            <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={this.handleAddGood}>{translate('task_template.add')}</button>
                                        }
                                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>{translate('task_template.delete')}</button>
                                    </div>
                                    <div className={`form-group`}>
                                        {/* Bảng thông tin chi tiết */}
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th style={{width: "5%"}} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.good_code')}>{translate('manage_warehouse.bill_management.good_code')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={6}>
                                                        <center> {translate('table.no_data')}</center>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                            </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}
export default connect(mapStateToProps, null)(withTranslate(BillCreateForm));