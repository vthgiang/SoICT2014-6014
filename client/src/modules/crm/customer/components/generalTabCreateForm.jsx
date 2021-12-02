import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, DatePicker, ErrorLabel } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import ValidationHelper from '../../../../helpers/validationHelper';
import './customer.css';
import { getData } from '../../common';

function GeneralTabCreateForm(props) {

    const { crm, user, auth, role } = props;
    const { callBackFromParentCreateForm } = props;
    const [customerInfo, setCustomerInfo] = useState({})
    const [crmState, setCrmState] = useState({});

    useEffect(() => {

        if (crm.status.list && crm.status.list.length > 0 && user.usersOfChildrenOrganizationalUnit) {

            // Lấy danh sách người trong phòng ban hiện tại và con
            let unitMembers;
            if (user.usersOfChildrenOrganizationalUnit) {
                unitMembers = getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit);
            }

            // Lấy danh sách nhóm khách hàng
            let listGroups;
            if (crm.groups.list && crm.groups.list.length > 0) {
                listGroups = crm.groups.list.map(o => ({ value: o._id, text: o.name }))
                listGroups.unshift({ value: '', text: '---Chọn---' });
            }

            const newCrmState = {
                ...crmState,
                owner: props.newCustomer.owner,
                unitMembers,
                listGroups,
                listStatus: crm.status.list.map(o => ({ _id: o._id, name: o.name, active: o.active }))
            }
            setCrmState(newCrmState);

        }

    }, [])

    /**
     * lay thong tin nguoi dung hien tai cho vao selectBox
     * @param {*} value 
     */
    let userSelectBox;
    if (auth && auth.user) {
        userSelectBox = { value: auth.user._id, text: auth.user.name };
    }




    /**
     * Hàm xử lý khi người sở hữu/quản lý thay đổi
     * @param {*} value giá trị mới
     */
    const handleChangeCustomerOwner = (value) => {

        const newCustomerInfo = {
            ...customerInfo,
            owner: value,
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('owner', value); // Truyền giá trị về form cha
    }

    /**
     * Hàm xử lý khi nguồn khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerSource = (e) => {

        const { value } = e.target;
        const newCustomerInfo = {
            ...customerInfo,
            customerSource: value,
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('customerSource', value);

    }


 


    /**
     * Hàm xử lý khi tên khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerName = (e) => {

        const { value } = e.target;
        const newCustomerInfo = {
            ...customerInfo,
            name: value
        }

        setCustomerInfo(newCustomerInfo);

        // validate tên khách hàng
        // let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        // this.setState({ customerNameError: message });

        callBackFromParentCreateForm('name', value)
    }


    /**
     * Hàm xử lý khi loại khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerType = (value) => {

        const newCustomerInfo = {
            ...customerInfo,
            customerType: value[0]
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('customerType', parseInt(value[0]))
    }


    /**
     * Hàm xử lý khi tên công ty của khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCompanyName = (e) => {
        const { value } = e.target;

        const newCustomerInfo = {
            ...customerInfo,
            company: value
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('company', value)
    }


    /**
     * Hàm xử lý khi người tại diện thay đổi
     * @param {*} e 
     */
    const handleChangeRepresent = (e) => {
        const { value } = e.target;

        const newCustomerInfo = {
            ...customerInfo,
            represent: value
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('represent', value)
    }


    /**
     * Hàm xử lý khi Ngày thành lập công ty thay đổi
     * @param {*} value 
     */
    const handleChangeCompanyEstablishmentDate = (value) => {

        const newCustomerInfo = {
            ...customerInfo,
            companyEstablishmentDate: value,
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('companyEstablishmentDate', value)
    }


    /**
     * Hàm xử lý khi số điện thoại di động thay đổi
     * @param {*} e 
     */
    const handleChangeMobilephoneNumber = (e) => {
        const { value } = e.target;


        const newCustomerInfo = {
            ...customerInfo,
            mobilephoneNumber: parseInt(value),
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('mobilephoneNumber', parseInt(value))
    }


    /**
     * Hàm xử lý khi số điện thoại khách hàng bàn thay đổi
     * @param {*} e 
     */
    const handleChangeTelephoneNumber = (e) => {
        const { value } = e.target;
        const newCustomerInfo = {
            ...customerInfo,
            telephoneNumber: parseInt(value),
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('telephoneNumber', parseInt(value))
    }


    /**
     * Hàm xử lý khi địa chỉ email khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerEmail = (e) => {

        const { value } = e.target;
        const newCustomerInfo = {
            ...customerInfo,
            email: value,
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('email', value)
    }


    /**
     * Hàm xử lý khi địa chỉ email phụ khách hàng thay đổi
     * @param {*} e 
     */
    // handleChangeCustomerEmail2 = (e) => {
    //     const { callBackFromParentCreateForm } = this.props;
    //     const { value } = e.target;

    //     this.setState({
    //         email2: value,
    //     })
    //     callBackFromParentCreateForm('email2', value)
    // }


    /**
     * Hàm xử lý khi địa chỉ khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerAddress = (e) => {

        const { value } = e.target;

        const newCustomerInfo = {
            ...customerInfo,
            address: value,
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('address', value)
    }


    /**
     * Hàm xử lý khi địa chỉ phụ khách hàng thay đổi
     * @param {*} e 
     */
    // handleChangeCustomerAddress2 = (e) => {
    //     const { callBackFromParentCreateForm } = this.props;
    //     const { value } = e.target;

    //     this.setState({
    //         address2: value,
    //     })
    //     callBackFromParentCreateForm('address2', value)
    // }


    /**
     * Hàm xử lý khi giới tính khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerGender = (value) => {



        const newCustomerInfo = {
            ...customerInfo,
            gender: value[0],
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('gender', parseInt(value[0]))
    }


    /**
     * Hàm xử lý khi ngày sinh nhật khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerBirth = (value) => {

        const newCustomerInfo = {
            ...customerInfo,
            birthDate: value,
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('birthDate', value)
    }


    /**
     * Hàm xử lý khi nhóm khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerGroup = (value) => {

        const newCustomerInfo = {
            ...customerInfo,
            customerGroup: value[0],
        }
        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('customerGroup', value[0])
    }


    /**
     * Hàm xử lý khi trạng thái khách hàng thay đổi
     * @param {*} index 
     */
    const handleChangeCustomerStatus = (index) => {
        let getStatusActive = [];

        listStatus.map((o, i) => {
            if (i <= index) {
                o.active = true;
            } else {
                o.active = false;
            }
            return o;
        });

        // lấy trạng thái khách hàng lưu vào db
        listStatus.forEach(o => {
            if (o.active) {
                getStatusActive = [o._id];
            }
        })
        const newCustomerInfo = {
            ...customerInfo,
            listStatus: listStatus,
        }
        setCustomerInfo(newCustomerInfo);
        console.log('listStatus', listStatus)
        callBackFromParentCreateForm('customerStatus', getStatusActive)
    }


    /**
     * Hàm xử lý khi khu vực khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCustomerLocation = (value) => {
        const newCustomerInfo = {
            ...customerInfo,
            location: value[0],
        }
        setCustomerInfo(newCustomerInfo);


        callBackFromParentCreateForm('location', parseInt(value[0]))
    }


    /**
     * Hàm xử lý khi mã số thuế khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeTaxNumber = (e) => {

        const { value } = e.target;
        const newCustomerInfo = {
            ...customerInfo,
            taxNumber: value,
        }
        setCustomerInfo(newCustomerInfo);


        // validate mã số thuế khách hàng
        // let { message } = ValidationHelper.validateInvalidCharacter(translate, value);
        // this.setState({ customerTaxNumberError: message });

        callBackFromParentCreateForm('taxNumber', value)
    }


    /**
     * Hàm xử lý khi địa chỉ website khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeCustomerWebsite = (e) => {
        const { value } = e.target;


        const newCustomerInfo = {
            ...customerInfo,
            website: value,
        }

        setCustomerInfo(newCustomerInfo);
        callBackFromParentCreateForm('website', value)
    }


    /**
     * Hàm xử lý khi địa chỉ ghi chú khách hàng thay đổi
     * @param {*} e
     */
    const handleChangeCustomerNote = (e) => {
        const { value } = e.target;
        const newCustomerInfo = {
            ...customerInfo,
            note: value,
        }
        callBackFromParentCreateForm('note', value)
    }

    /**
     * Hàm xử lý khi địa chỉ linkedIn khách hàng thay đổi
     * @param {*} e
     */
    // handleChangeCustomerLinkedIn = (e) => {
    //     const { callBackFromParentCreateForm } = this.props;
    //     const { value } = e.target;

    //     this.setState({
    //         linkedIn: value,
    //     })
    //     callBackFromParentCreateForm('linkedIn', value)
    // }


    const { translate } = props; // state redux
    const { id } = props; // Lấy giá trị từ component cha
    const {
        owner,
        customerSource,
        name,
        company,
        represent,
        customerType,
        companyEstablishmentDate,
        mobilephoneNumber,
        telephoneNumber,
        email,
        address,
        gender,
        birth,
        group,
        location,
        taxNumber,
        website
    } = customerInfo;

    const { customerNameError, customerCodeError, customerTaxNumberError, } = {};
    const { unitMembers, listGroups, listStatus } = crmState;
    let progressBarWidth;

    // setting timeline customer status
    if (listStatus) {
        const totalItem = listStatus.length;
        const numberOfActiveItems = listStatus.filter(o => o.active).length;
        progressBarWidth = totalItem > 1 && numberOfActiveItems > 0 ? ((numberOfActiveItems - 1) / (totalItem - 1)) * 100 : 0;
    }


    return (
        <React.Fragment>
            <div id={id} className="tab-pane active">
                {/* timeline trạng thái khách hàng */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin khách hàng"}</legend>
                    <div className="row">
                        <div className="col-md-12">
                            <label>{translate('crm.customer.status')}<span className="text-red">*</span></label>
                            <div className="timeline">
                                <div className="timeline-crm-progress" style={{ width: `${progressBarWidth}%` }}></div>
                                <div className="timeline-items">
                                    {
                                        listStatus && listStatus.length > 0 &&
                                        listStatus.map((o, index) => (
                                            <div key={index} className={`timeline-item ${o.active ? 'active' : ''}`} onClick={() => handleChangeCustomerStatus(index)}>
                                                <div className="timeline-contain">{o.name}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Tên khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerNameError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.name')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" value={name ? name : ''} onChange={handleChangeCustomerName} placeholder={translate('crm.customer.name')} />
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
                                    id={`customerType`}
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
                                {listGroups && <SelectBox
                                    id={`customer-group`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listGroups
                                    }
                                    value={group ? group : ''}
                                    onChange={handleChangeCustomerGroup}
                                    multiple={false}
                                />}
                            </div>
                        </div>
                    </div>

                    {customerType == 2 ? (<>
                        <div className="row">
                            {/* Người đại diện */}
                            <div className="col-md-6">
                                <div className={`form-group`}>
                                    <label>Người đại diện</label>
                                    <input type="Name" className="form-control" value={represent ? represent : ''} onChange={handleChangeRepresent} placeholder={'Người đại diện'} />
                                    <ErrorLabel content={customerNameError} />
                                </div>
                            </div>
                            {/* Ngày thành lập công ty */}
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>{translate('crm.customer.companyEstablishmentDate')}</label>
                                    <DatePicker
                                        id="start-date-form-create"
                                        value={companyEstablishmentDate ? companyEstablishmentDate : ''}
                                        onChange={handleChangeCompanyEstablishmentDate}
                                        disabled={false}
                                    />
                                </div>
                            </div>

                        </div>


                    </>) : (<>
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
                                                { value: '', text: '---Chọn---' },
                                                { value: 1, text: 'Nam' },
                                                { value: 2, text: 'Nữ' },
                                            ]
                                        }
                                        value={gender ? gender : ''}
                                        onChange={handleChangeCustomerGender}
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
                                        onChange={handleChangeCustomerBirth}
                                        disabled={false}
                                    />
                                </div>
                            </div>
                        </div>

                    </>)
                    }

                    <div className="row">
                        {/* Số điện thoại di động*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.mobilephoneNumber')} </label>
                                <input type="number" className="form-control" value={mobilephoneNumber ? mobilephoneNumber : ''} onChange={handleChangeMobilephoneNumber} placeholder={translate('crm.customer.mobilephoneNumber')} />
                            </div>
                        </div>

                        {/* Địa chỉ email*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.email')} </label>
                                <input type="email" className="form-control" value={email ? email : ''} onChange={handleChangeCustomerEmail} placeholder={translate('crm.customer.email')} />
                            </div>
                        </div>


                    </div>

                    <div className="row">
                        {/* Địa chỉ */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address')}</label>
                                <input type="text" className="form-control" value={address ? address : ''} onChange={handleChangeCustomerAddress} placeholder={translate('crm.customer.address')} />
                            </div>
                        </div>

                        {/* Số điện thoại cố định */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.telephoneNumber')} </label>
                                <input type="number" className="form-control" value={telephoneNumber ? telephoneNumber : ''} onChange={handleChangeTelephoneNumber} placeholder={translate('crm.customer.telephoneNumber')} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* // Mã số thuế */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerTaxNumberError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.taxNumber')}</label>
                                <input type="text" className="form-control" value={taxNumber ? taxNumber : ''} onChange={handleChangeTaxNumber} placeholder={translate('crm.customer.taxNumber')} />
                                <ErrorLabel content={customerTaxNumberError} />
                            </div>
                        </div>
                        {/* khu vực */}
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
                                            { value: 1, text: 'Bắc' },
                                            { value: 2, text: 'Trung ' },
                                            { value: 3, text: 'Nam ' },
                                        ]
                                    }
                                    value={location ? location : ''}
                                    onChange={handleChangeCustomerLocation}
                                    multiple={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">


                        {/* website */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.website')}</label>
                                <input type="text" className="form-control" value={website ? website : ''} onChange={handleChangeCustomerWebsite} placeholder={translate('crm.customer.website')} />
                            </div>
                        </div>
                    </div>



                </fieldset>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin liên quan"}
                    </legend>
                    <div className="row">
                        {/* Người quản lý */}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.owner')}<span className="text-red">*</span></label>
                                {
                                    unitMembers && userSelectBox &&
                                    <SelectBox
                                        id={`customer-owner`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={getData.getRole(role) == 'employee' ? [userSelectBox] : unitMembers}
                                        value={owner}
                                        onChange={handleChangeCustomerOwner}
                                        multiple={true}
                                    />
                                }
                            </div>
                        </div>

                        {/* Nguồn khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.source')}</label>
                                <input type="text" className="form-control" value={customerSource ? customerSource : ''} onChange={handleChangeCustomerSource} placeholder="Facebook,...." />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Ghi chú */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.note')}</label>
                                <textarea type="text" className="form-control" onChange={handleChangeCustomerNote} />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </React.Fragment>
    );
}



function mapStateToProps(state) {
    const { crm, user, role, auth } = state;
    return { crm, user, role, auth };
}

export default connect(mapStateToProps, null)(withTranslate(GeneralTabCreateForm));

