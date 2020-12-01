import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';

class QuantityLotStockTakeEdit extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_LOT = {
            lot: '',
            quantity: 0,
            realQuantity: '',
            damagedQuantity: 0,
            note: ''
        }
        this.state = {
            lot: Object.assign({}, this.EMPTY_LOT),
            lots: this.props.initialData,
            editInfo: false,
            getLotInfo: false,
            good: ''
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.good !== prevState.good) {
            return {
                ...prevState,
                good: nextProps.good,
                lots: nextProps.initialData
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
        const { lot } = this.state;
        let msg = undefined;
        const { translate } = this.props;
        
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_quantity');
        }

        if (willUpdateState) {
            this.state.lot.realQuantity = value;
            this.state.lot.damagedQuantity = Number(this.state.lot.realQuantity) - Number(this.state.lot.quantity);
            this.setState(state => {
                return {
                    ...state,
                    errorQuantity: msg,
                }
            });
        }
        return msg === undefined;
    }

    isFormValidated = () => {
        if(this.state.lots.length > 0) {
            return true;
        }
        return false
    }

    isLotsValidated = () => {
        let result =
            this.validateQuantity(this.state.lot.quantity, false) &&
            this.validateLot(this.state.lot.lot, false)
        return result
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
        await this.setState(state => {
            return {
                ...state,
                lots: newLots,
                editInfo: false,
                lot: Object.assign({}, this.EMPTY_LOT),
            }
        })
        // this.props.onDataChange(this.state.lots);
    }

    handleCancelEditLot = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                lot: Object.assign({}, this.EMPTY_LOT)
            }
        })
    }

    handleEditLot = (lot, index) => {
        this.setState(state => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                lot: Object.assign({}, lot)
            }
        })
    }

    handleDeleteLot = async (index) => {
        const { lots } = this.state;
        let newLots;
        if (lots) {
            newLots = lots.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                lots: newLots
            }
        })

        // this.props.onDataChange(this.state.lots);
    }

    handleLotNoteChange = (e) => {
        let value = e.target.value;
        this.state.lot.note = value;
        this.setState(state => {
            return {
                ...state,
            }
        })
    }

    save = () => {
        this.props.onDataChange(this.state.lots);
    }

    render() {
        const { translate, group, good } = this.props;
        const { errorLot, lot, errorQuantity, lots } = this.state;
        const dataLots = this.getLotsByGood();

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-quantity-take`}
                    formID={`form-edit-quantity-take`}
                    title="Sửa số lượng kiểm kê theo lô"
                    msg_success={translate('manage_warehouse.bill_management.add_success')}
                    msg_faile={translate('manage_warehouse.bill_management.add_faile')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="50"
                >
                <form id={`form-edit-quantity-take`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('manage_warehouse.bill_management.lot')}</legend>

                        { this.state.editInfo &&
                        <div>
                            <div className={`form-group ${!errorLot ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bill_management.lot_number')}<span className="attention">*</span></label>
                                <SelectBox
                                    id={`select-lot-take-by-${group}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={lot.lot ? lot.lot._id : '1'}
                                    items={dataLots}
                                    onChange={this.handleLotChange}
                                    multiple={false}
                                    disabled={true}
                                />
                                <ErrorLabel content={errorLot} />
                            </div>

                            <div className={`form-group`}>
                                <label className="control-label">{translate('manage_warehouse.bill_management.number')}</label>
                                <div>
                                    <input type="number" className="form-control" placeholder={translate('manage_warehouse.bill_management.number')} value={lot.quantity} disabled />
                                </div>
                            </div>

                            <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                                <label className="control-label">{translate('manage_warehouse.bill_management.real_quantity')}</label>
                                <div>
                                    <input type="number" className="form-control" placeholder={translate('manage_warehouse.bill_management.real_quantity')} value={lot.realQuantity ? lot.realQuantity : ''} onChange={this.handleQuantityChange} />
                                </div>
                                <ErrorLabel content={errorQuantity} />
                            </div>

                            <div className="form-group">
                                <label>{translate('manage_warehouse.bill_management.description')}</label>
                                <textarea type="text" className="form-control" value={lot.note} onChange={this.handleLotNoteChange} />
                            </div>

                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                {this.state.editInfo &&
                                    <React.Fragment>
                                        <button className="btn btn-success" onClick={this.handleCancelEditLot} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                        <button className="btn btn-success" disabled={!this.isLotsValidated()} onClick={this.handleSaveEditLot} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                        }

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th title={translate('manage_warehouse.bill_management.lot_number')}>{translate('manage_warehouse.bill_management.lot_number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.real_quantity')}>{translate('manage_warehouse.bill_management.real_quantity')}</th>
                                    <th title={translate('manage_warehouse.bill_management.difference')}>{translate('manage_warehouse.bill_management.difference')}</th>
                                    <th title={translate('manage_warehouse.bill_management.description')}>{translate('manage_warehouse.bill_management.description')}</th>
                                    <th>{translate('task_template.action')}</th>
                                </tr>
                            </thead>
                            <tbody id={`quantity-bill-lot-take-edit-${group}`}>
                                {
                                    (typeof lots !== 'undefined' && lots.length > 0) ?
                                        lots.map((x, index) =>
                                            <tr key={index}>
                                                <td>{x.lot ? x.lot.code : "Lot is deleted"}</td>
                                                <td>{x.quantity}</td>
                                                <td>{x.realQuantity}</td>
                                                <td>{x.damagedQuantity}</td>
                                                <td>{x.note}</td>
                                                <td>
                                                    <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditLot(x, index)}><i className="material-icons"></i></a>
                                                    <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteLot(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        ) : <tr><td colSpan={6}><center>{translate('task_template.no_data')}</center></td></tr>
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
    
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityLotStockTakeEdit));