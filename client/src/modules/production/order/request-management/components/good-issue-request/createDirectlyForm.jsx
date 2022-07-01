import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import GoodComponentRequest from '../../../../common-production/request-management/components/goodComponent';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { generateCode } from '../../../../../../helpers/generateCode';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
function CreateDirectlyForm(props) {
    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('-');
    }

    const [state, setState] = useState({
        code: generateCode("PDN"),
        desiredTime: formatDate((new Date()).toISOString()),
        description: "",
        listGoods: [],
        stock: "",
    });

    // Thời gian mong muốn 

    const handleDesiredTimeChange = (value) => {
        if (value.length === 0) {
            value = ""
        }
        setState({
            ...state,
            desiredTime: value
        })
    }

    // Mô tả
    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value,
        });

    }
    // Phần người phê duyệt

    const getApprover = () => {
        let mapOptions = [];
        const { user } = props;
        if (user) {
            mapOptions = [{
                value: "title", //Title không được chọn
                text: "---Chọn người phê duyệt---",
            }];

            user.list.map((user) => {
                mapOptions.push({
                    value: user._id,
                    text: user.name,
                });
            });
        }
        return mapOptions;
    }

    const handleApproverChange = (value) => {
        let approver = value[0];
        validateApprover(approver, true);
    };

    const validateApprover = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("production.request_management.validate_approver_in_order");
        }
        if (willUpdateState) {
            let approvers = [];
            let information = [];
            information.push({
                approver: value,
                approvedTime: null,
            });
            approvers.push({
                information: information,
                approveType: 3
            });
            setState({
                ...state,
                approver: value,
                approvers: approvers,
                errorApprover: msg,
            });
        }
        return msg === undefined;
    };

    // phần kho
    const handleStockChange = (value) => {
        let stock = value[0];
        validateStock(stock, true);
    };

    const validateStock = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("production.request_management.validate_stock");
        }
        if (willUpdateState) {
            setState({
                ...state,
                stock: value,
                errorStock: msg,
            });
        }
        return msg === undefined;
    };

    const getStock = () => {
        const { stocks, translate } = props;
        let stockArr = [{ value: "", text: translate("production.request_management.choose_stock") }];

        stocks.listStocks.map((item) => {
            stockArr.push({
                value: item._id,
                text: item.name,
            });
        });

        return stockArr;
    };

    // phần nhà cung cấp 

    const getSuplierOptions = () => {
        let mapOptions = [];
        const { list } = props.crm.customers;
        if (list) {
            mapOptions = [{
                value: "title", //Title không được chọn
                text: "---Chọn nhà cung cấp---",
            }];
            list.map((item) => {
                mapOptions.push({
                    value: item._id,
                    text: item.name,
                });
            });
        }
        return mapOptions;
    };

    const handleSupplierChange = async (value) => {
        validateSupplier(value[0], true);
    };

    const validateSupplier = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }
        if (willUpdateState) {
            setState({
                ...state,
                supplier: value,
                supplierError: msg,
            });
        }
        return msg;
    };

    // Phần lưu dữ liệu

    const isFormValidated = () => {
        let { approver, stock, listGoods } = state;
        let result = validateApprover(approver, false) &&
            validateStock(stock, false) &&
            listGoods.length > 0
        return result;
    }

    const save = () => {
        if (isFormValidated()) {
            let { listGoods } = state;
            let goods = listGoods.map((good) => {
                return {
                    good: good.goodId,
                    quantity: good.quantity
                }
            })
            const data = {
                code: state.code,
                desiredTime: state.desiredTime,
                description: state.description,
                goods: goods,
                stock: state.stock,
                requestType: 2,
                type: 2,
                status: 1,
                approvers: state.approvers,
                supplier: state.supplier,
            }
            console.log(data);
            props.createRequest(data);
        }
    }

    const onHandleGoodChange = (data) => {
        setState({
            ...state,
            listGoods: data
        });
    }

    const { translate, bigModal } = props;
    const { code, desiredTime, errorIntendReceiveTime, description, errorStock, stock, errorApprover, approver, supplier, supplierError } = state;
    const dataStock = getStock();
    const dataApprover = getApprover();
    const dataSupplier = getSuplierOptions();

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-directly-request"
                formID="modal-create-directly-request"
                title={translate('production.request_management.add_request')}
                msg_success={translate('production.request_management.create_successfully')}
                msg_failure={translate('production.request_management.create_failed')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={bigModal ? 75 : 50}
                maxWidth={500}
            >
                <form id="modal-create-directly-request">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate("production.request_management.base_infomation")}</legend>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('production.request_management.code')}<span className="text-red">*</span></label>
                                <input type="text" disabled={true} value={code} className="form-control"></input>
                            </div>
                            <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                <label>
                                    {translate("production.request_management.unit_receiving_request")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-stock-directly-request`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={stock}
                                    items={dataStock}
                                    onChange={handleStockChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorStock} />
                            </div>
                            <div className={`form-group ${!supplierError ? "" : "has-error"}`}>
                                <label>{"Nhà cung cấp"}<span className="text-red"> * </span></label>
                                <SelectBox
                                    id={`select-create-purchase-order-directly-supplier`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={supplier}
                                    items={dataSupplier}
                                    onChange={handleSupplierChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={supplierError} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                <label>
                                    {translate("production.request_management.approver_in_order")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-approver-directly-request`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approver}
                                    items={dataApprover}
                                    onChange={handleApproverChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorApprover} />
                            </div>
                            <div className={`form-group ${!errorIntendReceiveTime ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.desiredTime')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`purchasing-request-create-desiredTime-directly-request`}
                                    value={desiredTime}
                                    onChange={handleDesiredTimeChange}
                                    disabled={false}
                                />
                                <ErrorLabel content={errorIntendReceiveTime} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={`form-group`}>
                                <label>{translate('production.request_management.description')}</label>
                                <textarea type="text" className="form-control" value={description} onChange={handleDescriptionChange} />
                            </div>
                        </div>
                    </fieldset>
                    <GoodComponentRequest onHandleGoodChange={onHandleGoodChange} selectBoxName={"create-receipt-request-directly"} />
                </form>
            </DialogModal>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    createRequest: RequestActions.createRequest,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateDirectlyForm));
