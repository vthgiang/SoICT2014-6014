import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../production/common-production/request-management/redux/actions';
import { formatToTimeZoneDate, formatDate } from '../../../../../helpers/formatDate';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { generateCode } from '../../../../../helpers/generateCode';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { CrmCustomerActions } from '../../../../crm/customer/redux/actions';
import { getStorage } from '../../../../../config';

function DetailTransportRequestForm(props) {

    const { translate, bigModal, requestManagements, detailRequest, id } = props;

    const [state, setState] = useState({
        code: "",
        desiredTime: formatDate((new Date()).toISOString()),
        description: "",
        listGoods: [],
        approvers: "",
        stock: "",
        customer: "",
        optimalStock: null,
        isValidatedToSearchOptimalStock: false,
        optimalStockMessage: "",
    });
    const { code, desiredTime, errorIntendReceiveTime, description, customer, listGoods } = state;

    useEffect(() => {
        props.getCustomers({
            page: 0,
            roleId: getStorage('currentRole')
        });
    }, []);

    useEffect(() => {
        if (detailRequest && detailRequest._id) {
            props.getDetailRequestById(detailRequest?._id);
        }
    }, [detailRequest]);

    useEffect(() => {
        if (requestManagements.currentRequest) {
            let currentRequestInfo = requestManagements.currentRequest;
            let goods = [];
            if (currentRequestInfo.goods) {
                goods = currentRequestInfo.goods.map((good) => {
                    return {
                        goodId: good.good._id,
                        goodObject: good.good,
                        quantity: good.quantity
                    }
                })
            }
            setState({
                ...state,
                desiredTime: currentRequestInfo.desiredTime ? currentRequestInfo.desiredTime : "",
                code: currentRequestInfo.code ? currentRequestInfo.code : "",
                customer: currentRequestInfo.supplier?._id,
                description: currentRequestInfo.description ? currentRequestInfo.description : "",
                isValidatedToSearchOptimalStock: true,
                listGoods: goods
            });
        }
    }, [requestManagements?.currentRequest])

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

    // Phần lưu dữ liệu

    const handleClickCreate = () => {
        const value = generateCode("GIR");
        setState({
            ...state,
            code: value
        });
    }

    const handleCustomerChange = (value) => {
        const { listGoods } = state;
        setState({
            ...state,
            customer: value[0],
            isValidatedToSearchOptimalStock: listGoods.length > 0 ? true : false,
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

    const dataCustomer = getListCustomer();

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-transportation-request-${props.id}`}
                formID="form-detail-transportation-request"
                title="Thông tin đơn hàng"
                msg_success={translate('production.request_management.create_successfully')}
                msg_failure={translate('production.request_management.create_failed')}
                size={bigModal ? 75 : 50}
                maxWidth={500}
                hasSaveButton={false}
            >
                <form id="form-detail-transportation-request">
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
                                    id={`select-customer-detail-form`}
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
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>{translate('production.request_management.index')}</th>
                                <th>{translate('production.request_management.good_code')}</th>
                                <th>{translate('production.request_management.good_name')}</th>
                                <th>{translate('production.request_management.good_base_unit')}</th>
                                <th>{translate('production.request_management.quantity')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (!listGoods || listGoods.length === 0) ?
                                    <tr>
                                        <td colSpan={6}>
                                            <center>{translate('confirm.no_data')}</center>
                                        </td>
                                    </tr>
                                    :
                                    listGoods.map((good, index) => {
                                        return <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{good.goodObject.code}</td>
                                            <td>{good.goodObject.name}</td>
                                            <td>{good.goodObject.baseUnit}</td>
                                            <td>{good.quantity}</td>
                                        </tr>
                                    })
                            }
                        </tbody>
                    </table>
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
    getDetailRequestById: RequestActions.getDetailRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailTransportRequestForm));