import React, { useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import QuantityLotGoodIssue from "./quantityLotGoodIssue";
import { LotActions } from "../../../inventory-management/redux/actions";

function SelectLotComponent(props) {

    const [state, setState] = useState({
        userId: localStorage.getItem("userId"),
        list: [],
        lots: [],
        listGood: [],
        good: {},
    })

    const selectLot = async (good, index) => {
        await setState({
            ...state,
            isPassQualityControl: true,
            quantity: good.realQuantity,
            good: good,
            indexInfo: index,
        })
        await props.getLotsByGood({ good: good.good._id, stock: props.fromStock, type: props.type });
        await window.$("#modal-add-quantity-issue").modal("show");
    }

    const handleLotsChange = (data) => {
        state.good.lots = data;
        setState({
            ...state,
            lots: data,
        });
        
    };

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

    const { translate, group, listGood, fromStock } = props;
    const { lots, lotName, good } = state;
    return (
        <React.Fragment>
            <QuantityLotGoodIssue group={group} good={good} stock={fromStock} initialData={lots} onDataChange={handleLotsChange} />
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
                                    <th title={"Lô hàng/số lượng"}>{"Lô hàng/số lượng"}</th>
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
                                                {(checkLots(x.lots, x.quantity)) ? <td>{x.quantity}</td> :
                                                    <td className="tooltip-abc">
                                                        <span style={{ color: "red" }}>{x.quantity}</span>
                                                        <span className="tooltiptext"><p style={{ color: "white" }}>{"Chưa chọn đủ lô cho hàng hóa"}</p></span>
                                                    </td>}
                                                {(x.lots && x.lots.length > 0) ?
                                                    <td>{x.lots.map((lot, index) =>
                                                        <div key={index}>
                                                            {lot.lot && <p>{lot.lot.code}/{lot.quantity} {x.good.baseUnit}</p>}
                                                        </div>)}
                                                    </td> :
                                                    <td>{"Chưa chọn lô"}</td>
                                                }
                                                <td>
                                                    <a href="#abc" className="text-green" title={"Chọn lô hàng"} onClick={() => selectLot(x, index)}><i className="material-icons">add_circle</i></a>
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
    getLotsByGood: LotActions.getLotsByGood,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SelectLotComponent));
