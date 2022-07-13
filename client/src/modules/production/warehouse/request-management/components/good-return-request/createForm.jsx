import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import { formatToTimeZoneDate, formatDate } from '../../../../../../helpers/formatDate';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { generateCode } from '../../../../../../helpers/generateCode';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import ModalSelectIssueBill from '../../../bill-management/components/good-returns/modalSelectIssueBill';
import { BillActions } from '../../../bill-management/redux/actions';

function CreateForm(props) {
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
        code: generateCode("SR"),
        desiredTime: formatDate((new Date()).toISOString()),
        description: "",
        listGoods: [],
        approvers: "",
        stock: "",
    });

    // Thời gian mong muốn 

    const handleDesiredTimeChange = (value) => {
        if (value.length === 0) {
            value = ""
        }
        setState({
            ...state,
            desiredTime: formatToTimeZoneDate(value)
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

    const findIndex = (array, value) => {
        let result = -1;
        array.map((item, index) => {
            if (item.value === value) {
                result = index
            }
        })
        return result;
    }

    useEffect(() => {
        if (state.stock) {
            let group = '2';
            let status = '2';
            props.getBillsByStatus({ group, status, type: null, fromStock: state.stock });
            let listStocks = getStock();
            let result = findIndex(listStocks, state.stock);
            if (result !== -1) {
                props.getAllUserOfDepartment(listStocks[result].organizationalUnit);
            }
        }
    }, [state.stock])

    const getApprover = () => {
        const { translate, user } = props;
        let listUsersArray = [{
            value: "",
            text: translate('production.request_management.approver_in_stock')
        }];

        let { userdepartments } = user;
        if (userdepartments) {
            userdepartments = userdepartments[0];
            if (userdepartments && userdepartments.managers && Object.keys(userdepartments.managers).length > 0) { // Nếu kho có nhân viên
                let managers = userdepartments.managers[Object.keys(userdepartments.managers)[0]].members;
                if (managers.length) {
                    managers.map((member) => {
                        listUsersArray.push({
                            value: member._id,
                            text: member.name
                        });
                    });
                }

            }
        }
        return listUsersArray;
    }

    const handleApproverChange = (value) => {
        let approver = value[0];
        validateApprover(approver, true);
    };

    const validateApprover = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("production.request_management.validate_approver_in_stock");
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
                approveType: 4
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

    const validateStock = async (value, willUpdateState = true) => {
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
                organizationalUnit: item.organizationalUnit._id
            });
        });

        return stockArr;
    };

    // Phần nguồn gốc yêu cầu

    const handleSourceChange = (value) => {
        validateSourceProduct(value[0], true);
    }

    const validateSourceProduct = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value !== "1" && value !== "2") {
            msg = translate("manage_warehouse.good_management.validate_source_product");
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorOnSourceProduct: msg,
                sourceType: value,
                // selfProducedCheck: value === "1" ? true : false,
                // listGood: [],
            });
        }
        return msg === undefined;
    }

    // Phần nhà máy sản xuất

    const getListWorks = () => {
        const { translate, manufacturingWorks } = props;
        let listWorksArray = [{
            value: "",
            text: translate('production.request_management.choose_manufacturing_works')
        }];

        const { listWorks } = manufacturingWorks;

        if (listWorks) {
            listWorks.map((item) => {
                listWorksArray.push({
                    value: item._id,
                    text: item.name,
                    organizationalUnit: item.organizationalUnit._id
                });
            });
        }
        return listWorksArray;
    }

    const handleManufacturingWorksChange = (value) => {
        const worksValue = value[0];
        validateManufacturingWorks(worksValue, true);
    }

    const validateManufacturingWorks = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = props;
        if (value === undefined || value === "") {
            msg = translate('production.request_management.validate_manufacturing_works');
        }
        if (willUpdateState) {
            setState({
                ...state,
                worksValue: value,
                worksValueError: msg,
                teamLeaderValue: "",
                supplier: "",
            });
        }
        return msg === undefined;
    }

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
                worksValue: "",
            });
        }
        return msg === undefined;
    };

    const handleReturnQuantityChange = (e, index) => {
        let { value } = e.target;

        let { dataLots } = state;
        dataLots[index].returnQuantity = value;
        setState({
            ...state,
            dataLots,
        });

        validateReturnQuantityChangeOnTable(value, index, true);
    };

    const validateReturnQuantityChangeOnTable = (value, index, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) < 0) {
            msg = "giá trị không được nhỏ hơn 0!";
        } else if (parseInt(value) > parseInt(state.dataLots[index].quantity)) {
            msg = "giá trị không được lớn hơn số lượng!";
        }
        if (willUpdateState) {
            setState({
                ...state,
                returnQuantityErrorPosition: index,
                returnQuantityErrorOnTable: msg,
            });
        }

        return msg;
    };

    const selectBill = () => {
        window.$("#modal-select-bill-issue").modal("show");
    };

    const getDataLots = (goods) => {
        let lots = [];
        goods.forEach(item => {
            item.lots.forEach(lot => {
                lot.goodName = item.good.name;
                lot.baseUnit = item.good.baseUnit;
                lot.code = lot.lot.code;
                lot.expirationDate = lot.lot.expirationDate;
                lot.returnQuantity = 0;
                lot.goodId = item.good._id;
                lots.push(lot);
            })
        })
        return lots;
    }

    const handleBillIssueChange = async (data) => {
        await setState({
            ...state,
            billSelected: data.code + " -- " + formatDate(data.createdAt),
            bill: data,
            dataLots: getDataLots(data.goods),
            worksValue: data.manufacturingWork && data.manufacturingWork._id ? data.manufacturingWork._id : "",
            sourceType: data.manufacturingWork && data.manufacturingWork._id ? "1" : "2",
            supplier: data.supplier && data.supplier._id ? data.supplier._id : "",
            listGoods: data.goods,
        })
    };

    const handleBillChange = (value) => {
    }

    const totalReturnQuantity = (dataLots) => {
        let total = 0;
        dataLots.forEach(item => {
            total += parseInt(item.returnQuantity);
        })
        return total;
    }

    // Phần lưu dữ liệu

    const handleClickCreate = () => {
        const value = generateCode("SR");
        setState({
            ...state,
            code: value
        });
    }

    const isFormValidated = () => {
        let { approver, stock, listGoods } = state;
        let result = validateApprover(approver, false) &&
            validateStock(stock, false) &&
            validateSourceProduct(state.sourceType, false) &&
            (validateManufacturingWorks(state.worksValue, false) ||
                validateSupplier(state.supplier, false)) &&
            totalReturnQuantity(state.dataLots) > 0
        return result;
    }

    const save = () => {
        if (isFormValidated()) {
            let { listGoods } = state;
            listGoods.forEach((item) => {
                item.lots = [];
                dataLots.forEach(lot => {
                    if (lot.goodId === item.good._id) {
                        item.lots.push(lot);
                    }
                })
            })
            let goods = listGoods.map((good) => {
                return {
                    good: good.good._id,
                    quantity: '',
                    lots: good.lots.map((lot) => {
                        return {
                            lot: lot.lot._id,
                            quantity: lot.quantity,
                            returnQuantity: lot.returnQuantity
                        }
                    })
                }
            })
            const data = {
                code: state.code,
                bill: state.bill._id,
                desiredTime: state.desiredTime,
                description: state.description,
                goods: goods,
                approvers: state.approvers,
                stock: state.stock,
                status: 1,
                type: props.stockRequestType,
                requestType: 3,
                manufacturingWork: state.worksValue,
                supplier: state.supplier,
                dataLots: state.dataLots,
            }
            props.createRequest(data);
        }
    }

    const { translate, NotHaveCreateButton, bills } = props;
    const { code, desiredTime, errorIntendReceiveTime, description, approver, errorApprover,
        errorStock, stock, sourceType, errorOnSourceProduct, errorSupplier, supplier, worksValueError,
        worksValue, errorBill, billSelected, dataLots, returnQuantityErrorPosition, returnQuantityErrorOnTable } = state;
    let dataSource = [
        {
            value: '0',
            text: 'Chọn nguồn yêu cầu',
        },
        {
            value: '1',
            text: 'Yêu cầu từ nhà máy sản xuất',
        },
        {
            value: '2',
            text: 'Yêu cầu từ nhà cung cấp',
        }
    ];
    const dataApprover = getApprover();
    const dataStock = getStock();
    const dataManufacturingWorks = getListWorks();
    const dataCustomer = getSuplierOptions();
    return (
        <React.Fragment>
            {!NotHaveCreateButton && <ButtonModal onButtonCallBack={handleClickCreate} modalID="modal-create-purchasing-request" button_name={translate('production.request_management.add_request_button')} title={translate('production.request_management.add_request')} />}
            <DialogModal
                modalID="modal-create-purchasing-request"
                formID="form-create-purchasing-request"
                title={translate('production.request_management.add_request')}
                msg_success={translate('production.request_management.create_successfully')}
                msg_failure={translate('production.request_management.create_failed')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
                maxWidth={500}
            >
                <ModalSelectIssueBill listBills={bills.listBillByStatus} onDataChange={handleBillIssueChange} />
                <form id="form-create-purchasing-request">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate("production.request_management.base_infomation")}</legend>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('production.request_management.code')}<span className="text-red">*</span></label>
                                <input type="text" disabled={true} value={code} className="form-control"></input>
                            </div>
                            <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                <label>
                                    {translate("production.request_management.approver_in_stock")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-approver`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approver}
                                    items={dataApprover}
                                    onChange={handleApproverChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorApprover} />
                            </div>
                            <div className={`form-group ${!errorOnSourceProduct ? "" : "has-error"}`}>
                                <label>{"Nguồn yêu cầu"}</label>
                                <span className="text-red"> * </span>
                                <SelectBox
                                    id={`choose-source-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={sourceType}
                                    items={dataSource}
                                    onChange={handleSourceChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorOnSourceProduct} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                <label>
                                    {translate("production.request_management.unit_receiving_request")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-stock`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={stock}
                                    items={dataStock}
                                    onChange={handleStockChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorStock} />
                            </div>

                            <div className={`form-group ${!errorBill ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bill_management.choose_bill')}<span className="text-red"> * </span></label>
                                <div>
                                    <div className="col-md-8 col-lg-8" style={{ padding: 0 }}>
                                        <input type="text" className="form-control" value={billSelected ? billSelected : ''} onChange={handleBillChange} />
                                    </div>
                                    <div className="col-md-4 col-lg-4">
                                        <p type="button" className="btn btn-info" style={{ marginLeft: "10px" }} onClick={() => selectBill()}>{translate('manage_warehouse.bill_management.choose_bill')}</p>
                                    </div>
                                </div>
                                <ErrorLabel content={errorBill} />
                            </div>

                            <div style={{ marginTop: "50px" }} className={`form-group ${!errorIntendReceiveTime ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.desiredTime')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`purchasing-request-create-desiredTime`}
                                    value={desiredTime}
                                    onChange={handleDesiredTimeChange}
                                    disabled={false}
                                />
                                <ErrorLabel content={errorIntendReceiveTime} />
                            </div>
                            {sourceType === "2" ?
                                (<div className={`form-group ${!errorSupplier ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.supplier")}
                                        <span className="text-red"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-customer`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={supplier}
                                        items={dataCustomer}
                                        onChange={handleSupplierChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content={errorSupplier} />
                                </div>)
                                : null}
                            {sourceType === "1" ?
                                (<div className={`form-group ${!worksValueError ? "" : "has-error"}`}>
                                    <label>{translate('production.request_management.manufacturing_works')}<span className="text-red">*</span></label>
                                    <SelectBox
                                        id={`select-works`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={worksValue}
                                        items={dataManufacturingWorks}
                                        onChange={handleManufacturingWorksChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content={worksValueError} />
                                </div>)
                                : null}

                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={`form-group`}>
                                <label>{translate('production.request_management.description')}</label>
                                <textarea type="text" className="form-control" value={description} onChange={handleDescriptionChange} />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{"Thông tin chi tiết lô hàng không đạt kiểm định"}</legend>
                        <div className={`form-group`}>
                            {/* Bảng thông tin chi tiết */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                        <th title="Mã lô hàng">{"Mã lô hàng"}</th>
                                        <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                        <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                        <th title={"Số lượng xuất kho"}>{"Số lượng xuất kho"}</th>
                                        <th title={"Vị lượng trả lại"}>{"Số lượng trả lại"}</th>
                                        <th title={"Ngày hết hạn"}>{"Ngày hết hạn"}</th>
                                    </tr>
                                </thead>
                                <tbody id={`good-return-request-create`}>
                                    {
                                        (typeof dataLots === 'undefined' || dataLots.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            dataLots.map((x, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.code}</td>
                                                    <td>{x.goodName}</td>
                                                    <td>{x.baseUnit}</td>
                                                    <td>{x.quantity}</td>
                                                    <td>
                                                        <div className={`form-group ${parseInt(returnQuantityErrorPosition) === index && returnQuantityErrorOnTable ? "has-error" : ""} `}>
                                                            <input
                                                                className="form-control"
                                                                type="number"
                                                                value={x.returnQuantity}
                                                                name="value"
                                                                style={{ width: "100%" }}
                                                                onChange={(e) => handleReturnQuantityChange(e, index)}
                                                            />
                                                            {parseInt(returnQuantityErrorPosition) === index && returnQuantityErrorOnTable && (
                                                                <ErrorLabel content={returnQuantityErrorOnTable} />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>{x.expirationDate}</td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                </form>
            </DialogModal>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    createRequest: RequestActions.createRequest,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getBillsByStatus: BillActions.getBillsByStatus,
    getDetailBill: BillActions.getDetailBill,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));
