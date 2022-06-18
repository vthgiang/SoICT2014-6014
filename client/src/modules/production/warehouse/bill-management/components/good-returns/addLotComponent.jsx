import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { SelectBox, ErrorLabel } from '../../../../../../common-components';
import QuantityLotGoodReturn from './quantityLotGoodReturn';
import "../good-receipts/goodReceipt.css";

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

    const addLotUnPassQualityControl = (lot, index) => {
        console.log(lot);
        setState({
            ...state,
            indexInfo: index,
            isPassQualityControl: false,
            quantity: parseInt(lot.returnQuantity) - parseInt(lot.passedQuantity),
            initialData: lot.returnLot ? lot.returnLot : [],
            good: lot.good,
        })
        console.log(state);
        window.$('#modal-edit-quantity-receipt').modal('show');
    }

    const handleLotsChange = (lots, data, arrayId) => {
        console.log(state.indexInfo);
        const dataLot = [...dataLots];
        const dataGoods = [...listGood];
        dataLot[state.indexInfo].lots = lots;
        dataGoods.forEach((item, index) => {
            dataGoods[index].unpassed_quality_control_lots = [];
            dataLot.forEach(lot => {
                if (item.good._id === lot.good._id) {
                    lot.lots && lot.lots.length > 0 && lot.lots.forEach(itemLot => {
                        dataGoods[index].unpassed_quality_control_lots.push(itemLot);
                    })
                }
            })
        })
        console.log(dataGoods);
        console.log(dataLot);
        setState({
            ...state,
            dataLots: dataLot,
            listGood: dataGoods

        })
    }

    const getDataLots = (goods) => {
        let lots = [];
        if (goods && goods.length > 0) {
            goods.forEach(item => {
                item.lots.forEach(lot => {
                    lot.goodName = item.good.name;
                    lot.baseUnit = item.good.baseUnit;
                    lot.code = lot.lot.code;
                    lot.expirationDate = lot.lot.expirationDate;
                    lot.returnQuantity = lot.returnQuantity;
                    lot.goodId = item.good._id;
                    lot.good = item.good;
                    lots.push(lot);
                })
            })
        }
        return lots;
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
                dataLots: getDataLots(props.billInfor.goods),
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
        let { dataLots } = state;
        console.log(dataLots);
        if (dataLots && dataLots.length > 0) {
            dataLots.forEach(item => {
                if (item.lots) {
                    if (item.lots.length === 0) {
                        check = 1;
                    } else {
                        let totalQuantity = 0;
                        item.lots.forEach(item2 => {
                            totalQuantity += parseInt(item2.quantity);
                        })
                        if (totalQuantity !== parseInt(item.quantity) - parseInt(item.passedQuantity)) {
                            check = 1;
                        }
                    }
                }
            })
        }
        return check === 0;
    }

    const checkLots = (lots, quantity) => {
        console.log(lots, quantity);
        if (lots) {
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
    }

    const { translate, group } = props;
    const { dataLots, lots, lotName, listGood, good, billId, statusLot, fromStock, type, quantity, code, initialData, errorOnStatus, isPassQualityControl } = state;
    console.log("listGood", listGood);
    console.log("dataLots", dataLots);
    return (
        <React.Fragment>
            <QuantityLotGoodReturn group={group} good={good} stock={fromStock} type={type} quantity={quantity} bill={billId} lotName={lotName} initialData={initialData} isPassQualityControl={isPassQualityControl} onDataChange={handleLotsChange} />
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
                    <legend className="scheduler-border">{"Thông tin chi tiết lô hàng không đạt kiểm định"}</legend>
                    <div className={`form-group`}>
                        {/* Bảng thông tin chi tiết */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                    <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                    <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                    <th title={"Số lượng trả lại"}>{"Số lượng trả lại"}</th>
                                    <th title={"Số lượng không đạt kiểm định"}>{"Số lượng không đạt kiểm định"}</th>
                                    <th title={"Lô hàng"}>{"Lô hàng"}</th>
                                    <th title={translate('manage_warehouse.bill_management.action')}>{translate('manage_warehouse.bill_management.action')}</th>
                                </tr>
                            </thead>
                            <tbody id={`data-lot-bill`}>
                                {
                                    (typeof dataLots === 'undefined' || dataLots.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                        dataLots.map((x, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.goodName}</td>
                                                <td>{x.baseUnit}</td>
                                                <td>{x.returnQuantity}</td>
                                                <td>
                                                    {parseInt(x.returnQuantity) - parseInt(x.passedQuantity) > 0 ?
                                                        parseInt(x.returnQuantity) - parseInt(x.passedQuantity) : "Không có hàng hóa không đạt kiểm định, hàng sẽ được nhập vào lô cũ"}
                                                </td>
                                                {(checkLots(x.lots, parseInt(x.returnQuantity) - parseInt(x.passedQuantity))) ?
                                                    <td>{x.lots.map((lot, index) =>
                                                        <div key={index}>
                                                            {lot.code && <p>{lot.code}/{lot.quantity} {x.good.baseUnit}</p>}
                                                        </div>)}
                                                    </td> :
                                                    <td>{parseInt(x.returnQuantity) - parseInt(x.passedQuantity) == 0 ? "Không có hàng hóa không đạt" : 'Chưa đánh lô'}</td>
                                                }
                                                <td>
                                                    {parseInt(x.returnQuantity) - parseInt(x.passedQuantity) > 0 &&
                                                        <a href="#abc" className="text-blue" title={"Đánh lô hàng không đạt kiểm định"} onClick={() => addLotUnPassQualityControl(x, index)}><i className="material-icons">add_circle_outline</i></a>
                                                    }
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
