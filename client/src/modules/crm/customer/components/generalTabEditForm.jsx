import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, DatePicker, ErrorLabel } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { CrmGroupActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';


class GeneralTabEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { translate, crm, user } = this.props;
        const { editingCustomer, id } = this.props;
        const { owner, group, status, gender, location, customerCodeError, customerNameError, customerTaxNumberError } = this.state;
        // console.log('this.state', this.state)

        // Lấy thành viên trong đơn vị
        let unitMembers = [];
        if (user.usersOfChildrenOrganizationalUnit) {
            unitMembers = getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit);
        }

        // Lấy danh sách nhóm khách hàng
        let listGroups;
        if (crm.groups.list && crm.groups.list.length > 0) {
            listGroups = crm.groups.list.map(x => { return { value: x._id, text: x.name } })
            listGroups.unshift({ value: '', text: '---Chọn---' });
        }

        // Lấy danh sách trạng thái khách hàng
        let listStatus;
        if (crm.status.list && crm.status.list.length > 0) {
            listStatus = crm.status.list.map(o => ({ value: o._id, text: o.name }))
            listStatus.unshift({ value: '', text: '---Chọn---' });
        }
        return (
            <React.Fragment>
                <div id={id} className="tab-pane active">
                    <div className="row">
                        {/* Người quản lý khách hàng*/}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.owner')}<span className="text-red">*</span></label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`customer-ownwe-edit-form`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        value={owner}
                                        onChange={this.handleChangeCustomerOwner}
                                        multiple={true}
                                    />
                                }
                            </div>
                        </div>

                        {/* nguồn lấy được khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.source')}</label>
                                <input type="Name" className="form-control" value={editingCustomer.customerSource ? editingCustomer.customerSource : ''} onChange={this.handleChangeCustomerSource} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Mã khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerCodeError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.code')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" value={editingCustomer.code ? editingCustomer.code : ''} onChange={this.handleChangeCustomerCode} />
                                <ErrorLabel content={customerCodeError} />
                            </div>
                        </div>

                        {/* Tên khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerNameError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.name')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" value={editingCustomer.name ? editingCustomer.name : ''} onChange={this.handleChangeCustomerName} />
                                <ErrorLabel content={customerNameError} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Tên công ty */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.company')} </label>
                                <input type="text" className="form-control" value={editingCustomer.company ? editingCustomer.company : ''} onChange={this.handleChangeCustomerCompany} />
                            </div>
                        </div>

                        {/* Ngày thành lập công ty */}
                        <div className="col-md-6">
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
                        {/* Số điện thoại di động*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.mobilephoneNumber')} </label>
                                <input type="text" className="form-control" value={editingCustomer.mobilephoneNumber ? editingCustomer.mobilephoneNumber : ''} onChange={this.handleChangeMobilephoneNumber} />
                            </div>
                        </div>

                        {/* Số điện thoại cố định */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.telephoneNumber')}</label>
                                <input type="text" className="form-control" value={editingCustomer.telephoneNumber ? editingCustomer.telephoneNumber : ''} onChange={this.handleChangeTelephoneNumber} />
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        {/* Địa chỉ email*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.email')} </label>
                                <input type="email" className="form-control" value={editingCustomer.email ? editingCustomer.email : ''} onChange={this.handleChangeCustomerEmail} />
                            </div>
                        </div>

                        {/* Địa chỉ email*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.secondaryEmail')}</label>
                                <input type="email" className="form-control" value={editingCustomer.email2 ? editingCustomer.email2 : ''} onChange={this.handleChangeCustomerEmail2} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Địa chỉ 1 */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address')}</label>
                                <input type="text" className="form-control" value={editingCustomer.address ? editingCustomer.address : ''} onChange={this.handleChangeCustomerAddress} />
                            </div>
                        </div>

                        {/* Địa chỉ 2 */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address2')} </label>
                                <input type="text" className="form-control" value={editingCustomer.address2 ? editingCustomer.address2 : ''} onChange={this.handleChangeCustomerAddress2} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Giới tính */}
                        <div className="col-md-6">
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
                                    value={gender}
                                    onChange={this.handleChangeCustomerGender}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* Ngày sinh*/}
                        <div className="col-md-6">
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
                        {/* Nhóm khách hàng */}
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
                                        value={group}
                                        onChange={this.handleChangeCustomerGroup}
                                        multiple={false}
                                    />
                                }
                            </div>
                        </div>

                        {/* Trạng thái khách hàng */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.status')}</label>
                                {
                                    listStatus &&
                                    <SelectBox
                                        id={`customer-status-edit-form`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={listStatus}
                                        value={status}
                                        onChange={this.handleChangeCustomerStatus}
                                        multiple={false}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* location */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.location')}  </label>
                                <SelectBox
                                    id={`customer-location-edit-form`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: 0, text: 'Bắc' },
                                            { value: 1, text: 'Trung ' },
                                            { value: 2, text: 'Nam ' },
                                        ]
                                    }
                                    value={location}
                                    onChange={this.handleChangeCustomerLocation}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* Mã số thuế */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerTaxNumberError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.taxNumber')}</label>
                                <input type="text" className="form-control" value={editingCustomer.taxNumber ? editingCustomer.taxNumber : ''} onChange={this.handleChangeTaxNumber} />
                                <ErrorLabel content={customerTaxNumberError} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Website  */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.website')}</label>
                                <input type="text" className="form-control" value={editingCustomer.website ? editingCustomer.website : ''} onChange={this.handleChangeWebsite} />
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.linkedIn')}</label>
                                <input type="text" className="form-control" value={editingCustomer.linkedIn ? editingCustomer.linkedIn : ''} onChange={this.handleChangeLinkedIn} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    static getDerivedStateFromProps(props, state) {
        let { editingCustomer } = props;
        if (props.customerIdEdit != state.customerIdEdit) {
            return {
                ...state,
                id: props.id,
                customerIdEdit: props.customerIdEdit,
                owner: editingCustomer.owner,
                location: editingCustomer.location ? editingCustomer.location : '',
                status: editingCustomer.status ? editingCustomer.status : '',
                group: editingCustomer.group ? editingCustomer.group : '',
                gender: editingCustomer.gender ? editingCustomer.gender : '',
            }
        } else {
            return null;
        }
    }

    handleChangeCustomerOwner = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            owner: value,
        });
        callBackFromParentEditForm('owner', value);
    }

    handleChangeCustomerSource = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            customerSource: value,
        });
        callBackFromParentEditForm('customerSource', value);
    }

    handleChangeCustomerCode = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            code: value,
        });

        // validate mã khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ customerCodeError: message });

        callBackFromParentEditForm('code', value);
    }

    handleChangeCustomerName = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            name: value,
        });

        // validate tên khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ customerNameError: message });

        callBackFromParentEditForm('name', value);
    }

    handleChangeCustomerCompany = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            company: value,
        });
        callBackFromParentEditForm('company', value);
    }

    handleChangeCompanyEstablishmentDate = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            companyEstablishmentDate: value,
        });
        callBackFromParentEditForm('companyEstablishmentDate', value);
    }

    handleChangeMobilephoneNumber = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            mobilephoneNumber: parseInt(value),
        });
        callBackFromParentEditForm('mobilephoneNumber', parseInt(value));
    }

    handleChangeTelephoneNumber = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            telephoneNumber: parseInt(value),
        });
        callBackFromParentEditForm('telephoneNumber', parseInt(value));
    }

    handleChangeCustomerEmail = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            email: value,
        });
        callBackFromParentEditForm('email', value);
    }

    handleChangeCustomerEmail2 = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            email2: value,
        });
        callBackFromParentEditForm('email2', value);
    }

    handleChangeCustomerAddress = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            address: value,
        });
        callBackFromParentEditForm('address', value);
    }

    handleChangeCustomerAddress2 = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            address2: value,
        });
        callBackFromParentEditForm('address2', value);
    }

    handleChangeCustomerGender = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            gender: value[0],
        });
        callBackFromParentEditForm('gender', value[0]);
    }

    handleChangeCustomerBirth = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            birthDate: value,
        });
        callBackFromParentEditForm('birthDate', value);
    }

    handleChangeCustomerGroup = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            group: value[0],
        });
        callBackFromParentEditForm('group', value[0]);
    }

    handleChangeCustomerStatus = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            status: value[0],
        });
        callBackFromParentEditForm('status', value[0]);
    }

    handleChangeCustomerLocation = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            status: parseInt(value[0]),
        });
        callBackFromParentEditForm('status', parseInt(value[0]));
    }

    handleChangeTaxNumber = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            taxNumber: value,
        });

        // validate mã số thuế khách hàng
        let { message } = ValidationHelper.validateInvalidCharacter(translate, value);
        this.setState({ customerTaxNumberError: message });

        callBackFromParentEditForm('taxNumber', value);
    }

    handleChangeWebsite = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            website: value,
        });
        callBackFromParentEditForm('website', value);
    }

    handleChangeLinkedIn = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            linkedIn: value,
        });
        callBackFromParentEditForm('linkedIn', value);
    }
}

function mapStateToProps(state) {
    const { crm, user, auth } = state;
    return { crm, user, auth };
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GeneralTabEditForm));