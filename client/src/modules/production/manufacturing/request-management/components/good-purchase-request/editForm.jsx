import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import { formatDate, formatToTimeZoneDate } from '../../../../../../helpers/formatDate';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { generateCode } from '../../../../../../helpers/generateCode';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import GoodComponentRequest from '../../../../common-production/request-management/components/goodComponent';

function EditGoodPurchaseRequestForm(props) {

    const [state, setState] = useState({
        code: generateCode("PDN"),
        desiredTime: "",
        description: "",
        listGoods: [],
        organizationalUnitValue: '',
        worksValue: '',
        dataApproverInManufacturing: [{
            value: "",
            text: "Chọn người phê duyệt "
        }],
        dataApproverInReceiveRequestUnit: [{
            value: "",
            text: "Chọn người phê duyệt"
        }],
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
        if (state.organizationalUnitValue) {
            let listOrganizationUnit = getOrganizationalUnit();
            let result = findIndex(listOrganizationUnit, state.organizationalUnitValue);
            if (result !== -1) {
                props.getAllUserOfDepartment(listOrganizationUnit[result].value);
            }
        }
    }, [state.worksValue, state.organizationalUnitValue])

    useEffect(() => {
        const { translate, user } = props;
        let listUsersArray = [{
            value: "",
            text: "Chọn người phê duyệt"
        }];

        let { userdepartments } = user;
        if (userdepartments) {
            userdepartments = userdepartments[0];
            if (userdepartments.managers && Object.keys(userdepartments.managers).length > 0) { // Nếu nhà máy có nhân viên
                let managers = userdepartments.managers[Object.keys(userdepartments.managers)[0]].members;
                if (managers.length) {
                    managers.map((member) => {
                        console.log(member);
                        listUsersArray.push({
                            value: member._id,
                            text: member.name + " - " + userdepartments.managers[Object.keys(userdepartments.managers)[0]].name
                        });
                    });
                }

            }
        }
        if (state.organizationalUnitSelected == 'manufacturingWorks') {
            setState({
                ...state,
                dataApproverInManufacturing: listUsersArray,
            })
        } else {
            setState({
                ...state,
                dataApproverInReceiveRequestUnit: listUsersArray,
            })
        }
    }, [state.organizationalUnitSelected, props.user])

    const handleApproverChange = (value, typeApprove) => {
        validateApprover(value[0], typeApprove, true);
    };

    const validateApprover = (value, typeApprove, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("production.request_management.validate_approver_in_factory");
        }
        let error = 'error' + typeApprove;
        if (willUpdateState) {
            setState({
                ...state,
                [typeApprove]: value,
                [error]: msg,
            });
        }
        return msg === undefined;
    };

    //Phần đơn vị phê duyệt

    const handleOrganizationalUnitValueChange = (value) => {
        let organizationalUnitValue = value[0];
        validateOrganizationalUnitValue(organizationalUnitValue, true);
    }

    const validateOrganizationalUnitValue = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate, department } = props;
        if (value === "") {
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
                organizationalUnitSelected: 'receiveRequestUnit'
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
                teamLeaderValue: "",
                organizationalUnitSelected: 'manufacturingWorks',
            });
        }
        return msg === undefined;
    }


    const isFormValidated = () => {
        let { approver, stock, worksValue, organizationalUnitValue, listGoods } = state;
        let result =
            // validateApprover(approver, false) &&
            validateStock(stock, false) &&
            validateOrganizationalUnitValue(organizationalUnitValue, false) &&
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
            let approvers = [];
            let approversInManufacturing = [];
            let approversInReceiveRequestUnit = [];
            approversInManufacturing.push({
                information: [{
                    approver: state.approverInManufacturing,
                    approvedTime: null,
                }],
                approveType: 1
            });
            approversInReceiveRequestUnit.push({
                information: [{
                    approver: state.approverInReceiveRequestUnit,
                    approvedTime: null,
                }],
                approveType: 2
            });
            approvers = approversInManufacturing.concat(approversInReceiveRequestUnit);
            const data = {
                code: state.code,
                desiredTime: state.desiredTime,
                description: state.description,
                goods: goods,
                approvers: approvers,
                stock: state.stock,
                requestType: 1,
                type: 1,
                status: 1,
                manufacturingWork: state.worksValue,
                orderUnit: state.organizationalUnitValue,
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
            approverInManufacturing: props.approverInManufacturing[0].information[0].approver._id,
            approverInReceiverRequestUnit: props.approverInReceiverRequestUnit[0].information[0].approver._id,
            status: props.status,
            organizationalUnitValue: props.organizationalUnitValue,
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
    const { requestId, code, desiredTime, description, errorDescription, listGoods,
        approver, errorApprover, errorStock, stock, worksValueError, worksValue, organizationalUnitValue,
        organizationalUnitError, approverInManufacturing, dataApproverInManufacturing, errorapproverInManufacturing, 
        errorapproverInReceiveRequestUnit, approverInReceiveRequestUnit, dataApproverInReceiveRequestUnit } = state;
    const dataStock = getStock();
    const dataManufacturingWorks = getListWorks();
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
                size={50}
            >
                <form id={`form-edit-request-${requestId}`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate("production.request_management.base_infomation")}</legend>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('production.request_management.code')}<span className="text-red">*</span></label>
                                <input type="text" disabled={true} value={code} className="form-control"></input>
                            </div>
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
                            <div className={`form-group ${!organizationalUnitError ? "" : "has-error"}`}>
                                <label>{translate('production.request_management.unit_receiving_request')}<span className="text-red"> * </span></label>
                                <SelectBox
                                    id={`select-department`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnitValue}
                                    items={organizationalUnit}
                                    onChange={handleOrganizationalUnitValueChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={organizationalUnitError} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <label>{translate('production.request_management.desiredTime')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`request-edit-desiredTime-${requestId}`}
                                    value={formatDate(desiredTime)}
                                    onChange={handleDesiredTimeChange}
                                    disabled={false}
                                />
                            </div>
                            <div className={`form-group ${!errorapproverInManufacturing ? "" : "has-error"}`}>
                                <label>
                                    {translate("production.request_management.approver_in_factory")}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-approver-in-factory`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approverInManufacturing}
                                    items={dataApproverInManufacturing}
                                    onChange={(e) => handleApproverChange(e, 'approverInManufacturing')}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorapproverInManufacturing} />
                            </div>
                            <div className={`form-group ${!errorapproverInReceiveRequestUnit ? "" : "has-error"}`}>
                                <label>
                                    {"Người phê duyệt yêu cầu mua hàng"}
                                    <span className="text-red"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-approver-in-receive-request-unit`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approverInReceiveRequestUnit}
                                    items={dataApproverInReceiveRequestUnit}
                                    onChange={(e) => handleApproverChange(e, 'approverInReceiveRequestUnit')}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorapproverInReceiveRequestUnit} />
                            </div>
                            <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                <label>
                                    {translate("production.request_management.stock")}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditGoodPurchaseRequestForm));
