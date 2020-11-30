import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal, DatePicker } from '../../../../../../common-components';

import { generateCode } from '../../../../../../helpers/generateCode';

import { LotActions } from '../../../inventory-management/redux/actions';

class QuantityLotGoodReceipt extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_LOT = {
            lot: null,
            code: generateCode("LOT"),
            quantity: 0,
            note: '',
            expirationDate: ''
        }
        this.state = {
            lot: Object.assign({}, this.EMPTY_LOT),
            lots: this.props.initialData,
            editInfo: false,
            good: '',
            code: this.props.lotName,
            arrayId: [],
            oldQuantity: 0,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        prevState.code = nextProps.lotName;
        if (nextProps.good !== prevState.good) {
            return {
                ...prevState,
                good: nextProps.good,
                lots: nextProps.initialData,
            }
        } else {
            return null;
        }
    }

    handleAddLotInfo = async () => {
        this.setState(state => {
            return {
                ...state,
                quantity: 2
            }
        })
    }

    getLotsByGood = () => {
        const { lots, translate } = this.props;
        let lotArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_lot') }]

        if(lots.listLotsByGood && lots.listLotsByGood.length > 0) {
            lots.listLotsByGood.map(item => {
                let stock = item.stocks.filter(x => x.stock._id === this.props.stock);
                let quantity = stock[0] ? stock[0].quantity : 0;
                lotArr.push({ 
                    value: item._id, 
                    text: item.code,
                    quantity: quantity,
                });
            })
        }
        return lotArr;
    }

    handleLotChange = (value) => {
        let lot = value[0];
        this.validateLot(lot, true);
    }

    validateLot = async (value, willUpdateState = true) => {
        const dataLots = await this.getLotsByGood();
        let msg = undefined;
        const { translate } = this.props;
        if(!value) {
            msg = translate('manage_warehouse.bill_management.validate_lot');
        }
        if(willUpdateState) {
            let lotName = dataLots.find(x => x.value === value);
            this.state.lot.lot = { _id: value, code: lotName.text, quantity: lotName.quantity };
            await this.setState(state => {
                return {
                    ...state,
                    lotQuantity: lotName.quantity,
                    errorLot: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleQuantityChange = (e) => {
        let value = e.target.value;
        this.validateQuantity(value, true);
    }

    validateQuantity = (value, willUpdateState = true) => {
        const { oldQuantity } = this.state;
        let msg = undefined;
        const { translate } = this.props;
        let difference = this.difference();
        
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_quantity');
        }

        if((Number(value) - Number(oldQuantity)) > difference) {
            msg = translate('manage_warehouse.bill_management.validate_norm');
        }

        if (willUpdateState) {
            this.state.lot.quantity = value;
            this.setState(state => {
                return {
                    ...state,
                    errorQuantity: msg,
                }
            });
        }
        return msg === undefined;
    }

    handleNoteChange = (e) => {
        let value = e.target.value;
        this.state.lot.note = value;
        this.setState(state => {
            return {
                ...state,
            }
        })
    }

    isFormValidated = () => {
        let difference = this.difference();
        if(difference === 0) {
            return true;
        }
        return false
    }

    isLotsValidated = () => {
        let result =
            this.validateQuantity(this.state.lot.quantity, false) &&
            this.validateExpirationDate(this.state.lot.expirationDate, false);
        return result
    }

    handleAddLot = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            let lots = [...(this.state.lots), state.lot];
            return {
                ...state,
                lots: lots,
                lot: Object.assign({}, this.EMPTY_LOT),
            }
        })
        this.state.lot.code = generateCode("LOT");
        this.state.oldQuantity = 0;
        // this.props.onDataChange(this.state.lots);
    }

    handleClearLot = (e) => {
        e.preventDefault();
        this.state.lot = Object.assign({}, this.EMPTY_LOT);
        this.state.oldQuantity = 0;
        this.state.lot.code = generateCode("LOT");
        this.setState(state => {
            return {
                ...state
            }
        })
    }

    handleSaveEditLot = async (e) => {
        e.preventDefault();
        const { indexInfo, lots } = this.state;
        let newLots;
        if (lots) {
            newLots = lots.map((item, index) => {
                return (index === indexInfo) ? this.state.lot : item;
            })
        }
        this.state.lot = Object.assign({}, this.EMPTY_LOT);
        this.state.oldQuantity = 0;
        this.state.lot.code = generateCode("LOT");
        await this.setState(state => {
            return {
                ...state,
                lots: newLots,
                editInfo: false,
            }
        })
        this.props.onDataChange(this.state.lots);
    }

    handleCancelEditLot = (e) => {
        e.preventDefault();
        this.state.lot = Object.assign({}, this.EMPTY_LOT);
        this.state.oldQuantity = 0;
        this.state.lot.code = generateCode("LOT");
        this.setState(state => {
            return {
                ...state,
                editInfo: false
            }
        })
    }

    handleEditLot = (lot, index) => {
        this.state.oldQuantity = lot.quantity;
        this.state.lot.oldQuantity = lot.quantity;
        this.setState(state => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                lot: Object.assign({}, lot),
            }
        })
    }

    handleDeleteLot = async (lotId, index) => {
        const { lots, arrayId } = this.state;
        let newLots;
        if (lots) {
            newLots = lots.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                arrayId: [ ...arrayId, lotId ],
                lots: newLots
            }
        })

        // this.props.onDataChange(this.state.lots);
    }

    save = async() => {
        const { stock, good, quantity, bill, type } = this.props;
        const { lots, arrayId } = this.state;
        const data = {};
        data.stock = stock;
        data.lots = lots;
        data.bill = bill;
        data.typeBill = type;
        if(good.good) {
            data.good = good.good._id;
            data.type = good.good.type;
        }
        // if(arrayId && arrayId.length > 0) {
        //     await this.props.deleteLot(arrayId);
        // }

        await this.props.createOrUpdateLots(data);

        await this.props.onDataChange(this.state.lots, data, arrayId);
    }

    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                day = '' + d.getDate(),
                month = '' + (d.getMonth() + 1),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }
    handleExpirationDateChange = (value) => {
        this.validateExpirationDate(value, true)
    }
    validateExpirationDate = (value, willUpdateState = true) => {
        let msg = undefined
        if(!value) {
            msg = 'Chưa nhập ngày hết hạn'
        }

        if (willUpdateState) {
            this.state.lot.expirationDate = value;
            this.setState(state => {
                return {
                    ...state,
                    errorExpirationDate: msg,
                    expirationDate: value,
                }
            });
        }
        return msg === undefined;
    }

    difference = () => {
        const { lots } = this.state;
        const { quantity } = this.props;
        let number = 0;
        if(lots && lots.length > 0) {
            for (let i = 0; i < lots.length; i++) {
                number += Number(lots[i].quantity);
            }
        }

        let difference = Number(quantity) - Number(number);
        return difference;
    }

    render() {
        const { translate, group, good, quantity } = this.props;
        const { lot, errorQuantity, lots, errorExpirationDate } = this.state;

        let difference = this.difference();

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-quantity-receipt`}
                    formID={`form-edit-quantity-receipt`}
                    title="Thêm mới lô hàng"
                    msg_success={translate('manage_warehouse.bill_management.add_success')}
                    msg_faile={translate('manage_warehouse.bill_management.add_faile')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="75"
                >
                <form id={`form-edit-quantity-receipt`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('manage_warehouse.bill_management.lot')}</legend>
                        { quantity ? (difference !== 0 ? <div className="form-group" style={{ color: 'red', textAlign: 'center'}}>{`Bạn cần đánh lô cho ${difference} số lượng hàng nhập`}</div> :
                                <div className="form-group" style={{ color: 'green', textAlign: 'center'}}>Bạn đã đánh xong lô cho {quantity} số lượng hàng nhập</div>) : []}
                        <div className={`form-group`}>
                            <label>{translate('manage_warehouse.bill_management.lot_number')}</label>
                            <input type="text" className="form-control" value={lot.code} disabled/>
                        </div>

                        <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                            <label className="control-label">{translate('manage_warehouse.bill_management.number')}</label>
                            <div>
                                <input type="number" className="form-control" placeholder={translate('manage_warehouse.bill_management.number')} value={lot.quantity} onChange={this.handleQuantityChange} />
                            </div>
                            <ErrorLabel content={errorQuantity} />
                        </div>

                        <div className={`form-group ${!errorExpirationDate ? "" : "has-error"}`}>
                            <label htmlFor="expirationDate">{translate('manage_warehouse.bill_management.expiration_date')}</label>
                            <DatePicker
                                id={`expirationDate-lot`}
                                value={lot.expirationDate}
                                onChange={this.handleExpirationDateChange}
                            />
                            <ErrorLabel content={errorExpirationDate} />
                        </div>

                        <div className={`form-group`}>
                            <label className="control-label">{translate('manage_warehouse.bill_management.description')}</label>
                            <div>
                                <input type="text" className="form-control" placeholder={translate('manage_warehouse.bill_management.description')} value={lot.note} onChange={this.handleNoteChange} />
                            </div>
                        </div>

                        <div className="pull-right" style={{ marginBottom: "10px" }}>
                            {this.state.editInfo ?
                                <React.Fragment>
                                    <button className="btn btn-success" onClick={this.handleCancelEditLot} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                    <button className="btn btn-success" disabled={!this.isLotsValidated()} onClick={this.handleSaveEditLot} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                </React.Fragment> :
                                <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isLotsValidated()} onClick={this.handleAddLot}>{translate('task_template.add')}</button>
                            }
                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearLot}>{translate('task_template.delete')}</button>
                        </div>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th title={translate('manage_warehouse.bill_management.lot_number')}>{translate('manage_warehouse.bill_management.lot_number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.description')}>{translate('manage_warehouse.bill_management.description')}</th>
                                    <th title={translate('manage_warehouse.bill_management.expiration_date')}>{translate('manage_warehouse.bill_management.expiration_date')}</th>
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
                                                <td>
                                                    <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditLot(x, index)}><i className="material-icons"></i></a>
                                                    <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteLot(x.lot, index)}><i className="material-icons"></i></a>
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
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createOrUpdateLots: LotActions.createOrUpdateLots,
    deleteLot: LotActions.deleteManyLots,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityLotGoodReceipt));