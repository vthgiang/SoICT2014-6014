import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, DatePicker } from '../../../../common-components';
import { CustomerActions } from '../redux/actions';
import moment from 'moment';

class CrmCustomerEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: {},
            birth: '',
            sale: 'group'
        }
    }

    render() {
        const { translate, crm } = this.props;
        const { _id, name, code, phone, email, group, sale, location, gender, address, birth } = this.state.customer;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-customer-edit" isLoading={crm.customer.isLoading}
                    formID="form-crm-customer-edit"
                    title={translate("crm.customer.add")}
                    func={this.save}
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-crm-customer-edit">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{translate('crm.customer.name')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" onChange={this.handleName} value={name}/>
                                </div>
                                <div className="form-group">
                                    <label>{translate('crm.customer.code')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" onChange={this.handleCode} value={code}/>
                                </div>
                                <div className="form-group">
                                    <label>{translate('crm.customer.group')}</label>
                                    <SelectBox
                                        id={`select-crm-customer-edit-group-${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            [].map(g => { return { value: g._id, text: g.name} })
                                        }
                                        value={group}
                                        onChange={this.handleGroup}
                                        multiple={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{translate('crm.customer.location')}</label>
                                    <SelectBox
                                        id={`select-customer-edit-location-${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[]}
                                        value={location}
                                        onChange={this.handleLocation}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{translate('crm.customer.phone')}</label>
                                    <input type="text" className="form-control" onChange={this.handlePhone} value={phone}/>
                                </div>
                                <div className="form-group">
                                    <label>{translate('crm.customer.email')}</label>
                                    <input type="text" className="form-control" onChange={this.handleEmail} value={email}/>
                                </div>
                                <div className="form-group">
                                    <label>{translate('crm.customer.gender')}</label>
                                    <SelectBox
                                        id={`select-customer-edit-gender-${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[
                                            {value: 'Nam', text: 'Nam'},
                                            {value: 'Nữ', text: 'Nữ'},
                                            {value: 'Khác', text: 'Khác'},
                                        ]}
                                        value={gender}
                                        onChange={this.handleGender}
                                        multiple={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{translate('crm.customer.birth')}</label>
                                    <DatePicker
                                        id={`create-customer-edit-birth-${_id}`}
                                        value={moment(birth).format("DD-MM-YYYY")}
                                        onChange={this.handleBirth}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate('crm.customer.address')}</label>
                                    <input type="text" className="form-control" onChange={this.handleAddress} value={address}/>
                                </div>
                            </div>
                        </div>
                        
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('crm.customer.advance')}</legend>
                            <div className="form-group">
                                <label>{translate('crm.customer.carier')}</label>
                                <input type="text" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label>{translate('crm.customer.description')}</label>
                                <input type="text" className="form-control"/>
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
                                        <input type="number" className="form-control"/>
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('crm.customer.payment')}</label>
                                        <SelectBox
                                            id={`select-customer-sale-edit-${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[
                                                { value: 'cod', text: 'COD' },
                                                { value: 'point', text: 'Thanh toán bằng điểm' },
                                                { value: 'ck', text: 'Chuyển khoản' },
                                                { value: 'tm', text: 'Tiền mặt' },
                                                { value: 'qt', text: 'Quẹt thẻ' }
                                            ]}
                                            // onChange={this.handlePayment}
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
    
    convertBirth = (birth) => {
        const date = new Date(birth);
        return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
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
            phone: this.state.phone
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.customer._id !== prevState.customer._id) {
            return {
                ...prevState,
                customer: nextProps.customer
            }
        } else {
            return null;
        }
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerEdit));