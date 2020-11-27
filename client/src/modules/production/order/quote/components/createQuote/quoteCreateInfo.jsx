import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { CrmCustomerActions } from "../../../../../crm/customer/redux/actions";
import { DatePicker, SelectBox, ErrorLabel } from "../../../../../../common-components";

class QuoteCreateInfo extends Component {
    constructor(props) {
        super(props);
    }

    getCustomerOptions = () => {
        let options = this.props.customers.list.map((item) => {
            return {
                value: item._id,
                text: item.code + " - " + item.name,
            };
        });
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
            effectiveDate,
            expirationDate,
            dateError,
        } = this.props;

        const {
            handleCustomerChange,
            handleCustomerAddressChange,
            handleCustomerPhoneChange,
            handleCustomerRepresentChange,
            handleNoteChange,
            handleChangeEffectiveDate,
            handleChangeExpirationDate,
        } = this.props;
        return (
            <React.Fragment>
                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8" style={{ padding: 10, height: "100%" }}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Thông tin chung</legend>
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                            <div className="form-group">
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
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <label>
                                    Địa chỉ nhận hàng
                                    <span className="attention">* </span>
                                </label>
                                <input type="text" className="form-control" value={customerAddress} onChange={handleCustomerAddressChange} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                            <div className="form-group">
                                <label>
                                    Số điện thoại
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" value={customerPhone} onChange={handleCustomerPhoneChange} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                            <div className="form-group">
                                <label>
                                    Người liên hệ <span className="attention"> </span>
                                </label>
                                <input type="text" className="form-control" value={customerRepresent} onChange={handleCustomerRepresentChange} />
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <label>
                                    Ghi chú
                                    <span className="attention"> </span>
                                </label>
                                <input type="text" className="form-control" value={note} onChange={handleNoteChange} />
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: "100%" }}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Báo giá</legend>
                        <div className="form-group">
                            <label>
                                Mã báo giá
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={code} disabled="true" />
                        </div>
                        <div className={`form-group ${!dateError ? "" : "has-error"}`}>
                            <label>Ngày báo giá</label>
                            <DatePicker
                                id="date_picker_create_discount_effectiveDate"
                                value={effectiveDate}
                                onChange={handleChangeEffectiveDate}
                                disabled={false}
                            />
                            <ErrorLabel content={dateError} />
                        </div>

                        <div className={`form-group ${!dateError ? "" : "has-error"}`}>
                            <label>Hiệu lực đến</label>
                            <DatePicker
                                id="date_picker_create_discount_expirationDate"
                                value={expirationDate}
                                onChange={handleChangeExpirationDate}
                                disabled={false}
                            />
                            <ErrorLabel content={dateError} />
                        </div>

                        {/* <div className="form-group">
                                        <label>
                                            Nhân viên bán hàng
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" value={"Phạm Đại Tài"} disabled={true} />
                                    </div> */}
                    </fieldset>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    return { customers };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteCreateInfo));
