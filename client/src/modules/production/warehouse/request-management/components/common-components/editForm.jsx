import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import { formatDate, formatToTimeZoneDate } from '../../../../../../helpers/formatDate';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { generateCode } from '../../../../../../helpers/generateCode';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import GoodComponentRequest from '../../../../common-production/request-management/components/goodComponent';

function EditForm(props) {

    const [state, setState] = useState({
        code: generateCode("SR"),
        desiredTime: "",
        description: "",
        listGoods: [],
    });

    const handleDesiredTimeChange = (value) => {
        if (value.length === 0) {
            value = ""
        }
        setState({
            ...state,
            desiredTime: formatToTimeZoneDate(value)
        });
    }

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
            let listStocks = getStock();
            console.log(listStocks);
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
            if (userdepartments.managers && Object.keys(userdepartments.managers).length > 0) { // Nếu kho có nhân viên
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

    const isFormValidated = () => {
        let { approver, stock, listGoods } = state;
        let result = validateApprover(approver, false) &&
            validateStock(stock, false) &&
            validateSourceProduct(state.sourceType, false) &&
            (validateManufacturingWorks(state.worksValue, false) ||
                validateSupplier(state.supplier, false)) &&
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
                approvers: state.approvers,
                stock: state.stock,
                requestType: 3,
                type: props.stockRequestType,
                status: 1,
                manufacturingWork: state.worksValue,
                supplier: state.supplier,
            }
            props.editRequest(state.requestId, data);
        }
    }

    if (props.requestId !== state.requestId) {
        const { listGoods, goods, translate } = props;
        const { listGoodsByType } = goods;
        let goodOptions = [{
            value: "1",
            text: translate('production.request_management.choose_good')
        }];

        loop:
        for (let i = 0; i < listGoodsByType.length; i++) {
            for (let j = 0; j < listGoods.length; j++) {
                if (listGoods[j].goodId === listGoodsByType[i]._id) {
                    continue loop;
                }
            }
            goodOptions.push({
                value: listGoodsByType[i]._id,
                text: listGoodsByType[i].code + " - " + listGoodsByType[i].name
            });
        }
        console.log(props.worksValue, props.supplier);
        setState({
            ...state,
            requestId: props.requestId,
            code: props.code,
            desiredTime: props.desiredTime,
            description: props.description,
            listGoods: listGoods,
            worksValue: props.worksValue,
            supplier: props.supplier,
            sourceType: props.worksValue ? "1" : "2",
            stock: props.stock,
            approver: props.approver[0].information[0].approver._id,
            status: props.status,
            errorDescription: undefined,
            errorDesiredTime: undefined,
            goodOptions: goodOptions,
            errorGood: undefined,
            errorQuantity: undefined,
        });
    }

    const onHandleGoodChange = (data) => {
        setState({
            ...state,
            listGoods: data
        });
    }

    const { translate, requestManagements } = props;
    const { requestId, code, desiredTime, errorDesiredTime, description, listGoods,
        approver, errorApprover, errorStock, stock, worksValueError, worksValue, sourceType, errorOnSourceProduct, errorSupplier, supplier } = state;
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
            <DialogModal
                modalID={`modal-edit-request`} isLoading={requestManagements.isLoading}
                formID="form-edit-request"
                title={translate('production.request_management.add_request')}
                msg_success={translate('production.request_management.create_successfully')}
                msg_failure={translate('production.request_management.create_failed')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id={`form-edit-request-${requestId}`}>
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
                                    id={`select-approver-${requestId}`}
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
                                    id={`select-source-type-edit-${requestId}`}
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
                                    id={`select-stock-${requestId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={stock}
                                    items={dataStock}
                                    onChange={handleStockChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorStock} />
                            </div>
                            <div className={`form-group ${!errorDesiredTime ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.desiredTime')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`request-edit-desiredTime-${requestId}`}
                                    value={formatDate(desiredTime)}
                                    onChange={handleDesiredTimeChange}
                                    disabled={false}
                                />
                                <ErrorLabel content={errorDesiredTime} />
                            </div>
                            {sourceType === "2" ?
                                (<div className={`form-group ${!errorSupplier ? "" : "has-error"}`}>
                                    <label>
                                        {translate("manage_warehouse.bill_management.supplier")}
                                        <span className="text-red"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-customer-edit-${requestId}`}
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
                                        id={`select-works-edit-${requestId}`}
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
                    <GoodComponentRequest onHandleGoodChange={onHandleGoodChange} requestId={requestId} listGoods={listGoods} />
                </form>
            </DialogModal>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    editRequest: RequestActions.editRequest,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));
