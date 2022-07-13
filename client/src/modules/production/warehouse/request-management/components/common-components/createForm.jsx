import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import GoodComponentRequest from '../../../../common-production/request-management/components/goodComponent';
import { formatToTimeZoneDate } from '../../../../../../helpers/formatDate';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { generateCode } from '../../../../../../helpers/generateCode';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
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
                status: 1,
                type: props.stockRequestType,
                requestType: 3,
                manufacturingWork: state.worksValue,
                supplier: state.supplier,
            }
            props.createRequest(data);
        }
    }

    const onHandleGoodChange = (data) => {
        setState({
            ...state,
            listGoods: data
        });
    }

    const { translate, NotHaveCreateButton } = props;
    const { code, desiredTime, errorIntendReceiveTime, description, approver, errorApprover,
        errorStock, stock, sourceType, errorOnSourceProduct, errorSupplier, supplier, worksValueError, worksValue } = state;
    const dataSource = [
        {
            value: '0',
            text: 'Chọn nguồn hàng hóa',
        },
        {
            value: '1',
            text: 'Hàng từ nhà máy sản xuất',
        },
        {
            value: '2',
            text: 'Nhập hàng từ nhà cung cấp',
        }
    ];
    const dataSource2 = [
        {
            value: '0',
            text: 'Chọn đơn vị tiếp nhận hàng hóa',
        },
        {
            value: '1',
            text: 'Xuất hàng đến nhà máy sản xuất',
        },
        {
            value: '2',
            text: 'Xuất hàng đến khách hàng',
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
                <form id="form-create-purchasing-request">
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
                            <div className={`form-group ${!errorOnSourceProduct ? "" : "has-error"}`}>
                                <label>{props.stockRequestType == '1' ? "Nguồn hàng hóa" : 'Nơi tiếp nhận hàng hóa'}</label>
                                <span className="text-red"> * </span>
                                <SelectBox
                                    id={`choose-source-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={sourceType}
                                    items={props.stockRequestType == '1' ? dataSource : dataSource2}
                                    onChange={handleSourceChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorOnSourceProduct} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorIntendReceiveTime ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.desiredTime')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`purchasing-request-create-desiredTime`}
                                    value={desiredTime}
                                    onChange={handleDesiredTimeChange}
                                    disabled={false}
                                />
                                <ErrorLabel content={errorIntendReceiveTime} />
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
                    <GoodComponentRequest onHandleGoodChange={onHandleGoodChange} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));
