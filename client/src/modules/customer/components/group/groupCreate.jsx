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
        const {customers, group} = this.props.customer;
        const {nameError} = this.state;

        return (
            <React.Fragment>
                {/* Button thêm khách hàng mới */}
                <ButtonModal modalID="modal-create-customer-group" button_name="Thêm mới" title="Thêm nhóm khách hàng mới" />

                <DialogModal
                    modalID="modal-create-customer-group" isLoading={group.isLoading}
                    formID="form-create-customer-group"
                    title="Thêm mới nhóm khách hàng"
                    func={this.save}
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-create-customer-group">
                        <fieldset className="field-box-info">
                            <legend className="legend-box-info">Thông tin chung</legend>
                            <div className="form-group">
                                <label>Tên nhóm khách hàng<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                            <div className="form-group">
                                <label>Mã nhóm<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea type="text" className="form-control" onChange={this.handleName} />
                            </div>
                        </fieldset>
                        <fieldset className="field-box-info">
                            <legend className="legend-box-info">Nâng cao</legend>
                            <div className="form-group">
                                <label>Giá mặc định</label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                            <div className="form-group">
                                <label>Thuế mặc định</label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                            <div className="form-group">
                                <label>Phương thức thanh toán</label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                            <div className="form-group">
                                <label>Kỳ hạn thanh toán</label>
                                <input type="text" className="form-control" onChange={this.handleName} />
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