import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';

class CrmCustomerInformation extends Component {
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
        const {customer} = this.props;
        const {id, name, liabilities} = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-customer-information" isLoading={customer.isLoading}
                    formID="form-customer-information"
                    title="Thông tin chi tiết khách hàng"
                    func={this.save} size="100"
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-customer-information">
                        <fieldset className="field-box-info">
                            <legend className="legend-box-info">Thông tin cá nhân</legend>
                            
                            <div className="row">
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <b>Khách hàng: </b> {name}<br/>
                                    <b>Nhóm: </b> VIP<br/>
                                    <b>SĐT: </b> 0396629955<br/>
                                    <b>Email: </b> tmhanh@gmail.com<br/>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <b>Giới tính: </b> Nữ<br/>
                                    <b>Ngày sinh: </b> 13/05/1997<br/>
                                    <b>Mô tả: </b> <br/>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <b>Người phụ trách: </b> Nguyễn Văn Danh<br/>
                                    <b>Chiết khấu: </b> 5%<br/>
                                    <b>Hình thức thanh toánh: </b> Thẻ<br/>
                                </div>
                            </div>
                            
                        </fieldset>
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#customer-info-history" data-toggle="tab">Lịch sử mua hàng</a></li>
                                <li><a href="#sale" data-toggle="tab">Công nợ</a></li>
                                <li><a href="#address" data-toggle="tab">Địa chỉ</a></li>
                                <li><a href="#note" data-toggle="tab">Ghi chú</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="customer-info-history">
                                    Lịch sử mua hàng
                                </div>
                                <div className="tab-pane" id="sale">
                                    Công nợ
                                    <table className="table table-hover table-striped table-bordered" id={`table-customer-liabilities-${id}`}>
                                        <thead>
                                            <tr>
                                                <th>Mã phiếu</th>
                                                <th>Người tạo</th>
                                                <th>Ngày tạo</th>
                                                <th>Tổng công nợ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                liabilities.map(lia=>
                                                <tr>
                                                    <td>{lia.code}</td>
                                                    <td>{lia.creator.name}</td>
                                                    <td>abc</td>
                                                    <td>{lia.total}</td>
                                                </tr> )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tab-pane" id="address">
                                    Địa chỉ
                                </div>
                                <div className="tab-pane" id="note">
                                    Ghi chú
                                </div>
                            </div>
                        </div>
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                name: nextProps.name,
                liabilities: nextProps.liabilities,
            }
        } else {
            return null;
        }
    }
}

function mapStateToProps(state) {
    const { customer } = state;
    return { customer };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerInformation));