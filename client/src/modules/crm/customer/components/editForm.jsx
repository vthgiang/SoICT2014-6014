import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmCustomerActions } from '../redux/actions';
import { DialogModal, SelectBox, DatePicker } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';

import GeneralTabEditForm from './generalTabEditForm';
import './customer.css';

class CrmCustomerEdit extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            editingCustomer: {},
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
                owner: customer.owner ? customer.owner.map(o => o._id) : [],
                code: customer.code ? customer.code : '',
                name: customer.name ? customer.name : '',
                company: customer.company ? customer.company : '',
                represent: customer.represent ? customer.represent : '',
                gender: customer.gender ? customer.gender : '',
                taxNumber: customer.taxNumber ? customer.taxNumber : '',

                customerSource: customer.customerSource ? customer.customerSource : '',
                companyEstablishmentDate: customer.companyEstablishmentDate ? this.formatDate(customer.companyEstablishmentDate) : '',
                birthDate: customer.birthDate ? this.formatDate(customer.birthDate) : '',
                telephoneNumber: customer.telephoneNumber ? customer.telephoneNumber : '',
                mobilephoneNumber: customer.mobilephoneNumber ? customer.mobilephoneNumber : '',
                email: customer.email ? customer.email : '',
                email2: customer.email2 ? customer.email2 : '',

                status: customer.status ? customer.status.map(o => o._id) : '',
                group: customer.group ? customer.group._id : '',
                address: customer.address ? customer.address : '',
                address2: customer.address2 ? customer.address2 : '',
                location: customer.location ? customer.location : '',
                website: customer.website ? customer.website : '',
                linkedIn: customer.linkedIn ? customer.linkedIn : '',

                statusHistories: customer.statusHistories && customer.statusHistories.length > 0 ?
                    customer.statusHistories.map(o => ({
                        createdAt: o.createdAt,
                        oldValue: o.oldValue ? o.oldValue : null,
                        newValue: o.newValue,
                        createdBy: o.createdBy,
                    })) : [],
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

    /**
     * @param {*} date 
     * @param {*} monthYear 
     */
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
        } else {
            return date
        }
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
        let { editingCustomer, customerIdEdit } = this.state;
        const { auth } = this.props;
        // lấy danh sách trạng thái khách hàng sau khi edit
        const getStatus = editingCustomer.status;

        //lấy danh sách trạng thái khách hàng trước khi edit (lịch sử cũ)
        let { statusHistories } = editingCustomer;

        const getDateTime = new Date();

        if (getStatus && getStatus.length > 0 && statusHistories && statusHistories.length > 0) {
            statusHistories = [
                ...statusHistories,
                {
                    oldValue: statusHistories[statusHistories.length - 1].newValue._id,
                    newValue: getStatus[getStatus.length - 1],
                    createdAt: getDateTime,
                    createdBy: auth.user._id,
                }
            ]
        }
        editingCustomer = { ...editingCustomer, statusHistories }

        if (this.isFormValidated) {
            this.props.editCustomer(customerIdEdit, editingCustomer);
        }
    }

    render() {
        const { translate, crm, user } = this.props;
        const { editingCustomer, customerIdEdit, dataStatus } = this.state;
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
            listGroups.unshift({ value: '', text: '---chọn---' });
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
                            {
                                editingCustomer && dataStatus === 3 &&
                                <GeneralTabEditForm
                                    id={"customer-general-edit-form"}
                                    callBackFromParentEditForm={this.myCallBack}
                                    editingCustomer={editingCustomer}
                                    customerIdEdit={customerIdEdit}
                                />
                            }

                            {/* Tab file liên quan đến khách hàng */}
                            <div id="Customer-fileAttachment" className="tab-pane">

                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
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