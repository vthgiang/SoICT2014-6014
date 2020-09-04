import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel, DateTimeConverter } from '../../../../common-components';

class CrmCustomerInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: {}
        }
    }

    render() {
        const { translate, crm } = this.props;
        const { customer } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-customer-info" isLoading={crm.customer.isLoading}
                    formID="form-crm-customer-info"
                    title="Thông tin chi tiết khách hàng"
                    func={this.save} size={100}
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-crm-customer-info">
                        
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                                <div style={{ 
                                    padding: '20px', 
                                    border: '1px solid #D2D6DE',
                                    backgroundColor: '#F1F1F1',
                                    marginBottom: '20px',
                                    borderRadius: '5px',
                                }}>
                                    <div className="text-center">
                                        <img className="img-circle" src="/image/crm-customer.png" style={{width: '60%'}}/>
                                    </div>
                                    <h3 className="text-center"><b>{customer.name}</b></h3><hr/>
                                    <strong><i className="fa fa-barcode margin-r-5" /> {translate('crm.customer.code')}</strong>
                                    <p className="text-muted">{customer.code}</p>
                                    <strong><i className="fa fa-group margin-r-5" /> {translate('crm.customer.group')}</strong>
                                    <p className="text-muted">{customer.group.name}</p>
                                    <strong><i className="fa fa-book margin-r-5" /> {translate('crm.customer.tax')}</strong>
                                    <p className="text-muted">{customer.tax}</p>
                                    <strong><i className="fa fa-envelope margin-r-5" /> {translate('crm.customer.email')}</strong>
                                    <p className="text-muted">{customer.email}</p>
                                    <strong><i className="fa fa-phone margin-r-5" /> {translate('crm.customer.phone')}</strong>
                                    <p className="text-muted">{customer.phone}</p>
                                    <strong><i className="fa fa-map-marker margin-r-5" /> {translate('crm.customer.address')}</strong>
                                    <p className="text-muted">{customer.address}</p>
                                    <strong><i className="fa fa-birthday-cake margin-r-5" /> {translate('crm.customer.birth')}</strong>
                                    <p className="text-muted"><DateTimeConverter dateTime={customer.birth} type={"DD-MM-YYYY"}/></p>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-9 col-lg-9">
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
                                            <table className="table table-hover table-striped table-bordered" id={`table-customer-liabilities-${customer._id}`}>
                                                <thead>
                                                    <tr>
                                                        <th>Mã phiếu</th>
                                                        <th>Người tạo</th>
                                                        <th>Ngày tạo</th>
                                                        <th>Tổng công nợ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* {
                                                        liabilities.map(lia=>
                                                        <tr>
                                                            <td>{lia.code}</td>
                                                            <td>{lia.creator.name}</td>
                                                            <td>abc</td>
                                                            <td>{lia.total}</td>
                                                        </tr> )
                                                    } */}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerInformation));