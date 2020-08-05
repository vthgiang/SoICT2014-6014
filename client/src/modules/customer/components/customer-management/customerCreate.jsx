import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';

class CustomerCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleName: '',
            roleParents: [],
            roleUsers: []
        }
    }

    render() {
        const { translate } = this.props;
        const {customers} = this.props.customer;
        const {nameError} = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-customer" isLoading={customers.isLoading}
                    formID="form-create-customer"
                    title="Thêm mới khách hàng"
                    func={this.save} size="100"
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-create-role">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin chung</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Tên khách hàng<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                    <div className="form-group">
                                        <label>Số điện thoại<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                    <div className="form-group">
                                        <label>Nhóm khách hàng<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                    <div className="form-group">
                                        <label>Giới tính<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Mã khách hàng<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                    <div className="form-group">
                                        <label>Email<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày sinh<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                    <div className="form-group">
                                        <label>Mã số thuế<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin liên hệ</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Địa chỉ<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Khu vực<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName} /><br />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin khác</legend>
                            <div className="form-group">
                                <label>Nhân viên chăm sóc<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleName} /><br />
                            </div>
                            <div className="form-group">
                                <label>Mô tả<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleName} /><br />
                            </div>
                            <div className="form-group">
                                <label>Ưu đãi áp dụng<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleName} /><br />
                            </div>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }

    componentDidMount() {
   
    }

    // Xy ly va validate role name
    handleRoleName = (e) => {
        const { value } = e.target;
        this.validateRoleName(value, true);
    }

    handleParents = (value) => {
        this.setState(state => {
            return {
                ...state,
                roleParents: value
            }
        });
    }

    handleUsers = (value) => {
        this.setState(state => {
            return {
                ...state,
                roleUsers: value
            }
        });
    }

    handleRoleUser = (e) => {
        const { value } = e.target;
        this.setState(state => {
            return {
                ...state,
                roleUsers: [value]
            }
        });
    }

    isFormValidated = () => {
        let result = this.validateRoleName(this.state.roleName, false);
        return result;
    }

    save = () => {
        const data = {
            name: this.state.roleName,
            parents: this.state.roleParents,
            users: this.state.roleUsers
        }

        if (this.isFormValidated()) {
            return this.props.create(data);
        }
    }
}

function mapStateToProps(state) {
    const { customer } = state;
    return { customer };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CustomerCreate));