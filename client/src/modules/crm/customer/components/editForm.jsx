import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmCustomerActions } from '../redux/actions';
import { DialogModal, SelectBox, DatePicker } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';

import GeneralTabEditForm from './generalTabEditForm';

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
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa khách hàng mới */}
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#customer-general-edit-form" data-toggle="tab" >Thông tin chung</a></li>
                            <li><a href="#Customer-fileAttachment" data-toggle="tab">Tài liệu liên quan</a></li>
                        </ul>
                        <div className="tab-content">
                            {/* Tab thông tin chung */}
                            <GeneralTabEditForm
                                id={"customer-general-edit-form"}
                                callBackFromParentEditForm={this.myCallBack}
                                editingCustomer={editingCustomer}
                            />

                            {/* Tab file liên quan đến khách hàng */}
                            <div id="Customer-fileAttachment" className="tab-pane">

                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }

    myCallBack = (name, value) => {
        const { editingCustomer } = this.state;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                [name]: value,
            }
        })
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

    isFormValidated = () => {
        const { code, name, taxNumber } = this.state.editingCustomer;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, code).status
            || !ValidationHelper.validateName(translate, name).status
            || !ValidationHelper.validateInvalidCharacter(translate, taxNumber).status)
            return false;
        return true;
    }


    save = () => {
        const { editingCustomer, customerIdEdit } = this.state;
        if (this.isFormValidated) {
            this.props.editCustomer(customerIdEdit, editingCustomer);
        }
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
}

function mapStateToProps(state) {
    const { crm, user, auth } = state;
    return { crm, user, auth };
}

const mapDispatchToProps = {
    getCustomer: CrmCustomerActions.getCustomer,
    editCustomer: CrmCustomerActions.editCustomer,

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerEdit));