import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, DatePicker } from '../../../../common-components';
import { CustomerActions } from '../../redux/actions';
import {list as locations} from './location';
import moment from 'moment';

class CustomerCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerBirth: '',
            customerSale: 'group'
        }
    }

    render() {
        const { translate } = this.props;
        const {customers, group} = this.props.customer;
        const {customerSale} = this.state;
        console.log("State: ", this.state)

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-customer" isLoading={customers.isLoading}
                    formID="form-create-customer"
                    title="Thêm mới khách hàng"
                    func={this.save}
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-create-role">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin chung</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Tên khách hàng<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} />
                                    </div>
                                    <div className="form-group">
                                        <label>Mã khách hàng<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleCode} />
                                    </div>
                                    <div className="form-group">
                                        <label>Số điện thoại<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handlePhone} />
                                    </div>
                                    <div className="form-group">
                                        <label>Nhóm khách hàng</label>
                                        <SelectBox
                                            id="select-customer-group"
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={
                                                group.list.map(g => { return { value: g._id, text: g.name} })
                                            }
                                            onChange={this.handleGroup}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" className="form-control" onChange={this.handleEmail} />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày sinh</label>
                                        <DatePicker
                                            id="create-customer-birth"
                                            value={this.state.customerBirth}
                                            onChange={this.handleBirth}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Giới tính</label>
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
                                        <label>Mã số thuế</label>
                                        <input type="text" className="form-control" onChange={this.handleTax} />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin liên hệ</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Địa chỉ</label>
                                        <input type="text" className="form-control" onChange={this.handleAddress} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Khu vực</label>
                                        <SelectBox
                                            id="select-customer-location"
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={locations.map(location=>{
                                                return {
                                                    value: location.Title,
                                                    text: location.Title
                                                }
                                            })}
                                            onChange={this.handleLocation}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin khác</legend>
                            <div className="form-group">
                                <label>Nhân viên chăm sóc</label>
                                <input type="text" className="form-control" onChange={this.handleCaregiver} />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <input type="text" className="form-control" onChange={this.hanldeDescription} />
                            </div>
                            <div className="form-group">
                                <label>Ưu đãi áp dụng</label><br/>
                                <div style={{padding: '10px', backgroundColor: '#F1F1F1', marginBottom: '5px'}}>
                                    <div className="radio-inline">
                                        <span>
                                            <input type="radio" name={`sale-group`} value="group" onChange={this.hanldeSaleGroup}
                                                checked={customerSale === "group" ? true : false} />Theo nhóm khách hàng</span>
                                    </div>
                                    <div className="radio-inline">
                                        <span>
                                            <input type="radio" name={`sale-customer`} value="customer" onChange={this.hanldeSaleCustomer}
                                                checked={customerSale !== "group" ? true : false} />Theo khách hàng</span>
                                    </div>
                                </div>
                                <div id="create-sale-customer-option" style={{display: 'none'}}>
                                    <div className="form-group">
                                        <label>Chiết khấu (%)</label>
                                        <input type="number" className="form-control" onChange={this.handleDiscount} />
                                    </div>
                                    <div className="form-group">
                                        <label>Hình thức thanh toán</label>
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
            customerName: value
        });
    }

    handleCode = (e) => {
        const { value } = e.target;
        this.setState({
            customerCode: value
        });
    }

    handlePhone = (e) => {
        const { value } = e.target;
        this.setState({
            customerPhone: value
        });
    }

    handleGroup = (value) => {
        this.setState({
            customerGroup: value[0]
        })
    }

    handleEmail = (e) => {
        const {value} = e.target;
        this.setState({
            customerEmail: value
        })
    }

    handleBirth = (value) => {
        this.setState({
            ...this.state,
            customerBirth: moment(value, "DD-MM-YYYY").format("MM-DD-YYYY")
        });
    }

    handleGender = (value) => {
        this.setState({
            customerGender: value[0]
        })
    }

    hanldeSaleGroup = (e) => {
        const {value} = e.target;
        this.setState({
            customerSale: value
        })
        window.$('#create-sale-customer-option').hide();
    }

    hanldeSaleCustomer = (e) => {
        const {value} = e.target;
        this.setState({
            customerSale: value
        })
        window.$('#create-sale-customer-option').show();
    }

    handleAddress = (e) => {
        const {value} = e.target;
        this.setState({
            customerAddress: value
        })
    }

    handleLocation = (value) => {
        this.setState({
            customerLocation: value[0]
        })
    }

    save = () => {
        return this.props.create({
            name: this.state.customerName,
            code: this.state.customerCode,
            phone: this.state.customerPhone,
            address: this.state.customerAddress,
            location: this.state.customerLocation,
            email: this.state.customerEmail,
            group: this.state.customerGroup,
            birth: this.state.customerBirth
        });
    }
}

function mapStateToProps(state) {
    const { customer } = state;
    return { customer };
}

const mapDispatchToProps = {
    create: CustomerActions.createCustomer
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CustomerCreate));