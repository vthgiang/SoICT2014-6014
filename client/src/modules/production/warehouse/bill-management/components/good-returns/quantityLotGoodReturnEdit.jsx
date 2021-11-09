import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';

function QuantityLotGoodReturnEdit(props) {
    const EMPTY_LOT = {
        lot: '',
        quantity: 0,
        returnQuantity: 0,
        damagedQuantity: 0,
        note: ''
    }

    const [state, setState] = useState({
        lot: Object.assign({}, EMPTY_LOT),
        lots: props.initialData,
        editInfo: false,
        getLotInfo: false,
        good: ''
    })

    if (props.good !== state.good) {
        setState({
            ...state,
            good: props.good,
            lots: props.initialData
        })
    }

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
                lotArr.push({
                    value: item._id,
                    text: item.code + "--" + quantity + " (" + item.good.baseUnit + ")",
                    quantity: quantity,
                });
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

    const validateQuantity = (value, willUpdateState = true) => {
        const { lot } = state;
        let msg = undefined;
        const { translate } = props;

        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_quantity');
        }

        if (Number(value) > Number(lot.quantity)) {
            msg = ` ${translate('manage_warehouse.bill_management.validate_norm')} (${lot.quantity}) `
        }

        if (willUpdateState) {
            state.lot.returnQuantity = value;
            setState(state => {
                return {
                    ...state,
                    errorQuantity: msg,
                }
            });
        }
        return msg === undefined;
    }

    const isFormValidated = () => {
        if (state.lots.length > 0) {
            return true;
        }
        return false
    }

    const isLotsValidated = () => {
        let result =
            validateQuantity(state.lot.quantity, false) &&
            validateLot(state.lot.lot, false)
        return result
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
        await setState({
            ...state,
            lots: newLots,
            editInfo: false,
            lot: Object.assign({}, EMPTY_LOT),
        })
        // props.onDataChange(state.lots);
    }

    const handleCancelEditLot = (e) => {
        e.preventDefault();
        setState({
            ...state,
            editInfo: false,
            lot: Object.assign({}, EMPTY_LOT)
        })
    }

    const handleEditLot = (lot, index) => {
        setState({
            ...state,
            editInfo: true,
            indexInfo: index,
            lot: Object.assign({}, lot)
        })
    }

    const handleDeleteLot = async (index) => {
        const { lots } = state;
        let newLots;
        if (lots) {
            newLots = lots.filter((item, x) => index !== x);
        }
        await setState({
            ...state,
            lots: newLots
        })

        // props.onDataChange(state.lots);
    }

    const handleLotNoteChange = (e) => {
        let value = e.target.value;
        state.lot.note = value;
        setState({
            ...state,
        })
    }

    const save = () => {
        props.onDataChange(state.lots);
    }
    
    const { translate, group, good } = props;
    const { errorLot, lot, errorQuantity, lots } = state;
    const dataLots = getLotsByGood();

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-quantity-return`}
                formID={`form-edit-quantity-return`}
                title="Sửa số lượng trả hàng theo lô"
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={!isFormValidated()}
                func={save}
                size="75"
            >
                <form id={`form-edit-quantity-return`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('manage_warehouse.bill_management.lot')}</legend>

                        {state.editInfo &&
                            <div>
                                <div className={`form-group ${!errorLot ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.lot_number')}<span className="attention">*</span></label>
                                    <SelectBox
                                        id={`select-lot-return-by-${group}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={lot.lot ? lot.lot._id : '1'}
                                        items={dataLots}
                                        onChange={handleLotChange}
                                        multiple={false}
                                        disabled={true}
                                    />
                                    <ErrorLabel content={errorLot} />
                                </div>

                                <div className={`form-group`}>
                                    <label className="control-label">{translate('manage_warehouse.bill_management.quantity_issue')}</label>
                                    <div>
                                        <input type="number" className="form-control" placeholder={translate('manage_warehouse.bill_management.quantity_issue')} value={lot.quantity} disabled />
                                    </div>
                                </div>

                                <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('manage_warehouse.bill_management.quantity_return')}</label>
                                    <div>
                                        <input type="number" className="form-control" placeholder={translate('manage_warehouse.bill_management.quantity_return')} value={lot.returnQuantity ? lot.returnQuantity : 0} onChange={handleQuantityChange} />
                                    </div>
                                    <ErrorLabel content={errorQuantity} />
                                </div>

                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.description')}</label>
                                    <textarea type="text" className="form-control" value={lot.note} onChange={handleLotNoteChange} />
                                </div>

                                <div className="pull-right" style={{ marginBottom: "10px" }}>
                                    {state.editInfo &&
                                        <React.Fragment>
                                            <button className="btn btn-success" onClick={handleCancelEditLot} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                            <button className="btn btn-success" disabled={!isLotsValidated()} onClick={handleSaveEditLot} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        }

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th title={translate('manage_warehouse.bill_management.lot_number')}>{translate('manage_warehouse.bill_management.lot_number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.quantity_issue')}>{translate('manage_warehouse.bill_management.quantity_issue')}</th>
                                    <th title={translate('manage_warehouse.bill_management.quantity_return')}>{translate('manage_warehouse.bill_management.quantity_return')}</th>
                                    <th title={translate('manage_warehouse.bill_management.description')}>{translate('manage_warehouse.bill_management.description')}</th>
                                    <th>{translate('task_template.action')}</th>
                                </tr>
                            </thead>
                            <tbody id={`quantity-bill-lot-return-create-${group}`}>
                                {
                                    (typeof lots !== 'undefined' && lots.length > 0) ?
                                        lots.map((x, index) =>
                                            <tr key={index}>
                                                <td>{x.lot.code}</td>
                                                <td>{x.quantity}</td>
                                                <td>{x.returnQuantity}</td>
                                                <td>{x.note}</td>
                                                <td>
                                                    <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditLot(x, index)}><i className="material-icons"></i></a>
                                                    <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteLot(index)}><i className="material-icons"></i></a>
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

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityLotGoodReturnEdit));
