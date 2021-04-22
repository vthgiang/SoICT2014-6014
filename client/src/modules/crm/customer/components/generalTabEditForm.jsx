import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, DatePicker, ErrorLabel } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import ValidationHelper from '../../../../helpers/validationHelper';

function GeneralTabEditForm(props) {



    const { crm, user, customerIdEdit, id, editingCustomer, callBackFromParentEditForm, translate, handleChangeStatusCallBack } = props;

    const [customerEditState, setCustomerEditState] = useState({
        customerId: ""
    });


    if (editingCustomer && customerEditState.customerId !== editingCustomer._id) {
        setCustomerEditState({
            ...customerEditState,
            ...editingCustomer,
            customerId: editingCustomer._id
        })
    }

    const status = editingCustomer.status;
    const [edittingCustomerStatus, setEdittingCustomerStatus] = useState({
        description: ''
    });


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

    // lấy danh sách trạng thái
    let listStatus = crm.status.list.map((x) => ({ value: x._id, text: x.name }))

    /**
     * Hàm xử lý khi người sở hữu/quản lý thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerOwner = (value) => {
        const newCustomerEditState = { ...customerEditState, owner: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('owner', value);
    }


    /**
     * Hàm xử lý khi nguồn khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerSource = (e) => {

        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, customerSource: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('customerSource', value);
    }


    /**
     * Hàm xử lý khi mã khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerCode = (e) => {
        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, code: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('code', value);
    }


    /**
     * Hàm xử lý khi tên khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerName = (e) => {

        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, name: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('name', value);
    }

    /**
     * Hàm xử lý khi loại khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerType = (value) => {

        const newCustomerEditState = {
            ...customerEditState, customerType: value[0],
        }
        setCustomerEditState(newCustomerEditState);

        callBackFromParentEditForm('customerType', parseInt(value[0]));
    }


    /**
     * Hàm xử lý khi tên công ty của khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerCompany = (e) => {

        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, company: value, }
        setCustomerEditState(newCustomerEditState);


        callBackFromParentEditForm('company', value);
    }


    /**
     * Hàm xử lý khi người tại diện thay đổi
     * @param {*} e 
     */
    const handleChangeRepresent = (e) => {
        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, represent: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('represent', value);
    }


    /**
     * Hàm xử lý khi Ngày thành lập công ty thay đổi
     * @param {*} value 
     */
    const handleChangeCompanyEstablishmentDate = (value) => {
        const newCustomerEditState = { ...customerEditState, companyEstablishmentDate: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('companyEstablishmentDate', value);
    }


    /**
     * Hàm xử lý khi số điện thoại di động thay đổi
     * @param {*} e 
     */
    const handleChangeMobilephoneNumber = (e) => {

        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, mobilephoneNumber: value, }
        setCustomerEditState(newCustomerEditState);

        callBackFromParentEditForm('mobilephoneNumber', parseInt(value));
    }

    /**
     * Hàm xử lý khi số điện thoại khách hàng bàn thay đổi
     * @param {*} e 
     */
    const handleChangeTelephoneNumber = (e) => {

        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, telephoneNumber: parseInt(value), }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('telephoneNumber', parseInt(value));
    }

    /**
     * Hàm xử lý khi địa chỉ email khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerEmail = (e) => {

        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, email: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('email', value);
    }


    /**
     * Hàm xử lý khi địa chỉ email phụ khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerEmail2 = (e) => {
        const { value } = e.target;

        const newCustomerEditState = { ...customerEditState, email2: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('email2', value);
    }


    /**
     * Hàm xử lý khi địa chỉ khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerAddress = (e) => {
        const { value } = e.target;

        const newCustomerEditState = { ...customerEditState, address: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('address', value);
    }


    /**
     * Hàm xử lý khi địa chỉ phụ khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerAddress2 = (e) => {
        const { value } = e.target;

        const newCustomerEditState = { ...customerEditState, address2: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('address2', value);
    }


    /**
     * Hàm xử lý khi giới tính khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerGender = (value) => {
        const newCustomerEditState = { ...customerEditState, gender: value[0], }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('gender', parseInt(value[0]));
    }

    /**
     * Hàm xử lý khi ngày sinh nhật khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerBirth = (value) => {
        const newCustomerEditState = { ...customerEditState, birthDate: value, }
        setCustomerEditState(newCustomerEditState);

        callBackFromParentEditForm('birthDate', value);
    }


    /**
     * Hàm xử lý khi nhóm khách hàng thay đổi
     * @param {*} value 
     */
    async function handleChangeCustomerGroup(value) {
        const newCustomerEditState = { ...customerEditState, group: value[0], }
        console.log('value', value);
        await setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('group', value[0]);
    }


    /**
     * Hàm xử lý khi trạng thái khách hàng thay đổi
     * @param {*} index 
     */
    async function handleChangeCustomerStatus(value) {
        const newEdittingCustomerStatus = { ...edittingCustomerStatus, newStatus: value }
        await setEdittingCustomerStatus(newEdittingCustomerStatus);
        handleChangeStatusCallBack(newEdittingCustomerStatus);
    }

    /**
     * hàm xử lý khi mô tả thay đổi trạng thái KH thay đổi
     * @param {*} value 
     */
    async function handleChangeCustomerStatusDescription(e) {
        const { value } = e.target;
        const newEdittingCustomerStatus = { ...edittingCustomerStatus, description: value }
        await setEdittingCustomerStatus(newEdittingCustomerStatus);
        handleChangeStatusCallBack(newEdittingCustomerStatus);
    }
    /**
     * Hàm xử lý khi khu vực khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerLocation = (value) => {
        const newCustomerEditState = { ...customerEditState, location: value[0], }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('location', parseInt(value[0]));
    }


    /**
     * Hàm xử lý khi mã số thuế khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeTaxNumber = (e) => {
        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, taxNumber: value, }
        setCustomerEditState(newCustomerEditState);
        // validate mã số thuế khách hàng
        // let { message } = ValidationHelper.validateInvalidCharacter(translate, value);
        // this.setState({ customerTaxNumberError: message });

        callBackFromParentEditForm('taxNumber', value);
    }


    /**
     * Hàm xử lý khi địa chỉ website khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeWebsite = (e) => {
        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, website: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('website', value);
    }


    /**
     * Hàm xử lý khi địa chỉ ghi chú khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeNote = (e) => {
        const { value } = e.target;
        const newCustomerEditState = { ...customerEditState, note: value, }
        setCustomerEditState(newCustomerEditState);
        callBackFromParentEditForm('note', value);
    }






    const { owner, code, name, customerType, company, represent, group, gender, location,
        taxNumber, customerSource, companyEstablishmentDate, birthDate, telephoneNumber, mobilephoneNumber,
        email, email2, address, address2, website, note, linkedIn } = customerEditState;

    console.log('customerEditState', customerEditState)
    //message error
    const { customerCodeError, customerNameError, customerTaxNumberError } = customerEditState;
    let progressBarWidth;

    // Lấy danh sách trạng thái khách hàng
    if (listStatus) {
        const totalItem = listStatus.length;
        const numberOfActiveItems = listStatus.filter(o => o.active).length;
        progressBarWidth = totalItem > 1 && numberOfActiveItems > 0 ? ((numberOfActiveItems - 1) / (totalItem - 1)) * 100 : 0;
    }


    return (
        <React.Fragment>
            <div id={id} className="tab-pane active">
                {/* timeline trạng thái khách hàng */}
                {/* <div className="row">
                        <div className="col-md-12">
                            <label>{translate('crm.customer.status')}<span className="text-red">*</span></label>
                            <div className="timeline">
                                <div className="timeline-crm-progress" style={{ width: `${progressBarWidth}%` }}></div>
                                <div className="timeline-items">
                                    {
                                        listStatus && listStatus.length > 0 &&
                                        listStatus.map((o, index) => (
                                            <div key={index} className={`timeline-item ${o.active ? 'active' : ''}`} onClick={() => this.handleChangeCustomerStatus(index)}>
                                                <div className="timeline-contain">{o.name}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div> */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin khách hàng"} </legend>

                    <div className="row">
                        {/* Mã khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerCodeError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.code')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" value={code ? code : ''} onChange={handleChangeCustomerCode} />
                                <ErrorLabel content={customerCodeError} />
                            </div>
                        </div>

                        {/* Tên khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerNameError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.name')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" value={name ? name : ''} onChange={handleChangeCustomerName} />
                                <ErrorLabel content={customerNameError} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Loại khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.customerType')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`customerType-edit-form`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: '', text: '---Chọn---' },
                                        { value: 1, text: 'Cá nhân' },
                                        { value: 2, text: 'Công ty' },
                                    ]}
                                    value={customerType ? customerType : ''}
                                    onChange={handleChangeCustomerType}
                                    multiple={false}
                                />
                            </div>
                        </div>

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
                                        onChange={handleChangeCustomerGroup}
                                        multiple={false}
                                    />
                                }
                            </div>
                        </div>
                    </div>




                    {customerType == 2 ?
                        (<div className="row">
                            {/* Người đại diện */}
                            <div className="col-md-6">
                                <div className={`form-group`}>
                                    <label>Người đại diện</label>
                                    <input type="Name" className="form-control" value={represent ? represent : ''} onChange={handleChangeRepresent} />
                                    <ErrorLabel content={customerNameError} />
                                </div>
                            </div>
                            {/* Ngày thành lập công ty */}
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>{translate('crm.customer.companyEstablishmentDate')}</label>
                                    <DatePicker
                                        id="companyEstablishmentDate-edit-form"
                                        value={companyEstablishmentDate ? companyEstablishmentDate : ''}
                                        onChange={handleChangeCompanyEstablishmentDate}
                                        disabled={false}
                                    />
                                </div>
                            </div>

                        </div>) : (<div className="row">
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
                                                { value: '', text: '---Chọn---' },
                                                { value: 1, text: 'Nam' },
                                                { value: 2, text: 'Nữ' },
                                            ]
                                        }
                                        value={gender}
                                        onChange={handleChangeCustomerGender}
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
                                        value={birthDate ? birthDate : ''}
                                        onChange={handleChangeCustomerBirth}
                                        disabled={false}
                                    />
                                </div>
                            </div>
                        </div>)

                    }
                    <div className="row">


                        {/* Số điện thoại di động*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.mobilephoneNumber')} </label>
                                <input type="text" className="form-control" value={mobilephoneNumber ? mobilephoneNumber : ''} onChange={handleChangeMobilephoneNumber} />
                            </div>
                        </div>
                        {/* Địa chỉ email*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.email')} </label>
                                <input type="email" className="form-control" value={email ? email : ''} onChange={handleChangeCustomerEmail} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Số điện thoại cố định */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.telephoneNumber')}</label>
                                <input type="text" className="form-control" value={telephoneNumber ? telephoneNumber : ''} onChange={handleChangeTelephoneNumber} />
                            </div>
                        </div>
                        {/* Địa chỉ */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address')}</label>
                                <input type="text" className="form-control" value={address ? address : ''} onChange={handleChangeCustomerAddress} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Mã số thuế */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerTaxNumberError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.taxNumber')}</label>
                                <input type="text" className="form-control" value={taxNumber ? taxNumber : ''} onChange={handleChangeTaxNumber} />
                                <ErrorLabel content={customerTaxNumberError} />
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
                                            { value: '', text: '---Chọn---' },
                                            { value: 1, text: 'Bắc' },
                                            { value: 2, text: 'Trung ' },
                                            { value: 3, text: 'Nam ' },
                                        ]
                                    }
                                    value={location}
                                    onChange={handleChangeCustomerLocation}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* Website  */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.website')}</label>
                                <input type="text" className="form-control" value={website ? website : ''} onChange={handleChangeWebsite} />
                            </div>
                        </div>
                    </div>
                </fieldset>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin liên quan"} </legend>
                    <div className="row">
                        {/* Người quản lý khách hàng*/}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.owner')}<span className="text-red">*</span></label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`customer-owner-edit-form`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        value={owner}
                                        onChange={handleChangeCustomerOwner}
                                        multiple={true}
                                    />
                                }
                            </div>
                        </div>

                        {/* nguồn lấy được khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.source')}</label>
                                <input type="Name" className="form-control" value={customerSource ? customerSource : ''} onChange={handleChangeCustomerSource} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Ghi chú */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.note')}</label>
                                <textarea type="text" value={note ? note : ''} className="form-control" onChange={handleChangeNote} />
                            </div>
                        </div>
                    </div>
                </fieldset>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thay đổi trạng thái khách hàng"} </legend>
                    <div className="row">
                        {/* Trạng thái khách hàng*/}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{'Trạng thái khách hàng'}<span className="text-red">*</span></label>
                                {
                                    <SelectBox
                                        id={`customer-status-edit-form`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={listStatus}
                                        value={edittingCustomerStatus.newStatus?edittingCustomerStatus.newStatus : status[0]._id}
                                        onChange={handleChangeCustomerStatus}
                                        multiple={false}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Mô tả thay đổi*/}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{"Nội dung"}</label>
                                <textarea onChange={handleChangeCustomerStatusDescription} type="text" className="form-control"  />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </React.Fragment>
    );
}


function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GeneralTabEditForm));