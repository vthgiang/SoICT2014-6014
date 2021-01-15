import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DatePicker, SelectBox, ErrorLabel } from "../../../../../../common-components";

class SalesOrderCreateInfo extends Component {
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

            for (let index = 0; index < listBusinessDepartments.length; index++) {
                if (listBusinessDepartments[index].role === 2 || listBusinessDepartments[index].role === 3) {
                    //Chỉ lấy đơn vị quản lý bán hàng và đơn vị kế toán
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
            priority,
            organizationalUnit,
            isUseForeignCurrency,
            foreignCurrency,
        } = this.props;

        let { customerError, customerEmailError, customerPhoneError, customerAddressError, priorityError, organizationalUnitError } = this.props;

        const {
            handleCustomerChange,
            handleCustomerAddressChange,
            handleCustomerPhoneChange,
            handleCustomerRepresentChange,
            handleNoteChange,
            handleUseForeignCurrencyChange,
            handleRatioOfCurrencyChange,
            handleSymbolOfForreignCurrencyChange,
            handleCustomerEmailChange,
            handlePriorityChange,
            handleOrganizationalUnitChange,
        } = this.props;

        console.log("listBusinessDepartments", this.props.listBusinessDepartments);
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
                                            id={`select-sales-order-customer`}
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
                            <legend className="scheduler-border">Đơn bán hàng</legend>
                            <div className="form-group">
                                <label>
                                    Mã đơn
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" value={code} disabled={true} />
                            </div>

                            <div className={`form-group ${!organizationalUnitError ? "" : "has-error"}`}>
                                <label>
                                    Đơn vị bán hàng
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-create-sales-order-organizational-unit`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnit}
                                    items={this.getOrganizationalUnitOptions()}
                                    onChange={handleOrganizationalUnitChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={organizationalUnitError} />
                            </div>

                            <div className={`form-group ${!priorityError ? "" : "has-error"}`}>
                                <label>
                                    Độ ưu tiên
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-create-sales-order-priority`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={priority}
                                    items={[
                                        { value: "title", text: "---Chọn độ ưu tiên---" },
                                        { value: 1, text: "Thấp" },
                                        { value: 2, text: "Trung bình" },
                                        { value: 3, text: "Cao" },
                                        { value: 4, text: "Đặc biệt" },
                                    ]}
                                    onChange={handlePriorityChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={priorityError} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderCreateInfo));
