import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox, DatePicker } from '../../../../common-components';
import { CrmCustomerActions } from '../redux/actions';

class CrmCustomerCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCustomer: {
                status: 0,
            },
        }
    }

    render() {
        const { translate, crm } = this.props;
        const { owner, customerSource, code, name, company, companyEstablishmentDate, mobilephoneNumber, telephoneNumber
            , email, email2, address, address2, gender, birth, group, status, location, taxNumber, website, linkedIn
        } = this.state.newCustomer;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-customer-create" isLoading={crm.customer.isLoading}
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
                                            <label className="control-label">Người quản lý<span className="text-red">*</span></label>
                                            <SelectBox
                                                id={`customer-ownwe`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={
                                                    [
                                                        { value: 0, text: 'Nguyễn Văn Danh' },
                                                        { value: 1, text: 'Vũ Thị Cúc' },
                                                    ]
                                                }
                                                value={owner ? owner : []}
                                                onChange={this.handleChangeCustomerOwner}
                                                multiple={true}
                                                options={{ placeholder: "Người quản lý" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* nguồn lấy được khách hàng */}
                                        <div className={`form-group`} >
                                            <label className="control-label">Nguồn khách hàng</label>
                                            <input type="text" className="form-control" value={customerSource ? customerSource : ''} onChange={this.handleChangeCustomerSource} placeholder="Facebook,...." />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Mã khách hàng */}
                                        <div className={`form-group`}>
                                            <label>Mã khách hàng<span className="text-red">*</span></label>
                                            <input type="text" className="form-control" value={code ? code : ''} onChange={this.handleChangeCustomerCode} placeholder="Mã khách hàng" />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Tên khách hàng */}
                                        <div className={`form-group`}>
                                            <label>Tên khách hàng<span className="text-red">*</span></label>
                                            <input type="Name" className="form-control" value={name ? name : ''} onChange={this.handleChangeCustomerName} placeholder="Mã khách hàng" />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Tên công ty */}
                                        <div className={`form-group`}>
                                            <label>Tên công ty </label>
                                            <input type="Name" className="form-control" value={company ? company : ''} onChange={this.handleChangeCompanyName} placeholder="Tên công ty" />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Ngày thành lập công ty */}
                                        <div className="form-group">
                                            <label>Ngày thành lập công ty </label>
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
                                            <label>Số điện thoại di động </label>
                                            <input type="text" className="form-control" value={mobilephoneNumber ? mobilephoneNumber : ''} onChange={this.handleChangeMobilephoneNumber} placeholder="Số điện thoại di động" />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Số điện thoại cố định */}
                                        <div className={`form-group`}>
                                            <label>Số điện thoại cố định</label>
                                            <input type="text" className="form-control" value={telephoneNumber ? telephoneNumber : ''} onChange={this.handleChangeTelephoneNumber} placeholder="Số điện thoại cố định" />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Địa chỉ email*/}
                                        <div className={`form-group`}>
                                            <label>Email </label>
                                            <input type="email" className="form-control" value={email ? email : ''} onChange={this.handleChangeCustomerEmail} placeholder="Địa chỉ email" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Địa chỉ email phu*/}
                                        <div className={`form-group`}>
                                            <label>Email phụ</label>
                                            <input type="email" className="form-control" value={email2 ? email2 : ''} onChange={this.handleChangeCustomerEmail2} placeholder="Địa chỉ email" />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Địa chỉ 1 */}
                                        <div className={`form-group`}>
                                            <label>Địa chỉ 1</label>
                                            <input type="text" className="form-control" value={address ? address : ''} onChange={this.handleChangeCustomerAddress} placeholder="Địa chỉ" />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Địa chỉ 2 */}
                                        <div className={`form-group`}>
                                            <label>Địa chỉ 2 </label>
                                            <input type="text" className="form-control" value={address2 ? address2 : ''} onChange={this.handleChangeCustomerAddress2} placeholder="Địa chỉ 2" />
                                            {/* <ErrorLabel content={nameErrorCreateForm} /> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Giới tính */}
                                        <div className={`form-group`}>
                                            <label>Giới tính</label>
                                            <SelectBox
                                                id={`customer-gender`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={
                                                    [
                                                        { value: '', text: 'Chọn' },
                                                        { value: 0, text: 'Nam' },
                                                        { value: 1, text: 'Nữ' },
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
                                            <label>Ngày sinh </label>
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
                                            <label>Nhóm khách hàng</label>
                                            <SelectBox
                                                id={`customer-group`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={
                                                    [
                                                        { value: '', text: 'Chọn' },
                                                        { value: 0, text: 'Bán buôn' },
                                                        { value: 1, text: 'Bán lẻ ' },
                                                        { value: 2, text: '... ' },
                                                    ]
                                                }
                                                value={group ? group : ''}
                                                onChange={this.handleChangeCustomerGroup}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                    {/* Trạng thái khách hàng */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Trạng thái khách hàng</label>
                                            <SelectBox
                                                id={`customer-status`}
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
                                            <label>Vùng </label>
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
                                            <label>Mã số thuế</label>
                                            <input type="text" className="form-control" value={taxNumber ? taxNumber : ''} onChange={this.handleChangeTaxNumber} placeholder="Mã số thuế" />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    {/* website */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>website</label>
                                            <input type="text" className="form-control" value={website ? website : ''} onChange={this.handleChangeCustomerWebsite} placeholder="Địa chỉ website" />
                                        </div>
                                    </div>
                                    {/* linkedIn */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>linkedIn</label>
                                            <input type="text" className="form-control" value={linkedIn ? linkedIn : ''} onChange={this.handleChangeCustomerLinkedIn} placeholder="Địa chỉ linkedIn" />
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
                mobilephoneNumber: value,
            }
        });
    }

    handleChangeTelephoneNumber = (e) => {
        const { newCustomer } = this.state;
        const { value } = e.target;
        this.setState({
            newCustomer: {
                ...newCustomer,
                telephoneNumber: value,
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
                location: value,
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
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    createCustomer: CrmCustomerActions.createCustomer
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerCreate));