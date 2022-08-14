import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import GoodComponentRequest from '../../../../common-production/request-management/components/goodComponent';
import { formatToTimeZoneDate, formatDate } from '../../../../../../helpers/formatDate';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { generateCode } from '../../../../../../helpers/generateCode';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
function CreateGoodPurchaseRequestForm(props) {

    const [state, setState] = useState({
        code: generateCode("PCR"),
        desiredTime: formatDate((new Date()).toISOString()),
        description: "",
        listGoods: [],
        approvers: "",
        stock: "",
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

    //Phần đơn vị phê duyệt

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
        if (!value) {
            msg = translate('production.request_management.validate_manufacturing_works');
        }
        if (willUpdateState) {
            setState({
                ...state,
                worksValue: value,
                worksValueError: msg,
                organizationalUnitSelected: 'manufacturingWorks',
            });
        }
        return msg === undefined;
    }

    // Phần lưu dữ liệu

    const handleClickCreate = () => {
        const value = generateCode("PCR");
        setState({
            ...state,
            code: value
        });
    }

    const isFormValidated = () => {
        let { approverInManufacturing, stock, worksValue, organizationalUnitValue, listGoods } = state;
        let result = 
        // validateApprover(approverInManufacturing, false) &&
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
                desiredTime: formatToTimeZoneDate(state.desiredTime),
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

    const { translate, NotHaveCreateButton, bigModal } = props;
    const { code, desiredTime, description, approverInManufacturing, errorapproverInManufacturing, errorStock,
        stock, worksValueError, worksValue, organizationalUnitValue, organizationalUnitError, dataApproverInReceiveRequestUnit,
        dataApproverInManufacturing, approverInReceiveRequestUnit, errorapproverInReceiveRequestUnit } = state;
    const dataStock = getStock();
    const dataManufacturingWorks = getListWorks();
    const organizationalUnit = getOrganizationalUnit();

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
                size={bigModal ? 75 : 50}
            >
                <form id="form-create-purchasing-request">
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
                                    id={`select-works`}
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
                                    id={`purchasing-request-create-desiredTime`}
                                    value={desiredTime}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateGoodPurchaseRequestForm));
