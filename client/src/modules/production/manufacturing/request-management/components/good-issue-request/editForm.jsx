import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import { formatDate, formatToTimeZoneDate } from '../../../../../../helpers/formatDate';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { generateCode } from '../../../../../../helpers/generateCode';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import GoodComponentRequest from '../../../../common-production/request-management/components/goodComponent';

function EditGoodIssueRequestForm(props) {

    const [state, setState] = useState({
        code: generateCode("GIR"),
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
        if (state.worksValue) {
            let listWorks = getListWorks();
            let result = findIndex(listWorks, state.worksValue);
            if (result !== -1) {
                props.getAllUserOfDepartment(listWorks[result].organizationalUnit);
            }
        }
    }, [state.worksValue])

    const getApprover = () => {
        const { translate, user } = props;
        let listUsersArray = [{
            value: "",
            text: translate('production.request_management.approver_in_factory')
        }];

        let { userdepartments } = user;
        if (userdepartments) {
            userdepartments = userdepartments[0];
            if (userdepartments.managers && Object.keys(userdepartments.managers).length > 0) {
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
            msg = translate("production.request_management.validate_approver_in_factory");
        }
        if (willUpdateState) {
            let approvers = [];
            approvers.push({
                approver: value,
                approvedTime: null,
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


    const isFormValidated = () => {
        let { approver, stock, worksValue, listGoods } = state;
        let result = validateApprover(approver, false) &&
            validateStock(stock, false) &&
            validateManufacturingWorks(worksValue, false) &&
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
                approverInFactory: state.approvers,
                stock: state.stock,
                requestType: 1,
                type: 3,
                status: 1,
                manufacturingWork: state.worksValue,
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
            worksValue: props.worksValue,
            stock: props.stock,
            approver: props.approver,
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
        approver, errorApprover, errorStock, stock, worksValueError, worksValue } = state;
    const dataApprover = getApprover();
    const dataStock = getStock();
    const dataManufacturingWorks = getListWorks();
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
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!worksValueError ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.manufacturing_works')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`select-works-${requestId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={worksValue}
                                    items={dataManufacturingWorks}
                                    onChange={handleManufacturingWorksChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={worksValueError} />
                            </div>
                            <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                <label>
                                    {translate("production.request_management.approver_in_factory")}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditGoodIssueRequestForm));
