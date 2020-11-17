import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';
import QuantityLotStockTakeEdit from './quantityLotStockTakeEdit';
import { LotActions } from '../../../inventory-management/redux/actions';
import { BillActions } from '../../redux/actions';

class StockTakeEditForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            good: '',
            quantity: '',
            realQuantity: '',
            description: '',
            lots: []
        }
        this.state = {
            list: [],
            lots: [],
            listGood: [],
            good: Object.assign({}, this.EMPTY_GOOD),
            editInfo: false,
            users: [],
            status: '1',
            fromStock: ''
        }
    }

    getAllGoods = () => {
        let { translate } = this.props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_good') }];

        this.props.goods.listALLGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.code + " -- " + item.name,
                code: item.code,
                name: item.name,
                baseUnit: item.baseUnit
            })
        })

        return goodArr;
    }

    handleGoodChange = async (value) => {
        const dataGoods = await this.getAllGoods();
        let good = value[0];
        this.state.good.quantity = 0;
        let goodName = dataGoods.find(x => x.value === good);
        this.state.good.good = { _id: good, code: goodName.code, name: goodName.name, baseUnit: goodName.baseUnit };
        await this.setState(state => {
            return {
                ...state,
                lots: []
            }
        })
        const { fromStock } = this.state;

        await this.props.getLotsByGood({ good, stock: fromStock });
    }

    addQuantity = () => {
        window.$('#modal-edit-quantity-take').modal('show');
    }

    getApprover = () => {
        const { user, translate } = this.props;
        let ApproverArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_approver') }];

        user.list.map(item => {
            ApproverArr.push({
                value: item._id,
                text: item.name
            })
        })

        return ApproverArr;
    }

    getStock = () => {
        const { stocks, translate } = this.props;
        let stockArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_stock') }];

        stocks.listStocks.map(item => {
            stockArr.push({
                value: item._id,
                text: item.name
            })
        })

        return stockArr;
    }

    getType = () => {
        const { translate} = this.props;
        let typeArr = [];
        typeArr = [
            { value: '0', text: translate('manage_warehouse.bill_management.choose_type')},
            { value: '5', text: translate('manage_warehouse.bill_management.billType.5')},
            { value: '6', text: translate('manage_warehouse.bill_management.billType.6')},
        ]
        return typeArr;
    }

    getStatus = () => {
        const { translate } = this.props;
        const { oldStatus } = this.state;
        let statusArr = [];
        if(oldStatus === '1') {
            statusArr = [
                { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1')},
                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3')},
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4')}
            ]
        }
        if(oldStatus === '2') {
            statusArr = [
                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2')},
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4')}
            ]
        }
        if(oldStatus === '3') {
            statusArr = [
                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3')},
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4')},
                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5')}
            ]
        }
        if(oldStatus === '5') {
            statusArr = [
                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2')},
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4')},
                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5')}
            ]
        }

        if(oldStatus === '4') {
            statusArr = [
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4')}
            ]
        }

        return statusArr;
    }

    handleTypeChange = (value) => {
        let type = value[0];
        this.validateType(type, true);
    }

    validateType = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value) {
            msg = translate('manage_warehouse.bill_management.validate_type')
        }
        if(willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    type: value,
                    errorType: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleStockChange = (value) => {
        let fromStock = value[0];
        this.validateStock(fromStock, true);
    }

    validateStock = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value) {
            msg = translate('manage_warehouse.bill_management.validate_stock')
        }
        if(willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    fromStock: value,
                    errorStock: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleApproverChange = (value) => {
        let approver = value[0];
        this.validateApprover(approver, true);
    }

    validateApprover = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if(willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    approver: value,
                    errorApprover: msg,
                }
            })
        }
        return msg === undefined;
    }

    handlePartnerChange = (value) => {
        let partner = value[0];
        this.validatePartner(partner, true);
    }

    handleUsersChange = (value) => {
        let users = value;
        this.validateUsers(users, true);
    }

    validateUsers = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if(willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    users: value,
                    errorUsers: msg,
                }
            })
        }
        return msg === undefined;
    }

    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                description: value,
            }
        })
    }

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value[0]
            }
        })
    }

    isFormValidated = () => {
        let result =
            this.validateType(this.state.type, false) &&
            this.validateStock(this.state.fromStock, false) &&
            this.validateApprover(this.state.approver, false) &&
            this.validateUsers(this.state.users, false)
        return result;
    }

    handleLotsChange = (data) => {
        let totalQuantity = data.length > 0 ? data.reduce(function (accumulator, currentValue) {
            return Number(accumulator) + Number(currentValue.realQuantity);
          }, 0) : 0;
        this.state.good.realQuantity = totalQuantity;
        this.state.good.damagedQuantity = Number(this.state.good.realQuantity) - Number(this.state.good.quantity);
        this.state.good.lots = data;
        this.setState(state => {
            return {
                ...state,
                lots: data,
                realQuantity: totalQuantity
            }
        })
    }

    handleQuantityChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                realQuantity: value
            }
        })
    }

    handleAddGood = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            let listGood = [ ...(this.state.listGood), state.good];
            return {
                ...state,
                listGood: listGood,
                lots: [],
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                good: Object.assign({}, this.EMPTY_GOOD),
                lots: []
            }
        })
    }

    handleSaveEditGood = async (e) => {
        e.preventDefault();
        const { indexInfo, listGood } = this.state;
        let newListGood;
        if(listGood){
            newListGood = listGood.map((item, index) => {
                return (index === indexInfo) ? this.state.good : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                editInfo: false,
                listGood: newListGood,
                lots: [],
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleCancelEditGood = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                good: Object.assign({}, this.EMPTY_GOOD),
                lots: []
            }
        })
    }

    handleEditGood = async (good, index) => {
        let lots = good.lots ? good.lots : [];
        this.setState(state => {
            return{
                ...state,
                editInfo: true,
                indexInfo: index,
                good: Object.assign({}, good),
                lots: lots
            }
        })

        const { fromStock } = this.state;

        await this.props.getLotsByGood({ good: good.good._id, stock: fromStock });
    }

    handleDeleteGood = async (index) => {
        let { listGood } = this.state;
        let newListGood;
        if(listGood){
            newListGood = listGood.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                listGood: newListGood
            }
        })
    }

    handleGoodDescriptionChange = (e) => {
        let value = e.target.value;
        this.state.good.description = value;
        this.setState(state => {
            return {
                ...state,
            }
        })
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.billId !== prevState.billId){
            return {
                ...prevState,
                billId: nextProps.billId,
                code: nextProps.code,
                fromStock: nextProps.fromStock,
                status: nextProps.status,
                oldStatus: nextProps.status,
                group: nextProps.group,
                type: nextProps.type,
                users: nextProps.users,
                approver: nextProps.approver,
                description: nextProps.description,
                listGood: nextProps.listGood,
                errorStock: undefined, 
                errorType: undefined, 
                errorApprover: undefined, 
                errorCustomer: undefined,
                errorUsers: undefined

            }
        }
        else {
            return null;
        }
    }

    save = async () => {
        const { billId, fromStock, code, type, status, oldStatus, approver, users, description, listGood } = this.state;
        const { group } = this.props;
        await this.props.editBill(billId, {
            fromStock: fromStock,
            code: code,
            type: type,
            group: group,
            status: status,
            oldStatus: oldStatus,
            users: users,
            approver: approver,
            description: description,
            goods: listGood
        })
    }

    render() {
        const { translate, group } = this.props;
        const { lots, listGood, good, code, approver, status, users, fromStock, type, description, errorStock, errorType, errorApprover, errorUsers, quantity } = this.state;
        const listGoods = this.getAllGoods();
        const dataApprover = this.getApprover();
        const dataStock = this.getStock();
        const dataType = this.getType();
        const dataStatus = this.getStatus();

        return (
            <React.Fragment>
        
                <DialogModal
                    modalID={`modal-edit-bill-take`}
                    formID={`form-edit-bill-take`}
                    title={translate(`manage_warehouse.bill_management.edit_title.${group}`)}
                    msg_success={translate('manage_warehouse.bill_management.add_success')}
                    msg_faile={translate('manage_warehouse.bill_management.add_faile')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={100}
                >
                    <QuantityLotStockTakeEdit group={group} good={good} stock={fromStock} initialData={lots} onDataChange={this.handleLotsChange} />
                    <form id={`form-edit-bill-take`}>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.infor')}</legend>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group`}>
                                            <label>{translate('manage_warehouse.bill_management.code')}</label>
                                            <input type="text" className="form-control" value={code} disabled/>
                                        </div>
                                        <div className={`form-group ${!errorType ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.type')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-type-take-edit`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={type}
                                                items={dataType}
                                                onChange={this.handleTypeChange}    
                                                multiple={false}
                                                disabled={true}
                                            />
                                            <ErrorLabel content = { errorType } />
                                        </div>
                                        <div className={`form-group`}>
                                            <label>{translate('manage_warehouse.bill_management.status')}</label>
                                            <SelectBox
                                                id={`select-status-take-edit`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={status}
                                                items={dataStatus}
                                                onChange={this.handleStatusChange}    
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.stock')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-stock-bill-take-edit`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={fromStock}
                                                items={dataStock}
                                                onChange={this.handleStockChange}    
                                                multiple={false}
                                                disabled={true}
                                            />
                                            <ErrorLabel content = { errorStock } />
                                        </div>
                                        <div className={`form-group ${!errorApprover ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.approved')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-approver-bill-take-edit`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={approver}
                                                items={dataApprover}
                                                onChange={this.handleApproverChange}    
                                                multiple={false}
                                            />
                                            <ErrorLabel content = { errorApprover } />
                                        </div>
                                        <div className={`form-group ${!errorUsers ? "" : "has-error"}`}>
                                            <label>{translate('manage_warehouse.bill_management.users')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-management-location-take-edit-stock`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={users}
                                                items={dataApprover}
                                                onChange={this.handleUsersChange}    
                                                multiple={true}
                                            />
                                            <ErrorLabel content = { errorUsers } />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <label>{translate('manage_warehouse.bill_management.description')}</label>
                                            <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label>{translate('manage_warehouse.bill_management.choose_good')}</label>
                                            <SelectBox
                                                id={`select-good-take-edit`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={good.good ? good.good._id : '1'}
                                                items={listGoods}
                                                onChange={this.handleGoodChange}    
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label>{translate('manage_warehouse.bill_management.real_quantity')}</label>
                                            <div style={{display: "flex"}}><input className="form-control" value={good.realQuantity} onChange={this.handleQuantityChange} type="number" /><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: '5px', marginTop: '9px', cursor:'pointer' }} onClick={() => this.addQuantity()}></i></div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <label>{translate('manage_warehouse.bill_management.note')}</label>
                                            <textarea type="text" className="form-control" value={good.description} onChange={this.handleGoodDescriptionChange} />
                                        </div>
                                    </div>
                                    <div className="pull-right" style={{marginBottom: "10px"}}>
                                        {this.state.editInfo ?
                                            <React.Fragment>
                                                <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                                <button className="btn btn-success" onClick={this.handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                            </React.Fragment>:
                                            <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={this.handleAddGood}>{translate('task_template.add')}</button>
                                        }
                                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>{translate('task_template.delete')}</button>
                                    </div>
                                    <div className={`form-group`}>
                                        {/* Bảng thông tin chi tiết */}
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th style={{width: "5%"}} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.good_code')}>{translate('manage_warehouse.bill_management.good_code')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.real_quantity')}>{translate('manage_warehouse.bill_management.real_quantity')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.difference')}>{translate('manage_warehouse.bill_management.difference')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                                    <th>{translate('task_template.action')}</th>
                                                </tr>
                                            </thead>
                                            <tbody id={`good-bill-create`}>
                                            {
                                                (typeof listGood === 'undefined' || listGood.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                listGood.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.good.code}</td>
                                                        <td>{x.good.name}</td>
                                                        <td>{x.good.baseUnit}</td>
                                                        <td>{x.quantity}</td>
                                                        <td>{x.realQuantity}</td>
                                                        <td>{x.damagedQuantity ? x.damagedQuantity : 0}</td>
                                                        <td>{x.description}</td>
                                                        <td>
                                                            <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditGood(x, index)}><i className="material-icons"></i></a>
                                                            <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteGood(index)}><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                            </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getLotsByGood: LotActions.getLotsByGood,
    editBill: BillActions.editBill
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockTakeEditForm));