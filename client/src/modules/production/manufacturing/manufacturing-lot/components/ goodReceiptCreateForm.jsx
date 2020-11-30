import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

class GoodReceiptCreateFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { bills, translate } = this.props;
        const { code, fromStock, errorStock, description, approver, errorApprover, responsibles, errorResponsibles, accountables, errorAccountables } = this.state;
        let listGood = [];
        return (
            <React.Fragment>
                <ButtonModal onButtonCallBack={this.handleClickCreate} modalID={`modal-create-bill-issue-product`} button_name={translate('manage_warehouse.good_management.add')} title={translate('manage_warehouse.good_management.add_title')} />
                <DialogModal
                    modalID={`modal-create-bill-issue-product`} isLoading={bills.isLoading}
                    formID={`form-create-bill-issue-product`}
                    title={translate(`manage_warehouse.bill_management.add_issue_product`)}
                    msg_success={translate('manage_warehouse.bill_management.add_success')}
                    msg_faile={translate('manage_warehouse.bill_management.add_faile')}
                    // disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={75}
                >
                    <form id={`form-create-bill-issue-product`}>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.infor')}</legend>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.code')}</label>
                                        <input type="text" className="form-control" value={code} disabled />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.stock')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-stock-issue-product-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={fromStock}
                                            items={[{
                                                value: 1, text: "Kho 1"
                                            }, {
                                                value: 2, text: "Kho 2"
                                            }]}
                                            onChange={this.handleStockChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={errorStock} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>{translate('manage_warehouse.bill_management.description')}</label>
                                        <textarea value={description} type="text" className="form-control" onChange={this.handleDescriptionChange} />
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.list_saffs')}</legend>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.approved')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-approver-bill-issue-product-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={approver}
                                            items={[{
                                                value: 1, text: "Người 1"
                                            }, {
                                                value: 2, text: "Người 2"
                                            }]}
                                            onChange={this.handleApproverChange}
                                            multiple={true}
                                        />
                                        <ErrorLabel content={errorApprover} />
                                    </div>
                                    <div className={`form-group ${!errorResponsibles ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.users')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-accountables-bill-issue-product-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={responsibles}
                                            items={[{
                                                value: 1, text: "Người 1"
                                            }, {
                                                value: 2, text: "Người 2"
                                            }]}
                                            onChange={this.handleResponsiblesChange}
                                            multiple={true}
                                        />
                                        <ErrorLabel content={errorResponsibles} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group ${!errorAccountables ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.bill_management.accountables')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-responsibles-bill-issue-product-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={accountables}
                                            items={[{
                                                value: 1, text: "Người 1"
                                            }, {
                                                value: 2, text: "Người 2"
                                            }]}
                                            onChange={this.handleAccountablesChange}
                                            multiple={true}
                                        />
                                        <ErrorLabel content={errorAccountables} />
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.receiver')}</legend>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.name')}<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleNameChange} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.phone')}<span className="attention"> * </span></label>
                                        <input type="number" className="form-control" onChange={this.handlePhoneChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.email')}<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleEmailChange} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.bill_management.address')}<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleAddressChange} />
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>
                                {/* <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{translate('manage_warehouse.bill_management.choose_good')}</label>
                                        <SelectBox
                                            id={`select-good-issue-product-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={good.good ? good.good._id : '1'}
                                            items={listGoods}
                                            onChange={this.handleGoodChange}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{translate('manage_warehouse.bill_management.number')}</label>
                                        <div style={{ display: "flex" }}><input className="form-control" value={good.quantity} onChange={this.handleQuantityChange} disabled type="number" />{good.good && <i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: '5px', marginTop: '9px', cursor: 'pointer' }} onClick={() => this.addQuantity()}></i>}</div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>{translate('manage_warehouse.bill_management.description')}</label>
                                        <textarea type="text" className="form-control" value={good.description} onChange={this.handleGoodDescriptionChange} />
                                    </div>
                                </div> */}
                                <div className={`form-group`}>
                                    {/* Bảng thông tin chi tiết */}
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                <th title={translate('manage_warehouse.bill_management.good_code')}>{translate('manage_warehouse.bill_management.good_code')}</th>
                                                <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                                <th>{translate('task_template.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-bill-create`}>
                                            {
                                                (typeof listGood === 'undefined' || listGood.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                    listGood.map((x, index) =>
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.good.code}</td>
                                                            <td>{x.good.name}</td>
                                                            <td>{x.good.baseUnit}</td>
                                                            <td>{x.quantity}</td>
                                                            <td>{x.description}</td>
                                                            <td>
                                                                <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditGood(x, index)}><i className="material-icons"></i></a>
                                                                <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteGood(index)}><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                    )
                                            }
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
    const { bills } = state;
    return { bills }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodReceiptCreateFrom));