import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, Gantt, DatePicker, TimePicker } from '../../../../../../common-components';
import QuantityLotGoodReceipt from './quantityLotGoodReceipt';
import { generateCode } from '../../../../../../helpers/generateCode';
import { LotActions } from '../../../inventory-management/redux/actions';
import { BillActions } from '../../redux/actions';
import { GoodActions } from "../../../../common-production/good-management/redux/actions";
import './goodReceipt.css'
import 'react-calendar-timeline/lib/Timeline.css'
import ValidationHelper from '../../../../../../helpers/validationHelper';


function StockWorkAssignmentModal(props) {

    const [state, setState] = useState({
        userId: localStorage.getItem("userId"),
        currentZoom: props.translate('system_admin.system_setting.backup.date'),
        detailInfo: [],
        variantOption: [],
    })


    const getApprover = () => {
        const { user, translate } = props;
        let ApproverArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_approver') }];

        user.list.map(item => {
            ApproverArr.push({
                value: item._id,
                text: item.name
            })
        })

        return ApproverArr;
    }

    const getCustomer = () => {
        const { crm, translate } = props;
        let CustomerArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_supplier') }];

        crm.customers.list.map(item => {
            CustomerArr.push({
                value: item._id,
                text: item.name
            })
        })

        return CustomerArr;
    }

    const handleApproverChange = (value) => {
        let approver = value;
        validateApprover(approver, true);
    }

    const validateApprover = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            let approvers = [];
            value.map(item => {
                approvers.push({
                    approver: item,
                    approvedTime: null
                });
            })
            setState({
                ...state,
                approver: value,
                approvers: approvers,
                errorApprover: msg,
            })
        }
        return msg === undefined;
    }

    const handleAccountablesChange = (value) => {
        let accountables = value;
        validateAccountables(accountables, true);
    }

    const validateAccountables = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            setState({
                ...state,
                accountables: value,
                errorAccountables: msg,
            })
        }
        return msg === undefined;
    }

    const handleResponsiblesChange = (value) => {
        let responsibles = value;
        validateResponsibles(responsibles, true);
    }

    const validateResponsibles = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            setState({
                ...state,
                responsibles: value,
                errorResponsibles: msg,
            })
        }
        return msg === undefined;
    }

    const handleQualityControlStaffsChange = (value) => {
        let qualityControlStaffs = value;
        validateQualityControlStaffs(qualityControlStaffs, true);
    }

    const validateQualityControlStaffs = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            let listQualityControlStaffs = [];
            value.map(item => {
                listQualityControlStaffs.push({
                    staff: item,
                    time: null
                });
            })
            setState({
                ...state,
                qualityControlStaffs: value,
                listQualityControlStaffs: listQualityControlStaffs,
                errorQualityControlStaffs: msg,
            })
        }
        return msg === undefined;
    }

    const isFormValidated = () => {
        const { status } = state;
        let result =
            // validateType(state.type, false) &&
            // validateStock(state.fromStock, false) &&
            validateApprover(state.approver, false) &&
            // validatePartner(state.supplier, false) &&
            validateAccountables(state.accountables, false) &&
            // // validateQualityControlStaffs(state.qualityControlStaffs, false) &&
            validateResponsibles(state.responsibles, false)
        // if (status === '2') {
        //     result = result &&
        //         checkAllLots();
        // }
        return result;
    }


    // useEffect(() => {
    //     if (props.billId !== state.billId || props.oldStatus !== state.oldStatus) {
    //         let approver = [];
    //         let qualityControlStaffs = [];
    //         let responsibles = [];
    //         let accountables = [];
    //         if (props.approvers && props.approvers.length > 0) {
    //             for (let i = 0; i < props.approvers.length; i++) {
    //                 approver = [...approver, props.approvers[i].approver._id];
    //             }

    //         }

    //         if (props.listQualityControlStaffs && props.listQualityControlStaffs.length > 0) {
    //             for (let i = 0; i < props.listQualityControlStaffs.length; i++) {
    //                 qualityControlStaffs = [...qualityControlStaffs, props.listQualityControlStaffs[i].staff._id];
    //             }

    //         }

    //         if (props.responsibles && props.responsibles.length > 0) {
    //             for (let i = 0; i < props.responsibles.length; i++) {
    //                 responsibles = [...responsibles, props.responsibles[i]._id];
    //             }

    //         }

    //         if (props.accountables && props.accountables.length > 0) {
    //             for (let i = 0; i < props.accountables.length; i++) {
    //                 accountables = [...accountables, props.accountables[i]._id];
    //             }

    //         }
    //         state.good.quantity = 0;
    //         state.good.good = '';
    //         state.good.description = '';
    //         state.good.lots = [];

    //         if (props.type === "1") {
    //             props.getGoodsByType({ type: "material" });
    //         } else if (props.type === "2") {
    //             props.getGoodsByType({ type: "product" });
    //         }

    //         setState({
    //             ...state,
    //             billId: props.billId,
    //             code: props.code,
    //             fromStock: props.fromStock,
    //             status: props.status,
    //             oldStatus: props.oldStatus,
    //             group: props.group,
    //             type: props.type,
    //             users: props.users,
    //             creator: props.creator,
    //             approvers: props.approvers,
    //             approver: approver,
    //             qualityControlStaffs: qualityControlStaffs,
    //             listQualityControlStaffs: props.listQualityControlStaffs,
    //             responsibles: responsibles,
    //             accountables: accountables,
    //             description: props.description,
    //             supplier: props.supplier,
    //             manufacturingMill: props.manufacturingMillId,
    //             name: props.name,
    //             phone: props.phone,
    //             email: props.email,
    //             address: props.address,
    //             listGood: props.listGood,
    //             oldGoods: props.listGood,
    //             editInfo: false,
    //             errorStock: undefined,
    //             errorType: undefined,
    //             errorApprover: undefined,
    //             errorCustomer: undefined,
    //             errorQualityControlStaffs: undefined,
    //             errorAccountables: undefined,
    //             errorResponsibles: undefined

    //         })
    //     }
    // }, [props.billId, props.oldStatus])

    const save = async () => {
        const { billId, approvers, listQualityControlStaffs, responsibles, accountables } = state;
        const { group } = props;

        // if (arrayId && arrayId.length > 0) {
        //     await props.deleteLot(arrayId);
        // }

        await props.editBill(billId, {
            approvers: approvers,
            qualityControlStaffs: listQualityControlStaffs,
            responsibles: responsibles,
            accountables: accountables,
        })
    }

    // const checkApproved = (approvers, listQualityControlStaffs) => {
    //     let quantityApproved = 1;
    //     approvers.forEach((element) => {
    //         if (element.approvedTime == null) {
    //             quantityApproved = 0;
    //         }
    //     });
    //     if (quantityApproved === 0) {
    //         return true;
    //     }
    //     return false;
    // }

    const handleZoomChange = (zoom) => {
        setState({
            ...state,
            currentZoom: zoom
        });
    }

    const handleAddvariantOption = () => {
        var { variantOption } = state;
        let array = ['']
        if (variantOption.length !== 0) {
            let result;
            for (let n in variantOption) {
                result = validateNameField(variantOption[n].nameField, n);
                // && validateVariantOptionValue(variantOption[n].value, n);
                if (!result) {
                    validateNameField(variantOption[n].nameField, n);
                    // validateVariantOptionValue(variantOption[n].value, n)
                    break;
                }
            }
            if (result) {
                setState({
                    ...state,
                    variantOption: [...variantOption, { nameField: "", variantOptionValue: array }],
                })
            }
        } else {
            setState({
                ...state,
                variantOption: [...variantOption, { nameField: "", variantOptionValue: array }],
            })
        }

    }

    const handleAddVariantOptionValue = async (index) => {
        let data = Object.entries(state.variantOption[index]).map(([key, value]) => ({ key, value }));
        var { variantOption } = state;
        if (data.length !== 0) {
            let result = true;
            if (result) {
                data[1].value.push('');
                variantOption[index] = { ...variantOption[index], variantOptionValue: data[1].value }
                await setState({
                    ...state,
                    variantOption: variantOption
                });
            }
        } else {
            data[1].value.push('');
            variantOption[index] = { ...variantOption[index], variantOptionValue: data[1].value }
            await setState({
                ...state,
                variantOption: variantOption
            });
        }
    }

    const delete_function = (index) => {
        var { variantOption } = state;
        variantOption.splice(index, 1);
        if (variantOption.length !== 0) {
            for (let n in variantOption) {
                validateNameField(variantOption[n].nameField, n);
                // validateValue(variantOption[n].value, n)
            }
        } else {
            setState({
                ...state,
                variantOption: variantOption,
                errorOnValue: undefined,
                errorOnNameField: undefined
            })
        }
    };

    const deleteVariantOptionValue = (i, index) => {
        var { variantOption } = state;
        let data = Object.entries(state.variantOption[index]).map(([key, value]) => ({ key, value }));
        data[1].value.splice(i, 1);
        variantOption[index] = { ...variantOption[index], variantOptionValue: data[1].value }
        setState({
            ...state,
            variantOption: variantOption,
            errorOnValue: undefined,
            errorOnNameField: undefined
        });

    }

    const handleChangeNameField = (e, index) => {
        var { value } = e.target;
        validateNameField(value, index);
    }
    const validateNameField = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { variantOption } = state;
            variantOption[className] = { ...variantOption[className], nameField: value }
            setState({
                ...state,
                errorOnNameField: message,
                errorOnNameFieldPosition: message ? className : null,
                variantOption: variantOption
            });
        }
        return message === undefined;
    }


    const handleChangeVariantOptionValue = (e, i, index) => {
        var { value } = e.target;
        validateVariantOptionValue(value, i, index);
    }
    const validateVariantOptionValue = async (value, i, index, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { variantOption } = state;
            let data = Object.entries(variantOption[index]).map(([key, value]) => ({ key, value }));
            data[1].value[i] = value;
            variantOption[index] = { ...variantOption[index], variantOptionValue: data[1].value }
            await setState({
                ...state,
                errorOnValue: message,
                errorOnValuePosition: message ? index : null,
                variantOption: variantOption
            });
        }
        return message === undefined;
    }


    const { translate } = props;
    const { billId, approver, accountables, responsibles,
        qualityControlStaffs, errorApprover, errorQualityControlStaffs, errorAccountables, errorResponsibles, currentZoom, detailInfo, errorOnNameFieldPosition, errorOnNameField, errorOnValue, errorOnValuePosition, variantOption } = state;
    const dataApprover = getApprover();
    let today = new Date();
    return (
        <React.Fragment>

            <DialogModal
                modalID={`stock-work-assignment-modal`}
                formID={`stock-work-assignment-modal`}
                title={'Phân công công việc'}
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={!isFormValidated()}
                func={save}
                size={75}
            >
                <form id={`stock-work-assignment-modal`}>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.list_saffs')}</legend>
                            <div className="form-group">
                                    <p type="button" className="btn btn-primary">Phân công tự động</p>
                                </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.approved')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-approver-bill-receipt-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={approver}
                                        items={dataApprover}
                                        onChange={handleApproverChange}
                                        multiple={true}
                                    />
                                    <ErrorLabel content={errorApprover} />
                                </div>

                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorAccountables ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.accountables')}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-responsibles-bill-receipt-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={accountables}
                                        items={dataApprover}
                                        onChange={handleAccountablesChange}
                                        multiple={true}
                                    />
                                    <ErrorLabel content={errorAccountables} />
                                </div>
                            </div>
                            <div className="col-xs-12">
                                <div className={`form-group ${!errorQualityControlStaffs ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.qualityControlStaffs')}<span className="text-red"> * </span></label>
                                    {/* <SelectBox
                                        id={`select-qualityControlStaffs-bill-receipt-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={qualityControlStaffs}
                                        items={dataApprover}
                                        onChange={handleQualityControlStaffsChange}
                                        multiple={true}
                                    /> */}
                                    <ErrorLabel content={errorQualityControlStaffs} />
                                </div>
                                <div className="form-group">
                                    <p type="button" className="btn btn-success" onClick={handleAddvariantOption}>Thêm mới</p>
                                </div>
                                <table className="table">
                                    {/* <thead>
                                        <tr>
                                            <th style={{ paddingLeft: '0px' }}>{"Tên công việc"}</th>
                                            <th style={{ paddingLeft: '0px' }}>{"Người tham gia/Thời gian thực hiên"}</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                        </tr>
                                    </thead> */}
                                    <tbody>
                                        {(!variantOption || variantOption.length === 0) ? <tr>
                                            <td colSpan={10}>
                                                <center> {translate('table.no_data')}</center>
                                            </td>
                                        </tr> :
                                            variantOption.map((x, index) => {
                                                return <tr key={index}>
                                                    <td>
                                                        <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                            <input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => handleChangeNameField(e, index)} />
                                                            {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                                        </div>
                                                        <a onClick={() => delete_function(index)}><p className='text-red'>- Xóa tùy chọn</p></a>
                                                    </td>

                                                    <td>
                                                        {(x.variantOptionValue && x.variantOptionValue.length) ? x.variantOptionValue.map((y, i) => {
                                                            return <div key={i} className={`form-group ${(parseInt(errorOnValuePosition) === i && errorOnValue) ? "has-error" : ""}`} style={{ display: "flex" }}>
                                                                <input className="form-control" type="text" value={y} name="value" style={{ width: "100%" }} onChange={(e) => handleChangeVariantOptionValue(e, i, index)} />
                                                                <DatePicker
                                                                    id={`datepicker1`}
                                                                    dateFormat="day-month-year"
                                                                // value={newTask.startDate}
                                                                // onChange={handleChangeTaskStartDate}
                                                                />
                                                                < TimePicker
                                                                    id={`time-picker-1`}
                                                                    refs={`time-picker-1`}
                                                                // value={newTask.startTime}
                                                                // onChange={handleStartTimeChange}
                                                                />

                                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => deleteVariantOptionValue(i, index)}><i className="material-icons"></i></a>
                                                                {(parseInt(errorOnValuePosition) === i && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                                            </div>

                                                        }) : <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}> </div>}
                                                        <a style={{ textAlign: 'left' }} onClick={() => handleAddVariantOptionValue(index)}><p className='text-green'>+ Thêm giá trị mới</p></a>
                                                    </td>
                                                </tr>
                                            })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-xs-12">
                                <div className={`form-group ${!errorResponsibles ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.users')}<span className="text-red"> * </span></label>
                                    {/* <SelectBox
                                        id={`select-accountables-bill-receipt-edit-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={responsibles}
                                        items={dataApprover}
                                        onChange={handleResponsiblesChange}
                                        multiple={true}
                                    /> */}
                                    <ErrorLabel content={errorResponsibles} />
                                </div>
                                {/* <div className="form-group">
                                    <p type="button" className="btn btn-success" onClick={handleAddDetailInfo}>Thêm mới</p>
                                </div>

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ paddingLeft: '0px' }}>{"Tên công việc"}</th>
                                            <th style={{ paddingLeft: '0px' }}>{"Người tham gia"}</th>
                                            <th style={{ paddingLeft: '0px' }}>{"Thời gian thực hiên"}</th>
                                            <th style={{ paddingLeft: '0px' }}></th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(!detailInfo || detailInfo.length === 0) ? <tr>
                                            <td colSpan={3}>
                                                <center> {translate('table.no_data')}</center>
                                            </td>
                                        </tr> :
                                            detailInfo.map((x, index) => {
                                                return <tr key={index}>
                                                    <td style={{ paddingLeft: '0px' }}>
                                                        <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                            <input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => handleChangeNameField(e, index)} />
                                                            {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                                        </div>
                                                    </td>

                                                    <td style={{ paddingLeft: '0px' }}>
                                                        <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                                            <input className="form-control" type="text" value={x.value} name="value" style={{ width: "100%" }} onChange={(e) => handleChangeValue(e, index)} />
                                                            {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                                        </div>
                                                    </td>
                                                    <td style={{ paddingLeft: '0px' }}>
                                                        <DatePicker
                                                            id={`datepicker1`}
                                                            dateFormat="day-month-year"
                                                        value={newTask.startDate}
                                                        onChange={handleChangeTaskStartDate}
                                                        />
                                                    </td>
                                                    <td style={{ paddingLeft: '0px' }}>
                                                        < TimePicker
                                                            id={`time-picker-1`}
                                                            refs={`time-picker-1`}
                                                        value={newTask.startTime}
                                                        onChange={handleStartTimeChange}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => delete_function(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            })}
                                    </tbody>
                                </table> */}
                            </div>
                        </fieldset>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <Gantt
                            ganttId="gantt-chart"
                            ganttData={''}
                            zoom={currentZoom}
                            status={''}
                            count={''}
                            line={''}
                            unit={''}
                            onZoomChange={handleZoomChange}
                        // attachEvent={attachEvent}
                        />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createOrUpdateLots: LotActions.createOrUpdateLots,
    editBill: BillActions.editBill,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockWorkAssignmentModal));
