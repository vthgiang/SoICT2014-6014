import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../production/common-production/request-management/redux/actions';
import GoodComponentRequest from '../../../../production/common-production/request-management/components/goodComponent'
import { formatToTimeZoneDate, formatDate } from '../../../../../helpers/formatDate';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { generateCode } from '../../../../../helpers/generateCode';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { CrmCustomerActions } from '../../../../crm/customer/redux/actions';
import { getStorage } from '../../../../../config';
import { DeliveryServices } from '../redux/services'
import { Loading } from '../../../../../common-components';

function CreateTransportRequestForm(props) {

    const [state, setState] = useState({
        code: generateCode("GIR"),
        desiredTime: formatDate((new Date()).toISOString()),
        description: "",
        listGoods: [],
        approvers: "",
        stock: "",
        customer: "",
        optimalStock: null,
        isValidatedToSearchOptimalStock: false,
        optimalStockMessage: "",
        isSearchingStock: false
    });

    useEffect(() => {
        // Code to handle modal visibility when `showModal` prop changes
        if (props.showModal) {
            // Code to show modal
        }
    }, [props.showModal]);

    // Function to handle modal visibility
    const handleShowModal = () => {
        props.setShowModal(true); // Call setShowModal function passed from parent component
    }

    useEffect(() => {
        props.getCustomers({
            page: 0,
            // limit: 10,
            // tableId: "table-get-customers",
            roleId: getStorage('currentRole')
        });
    }, []);

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
        if (state.worksValue) {
            let listWorks = getListWorks();
            let result = findIndex(listWorks, state.worksValue);
            if (result !== -1) {
                props.getAllUserOfDepartment(listWorks[result].organizationalUnit);
            }
        }
        props.getAllStockWithBinLocation({});
    }, [state.worksValue])

    const getApprover = () => {
        const { translate, user } = props;
        let listUsersArray = [{
            value: "",
            text: translate('production.request_management.approver_in_stock')
        }];

        let { userdepartments } = user;
        if (userdepartments) {
            userdepartments = userdepartments[0];
            if (userdepartments.managers && Object.keys(userdepartments.managers).length > 0) { // Nếu nhà máy có nhân viên
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
                approveType: 1
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
        if (value === "") {
            msg = translate('production.request_management.validate_manufacturing_works');
        }
        if (willUpdateState) {
            setState({
                ...state,
                worksValue: value,
                worksValueError: msg,
                teamLeaderValue: ""
            });
        }
        return msg === undefined;
    }

    // Phần lưu dữ liệu

    const handleClickCreate = () => {
        const value = generateCode("GIR");
        setState({
            ...state,
            code: value
        });
    }

    const isFormValidated = () => {
        let { listGoods, optimalStock } = state;
        let result = listGoods.length > 0 && optimalStock
        return result;
    }

    const save = () => {
        if (isFormValidated()) {
            let { listGoods, optimalStock } = state;
            let goods = listGoods.map((good) => {
                return {
                    good: good.goodId,
                    quantity: good.quantity
                }
            })
            const data = {
                code: state.code,
                desiredTime: formatToTimeZoneDate(state.desiredTime),
                description: state.description,
                goods: goods,
                requestType: 4,
                stock: optimalStock._id,
                status: 1,
                supplier: state.customer
            }
            props.createRequest(data);
        }
    }

    const onHandleGoodChange = (data) => {
        if (data.length > 0 && customer) {
            setState({
                ...state,
                listGoods: data,
                isValidatedToSearchOptimalStock: true,
            });
        }
    }

    const handleCustomerChange = (value) => {
        const { listGoods } = state;
        setState({
            ...state,
            customer: value[0],
            isValidatedToSearchOptimalStock: listGoods.length > 0 ? true : false,
            code: generateCode("GIR")
        })
    }

    // Trả lại mảng customer phục vụ cho select box
    const getListCustomer = () => {
        const { customers, translate } = props;
        let customerArr = [{ value: "", text: translate("manage_transportation.orders_table.text_select_customer") }];

        customers.list.map((item) => {
            customerArr.push({
                value: item._id,
                text: item.name,
            });
        });

        return customerArr;
    }

    // Tìm ra kho tối ưu phục vụ cho đơn hàng của khách
    const handleSearchOptimalStock = () => {
        setState({
            ...state,
            isSearchingStock: true
        });

        const availableStocks = getAvailableStocks(); // Lấy ra các kho có đủ số lương hàng
        if (availableStocks.length <= 0) {
            setState({
                ...state,
                optimalStock: null,
                optimalStockMessage: translate('production.request_management.optimal_stock_error_message')
            })
        } else {
            const availableStockIds = availableStocks.map((stock) => stock.stockId );
            const customerDxCode = state.customer;

            const dataToSync = {
                listDepotCode: availableStockIds,
                customerDxCode: customerDxCode
            }
            // Trong list kho khả dụng với đơn hàng lấy ra kho có khoảng cách đến khách là ngắn nhất (gọi đến hệ thống ngoài)
            DeliveryServices.getOptimalDepot(dataToSync)
                .then((res) => {
                    const resData = res.data.data;
                    if (!res.data.data) {
                        setState({
                            ...state,
                            optimalStock: null,
                            optimalStockMessage: translate('production.request_management.optimal_stock_error_message')
                        })
                    } else {
                        var clusterDepotCorrelation = resData.correlations.filter((node) => (node.toNodeName == resData.clusterDepot.name));
                        let optimalStock = {
                            name: resData.clusterDepot.name,
                            address: resData.clusterDepot.address,
                            _id: resData.clusterDepot.dxCode,
                            distance: Math.round((clusterDepotCorrelation[0].distance/1000) * 100) / 100 + " km"
                        }
                        setState({
                            ...state,
                            optimalStock: optimalStock,
                            isSearchingStock: false
                        })
                    }
                })
                .catch((error) => {
                    console.log("Lấy dữ liệu ma trận khoảng cách lỗi", error);
                    setState({
                        ...state,
                        optimalStock: null,
                        optimalStockMessage: `Lấy dữ liệu ma trận khoảng cách lỗi`,
                        isSearchingStock: false
                    })
                })
        }
    }

    const getAvailableStocks = () => {
        const { listGoods } = state;
        let listStock = requestManagements.allStockWithBinLocation?.listStock;
        
        let listRequestGood = listGoods.map((good) => {
            return {
                id: good.goodId,
                quantity: good.quantity
            }
        })

        let availableStock = listStock.filter((stock) => {
            let enableGoods = stock.enableGoods;
            if (listRequestGood.length > enableGoods.length) return false;

            let check = true;
            listRequestGood.forEach((requestGood) => {
                let good = null
                enableGoods.forEach((enableGood) => {
                    if (requestGood.id == enableGood.good._id) good = enableGood
                })
                if (good == null) {
                    check = false;
                } else if (good.contained < requestGood.quantity) {
                    check = false;
                }
            })
            if (check) return true;
        })
        return availableStock;
    }


    const { translate, bigModal, requestManagements } = props;
    const { code, desiredTime, errorIntendReceiveTime, description, approver, errorApprover,
        errorStock, stock, worksValueError, worksValue, customer, optimalStock, isSearchingStock } = state;
    const dataApprover = getApprover();
    const dataStock = getStock();
    const dataCustomer = getListCustomer();
    const dataManufacturingWorks = getListWorks();

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-transportation-request"
                formID="form-create-transportation-request"
                title={translate('production.request_management.add_request')}
                msg_success={translate('production.request_management.create_successfully')}
                msg_failure={translate('production.request_management.create_failed')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={bigModal ? 75 : 50}
                maxWidth={500}
                handleShowModal
            >
                <form id="form-create-transportation-request">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate("production.request_management.base_infomation")}</legend>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>{translate('production.request_management.code')}<span className="text-red">*</span></label>
                                <input type="text" disabled={true} value={code} className="form-control"></input>
                            </div>
                            <div className={`form-group`}>
                                <label>
                                    {translate("manage_transportation.orders_table.select_customer")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-customer-create-form`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={customer}
                                    items={dataCustomer}
                                    onChange={handleCustomerChange}
                                    multiple={false}
                                />
                            </div>
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
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={`form-group`}>
                                <label>{translate('production.request_management.description')}</label>
                                <textarea type="text" className="form-control" value={description} onChange={handleDescriptionChange} />
                            </div>
                        </div>
                    </fieldset>
                    <GoodComponentRequest onHandleGoodChange={onHandleGoodChange} />
                    {
                        state.isValidatedToSearchOptimalStock &&
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate("production.request_management.optimal_stock")}</legend>
                        <div className="col-md-12">
                                <div className="form-group">
                                    <button className='btn btn-success' type='button' onClick={handleSearchOptimalStock}>{translate('production.request_management.optimal_stock_search')}</button>
                                    { isSearchingStock && <span style={{marginLeft: "1%"}}><Loading/></span>}
                                </div>
                                {
                                    optimalStock ?
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="optimal-stock-name">{translate('production.request_management.optimal_stock_name')}</label>
                                            <input type="text" className='form-control' value={optimalStock.name} disabled/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="optimal-stock-address">{translate('production.request_management.optimal_stock_address')}</label>
                                            <input type="text" className='form-control' value={optimalStock.address} disabled/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="optimal-stock-distance">{translate('production.request_management.optimal_stock_distance')}</label>
                                            <input type="text" className='form-control' value={optimalStock.distance} disabled/>
                                        </div>
                                        {/* <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                            <label>
                                                {translate("production.request_management.approver_in_stock")}
                                                <span className="text-red"> * </span>
                                            </label>
                                            <SelectBox
                                                id={`select-approver-create-form`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={approver}
                                                items={dataApprover}
                                                onChange={handleApproverChange}
                                                multiple={false}
                                            />
                                            <ErrorLabel content={errorApprover} />
                                        </div> */}
                                    </> :
                                    <div className={`form-group ${!state.optimalStockMessage ? "" : "has-error"}`}>
                                        <ErrorLabel content={state.optimalStockMessage} />
                                    </div>
                                }
                        </div>
                        </fieldset>
                    }
                </form>
            </DialogModal>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => {
    const customers = state.crm.customers;
    const user = state.user;
    const stocks = state.stocks;
    const manufacturingWorks =  state.manufacturingWorks;
    const requestManagements = state.requestManagements

    return { customers, user, stocks, manufacturingWorks, requestManagements }
};

const mapDispatchToProps = {
    createRequest: RequestActions.createRequest,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getCustomers: CrmCustomerActions.getCustomers,
    getAllStockWithBinLocation: RequestActions.getAllStockWithBinLocation,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateTransportRequestForm));