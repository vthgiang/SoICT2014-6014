import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox, DatePicker } from '../../../../common-components';
import { CrmCustomerActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getStorage } from '../../../../config';

class CrmCustomerCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCustomer: {
                status: '0',
                group: '',
            },
            currentRole: getStorage('currentRole')
        }
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        const { auth, user } = this.props;
        const { newCustomer, currentRole } = this.state;

        if (!newCustomer.owner && auth.user && user.organizationalUnitsOfUser) {
            let getCurrentUnit = await user.organizationalUnitsOfUser.find(item =>
                item.deans[0] === currentRole
                || item.viceDeans[0] === currentRole
                || item.employees[0] === currentRole);

            // Lấy người dùng của đơn vị hiện tại và người dùng của đơn vị con
            if (getCurrentUnit) {
                this.props.getChildrenOfOrganizationalUnits(getCurrentUnit._id);
            }

            this.setState({
                newCustomer: {
                    ...newCustomer,
                    owner: [auth.user._id],
                },
            })
            return false;
        }
        return true;
    }

    render() {
        const { translate, crm, user } = this.props;
        const { groups } = crm;
        const { owner, customerSource, code, name, company, companyEstablishmentDate, mobilephoneNumber, telephoneNumber
            , email, email2, address, address2, gender, birth, group, status, location, taxNumber, website, linkedIn
        } = this.state.newCustomer;

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
                    modalID="modal-crm-customer-create" isLoading={crm.customers.isLoading}
                    formID="form-crm-customer-create"
                    title={translate("crm.customer.add")}
                    size={75}
                    func={this.save}
                >
                    {/* Form thêm khách hàng mới */}
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
                                            {
                                                unitMembers &&
                                                <SelectBox
                                                    id={`customer-ownwe`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={unitMembers}
                                                    value={owner ? owner : []}
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
                                            <input type="text" className="form-control" value={customerSource ? customerSource : ''} onChange={this.handleChangeCustomerSource} placeholder="Facebook,...." />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Mã khách hàng */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.code')}<span className="text-red">*</span></label>
                                            <input type="text" className="form-control" value={code ? code : ''} onChange={this.handleChangeCustomerCode} placeholder={translate('crm.customer.code')} />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Tên khách hàng */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.name')}<span className="text-red">*</span></label>
                                            <input type="Name" className="form-control" value={name ? name : ''} onChange={this.handleChangeCustomerName} placeholder={translate('crm.customer.name')} />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Tên công ty */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.company')}</label>
                                            <input type="Name" className="form-control" value={company ? company : ''} onChange={this.handleChangeCompanyName} placeholder={translate('crm.customer.company')} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Ngày thành lập công ty */}
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
                                    <div className="col-md-6">
                                        {/* Số điện thoại di động*/}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.mobilephoneNumber')} </label>
                                            <input type="text" className="form-control" value={mobilephoneNumber ? mobilephoneNumber : ''} onChange={this.handleChangeMobilephoneNumber} placeholder={translate('crm.customer.mobilephoneNumber')} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Số điện thoại cố định */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.telephoneNumber')} </label>
                                            <input type="text" className="form-control" value={telephoneNumber ? telephoneNumber : ''} onChange={this.handleChangeTelephoneNumber} placeholder={translate('crm.customer.telephoneNumber')} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Địa chỉ email*/}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.email')} </label>
                                            <input type="email" className="form-control" value={email ? email : ''} onChange={this.handleChangeCustomerEmail} placeholder={translate('crm.customer.email')} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Địa chỉ email phu*/}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.secondaryEmail')}</label>
                                            <input type="email" className="form-control" value={email2 ? email2 : ''} onChange={this.handleChangeCustomerEmail2} placeholder={translate('crm.customer.secondaryEmail')} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Địa chỉ 1 */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.address')}</label>
                                            <input type="text" className="form-control" value={address ? address : ''} onChange={this.handleChangeCustomerAddress} placeholder={translate('crm.customer.address')} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Địa chỉ 2 */}
                                        <div className={`form-group`}>
                                            <label>{translate('crm.customer.address2')}</label>
                                            <input type="text" className="form-control" value={address2 ? address2 : ''} onChange={this.handleChangeCustomerAddress2} placeholder={translate('crm.customer.address2')} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Giới tính */}
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
                                    <div className="col-md-6">
                                        {/* ngày sinh */}
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
                                        <div className="form-group">
                                            <label>{translate('crm.customer.taxNumber')}</label>
                                            <input type="text" className="form-control" value={taxNumber ? taxNumber : ''} onChange={this.handleChangeTaxNumber} placeholder={translate('crm.customer.taxNumber')} />
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

                            {/* Tab file liên quan đến khách hàng */}
                            <div id="Customer-fileAttachment" className="tab-pane">

                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }

    handleChangeCustomerOwner = (value) => {
        const { newCustomer } = this.state;
        this.setState({
            newCustomer: {
                ...newCustomer,
                owner: value,
            }
        })
    }

    handleChangeCustomerSource = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                customerSource: value,
            }
        })
    }

    handleChangeCustomerCode = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                code: value,
            }
        })
    }

    handleChangeCustomerName = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                name: value,
            }
        });
    }

    handleChangeCompanyName = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                company: value,
            }
        });
    }

    handleChangeCompanyEstablishmentDate = (value) => {
        const { newCustomer } = this.state;
        this.setState({
            newCustomer: {
                ...newCustomer,
                companyEstablishmentDate: value,
            }
        })
    }


    handleChangeMobilephoneNumber = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                mobilephoneNumber: parseInt(value),
            }
        });
    }

    handleChangeTelephoneNumber = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                telephoneNumber: parseInt(value),
            }
        });
    }

    handleChangeCustomerEmail = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                email: value,
            }
        });
    }

    handleChangeCustomerEmail2 = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                email2: value,
            }
        });
    }

    handleChangeCustomerAddress = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                address: value,
            }
        });
    }

    handleChangeCustomerAddress2 = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                address2: value,
            }
        });
    }

    handleChangeCustomerGender = (value) => {
        const { newCustomer } = this.state;
        value = value[0];
        this.setState({
            newCustomer: {
                ...newCustomer,
                gender: value,
            }
        })
    }

    handleChangeCustomerBirth = (value) => {
        const { newCustomer } = this.state;
        this.setState({
            newCustomer: {
                ...newCustomer,
                birthDate: value,
            }
        })
    }

    handleChangeCustomerGroup = (value) => {
        const { newCustomer } = this.state;
        value = value[0];
        this.setState({
            newCustomer: {
                ...newCustomer,
                group: value,
            }
        })
    }

    handleChangeCustomerStatus = (value) => {
        const { newCustomer } = this.state;
        value = value[0];
        this.setState({
            newCustomer: {
                ...newCustomer,
                status: value,
            }
        })
    }

    handleChangeCustomerLocation = (value) => {
        const { newCustomer } = this.state;
        value = value[0];
        this.setState({
            newCustomer: {
                ...newCustomer,
                location: parseInt(value),
            }
        })
    }

    handleChangeTaxNumber = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                taxNumber: value,
            }
        });
    }

    handleChangeCustomerWebsite = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                website: value,
            }
        });
    }

    handleChangeCustomerLinkedIn = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                linkedIn: value,
            }
        });
    }

    save = () => {
        const { newCustomer } = this.state;
        return this.props.createCustomer(newCustomer);
    }
}

function mapStateToProps(state) {
    const { crm, auth, user } = state;
    return { crm, auth, user };
}

const mapDispatchToProps = {
    createCustomer: CrmCustomerActions.createCustomer,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerCreate));