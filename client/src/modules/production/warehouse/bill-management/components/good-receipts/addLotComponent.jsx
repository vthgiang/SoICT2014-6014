import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { SelectBox, ErrorLabel } from '../../../../../../common-components';
import QuantityLotGoodReceipt from './quantityLotGoodReceipt';
import './goodReceipt.css'

function AddLotComponent(props) {

    const EMPTY_GOOD = {
        good: '',
        quantity: 0,
        realQuantity: 0,
        returnQuantity: 0,
        description: '',
        lots: [],
        isPassQualityControl: true,
    }

    const [state, setState] = useState({
        userId: localStorage.getItem("userId"),
        list: [],
        lots: [],
        listGood: [],
        good: Object.assign({}, EMPTY_GOOD),
        statusLot: 1,
    })

    const handleStatusChange = (value) => {
        const status = value[0];
        validateStatus(status, true);
    }

    const validateStatus = (status, willUpdateState = false) => {
        let msg = undefined;
        if (status == 0) {
            msg = "Bạn phải chọn trạng thái";
        }
        if (willUpdateState) {
            setState({
                ...state,
                statusLot: status,
                errorOnStatus: msg,
            });
            props.onDataChange(status)
        }
        return msg === undefined;
    }

    const addLotPassQualityControl = (good, index) => {
        setState({
            ...state,
            isPassQualityControl: true,
            indexInfo: index,
            quantity: good.realQuantity,
            initialData: good.lots,
            good: good,
        })
        window.$('#modal-edit-quantity-receipt').modal('show');
    }

    const addLotUnPassQualityControl = (good, index) => {
        setState({
            ...state,
            indexInfo: index,
            isPassQualityControl: false,
            quantity: good.quantity - good.realQuantity,
            initialData: good.unpassed_quality_control_lots,
            good: good,
        })
        window.$('#modal-edit-quantity-receipt').modal('show');
    }

    const handleLotsChange = (lots, data, arrayId) => {
        const { isPassQualityControl } = state;
        const dataGoods = [...listGood];
        if (isPassQualityControl)
            dataGoods[state.indexInfo].lots = lots;
        else
            dataGoods[state.indexInfo].unpassed_quality_control_lots = lots;
        setState({
            ...state,
            listGood: dataGoods
        })
    }

    useEffect(() => {
        if (props.billId !== state.billId) {
            state.good.quantity = 0;
            state.good.good = '';
            state.good.description = '';
            state.good.lots = [];
            setState({
                ...state,
                billId: props.billId,
                status: props.billInfor.status,
                listGood: props.billInfor.goods,
                code: props.billInfor.code,
                statusLot: props.statusLot,
            })
        }
    }, [props.billId])

    const checkQuantity = (arr, quantity) => {
        let check = 0;
        let totalQuantity = 0;
        if (arr.length === 0) {
            check = 1;
        } else {
            arr.forEach(item => {
                totalQuantity += parseInt(item.quantity);
            })
            if (totalQuantity !== quantity) {
                check = 1;
            }
        }
        return check;
    }

    const isValidateAddLotComponent = () => {
        let check = 0;
        let { listGood } = state;
        if (listGood && listGood.length > 0) {
            listGood.forEach(item => {
                if (item.lots.length === 0) {
                    check = checkQuantity(item.unpassed_quality_control_lots, item.quantity - item.realQuantity);
                } else if (item.unpassed_quality_control_lots.length === 0) {
                    check = checkQuantity(item.lots, item.quantity);
                } else {
                    let totalQuantity = 0;
                    item.lots.forEach(item2 => {
                        totalQuantity += parseInt(item2.quantity);
                    })
                    item.unpassed_quality_control_lots.forEach(item2 => {
                        totalQuantity += parseInt(item2.quantity);
                    })
                    if (totalQuantity !== item.quantity) {
                        check = 1;
                    }
                }
            })
        }
        return check === 0;
    }

    const checkLots = (lots, quantity) => {
        if (lots.length === 0) {
            return false;
        } else {
            let totalQuantity = 0;
            for (let i = 0; i < lots.length; i++) {
                totalQuantity += Number(lots[i].quantity);
            }
            if (Number(quantity) !== Number(totalQuantity)) {
                return false;
            }
        }
        return true;
    }

    const { translate, group } = props;
    const { lots, lotName, listGood, good, billId, statusLot, fromStock, type, quantity, code, initialData, errorOnStatus, isPassQualityControl } = state;
    return (
        <React.Fragment>
            <QuantityLotGoodReceipt group={group} good={good} stock={fromStock} type={type} quantity={quantity} bill={billId} lotName={lotName} initialData={initialData} isPassQualityControl={isPassQualityControl}onDataChange={handleLotsChange} />
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <div className="form-group">
                    <label>{translate('manage_warehouse.bill_management.code')}</label>
                    <input type="text" value={code ? code : ''} className="form-control" disabled={true}></input>
                </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <div className={`form-group ${!errorOnStatus ? "" : "has-error"}`}>
                    <label>{translate('manage_warehouse.bill_management.status')}<span className="text-red">*</span></label>
                    <SelectBox
                        id={`select-quality-control-status-bill`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={statusLot}
                        items={[
                            { value: 0, text: "Chọn trạng thái" },
                            { value: 1, text: "Chưa đánh lô hàng hóa xong" },
                            { value: 2, text: "Đã đánh lô hàng hóa xong" }]}
                        onChange={handleStatusChange}
                        multiple={false}
                        disabled={!isValidateAddLotComponent()}
                    />
                    <ErrorLabel content={errorOnStatus} />
                </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>
                    <div className={`form-group`}>
                        {/* Bảng thông tin chi tiết */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                    <th title={translate('manage_warehouse.bill_management.good_code')}>{translate('manage_warehouse.bill_management.good_code')}</th>
                                    <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                    <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                    <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.number_passed')}>{translate('manage_warehouse.bill_management.number_passed')}</th>
                                    <th title={"Lô hàng đạt kiểm định"}>{"Lô hàng đạt kiểm định"}</th>
                                    <th title={"Số lượng không đạt kiểm định"}>{"Số lượng không đạt kiểm định"}</th>
                                    <th title={"Lô hàng không đạt kiểm định"}>{"Lô hàng không đạt kiểm định"}</th>
                                    <th title={translate('manage_warehouse.bill_management.action')}>{translate('manage_warehouse.bill_management.action')}</th>
                                </tr>
                            </thead>
                            <tbody id={`good-bill-edit`}>
                                {
                                    (typeof listGood === 'undefined' || listGood.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                        listGood.map((x, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.good.code}</td>
                                                <td>{x.good.name}</td>
                                                <td>{x.good.baseUnit}</td>
                                                <td>{x.quantity}</td>
                                                {(checkLots(x.lots, x.realQuantity)) ? <td>{x.realQuantity}</td> :
                                                    (x.realQuantity == 0 ?
                                                        <td>{"Không có hàng hóa đạt kiểm định"}</td> :
                                                        <td className="tooltip-abc">
                                                            <span style={{ color: "red" }}>{x.realQuantity}</span>
                                                            <span className="tooltiptext"><p style={{ color: "white" }}>{translate('manage_warehouse.bill_management.text')}</p></span>
                                                        </td>)}
                                                {(checkLots(x.lots, x.realQuantity)) ?
                                                    <td>{x.lots.map((lot, index) =>
                                                        <div key={index}>
                                                            {lot.code && <p>{lot.code}/{lot.quantity} {x.good.baseUnit}</p>}
                                                        </div>)}
                                                    </td> :
                                                    <td>{x.realQuantity == 0 ? "Không có hàng hóa đạt" : 'Chưa đánh lô'}</td>
                                                }
                                                {(checkLots(x.unpassed_quality_control_lots, x.quantity - x.realQuantity)) ?
                                                    <td>{x.quantity - x.realQuantity}</td> :
                                                    (x.quantity - x.realQuantity == 0 ?
                                                        <td>{"Không có hàng hóa không đạt"}</td> :
                                                        <td className="tooltip-abc">
                                                            <span style={{ color: "red" }}>{x.quantity - x.realQuantity}</span>
                                                            <span className="tooltiptext"><p style={{ color: "white" }}>{translate('manage_warehouse.bill_management.text')}</p></span>
                                                        </td>)}
                                                {(checkLots(x.unpassed_quality_control_lots, x.quantity - x.realQuantity)) ?
                                                    <td>{x.unpassed_quality_control_lots.map((lot, index) =>
                                                        <div key={index}>
                                                            {lot.code && <p>{lot.code}/{lot.quantity} {x.good.baseUnit}</p>}
                                                        </div>)}
                                                    </td> :
                                                    <td>{x.quantity - x.realQuantity == 0 ? "Không có hàng hóa không đạt" : 'Chưa đánh lô'}</td>
                                                }
                                                <td>
                                                    <a href="#abc" className="text-green" title={"Đánh lô hàng đạt kiểm định"} onClick={() => addLotPassQualityControl(x, index)}><i className="material-icons">add_circle</i></a>
                                                    <a href="#abc" className="text-blue" title={"Đánh lô hàng không đạt kiểm định"} onClick={() => addLotUnPassQualityControl(x, index)}><i className="material-icons">add_circle_outline</i></a>
                                                </td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AddLotComponent));
