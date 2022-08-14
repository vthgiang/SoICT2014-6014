import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
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
        fromStock: "",
        toStock: "",
        listApproversFromStock: [{
            value: "",
            text: "Chọn người phê duyệt trong kho"
        }],
        listApproversToStock: [{
            value: "",
            text: "Chọn người phê duyệt trong kho"
        }],
    });

    const handleDesiredTimeChange = (value) => {
        if (value.length === 0) {
            value = ""
        }
        setState({
            ...state,
            desiredTime: value
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
        if (state.fromStock) {
            let listStocks = getStock();
            let result = findIndex(listStocks, state.fromStock);
            if (result !== -1) {
                props.getAllUserOfDepartment(listStocks[result].organizationalUnit);
            }
        }
        if (state.toStock) {
            let listStocks = getStock();
            let result = findIndex(listStocks, state.toStock);
            if (result !== -1) {
                props.getAllUserOfDepartment(listStocks[result].organizationalUnit);
            }
        }
    }, [state.fromStock, state.toStock])

    useEffect(() => {
        const { translate, user } = props;
        let listUsersArray = [{
            value: "",
            text: "Chọn người phê duyệt trong kho"
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
        if (state.isFromStock) {
            setState({
                ...state,
                listApproversFromStock: listUsersArray,
            })
        } else {
            setState({
                ...state,
                listApproversToStock: listUsersArray,
            })
        }
    }, [state.isFromStock, props.user])

    const handleApproverChange = (value, typeApprove) => {
        let approver = value[0];
        validateApprover(approver, typeApprove, true);
    };

    const validateApprover = (value, typeApprove, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        let error = 'error' + typeApprove;
        if (!value) {
            msg = translate("production.request_management.validate_approver_in_stock");
        }

        if (willUpdateState) {
            setState({
                ...state,
                [typeApprove]: value,
                [error]: msg,
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

    const handleOrganizationalUnitValueChange = (value) => {
        let organizationalUnitValue = value[0];
        validateOrganizationalUnitValue(organizationalUnitValue, true);
    }

    const validateOrganizationalUnitValue = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate, department } = props;
        if (!value) {
            msg = translate('production.request_management.validate_unit')
        }

        if (willUpdateState) {
            const { list } = department;
            let currentDepartment;
            const listDepartment = list.filter(x => x._id === value);
            if (listDepartment.length > 0) {
                currentDepartment = listDepartment[0];
            } else {
                currentDepartment = {
                    name: "",
                    description: ""
                }
            }
            setState({
                ...state,
                organizationalUnitError: msg,
                organizationalUnitValue: value,
                currentDepartment: currentDepartment,
            });
        }
        return msg === undefined;
    }

    const getOrganizationalUnit = () => {
        const { translate, department } = props;
        let organizationalUnitArr = [{ value: '', text: translate('production.request_management.choose_unit') }];

        department.list.map(item => {
            organizationalUnitArr.push({
                value: item._id,
                text: item.name
            })
        })

        return organizationalUnitArr;
    }

    const isFormValidated = () => {
        let { approver, stock, listGoods } = state;
        let result = true;
        // validateApprover(approver, false) &&
        //     validateStock(stock, false) &&
        //     listGoods.length > 0
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
            let approvers = [];
            let approverInFromStock = [];
            let approverInToStock = [];
            approverInFromStock.push({
                information: [{
                    approver: state.approveInFromStock,
                    approvedTime: null,
                }],
                approveType: 4
            });
            approverInToStock.push({
                information: [{
                    approver: state.approveInToStock,
                    approvedTime: null,
                }],
                approveType: 5
            });
            approvers = approverInFromStock.concat(approverInToStock);
            const data = {
                code: state.code,
                desiredTime: state.desiredTime,
                description: state.description,
                goods: goods,
                approvers: approvers,
                stock: state.fromStock,
                toStock: state.toStock,
                status: 1,
                type: props.stockRequestType,
                requestType: 3,
                requestingDepartment: state.organizationalUnitValue,
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
        setState({
            ...state,
            requestId: props.requestId,
            code: props.code,
            desiredTime: props.desiredTime,
            description: props.description,
            listGoods: listGoods,
            sourceType: props.worksValue ? "1" : "2",
            fromStock: props.fromStock,
            toStock: props.toStock,
            approverInFromStock: props.approverInFromStock[0].information[0].approver._id,
            approverInToStock: props.approverInToStock[0].information[0].approver._id,
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
    const { code, desiredTime, errorIntendReceiveTime, description,
        organizationalUnitValue, organizationalUnitError,
        errorfromStock, errortoStock, errorapproverInFromStock, errorapproverToStock,
        fromStock, toStock, approverInFromStock, approverInToStock, listApproversFromStock, listApproversToStock,
        requestId, listGoods } = state;
    const dataStock = getStock();
    const organizationalUnit = getOrganizationalUnit();
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
                size={75}
            >
                <form id={`form-edit-request-${requestId}`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate("production.request_management.base_infomation")}</legend>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('production.request_management.code')}<span className="text-red">*</span></label>
                                <input type="text" disabled={true} value={code} className="form-control"></input>
                            </div>
                            <div className={`form-group ${!errorfromStock ? "" : "has-error"}`}>
                                <label>
                                    {"Kho xuất hàng hóa"}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`edit-select-from-stock`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={fromStock}
                                    items={dataStock}
                                    onChange={(e) => handleStockChange(e, 'fromStock')}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorfromStock} />
                            </div>
                            <div className={`form-group ${!errortoStock ? "" : "has-error"}`}>
                                <label>
                                    {"Kho nhận hàng hóa"}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`edit-select-to-stock`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={toStock}
                                    items={dataStock}
                                    onChange={(e) => handleStockChange(e, 'toStock')}
                                    multiple={false}
                                />
                                <ErrorLabel content={errortoStock} />
                            </div>
                            <div className={`form-group ${!errorIntendReceiveTime ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.desiredTime')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit-purchasing-request-create-desiredTime`}
                                    value={desiredTime}
                                    onChange={handleDesiredTimeChange}
                                    disabled={false}
                                />
                                <ErrorLabel content={errorIntendReceiveTime} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!organizationalUnitError ? "" : "has-error"}`}>
                                <label>{"Bộ phận gửi yêu cầu"}<span className="text-red"> * </span></label>
                                <SelectBox
                                    id={`edit-select-department`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnitValue}
                                    items={organizationalUnit}
                                    onChange={handleOrganizationalUnitValueChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={organizationalUnitError} />
                            </div>
                            <div className={`form-group ${!errorapproverInFromStock ? "" : "has-error"}`}>
                                <label>
                                    {"Người phê duyệt trong kho xuất"}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`edit-select-from-stock-approver`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approverInFromStock}
                                    items={listApproversFromStock}
                                    onChange={(e) => handleApproverChange(e, 'approveInFromStock')}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorapproverInFromStock} />
                            </div>
                            <div className={`form-group ${!errorapproverToStock ? "" : "has-error"}`}>
                                <label>
                                    {"Người phê duyệt trong kho nhập"}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`edit-select-to-stock-approver`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approverInToStock}
                                    items={listApproversToStock}
                                    onChange={(e) => handleApproverChange(e, 'approveInToStock')}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorapproverToStock} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={`form-group`}>
                                <label>{translate('production.request_management.description')}</label>
                                <textarea type="text" className="form-control" value={description ? description : ''} onChange={handleDescriptionChange} />
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
