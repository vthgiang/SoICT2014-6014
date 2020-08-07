import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, DatePicker } from '../../../../common-components';
import { CustomerActions } from '../../redux/actions';
import {list as locations} from './location';

class CustomerCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerBirth: ''
        }
    }

    render() {
        const { translate } = this.props;
        const {customers, group} = this.props.customer;

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
                                            onChange={this.handleParents}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" className="form-control" onChange={this.handleName} />
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
                                            onChange={this.handleParents}
                                            multiple={false}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mã số thuế</label>
                                        <input type="text" className="form-control" onChange={this.handleName} />
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
                                        <input type="text" className="form-control" onChange={this.handleName} />
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
                                            onChange={this.handleParents}
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
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                            <div className="form-group">
                                <label>Ưu đãi áp dụng</label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
    
    handleBirth = (value) => {
        this.setState({
            ...this.state,
            customerBirth: value
        });
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

    save = () => {
        return this.props.create({
            name: this.state.customerName,
            code: this.state.customerCode,
            phone: this.state.customerPhone
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