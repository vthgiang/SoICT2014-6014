import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { DialogModal } from '../../../../../../common-components';
import GoodReturnCreateForm from '../good-returns/goodReturnCreateForm';
import { LotActions } from '../../../inventory-management/redux/actions';
import LotEditForm from '../../../inventory-management/components/lotEditForm';
import QuantityLotGoodReceipt from './quantityLotGoodReceipt';
import { BillActions } from '../../redux/actions';

function GoodDetailModal(props) {
    const [state, setState] = useState({
        lotName: '',
        initialData: [],
    })

    const { translate, listGoods, bill, billId } = props;
    const { lotId, lotName, damagedQuantity, good, initialData } = state;

    const handleEdit = async (id) => {
        const lot = await props.getDetailLot(id);
        setState({
            ...state,
            lotId: id,
            dataStatus: 0
        })
        window.$('#modal-edit-lot').modal('show');
    }

    const handleAddLot = async (good) => {
        await setState({
            ...state,
            good: good,
            damagedQuantity: good.damagedQuantity,
        })

        window.$('#modal-edit-quantity-receipt').modal('show');
    }

    const checkQuantity = (stock) => {
        if (stock) {
            const { stocks } = props;
            var check = 1;
            stock.map(x => {
                if (stocks.listStocks.length > 0) {
                    for (let i = 0; i < stocks.listStocks.length; i++) {
                        if (x.stock === stocks.listStocks[i]._id) {
                            if (x.binLocations.length === 0) {
                                check = 0;
                            } else {
                                let totalQuantity = x.binLocations.reduce(function (accumulator, currentValue) {
                                    return Number(accumulator) + Number(currentValue.quantity);
                                }, 0);
                                if (x.quantity === totalQuantity) {
                                    check = 1;
                                }
                            }
                        }
                    }
                }
            })

            if (check === 1) {
                return false
            }
            return true
        }
        return false;

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

    const handleLotsChange = async (unpassed_quality_control_lots) => {
        listGoods.forEach(element => {
            if (element._id === good._id) {
                element.unpassed_quality_control_lots = unpassed_quality_control_lots;
            }
        });
    }

    const save = async () => {
        listGoods.forEach(element => {
            if (element._id === good._id) {
                const { listCreateOrEdit } = props.lots;
                if (element.unpassed_quality_control_lots.length > 0) {
                    for (let i = 0; i < element.unpassed_quality_control_lots.length; i++) {
                        for (let j = 0; j < listCreateOrEdit.length; j++) {
                            if (element.unpassed_quality_control_lots[i].code === listCreateOrEdit[j].code) {
                                element.unpassed_quality_control_lots[i].lot = listCreateOrEdit[j]._id;
                            }
                        }
                    }
                }
            }
        });
        await props.editBill(billId, {
            goods: listGoods,
        })
    }

    const handleCreateBillReturn = () => {
        window.$('#modal-create-bill-return').modal('show');
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-good-detail"
                title={translate(`manage_warehouse.bill_management.good_detail`)}
                size="75"
                hasSaveButton={true}
                func={save}
                hasNote={false}
            >
                <QuantityLotGoodReceipt group={'1'} good={good} stock={bill.fromStock._id} type={bill.type} quantity={damagedQuantity} bill={billId} lotName={lotName} initialData={initialData} onDataChange={handleLotsChange} />
                <GoodReturnCreateForm group={"3"} isHideButtonCreate={true} />
                {
                    lotId &&
                    <LotEditForm
                        id={lotId}
                        lot={props.lots.lotDetail}
                    />
                }
                <div className={`form-group`}>
                    <fieldset className="scheduler-border">
                        {/* Bảng thông tin chi tiết */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                    <th title={translate('manage_warehouse.bill_management.good_code')}>{translate('manage_warehouse.bill_management.good_code')}</th>
                                    <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                    <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                    <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.quantity_passed_test')}>{translate('manage_warehouse.bill_management.quantity_passed_test')}</th>
                                    <th title={translate('manage_warehouse.bill_management.lot_with_unit')}>{translate('manage_warehouse.bill_management.lot_with_unit')}</th>
                                    <th title={translate('manage_warehouse.bill_management.quantity_return_supplier')}>{translate('manage_warehouse.bill_management.quantity_return_supplier')}</th>
                                </tr>
                            </thead>

                            <tbody id={`good-bill-edit`}>
                                {
                                    (typeof listGoods === 'undefined' || listGoods.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                        listGoods.map((x, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.good.code}</td>
                                                <td>{x.good.name}</td>
                                                <td>{x.good.baseUnit}</td>
                                                <td>{x.quantity}</td>
                                                <td>
                                                    <span style={{ color: "green" }}>{x.realQuantity}</span>
                                                </td>
                                                <td>{x.lots.map((lot, index) =>
                                                    <div key={index}>
                                                        {(lot.lot && !checkQuantity(lot.lot.stocks)) ? <div>{lot.lot.code && <p>{lot.lot.code}/{lot.quantity} {x.good.baseUnit} <a onClick={() => handleEdit(lot.lot._id)} href={`#${lot.lot._id}`} className="text-green"><i title={translate('manage_warehouse.bill_management.arrange_goods_into_the_warehouse')} className="material-icons vertical-align-middle">precision_manufacturing</i></a></p>}</div> :
                                                            <div className="tooltip-abc">
                                                                {lot.lot.code && <span style={{ color: "red" }}>{lot.lot.code}/{lot.quantity} {x.good.baseUnit} <a onClick={() => handleEdit(lot.lot._id)} href={`#${lot.lot._id}`} className="text-green"><i title={translate('manage_warehouse.bill_management.arrange_goods_into_the_warehouse')} className="material-icons vertical-align-middle">precision_manufacturing</i></a></span>}
                                                                <span className="tooltiptext"><p style={{ color: "white" }}>{translate('manage_warehouse.inventory_management.text')}</p></span>
                                                            </div>
                                                        }
                                                    </div>)}
                                                </td>
                                                <td>
                                                    {x.unpassed_quality_control_lots.length === 0 && x.damagedQuantity !== 0 && <div className="tooltip-abc">
                                                        <span className={checkLots(x.unpassed_quality_control_lots, x.damagedQuantity) ? 'text-green' : 'text-red'}>{x.damagedQuantity}/{x.good.baseUnit}</span>
                                                        <a className="text-green" onClick={() => handleAddLot(x)} ><i title={translate('manage_warehouse.inventory_management.add_lot')} className="material-icons vertical-align-middle">add_box</i></a>
                                                        <a className="text-green" ><i title={translate('manage_warehouse.bill_management.arrange_goods_into_the_warehouse')} className="material-icons vertical-align-middle">precision_manufacturing</i></a>
                                                        {!checkLots(x.unpassed_quality_control_lots, x.damagedQuantity) &&
                                                            <span className="tooltiptext" style={{ right: "80%", bottom: "-100%", textAlign: "left", padding: "5px 0 5px 5px", width: "200px" }}>
                                                                <p style={{ whiteSpace: 'pre-wrap', color: "white" }}>{translate('manage_warehouse.bill_management.process_not_passed_goods')}</p>
                                                            </span>}
                                                    </div>}
                                                    {x.unpassed_quality_control_lots.length !== 0 &&
                                                        x.unpassed_quality_control_lots.map((unpassed_quality_control_lot, index) =>
                                                            <div key={index}>
                                                                {unpassed_quality_control_lot.lot && ((!checkQuantity(unpassed_quality_control_lot.lot.stocks)) ?
                                                                    <div>
                                                                        {unpassed_quality_control_lot.lot.code &&
                                                                            <p>
                                                                                {unpassed_quality_control_lot.lot.code}/{unpassed_quality_control_lot.quantity} {x.good.baseUnit}
                                                                                {/* <a onClick={() => handleEdit(unpassed_quality_control_lot.lot._id)} href={`#${unpassed_quality_control_lot.lot._id}`} className="text-green">
                                                                                    <i title={translate('manage_warehouse.bill_management.arrange_goods_into_the_warehouse')} className="material-icons vertical-align-middle">precision_manufacturing</i>
                                                                                </a> */}
                                                                                <a onClick={() => handleCreateBillReturn()} className="text-red">
                                                                                    <i title={translate('manage_warehouse.bill_management.good_return')} className="material-icons vertical-align-middle">assignment_returned</i>
                                                                                </a>
                                                                            </p>}
                                                                    </div> :
                                                                    <div className="tooltip-abc">
                                                                        {unpassed_quality_control_lot.lot.code &&
                                                                            <span style={{ color: "red" }}>
                                                                                {unpassed_quality_control_lot.lot.code}/{unpassed_quality_control_lot.quantity} {x.good.baseUnit}
                                                                                <a onClick={() => handleEdit(unpassed_quality_control_lot.lot._id)} href={`#${unpassed_quality_control_lot.lot._id}`} className="text-green">
                                                                                    <i title={translate('manage_warehouse.bill_management.arrange_goods_into_the_warehouse')} className="material-icons vertical-align-middle">precision_manufacturing</i>
                                                                                </a>
                                                                            </span>}
                                                                        <span className="tooltiptext"><p style={{ color: "white" }}>{translate('manage_warehouse.inventory_management.text')}</p></span>
                                                                    </div>)
                                                                }
                                                            </div>)
                                                    }
                                                    {x.damagedQuantity === 0 && <span>{x.damagedQuantity} / {x.good.baseUnit}</span>}
                                                </td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </fieldset>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { bills } = state;
    return { bills }
}

const mapDispatchToProps = {
    getDetailLot: LotActions.getDetailLot,
    editBill: BillActions.editBill,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodDetailModal))
