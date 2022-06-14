import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal, DatePicker } from '../../../../../../common-components';

import { generateCode } from '../../../../../../helpers/generateCode';

import { LotActions } from '../../../inventory-management/redux/actions';

function QuantityLotGoodReceipt(props) {
    const EMPTY_LOT = {
        lot: null,
        code: generateCode("LOT"),
        quantity: 0,
        note: '',
        expirationDate: '',
        rfidCode: [],
        rfidQuantity: 0,
    }

    const [state, setState] = useState({
        lot: Object.assign({}, EMPTY_LOT),
        lots: props.initialData,
        editInfo: false,
        good: '',
        code: props.lotName,
        arrayId: [],
        oldQuantity: 0,
    })

    useEffect(() => {
        state.code = props.lotName;
        if (props.good !== state.good || props.isPassQualityControl !== state.isPassQualityControl) {
            setState({
                ...state,
                good: props.good,
                lots: props.initialData,
                isPassQualityControl: props.isPassQualityControl,
            })
        }
    }, [props.good, props.isPassQualityControl])

    const handleAddLotInfo = async () => {
        setState({
            ...state,
            quantity: 2
        })
    }

    const getLotsByGood = () => {
        const { lots, translate } = props;
        let lotArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_lot') }]

        if (lots.listLotsByGood && lots.listLotsByGood.length > 0) {
            lots.listLotsByGood.map(item => {
                let stock = item.stocks.filter(x => x.stock._id === props.stock);
                let quantity = stock[0] ? stock[0].quantity : 0;
                if (quantity > 0) {
                    lotArr.push({
                        value: item._id,
                        text: item.code + "--" + quantity + " (" + item.good.baseUnit + ")",
                        quantity: quantity,
                    });
                }
            })
        }
        return lotArr;
    }

    const handleLotChange = (value) => {
        let lot = value[0];
        validateLot(lot, true);
    }

    const validateLot = async (value, willUpdateState = true) => {
        const dataLots = await getLotsByGood();
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_lot');
        }
        if (willUpdateState) {
            let lotName = dataLots.find(x => x.value === value);
            state.lot.lot = { _id: value, code: lotName.text, quantity: lotName.quantity };
            await setState({
                ...state,
                lotQuantity: lotName.quantity,
                errorLot: msg,
            })
        }
        return msg === undefined;
    }

    const handleQuantityChange = (e) => {
        let value = e.target.value;
        validateQuantity(value, true);
    }

    const handleRfidQuantityChange = (e) => {
        state.lot.rfidCode = [];
        let value = e.target.value;
        validateRfidQuantity(value, true);
    }

    const validateQuantity = (value, willUpdateState = true) => {
        const { oldQuantity } = state;
        let msg = undefined;
        const { translate } = props;
        let different = difference();

        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_quantity');
        }

        if ((Number(value) - Number(oldQuantity)) > different) {
            msg = translate('manage_warehouse.bill_management.validate_norm');
        }

        if (willUpdateState) {
            state.lot.quantity = value;
            setState({
                ...state,
                errorQuantity: msg,
            });
        }
        return msg === undefined;
    }

    const handleNoteChange = (e) => {
        let value = e.target.value;
        state.lot.note = value;
        setState({
            ...state,
        })
    }

    const isFormValidated = () => {
        let different = difference();
        if (different === 0) {
            return true;
        }
        return false
    }

    const isLotsValidated = () => {
        let result =
            validateQuantity(state.lot.quantity, false) &&
            validateExpirationDate(state.lot.expirationDate, false)
            && validateRfidQuantity(state.lot.rfidQuantity, false)
            && state.lot.rfidCode && state.lot.rfidCode.length > 0;
        return result
    }

    const isRfidCodeValidate = () => {
        let result =
            validateQuantity(state.lot.quantity, false) &&
            validateRfidQuantity(state.lot.rfidQuantity, false)
        return result
    }

    const validateRfidQuantity = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value || Number(value) > Number(state.lot.quantity) || Number(value) < 0) {
            msg = translate('manage_warehouse.bill_management.validate_quantity_rfid');
        }
        if (willUpdateState) {
            state.lot.rfidQuantity = value;
            setState({
                ...state,
                errorRfidQuantity: msg,
            });
        }
        return msg === undefined;
    }

    const handleAddLot = async (e) => {
        e.preventDefault();
        let lots = [];
        if (state.lots && state.lots.length > 0) 
            lots.push(state.lots);
        lots.push(state.lot);
        console.log(lots);
        await setState({
            ...state,
            lots: lots,
            lot: Object.assign({}, EMPTY_LOT),
        })
        state.lot.code = generateCode("LOT");
        state.oldQuantity = 0;
        // props.onDataChange(state.lots);
    }

    const handleClearLot = (e) => {
        e.preventDefault();
        state.lot = Object.assign({}, EMPTY_LOT);
        state.oldQuantity = 0;
        state.lot.code = generateCode("LOT");
        setState({
            ...state
        })
    }

    const handleGenerateRfid = async (e) => {
        let numberRfid = 0;
        if (state.lot.quantity % state.lot.rfidQuantity === 0) {
            numberRfid = state.lot.quantity / state.lot.rfidQuantity;
        } else {
            numberRfid = Math.floor(state.lot.quantity / state.lot.rfidQuantity) + 1;
        }
        state.lot.rfidCode = [];
        for (let i = 0; i < numberRfid; i++) {
            let code = generateCode("RFID") + "-" + String(i + 1);
            state.lot.rfidCode.push(code);
        }
    }

    const handleSaveEditLot = async (e) => {
        e.preventDefault();
        const { indexInfo, lots } = state;
        let newLots;
        if (lots) {
            newLots = lots.map((item, index) => {
                return (index === indexInfo) ? state.lot : item;
            })
        }
        state.lot = Object.assign({}, EMPTY_LOT);
        state.oldQuantity = 0;
        state.lot.code = generateCode("LOT");
        await setState({
            ...state,
            lots: newLots,
            editInfo: false,
        })
        props.onDataChange(state.lots);
    }

    const handleCancelEditLot = (e) => {
        e.preventDefault();
        state.lot = Object.assign({}, EMPTY_LOT);
        state.oldQuantity = 0;
        state.lot.code = generateCode("LOT");
        setState({
            ...state,
            editInfo: false
        })
    }

    const handleEditLot = (lot, index) => {
        state.oldQuantity = lot.quantity;
        state.lot.oldQuantity = lot.quantity;
        setState({
            ...state,
            editInfo: true,
            indexInfo: index,
            lot: Object.assign({}, lot),
        })
    }

    const handleDeleteLot = async (lotId, index) => {
        const { lots, arrayId } = state;
        let newLots;
        if (lots) {
            newLots = lots.filter((item, x) => index !== x);
        }
        await setState({
            ...state,
            arrayId: [...arrayId, lotId],
            lots: newLots
        })

        // props.onDataChange(state.lots);
    }

    const save = async () => {
        // const { stock, good, quantity, bill, type } = props;
        // const { lots, arrayId } = state;
        // const data = {};
        // data.stock = stock;
        // data.lots = lots;
        // data.bill = bill;
        // data.typeBill = type;
        // if (good.good) {
        //     data.good = good.good._id;
        //     data.type = good.good.type;
        // }
        // if(arrayId && arrayId.length > 0) {
        //     await props.deleteLot(arrayId);
        // }

        // await props.createOrUpdateLots(data);

        await props.onDataChange(state.lots);
    }

    const handleExpirationDateChange = (value) => {
        validateExpirationDate(value, true)
    }
    const validateExpirationDate = (value, willUpdateState = true) => {
        let msg = undefined
        if (!value) {
            msg = 'Chưa nhập ngày hết hạn'
        }

        if (willUpdateState) {
            state.lot.expirationDate = value;
            setState({
                ...state,
                errorExpirationDate: msg,
                expirationDate: value,
            });
        }
        return msg === undefined;
    }

    const difference = () => {
        const { lots } = state;
        const { quantity } = props;
        let number = 0;
        if (lots && lots.length > 0) {
            for (let i = 0; i < lots.length; i++) {
                number += Number(lots[i].quantity);
            }
        }

        let difference = Number(quantity) - Number(number);
        return difference;
    }

    const { translate, group, good, quantity } = props;
    const { lot, errorQuantity, errorRfidQuantity, lots, errorExpirationDate } = state;
    let different = difference();
    console.log(props.isPassQualityControl);
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-quantity-receipt`}
                formID={`form-edit-quantity-receipt`}
                title="Thêm mới lô hàng"
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={!isFormValidated()}
                func={save}
                size="100"
            >
                <form id={`form-edit-quantity-receipt`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('manage_warehouse.bill_management.lot')}</legend>
                        {quantity ? (different !== 0 ? <div className="form-group" style={{ color: 'red', textAlign: 'center' }}>{`Bạn cần phải đánh lô cho ${different} số lượng hàng nhập`}</div> :
                            <div className="form-group" style={{ color: 'green', textAlign: 'center' }}>Bạn đã đánh xong lô cho {quantity} số lượng hàng nhập</div>) : []}
                        <div className={`form-group`}>
                            <label>{translate('manage_warehouse.bill_management.lot_number')}</label>
                            <input type="text" className="form-control" value={lot.code} disabled />
                        </div>

                        <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                            <label className="control-label">{translate('manage_warehouse.bill_management.number')}</label>
                            <div>
                                <input type="number" className="form-control" placeholder={translate('manage_warehouse.bill_management.number')} value={lot.quantity} onChange={handleQuantityChange} />
                            </div>
                            <ErrorLabel content={errorQuantity} />
                        </div>

                        <div className={`form-group ${!errorRfidQuantity ? "" : "has-error"}`}>
                            <label className="control-label">{translate('manage_warehouse.bill_management.rfid_quantity')}</label>
                            <div>
                                <input type="number" className="form-control" placeholder={translate('manage_warehouse.bill_management.rfid_quantity')} value={lot.rfidQuantity} onChange={handleRfidQuantityChange} />
                            </div>
                            <ErrorLabel content={errorRfidQuantity} />
                        </div>

                        <div className={`form-group ${!errorExpirationDate ? "" : "has-error"}`}>
                            <label htmlFor="expirationDate">{translate('manage_warehouse.bill_management.expiration_date')}</label>
                            <DatePicker
                                id={`expirationDate-lot`}
                                value={lot.expirationDate}
                                onChange={handleExpirationDateChange}
                            />
                            <ErrorLabel content={errorExpirationDate} />
                        </div>

                        <div className={`form-group`}>
                            <label className="control-label">{translate('manage_warehouse.bill_management.description')}</label>
                            <div>
                                <input type="text" className="form-control" placeholder={translate('manage_warehouse.bill_management.description')} value={lot.note} onChange={handleNoteChange} />
                            </div>
                        </div>

                        <div className="pull-right" style={{ marginBottom: "10px" }}>
                            <p type="button" className="btn btn-primary" style={{ marginLeft: "10px" }} disabled={!isRfidCodeValidate()} onClick={handleGenerateRfid}>{translate('manage_warehouse.bill_management.create_rfid_code')}</p>
                            {state.editInfo ?
                                <React.Fragment>
                                    <button className="btn btn-success" onClick={handleCancelEditLot} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                    <button className="btn btn-success" disabled={!isLotsValidated()} onClick={handleSaveEditLot} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                </React.Fragment> :
                                <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isLotsValidated()} onClick={handleAddLot}>{translate('task_template.add')}</button>
                            }
                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearLot}>{translate('task_template.delete')}</button>
                        </div>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th title={translate('manage_warehouse.bill_management.lot_number')}>{translate('manage_warehouse.bill_management.lot_number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.description')}>{translate('manage_warehouse.bill_management.description')}</th>
                                    <th title={translate('manage_warehouse.bill_management.expiration_date')}>{translate('manage_warehouse.bill_management.expiration_date')}</th>
                                    <th title={translate('manage_warehouse.bill_management.rfid_code')}>{translate('manage_warehouse.bill_management.rfid_code')}</th>
                                    <th>{translate('task_template.action')}</th>
                                </tr>
                            </thead>
                            <tbody id={`quantity-bill-lot-create-${group}`}>
                                {
                                    (typeof lots !== 'undefined' && lots.length > 0) ?
                                        lots.map((x, index) =>
                                            <tr key={index}>
                                                <td>{x.code}</td>
                                                <td>{x.quantity}</td>
                                                <td>{x.note}</td>
                                                <td>{x.expirationDate}</td>
                                                <td>{x.rfidCode ? x.rfidCode.map((rfid, index) =>
                                                    <div key={index}>
                                                        <p>{rfid}<br></br></p>
                                                    </div>) : ''}
                                                </td>
                                                <td>
                                                    <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditLot(x, index)}><i className="material-icons"></i></a>
                                                    <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteLot(x.lot, index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        ) : <tr><td colSpan={5}><center>{translate('task_template.no_data')}</center></td></tr>
                                }
                            </tbody>
                        </table>
                    </fieldset>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createOrUpdateLots: LotActions.createOrUpdateLots,
    deleteLot: LotActions.deleteManyLots,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityLotGoodReceipt));
