import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, DatePicker, ErrorLabel } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { CrmGroupActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

class GeneralTabCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: '0',
        }
    }
    render() {
        const { translate, crm, user } = this.props;
        const { groups } = crm;
        const { id, newCustomer } = this.props;

        const { customerSource, code, name, company, companyEstablishmentDate, mobilephoneNumber, telephoneNumber
            , email, email2, address, address2, gender, birth, group, status, location, taxNumber, website, linkedIn,
        } = this.state;

        const { customerNameError, customerCodeError, customerTaxNumberError } = this.state;

        // Lấy danh sách người trong phòng ban hiện tại và con
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
                <div id={id} className="tab-pane active">
                    <div className="row">
                        {/* Người quản lý khách hàng*/}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.owner')}<span className="text-red">*</span></label>
                                {
                                    unitMembers &&
                                    <SelectBox
                                        id={`customer-ownwe`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        value={newCustomer.owner ? newCustomer.owner : []}
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
                                <input type="text" className="form-control" value={customerSource ? customerSource : ''} onChange={this.handleChangeCustomerSource} placeholder="Facebook,...." />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Mã khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerCodeError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={code ? code : ''} onChange={this.handleChangeCustomerCode} placeholder={translate('crm.customer.code')} />
                                <ErrorLabel content={customerCodeError} />
                            </div>
                        </div>

                        {/* Tên khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerNameError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.name')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" value={name ? name : ''} onChange={this.handleChangeCustomerName} placeholder={translate('crm.customer.name')} />
                                <ErrorLabel content={customerNameError} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Tên công ty */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.company')}</label>
                                <input type="Name" className="form-control" value={company ? company : ''} onChange={this.handleChangeCompanyName} placeholder={translate('crm.customer.company')} />
                            </div>
                        </div>

                        {/* Ngày thành lập công ty */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.companyEstablishmentDate')}</label>
                                <DatePicker
                                    id="start-date-form-create"
                                    value={companyEstablishmentDate ? companyEstablishmentDate : ''}
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
                                <input type="text" className="form-control" value={mobilephoneNumber ? mobilephoneNumber : ''} onChange={this.handleChangeMobilephoneNumber} placeholder={translate('crm.customer.mobilephoneNumber')} />
                            </div>
                        </div>

                        {/* Số điện thoại cố định */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.telephoneNumber')} </label>
                                <input type="text" className="form-control" value={telephoneNumber ? telephoneNumber : ''} onChange={this.handleChangeTelephoneNumber} placeholder={translate('crm.customer.telephoneNumber')} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Địa chỉ email*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.email')} </label>
                                <input type="email" className="form-control" value={email ? email : ''} onChange={this.handleChangeCustomerEmail} placeholder={translate('crm.customer.email')} />
                            </div>
                        </div>

                        {/* Địa chỉ email phu*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.secondaryEmail')}</label>
                                <input type="email" className="form-control" value={email2 ? email2 : ''} onChange={this.handleChangeCustomerEmail2} placeholder={translate('crm.customer.secondaryEmail')} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Địa chỉ 1 */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address')}</label>
                                <input type="text" className="form-control" value={address ? address : ''} onChange={this.handleChangeCustomerAddress} placeholder={translate('crm.customer.address')} />
                            </div>
                        </div>

                        {/* Địa chỉ 2 */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address2')}</label>
                                <input type="text" className="form-control" value={address2 ? address2 : ''} onChange={this.handleChangeCustomerAddress2} placeholder={translate('crm.customer.address2')} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Giới tính */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.gender')}</label>
                                <SelectBox
                                    id={`customer-gender`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: '', text: 'Chọn' },
                                            { value: 'male', text: 'Nam' },
                                            { value: 'female', text: 'Nữ' },
                                        ]
                                    }
                                    value={gender ? gender : ''}
                                    onChange={this.handleChangeCustomerGender}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* ngày sinh */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.birth')}</label>
                                <DatePicker
                                    id="birth-form-create"
                                    value={birth ? birth : ''}
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
                                {listGroups && <SelectBox
                                    id={`customer-group`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listGroups
                                    }
                                    value={group ? group : ''}
                                    onChange={this.handleChangeCustomerGroup}
                                    multiple={false}
                                />}
                            </div>
                        </div>

                        {/* Trạng thái khách hàng */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.status')}</label>
                                <SelectBox
                                    id={`customer-status`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: '0', text: 'Khách hàng mới' },
                                            { value: '1', text: 'Quan tâm đến sản phẩm ' },
                                            { value: '2', text: 'Đã báo giá ' },
                                            { value: '3', text: 'Đã mua sản phẩm ' },
                                            { value: '4', text: 'Đã kí hợp đồng' },
                                            { value: '5', text: 'Dừng liên hệ ' },
                                        ]
                                    }
                                    value={status ? status : ''}
                                    onChange={this.handleChangeCustomerStatus}
                                    multiple={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* location */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.location')} </label>
                                <SelectBox
                                    id={`customer-location`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: '', text: 'Chọn' },
                                            { value: 0, text: 'Bắc' },
                                            { value: 1, text: 'Trung ' },
                                            { value: 2, text: 'Nam ' },
                                        ]
                                    }
                                    value={location ? location : ''}
                                    onChange={this.handleChangeCustomerLocation}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* Mã số thuế */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerTaxNumberError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.taxNumber')}</label>
                                <input type="text" className="form-control" value={taxNumber ? taxNumber : ''} onChange={this.handleChangeTaxNumber} placeholder={translate('crm.customer.taxNumber')} />
                                <ErrorLabel content={customerTaxNumberError} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* website */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.website')}</label>
                                <input type="text" className="form-control" value={website ? website : ''} onChange={this.handleChangeCustomerWebsite} placeholder={translate('crm.customer.website')} />
                            </div>
                        </div>

                        {/* linkedIn */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.linkedIn')}</label>
                                <input type="text" className="form-control" value={linkedIn ? linkedIn : ''} onChange={this.handleChangeCustomerLinkedIn} placeholder={translate('crm.customer.linkedIn')} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    handleChangeCustomerOwner = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            owner: value,
        });
        callBackFromParentCreateForm('owner', value);
    }


    handleChangeCustomerSource = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            customerSource: value,
        })
        callBackFromParentCreateForm('customerSource', value)
    }

    handleChangeCustomerCode = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            code: value,
        })

        // validate mã khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ customerCodeError: message });

        callBackFromParentCreateForm('code', value)
    }

    handleChangeCustomerName = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            name: value,
        })

        // validate tên khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ customerNameError: message });

        callBackFromParentCreateForm('name', value)
    }

    handleChangeCompanyName = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            company: value,
        })
        callBackFromParentCreateForm('company', value)
    }

    handleChangeCompanyEstablishmentDate = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            companyEstablishmentDate: value,
        })
        callBackFromParentCreateForm('companyEstablishmentDate', value)
    }

    handleChangeMobilephoneNumber = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            mobilephoneNumber: parseInt(value),
        })
        callBackFromParentCreateForm('mobilephoneNumber', parseInt(value))
    }

    handleChangeTelephoneNumber = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            telephoneNumber: parseInt(value),
        })
        callBackFromParentCreateForm('telephoneNumber', parseInt(value))
    }

    handleChangeCustomerEmail = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            email: value,
        })
        callBackFromParentCreateForm('email', value)
    }

    handleChangeCustomerEmail2 = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            email2: value,
        })
        callBackFromParentCreateForm('email2', value)
    }

    handleChangeCustomerAddress = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            address: value,
        })
        callBackFromParentCreateForm('address', value)
    }

    handleChangeCustomerAddress2 = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            address2: value,
        })
        callBackFromParentCreateForm('address2', value)
    }

    handleChangeCustomerGender = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            gender: value[0],
        })
        callBackFromParentCreateForm('gender', value[0])
    }

    handleChangeCustomerBirth = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            birthDate: value,
        })
        callBackFromParentCreateForm('birthDate', value)
    }

    handleChangeCustomerGroup = (value) => {
        const { callBackFromParentCreateForm } = this.props;
        this.setState({
            group: value[0],
        })
        callBackFromParentCreateForm('group', value[0])
    }

    handleChangeCustomerStatus = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            status: value[0],
        })
        callBackFromParentCreateForm('status', value[0])
    }

    handleChangeCustomerLocation = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            location: parseInt(value[0]),
        })
        callBackFromParentCreateForm('location', parseInt(value[0]))
    }

    handleChangeTaxNumber = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            taxNumber: value,
        })

        // validate mã số thuế khách hàng
        let { message } = ValidationHelper.validateInvalidCharacter(translate, value);
        this.setState({ customerTaxNumberError: message });

        callBackFromParentCreateForm('taxNumber', value)
    }

    handleChangeCustomerWebsite = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            website: value,
        })
        callBackFromParentCreateForm('website', value)
    }

    handleChangeCustomerLinkedIn = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            linkedIn: value,
        })
        callBackFromParentCreateForm('linkedIn', value)
    }
}



function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    // createGroup: CrmGroupActions.createGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GeneralTabCreateForm));