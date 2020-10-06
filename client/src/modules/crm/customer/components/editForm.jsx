import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmCustomerActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { DialogModal, SelectBox, DatePicker } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';

class CrmCustomerEdit extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            editingCustomer: {},
        }
    }

    render() {
        const { translate, crm, user } = this.props;
        const { editingCustomer } = this.state;
        const { groups } = crm;

        // Lấy thành viên trong đơn vị
        let unitMembers = [];
        if (user.usersOfChildrenOrganizationalUnit) {
            unitMembers = getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit);
        }

        // Lấy danh sách nhóm khách hàng
        let listGroups;
        if (groups.list && groups.list.length > 0) {
            listGroups = groups.list.map(x => { return { value: x._id, text: x.name } })
            listGroups.unshift({ value: '', text: 'Chọn nhóm khách hàng' });
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-customer-edit" isLoading={crm.customers.isLoading}
                    formID="form-crm-customer-edit"
                    title={translate("crm.customer.edit")}
                    size={75}
                    func={this.save}
                >
                    {/* Form chỉnh sửa khách hàng mới */}
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#Customer-general" data-toggle="tab" >Thông tin chung</a></li>
                            <li><a href="#Customer-fileAttachment" data-toggle="tab">Tài liệu liên quan</a></li>
                        </ul>
                        <div className="tab-content">
                            {/* Tab thông tin chung */}
                            <div id="Customer-general" className="tab-pane active">
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Người quản lý khách hàng*/}
                                        <div className={`form-group`} >
                                            <label className="control-label">{translate('crm.customer.owner')}<span className="text-red">*</span></label>
                                            {unitMembers &&
                                                <SelectBox
                                                    id={`customer-ownwe-edit-form`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={unitMembers}
                                                    value={editingCustomer.owner ? editingCustomer.owner : []}
                                                    onChange={this.handleChangeCustomerOwner}
                                                    multiple={true}
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* nguồn lấy được khách hàng */}
                                        <div className={`form-group`} >
                                            <label className="control-label">{translate('crm.customer.source')}</label>
                                            <input type="Name" className="form-control" value={editingCustomer.customerSource ? editingCustomer.customerSource : ''} onChange={this.handleChangeCustomerSource} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Mã khách hàng */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.code')}<span className="text-red">*</span></label>
                                            <input type="Name" className="form-control" value={editingCustomer.code ? editingCustomer.code : ''} onChange={this.handleChangeCustomerCode} />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Tên khách hàng */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.name')}<span className="text-red">*</span></label>
                                            <input type="Name" className="form-control" value={editingCustomer.name ? editingCustomer.name : ''} onChange={this.handleChangeCustomerName} />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Tên công ty */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.company')} </label>
                                            <input type="text" className="form-control" value={editingCustomer.company ? editingCustomer.company : ''} onChange={this.handleChangeCustomerCompany} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Ngày thành lập công ty */}
                                        <div className="form-group">
                                            <label>{translate('crm.customer.companyEstablishmentDate')}</label>
                                            <DatePicker
                                                id="companyEstablishmentDate-edit-form"
                                                value={editingCustomer.companyEstablishmentDate ? editingCustomer.companyEstablishmentDate : ''}
                                                onChange={this.handleChangeCompanyEstablishmentDate}
                                                disabled={false}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Số điện thoại di động*/}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.mobilephoneNumber')} </label>
                                            <input type="text" className="form-control" value={editingCustomer.mobilephoneNumber ? editingCustomer.mobilephoneNumber : ''} onChange={this.handleChangeMobilephoneNumber} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Số điện thoại cố định */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.telephoneNumber')}</label>
                                            <input type="text" className="form-control" value={editingCustomer.telephoneNumber ? editingCustomer.telephoneNumber : ''} onChange={this.handleChangeTelephoneNumber} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Địa chỉ email*/}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.email')} </label>
                                            <input type="email" className="form-control" value={editingCustomer.email ? editingCustomer.email : ''} onChange={this.handleChangeCustomerEmail} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Địa chỉ email*/}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.secondaryEmail')}</label>
                                            <input type="email" className="form-control" value={editingCustomer.email2 ? editingCustomer.email2 : ''} onChange={this.handleChangeCustomerEmail2} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Địa chỉ 1 */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.address')}</label>
                                            <input type="text" className="form-control" value={editingCustomer.address ? editingCustomer.address : ''} onChange={this.handleChangeCustomerAddress} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Địa chỉ 2 */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.address2')} </label>
                                            <input type="text" className="form-control" value={editingCustomer.address2 ? editingCustomer.address2 : ''} onChange={this.handleChangeCustomerAddress2} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Giới tính */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.gender')}</label>
                                            <SelectBox
                                                id={`customer-gender-edit-form`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={
                                                    [
                                                        { value: 0, text: 'Nam' },
                                                        { value: 1, text: 'Nữ' },
                                                    ]
                                                }
                                                value={editingCustomer.gender ? editingCustomer.gender : ''}
                                                onChange={this.handleChangeCustomerGender}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Ngày sinh*/}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.birth')}</label>
                                            <DatePicker
                                                id="birth-date-edit-form"
                                                value={editingCustomer.birthDate ? editingCustomer.birthDate : ''}
                                                onChange={this.handleChangeCustomerBirth}
                                                disabled={false}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>{translate('crm.customer.group')}</label>
                                            {
                                                listGroups &&
                                                <SelectBox
                                                    id={`customer-group-edit-form`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={
                                                        listGroups
                                                    }
                                                    value={editingCustomer.group ? editingCustomer.group : ''}
                                                    onChange={this.handleChangeCustomerGroup}
                                                    multiple={false}
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>{translate('crm.customer.status')}</label>
                                            <SelectBox
                                                id={`customer-status-edit-form`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={
                                                    [
                                                        { value: 0, text: 'Khách hàng mới' },
                                                        { value: 1, text: 'Quan tâm đến sản phẩm ' },
                                                        { value: 2, text: 'Đã báo giá ' },
                                                        { value: 3, text: 'Đã mua sản phẩm ' },
                                                        { value: 4, text: 'Đã kí hợp đồng' },
                                                        { value: 5, text: 'Dừng liên hệ ' },
                                                    ]
                                                }
                                                value={editingCustomer.status ? editingCustomer.status : ''}
                                                onChange={this.handleChangeCustomerGender}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>{translate('crm.customer.location')}  </label>
                                            <SelectBox
                                                id={`customer-gender-edit-form`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={
                                                    [
                                                        { value: 0, text: 'Bắc' },
                                                        { value: 1, text: 'Trung ' },
                                                        { value: 2, text: 'Name ' },
                                                    ]
                                                }
                                                value={editingCustomer.location ? editingCustomer.location : ''}
                                                onChange={this.handleChangeCustomerLocation}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>{translate('crm.customer.taxNumber')}</label>
                                            <input type="text" className="form-control" value={editingCustomer.taxNumber ? editingCustomer.taxNumber : ''} onChange={this.handleChangeTaxNumber} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>{translate('crm.customer.website')}</label>
                                            <input type="text" className="form-control" value={editingCustomer.website ? editingCustomer.website : ''} onChange={this.handleChangeWebsite} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>{translate('crm.customer.linkedIn')}</label>
                                            <input type="text" className="form-control" value={editingCustomer.linkedIn ? editingCustomer.linkedIn : ''} onChange={this.handleChangeLinkedIn} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tab file liên quan đến khách hàng */}
                            <div id="Customer-fileAttachment" className="tab-pane">

                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }

    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date
    }

    save = () => {
        const { editingCustomer, customerIdEdit } = this.state;
        return this.props.editCustomer(customerIdEdit, editingCustomer);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.customerIdEdit !== state.customerIdEdit) {
            props.getCustomer(props.customerIdEdit);
            return {
                dataStatus: 1,
                customerIdEdit: props.customerIdEdit,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        let { editingCustomer } = this.state;
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.crm.customers.isLoading) {
            let customer = nextProps.crm.customers.customerById;
            editingCustomer = {
                ...editingCustomer,
                owner: customer && customer.owner.map(o => o._id),
                code: customer && customer.code,
                name: customer && customer.name,
                company: customer && customer.company,
                creator: customer && customer.creator,
                gender: customer && customer.gender,
                taxNumber: customer && customer.taxNumber,
                customerSource: customer && customer.customerSource,
                companyEstablishmentDate: customer && this.formatDate(customer.companyEstablishmentDate),
                birthDate: customer && this.formatDate(customer.birthDate),
                telephoneNumber: customer && customer.telephoneNumber,
                mobilephoneNumber: customer && customer.mobilephoneNumber,
                email: customer && customer.email,
                email2: customer && customer.email2,
                group: customer && customer.group,
                address: customer && customer.address,
                address2: customer && customer.address2,
                location: customer && customer.location,
                website: customer && customer.website,
                linkedIn: customer && customer.linkedIn,
            }
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                editingCustomer,
            })
            return false;
        }

        if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return false;
        }


        return true;
    }

    handleChangeCustomerOwner = (value) => {
        const { editingCustomer } = this.state;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                owner: value,
            }
        })
    }

    handleChangeCustomerSource = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                customerSource: value,
            }
        })
    }

    handleChangeCustomerCode = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                code: value,
            }
        })
    }

    handleChangeCustomerName = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                name: value,
            }
        });
    }

    handleChangeCustomerCompany = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                company: value,
            }
        });
    }

    handleChangeCompanyEstablishmentDate = (value) => {
        const { editingCustomer } = this.state;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                companyEstablishmentDate: value,
            }
        })
    }

    handleChangeMobilephoneNumber = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                mobilephoneNumber: parseInt(value),
            }
        });
    }

    handleChangeTelephoneNumber = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                telephoneNumber: parseInt(value),
            }
        });
    }

    handleChangeCustomerEmail = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                email: value,
            }
        });
    }

    handleChangeCustomerEmail2 = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                email2: value,
            }
        });
    }

    handleChangeCustomerAddress = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                address: value,
            }
        });
    }

    handleChangeCustomerAddress2 = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                address2: value,
            }
        });
    }

    handleChangeCustomerGender = (value) => {
        const { editingCustomer } = this.state;
        value = value[0];
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                gender: value,
            }
        })
    }

    handleChangeCustomerBirth = (value) => {
        const { editingCustomer } = this.state;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                birthDate: value,
            }
        })
    }

    handleChangeCustomerGroup = (value) => {
        const { editingCustomer } = this.state;
        value = value[0];
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                group: value,
            }
        })
    }

    handleChangeCustomerLocation = (value) => {
        const { editingCustomer } = this.state;
        value = value[0];
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                location: parseInt(value),
            }
        })
    }

    handleChangeTaxNumber = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                taxNumber: value,
            }
        });
    }

    handleChangeWebsite = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                website: value,
            }
        });
    }

    handleChangeLinkedIn = (e) => {
        const { editingCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                linkedIn: value,
            }
        });
    }
}

function mapStateToProps(state) {
    const { crm, user, auth } = state;
    return { crm, user, auth };
}

const mapDispatchToProps = {
    getCustomer: CrmCustomerActions.getCustomer,
    editCustomer: CrmCustomerActions.editCustomer,

    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerEdit));