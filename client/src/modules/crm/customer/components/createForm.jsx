import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, DatePicker } from '../../../../common-components';
import { CrmCustomerActions } from '../redux/actions';
import moment from 'moment';

class CrmCustomerCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            birth: '',
            sale: 'group',
        }
    }

    render() {
        const { translate, crm } = this.props;
        const {sale} = this.state;

        return (
            <React.Fragment>
                <ButtonModal button_name={translate('general.add')} modalID={"modal-crm-customer-create"} title={translate('crm.customer.add')}/>
                <DialogModal
                    modalID="modal-crm-customer-create" isLoading={crm.customer.isLoading}
                    formID="form-crm-customer-create"
                    title={translate("crm.customer.add")}
                    func={this.save}
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-crm-customer-create">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('crm.customer.info')}</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{translate('crm.customer.name')}<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('crm.customer.code')}<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleCode} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('crm.customer.phone')}<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handlePhone} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('crm.customer.group')}</label>
                                        <SelectBox
                                            id="select-customer-group"
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={
                                                [].map(g => { return { value: g._id, text: g.name} })
                                            }
                                            onChange={this.handleGroup}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{translate('crm.customer.email')}</label>
                                        <input type="text" className="form-control" onChange={this.handleEmail} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('crm.customer.birth')}</label>
                                        <DatePicker
                                            id="create-customer-birth"
                                            value={this.state.customerBirth}
                                            onChange={this.handleBirth}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('crm.customer.gender')}</label>
                                        <SelectBox
                                            id="select-customer-gender"
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[
                                                {value: 'Nam', text: 'Nam'},
                                                {value: 'Nữ', text: 'Nữ'},
                                                {value: 'Khác', text: 'Khác'},
                                            ]}
                                            onChange={this.handleGender}
                                            multiple={false}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('crm.customer.tax')}</label>
                                        <input type="text" className="form-control" onChange={this.handleTax} />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('crm.customer.contact')}</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{translate('crm.customer.address')}</label>
                                        <input type="text" className="form-control" onChange={this.handleAddress} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{translate('crm.customer.location')}</label>
                                        <SelectBox
                                            id="select-customer-location"
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            // items={location.list.map(location=>{
                                            //     return {
                                            //         value: location.SolrID,
                                            //         text: location.Title
                                            //     }
                                            // })}
                                            items={[]}
                                            onChange={this.handleLocation}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('crm.customer.advance')}</legend>
                            <div className="form-group">
                                <label>{translate('crm.customer.carier')}</label>
                                <input type="text" className="form-control" onChange={this.handleCaregiver} />
                            </div>
                            <div className="form-group">
                                <label>{translate('crm.customer.description')}</label>
                                <input type="text" className="form-control" onChange={this.hanldeDescription} />
                            </div>
                            <div className="form-group">
                                <label>{translate('crm.customer.discount')}</label><br/>
                                <div style={{padding: '10px', backgroundColor: '#F1F1F1', marginBottom: '5px'}}>
                                    <div className="radio-inline">
                                        <span>
                                            <input type="radio" name={`sale-group`} value="group" onChange={this.hanldeSaleGroup}
                                                checked={sale === "group" ? true : false} />{translate('crm.customer.by_group')}</span>
                                    </div>
                                    <div className="radio-inline">
                                        <span>
                                            <input type="radio" name={`sale-customer`} value="customer" onChange={this.hanldeSaleCustomer}
                                                checked={sale !== "group" ? true : false} />{translate('crm.customer.by_customer')}</span>
                                    </div>
                                </div>
                                <div id="create-sale-customer-option" style={{display: 'none'}}>
                                    <div className="form-group">
                                        <label>(%)</label>
                                        <input type="number" className="form-control" onChange={this.handleDiscount} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('crm.customer.payment')}</label>
                                        <SelectBox
                                            id={`select-customer-sale-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[
                                                { value: 'cod', text: 'COD' },
                                                { value: 'point', text: 'Thanh toán bằng điểm' },
                                                { value: 'ck', text: 'Chuyển khoản' },
                                                { value: 'tm', text: 'Tiền mặt' },
                                                { value: 'qt', text: 'Quẹt thẻ' }
                                            ]}
                                            onChange={this.handlePayment}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }

    handleName = (e) => {
        const { value } = e.target;
        this.setState({
            name: value
        });
    }

    handleCode = (e) => {
        const { value } = e.target;
        this.setState({
            code: value
        });
    }

    handlePhone = (e) => {
        const { value } = e.target;
        this.setState({
            phone: value
        });
    }

    handleGroup = (value) => {
        this.setState({
            group: value[0]
        })
    }

    handleEmail = (e) => {
        const {value} = e.target;
        this.setState({
            email: value
        })
    }

    handleBirth = (value) => {
        this.setState({
            ...this.state,
            birth: moment(value, "DD-MM-YYYY").format("MM-DD-YYYY")
        });
    }

    handleGender = (value) => {
        this.setState({
            gender: value[0]
        })
    }

    hanldeSaleGroup = (e) => {
        const {value} = e.target;
        this.setState({
            sale: value
        })
        window.$('#create-sale-customer-option').hide();
    }

    hanldeSaleCustomer = (e) => {
        const {value} = e.target;
        this.setState({
            sale: value
        })
        window.$('#create-sale-customer-option').show();
    }

    handleAddress = (e) => {
        const {value} = e.target;
        this.setState({
            address: value
        })
    }

    handleLocation = (value) => {
        this.setState({
            location: value[0]
        })
    }

    save = () => {
        return this.props.create({
            name: this.state.name,
            code: this.state.code,
            phone: this.state.phone,
            address: this.state.address,
            location: this.state.location,
            email: this.state.email,
            group: this.state.group,
            birth: this.state.birth
        });
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    createCustomer: CrmCustomerActions.createCustomer
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerCreate));