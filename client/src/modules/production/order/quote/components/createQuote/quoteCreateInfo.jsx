import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DatePicker, SelectBox, ErrorLabel } from "../../../../../../common-components";
import "../quote.css";

class QuoteCreateInfo extends Component {
    constructor(props) {
        super(props);
    }

    getCustomerOptions = () => {
        let options = [];

        const { list } = this.props.customers;
        if (list) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn khách hàng---",
                },
            ];

            let mapOptions = this.props.customers.list.map((item) => {
                return {
                    value: item._id,
                    text: item.code + " - " + item.name,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    getOrganizationalUnitOptions = () => {
        let options = [];

        const { listBusinessDepartments } = this.props;
        if (listBusinessDepartments.length) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn đơn vị---",
                },
            ];

            for (let index = 0; index < listBusinessDepartments.length; index++) {
                if (listBusinessDepartments[index].role === 1) {
                    //Chỉ lấy đơn vị bán hàng, lấy trường organizationalUnit trong bảng businessDepartment
                    let option = {
                        value: `${listBusinessDepartments[index].organizationalUnit._id}`,
                        text: `${listBusinessDepartments[index].organizationalUnit.name}`,
                    };

                    options.push(option);
                }
            }
        }

        return options;
    };

    checkAvailableUser = (listUsers, id) => {
        var result = -1;
        listUsers.forEach((value, index) => {
            if (value.user._id === id) {
                result = index;
            }
        });
        return result;
    };

    getUsersInDepartments = () => {
        let users = [];
        const { listBusinessDepartments } = this.props;
        for (let indexDepartment = 0; indexDepartment < listBusinessDepartments.length; indexDepartment++) {
            if (listBusinessDepartments[indexDepartment].role === 2 || listBusinessDepartments[indexDepartment].role === 3) {
                //Chỉ lấy đơn vị quản lý bán hàng và đơn vị kế toán
                const { managers, deputyManagers, employees } = listBusinessDepartments[indexDepartment].organizationalUnit;
                //Thềm các trưởng đơn vị vào danh sách
                for (let indexRole = 0; indexRole < managers.length; indexRole++) {
                    //Lấy ra các role trong phòng ban
                    if (managers[indexRole].users) {
                        for (let indexUser = 0; indexUser < managers[indexRole].users.length; indexUser++) {
                            //Check nếu user chưa tồn tại trong danh sách thì cho vào danh sách
                            let availableCheckedIndex = this.checkAvailableUser(users, managers[indexRole].users[indexUser].userId._id);
                            if (availableCheckedIndex === -1) {
                                users.push({ user: managers[indexRole].users[indexUser].userId, roleName: managers[indexRole].name });
                            } else {
                                //Nếu người dùng đã có trong danh sách thì thêm role vào
                                console.log("availableCheckedIndex", availableCheckedIndex);
                                users[availableCheckedIndex].roleName = users[availableCheckedIndex].roleName + ", " + managers[indexRole].name;
                            }
                        }
                    }
                }
                //Thềm các phó đơn vị vào danh sách
                for (let indexRole = 0; indexRole < deputyManagers.length; indexRole++) {
                    //Lấy ra các role trong phòng ban
                    if (deputyManagers[indexRole].users) {
                        for (let indexUser = 0; indexUser < deputyManagers[indexRole].users.length; indexUser++) {
                            //Check nếu user chưa tồn tại trong danh sách thì cho vào danh sách
                            let availableCheckedIndex = this.checkAvailableUser(users, deputyManagers[indexRole].users[indexUser].userId._id);
                            if (availableCheckedIndex === -1) {
                                users.push({ user: deputyManagers[indexRole].users[indexUser].userId, roleName: deputyManagers[indexRole].name });
                            } else {
                                //Nếu người dùng đã có trong danh sách thì thêm role vào
                                users[availableCheckedIndex].roleName = users[availableCheckedIndex].roleName + ", " + deputyManagers[indexRole].name;
                            }
                        }
                    }
                }
                //Thềm nhân viên vào danh sách
                for (let indexRole = 0; indexRole < employees.length; indexRole++) {
                    //Lấy ra các role trong phòng ban
                    if (employees[indexRole].users) {
                        for (let indexUser = 0; indexUser < employees[indexRole].users.length; indexUser++) {
                            //Check nếu user chưa tồn tại trong danh sách thì cho vào danh sách
                            let availableCheckedIndex = this.checkAvailableUser(users, employees[indexRole].users[indexUser].userId._id);
                            if (availableCheckedIndex === -1) {
                                users.push({ user: employees[indexRole].users[indexUser].userId, roleName: employees[indexRole].name });
                            } else {
                                //Nếu người dùng đã có trong danh sách thì thêm role vào
                                users[availableCheckedIndex].roleName = users[availableCheckedIndex].roleName + ", " + employees[indexRole].name;
                            }
                        }
                    }
                }
            }
        }
        return users;
    };

    getApproversOptions = () => {
        let options = [];

        const { listBusinessDepartments } = this.props;
        if (listBusinessDepartments.length) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn người phê duyệt---",
                },
            ];
            let users = this.getUsersInDepartments();
            let mapOptions = users.map((item) => {
                return {
                    value: item.user._id,
                    text: item.user.name + " - " + item.roleName,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    render() {
        let {
            code,
            note,
            customer,
            customerName,
            customerAddress,
            customerPhone,
            customerRepresent,
            customerTaxNumber,
            customerEmail,
            effectiveDate,
            expirationDate,
            organizationalUnit,
            approvers,
            isUseForeignCurrency,
            foreignCurrency,
        } = this.props;

        let {
            customerError,
            customerEmailError,
            customerPhoneError,
            customerAddressError,
            effectiveDateError,
            expirationDateError,
            organizationalUnitError,
            approversError,
        } = this.props;

        const {
            handleCustomerChange,
            handleCustomerAddressChange,
            handleCustomerPhoneChange,
            handleCustomerRepresentChange,
            handleNoteChange,
            handleChangeEffectiveDate,
            handleChangeExpirationDate,
            handleUseForeignCurrencyChange,
            handleRatioOfCurrencyChange,
            handleSymbolOfForreignCurrencyChange,
            handleCustomerEmailChange,
            handleOrganizationalUnitChange,
            handleApproversChange,
        } = this.props;
        return (
            <React.Fragment>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8" style={{ padding: 10, height: "100%" }}>
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                            <legend className="scheduler-border">Thông tin khách hàng</legend>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!customerError ? "" : "has-error"}`}>
                                        <label>
                                            Khách hàng
                                            <span className="attention"> * </span>
                                        </label>
                                        <SelectBox
                                            id={`select-quote-customer`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={customer}
                                            items={this.getCustomerOptions()}
                                            onChange={handleCustomerChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={customerError} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <label>
                                            Tên khách hàng <span className="attention"> </span>
                                        </label>
                                        <input type="text" className="form-control" value={customerName} disabled={true} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group ${!customerEmailError ? "" : "has-error"}`}>
                                    <label>
                                        email
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" value={customerEmail} onChange={handleCustomerEmailChange} />
                                    <ErrorLabel content={customerEmailError} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                <div className="form-group">
                                    <label>
                                        Mã số thuế <span className="attention"> </span>
                                    </label>
                                    <input type="text" className="form-control" value={customerTaxNumber} disabled={true} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!customerPhoneError ? "" : "has-error"}`}>
                                        <label>
                                            Số điện thoại
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="number" className="form-control" value={customerPhone} onChange={handleCustomerPhoneChange} />
                                        <ErrorLabel content={customerPhoneError} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <label>
                                            Người liên hệ <span className="attention"> </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customerRepresent}
                                            onChange={handleCustomerRepresentChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group ${!customerAddressError ? "" : "has-error"}`}>
                                    <label>
                                        Địa chỉ nhận hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" value={customerAddress} onChange={handleCustomerAddressChange} />
                                    <ErrorLabel content={customerAddressError} />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: "100%" }}>
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                            <legend className="scheduler-border">Báo giá</legend>
                            <div className="form-group">
                                <label>
                                    Mã báo giá
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" value={code} disabled={true} />
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-0px" style={{ paddingRight: "5px" }}>
                                <div className={`form-group ${!effectiveDateError ? "" : "has-error"}`}>
                                    <label>
                                        Ngày báo giá
                                        <span className="attention"> * </span>
                                    </label>
                                    <DatePicker
                                        id="date_picker_create_discount_effectiveDate"
                                        value={effectiveDate}
                                        onChange={handleChangeEffectiveDate}
                                        disabled={false}
                                    />
                                    <ErrorLabel content={effectiveDateError} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-0px">
                                <div className={`form-group ${!expirationDateError ? "" : "has-error"}`}>
                                    <label>
                                        Hiệu lực đến
                                        <span className="attention"> * </span>
                                    </label>
                                    <DatePicker
                                        id="date_picker_create_discount_expirationDate"
                                        value={expirationDate}
                                        onChange={handleChangeExpirationDate}
                                        disabled={false}
                                    />
                                    <ErrorLabel content={expirationDateError} />
                                </div>
                            </div>
                            {/* <div className={`form-group ${!organizationalUnitError ? "" : "has-error"}`}>
                                <label>
                                    Đơn vị bán hàng
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-create-quote-organizational-unit`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnit}
                                    items={this.getOrganizationalUnitOptions()}
                                    onChange={handleOrganizationalUnitChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={organizationalUnitError} />
                            </div> */}
                            <div className={`form-group ${!approversError ? "" : "has-error"}`}>
                                <label>
                                    Người phê duyệt
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-create-quote-aprrovers`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approvers}
                                    items={this.getApproversOptions()}
                                    onChange={handleApproversChange}
                                    multiple={true}
                                />
                                <ErrorLabel content={approversError} />
                            </div>

                            <div className="form-group">
                                <div className="form-group">
                                    <label>
                                        Ghi chú
                                        <span className="attention"> </span>
                                    </label>
                                    <textarea type="text" className="form-control" value={note} onChange={handleNoteChange} />
                                </div>
                            </div>

                            <div className="form-group ">
                                <input
                                    type="checkbox"
                                    className={`form-check-input`}
                                    id={`checkbox-use-foreign-currency`}
                                    value={isUseForeignCurrency}
                                    checked={isUseForeignCurrency}
                                    onChange={handleUseForeignCurrencyChange}
                                    style={{ minWidth: "20px" }}
                                />
                                <label className={`form-check-label`} htmlFor={`checkbox-use-foreign-currency`} style={{ fontWeight: 500 }}>
                                    Sử dụng ngoại tệ
                                </label>
                            </div>
                            {isUseForeignCurrency ? (
                                <>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 " style={{ paddingLeft: "0px" }}>
                                        <div className="form-group">
                                            <label>
                                                Tên viết tắt ngoại tệ
                                                <span className="attention"> * </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập tên viết tắt..."
                                                value={foreignCurrency.symbol}
                                                onChange={handleSymbolOfForreignCurrencyChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ paddingRight: "0px" }}>
                                        <div className="form-group">
                                            <label>
                                                Tỷ giá hối đoái
                                                <span className="attention"> * </span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Vd: 99,99"
                                                value={foreignCurrency.ratio}
                                                onChange={handleRatioOfCurrencyChange}
                                            />
                                        </div>
                                    </div>

                                    <div className={`form-group`}>
                                        {foreignCurrency.ratio && foreignCurrency.symbol ? (
                                            <div>
                                                {" "}
                                                <span className="text-red">1</span> ({foreignCurrency.symbol}) ={" "}
                                                <span className="text-red">{foreignCurrency.ratio}</span> (vnđ){" "}
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </>
                            ) : (
                                ""
                            )}

                            {/* <div className="form-group">
                                        <label>
                                            Nhân viên bán hàng
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" value={"Phạm Đại Tài"} disabled={true} />
                                    </div> */}
                        </fieldset>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { listBusinessDepartments } = state.businessDepartments;
    const { customers } = state.crm;
    return { customers, listBusinessDepartments };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteCreateInfo));
