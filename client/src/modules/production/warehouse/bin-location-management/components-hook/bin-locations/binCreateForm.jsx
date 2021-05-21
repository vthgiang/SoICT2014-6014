import React, { useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { BinLocationActions } from '../../redux/actions';

import { DialogModal, SelectBox, ErrorLabel, ButtonModal, TreeSelect } from '../../../../../../common-components';

function BinCreateForm(props) {
    const EMPTY_GOOD = {
        good: '',
        capacity: '',
        binContained: 0,
        binStatus: '1'
    }

    const [state, setState] = useState({
        binDepartment: '',
        binStatus: '1',
        binUsers: [],
        binParentCreate: '',
        binStock: '',
        binEnableGoods: [],
        good: Object.assign({}, EMPTY_GOOD),
        editInfo: false
    })

    const getAllDepartment = () => {
        let { translate, department } = props;
        let manageDepartmentArr = [{ value: '', text: translate('manage_warehouse.bin_location_management.choose_department') }];

        department.list.map(item => {
            manageDepartmentArr.push({
                value: item._id,
                text: item.name
            })
        })

        return manageDepartmentArr;
    }

    const getAllGoods = () => {
        let { translate, goods } = props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.bin_location_management.choose_good') }];

        goods.listALLGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.name
            })
        })

        return goodArr;
    }

    const getAllStocks = () => {
        let { translate, stocks } = props;
        let stockArr = [{ value: '', text: translate('manage_warehouse.bin_location_management.choose_stock') }];

        if (stocks.listStocks.length) {
            stocks.listStocks.map(item => {
                stockArr.push({
                    value: item._id,
                    text: item.name
                })
            })
        }

        return stockArr;
    }

    const handleGoodChange = (value) => {
        let good = value[0];
        validateGood(good, true);
    }

    const validateGood = (value, willUpdateState = true) => {
        const dataGood = getAllGoods();

        let msg = undefined;
        const { translate } = props;
        let { good } = state;
        if (!value) {
            msg = translate('manage_warehouse.bin_location_management.validate_good');
        }
        if (willUpdateState) {
            let goodName = dataGood.find(x => x.value === value);
            good.good = { _id: value, name: goodName.text };
            setState({
                ...state,
                good: { ...good },
                errorGood: msg
            });
        }
        return msg === undefined;
    }

    const handleContainedChange = (e) => {
        let value = e.target.value;
        state.good.contained = value;
        setState({
            ...state
        })
    }

    const handleCapacityChange = (e) => {
        let value = e.target.value;
        validateCapacity(value, true);
    }

    const validateCapacity = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;

        if (!value) {
            msg = translate('manage_warehouse.bin_location_management.validate_capacity');
        }

        if (willUpdateState) {
            state.good.capacity = value;
            setState({
                ...state,
                errorCapacity: msg
            })
        }
        return msg = undefined;
    }

    const isGoodsValidated = () => {
        let result =
            validateGood(state.good.good, false)
        return result;
    }

    handleAddGood = async (e) => {
        e.preventDefault();
        let binEnableGoods = [...(state.binEnableGoods), state.good];
        await setState({
            ...state,
            binEnableGoods: binEnableGoods,
            good: Object.assign({}, EMPTY_GOOD)
        })
    }

    const handleClearGood = (e) => {
        e.preventDefault()
        setState({
            ...state,
            good: Object.assign({}, EMPTY_GOOD)
        })
    }

    const handleEditGood = (good, index) => {
        setState({
            ...state,
            editInfo: true,
            indexInfo: index,
            good: Object.assign({}, good)
        })
    }

    const handleSaveEditGood = async (e) => {
        e.preventDefault();
        const { indexInfo, binEnableGoods } = state;
        let newEnableGoods;
        if (binEnableGoods) {
            newEnableGoods = binEnableGoods.map((item, index) => {
                return (index === indexInfo) ? state.good : item
            })
        }

        await setState({
            ...state,
            editInfo: false,
            binEnableGoods: newEnableGoods,
            good: Object.assign({}, EMPTY_GOOD)
        })
    }

    const handleCancelEditGood = (e) => {
        e.preventDefault();
        setState({
            ...state,
            editInfo: false,
            good: Object.assign({}, EMPTY_GOOD)
        })
    }

    const handleDeleteGood = async (index) => {
        let { binEnableGoods } = state;
        let newEnableGoods;
        if (binEnableGoods) {
            newEnableGoods = binEnableGoods.filter((item, x) => index !== x)
        }

        setState({
            ...state,
            binEnableGoods: newEnableGoods
        })
    }

    const handleCodeChange = (e) => {
        let value = e.target.value;
        validateCode(value, true);
    }

    const validateCode = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_code');
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorCode: msg,
                binCode: value
            });
        }
        return msg === undefined;
    }

    const handleStatusChange = (value) => {
        setState({
            ...state,
            binStatus: value[0]
        })
    }

    const handleDepartmentChange = (value) => {
        let department = value[0];
        validateDepartment(department, true);
    }

    const validateDepartment = (department, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!department) {
            msg = translate('manage_warehouse.bin_location_management.validate_department');
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorDepartment: msg,
                binDepartment: department
            });
        }
        return msg === undefined;
    }

    const handleUnitChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            binUnit: value
        })
    }

    const handleStockChange = (value) => {
        let stock = value[0];
        validateStock(stock, true)
    }

    const validateStock = async (stock, willUpdateState = true) => {

        let msg = undefined;
        const { translate } = props;
        if (!stock) {
            msg = translate('manage_warehouse.bin_location_management.validate_stock');
        }
        if (willUpdateState) {
            await setState({
                ...state,
                errorStock: msg,
                binStock: stock
            });
        }
        await props.getBinLocations({ stock });
        return msg === undefined;
    }

    const handleContainedTotalChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            binContained: value
        })
    }

    const handleNameChange = (e) => {
        let value = e.target.value;
        validateName(value, true);
    }

    const validateName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            setState({
                ...state,
                errorName: msg,
                binName: value
            });
        }
        return msg === undefined;
    }

    const handleCapacityTotalChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            binCapacity: value
        })
    }

    const handleManagementLocationtChange = (value) => {
        setState({
            ...state,
            binUsers: value
        })
    }

    const handleParent = (value) => {
        setState({
            ...state,
            binParentCreate: value[0]
        })
    }

    const handleDescriptionChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            binDescription: value
        })
    }

    const isValidated = () => {
        let result =
            validateCode(state.binCode, false) &&
            validateName(state.binName, false) &&
            validateDepartment(state.binDepartment, false);

        return result;
    }

    const save = async () => {
        const { binCode, binName, binStatus, binUnit, binUsers, binPath, binContained,
            binParentCreate, binCapacity, binDescription, binDepartment, binEnableGoods, binStock } = state;
        await props.createBinLocation({
            code: binCode,
            name: binName,
            status: binStatus,
            unit: binUnit,
            users: binUsers,
            parent: binParentCreate,
            capacity: binCapacity,
            description: binDescription,
            department: binDepartment,
            enableGoods: binEnableGoods,
            contained: binContained,
            stock: binStock
        });
        window.$(`#edit-bin-location`).slideUp();
        await props.getBinLocations();
    }

    const { translate, binLocations, user, stocks } = props;
        const { list } = binLocations.binLocationByStock;
        const { binParentCreate, binStock, binContained, binStatus, binUsers, binDepartment, good, binEnableGoods, errorCapacity, errorCode, errorName, errorGood, errorStock, errorDepartment} = state;
        const dataDepartment = getAllDepartment();
        const dataGoods = getAllGoods();
        const dataStocks = getAllStocks();
        const listUsers = user.list;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-create-bin-location`}
                    formID={`form-create-bin-location`}
                    title={translate('manage_warehouse.bin_location_management.add_title')}
                    msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                    msg_faile={translate('manage_warehouse.bin_location_management.add_faile')}
                    size={75}
                    disableSubmit={!isValidated()}
                    func={save}
                >
                    <form id={`form-create-bin-location`} >
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorCode ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bin_location_management.code')}<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={handleCodeChange}/>
                                <ErrorLabel content = { errorCode }/>
                            </div>
                            <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bin_location_management.stock')}<span className="attention"> * </span></label>
                                <SelectBox
                                    id={`select-stock-bin-location-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={binStock ? binStock : { value: '', text: translate('manage_warehouse.good_management.choose_category') }}
                                    items={dataStocks}
                                    onChange={handleStockChange}    
                                    multiple={false}
                                />
                                <ErrorLabel content = { errorStock }/>
                            </div>
                            <div className={`form-group`}>
                                <label>{translate('manage_warehouse.bin_location_management.status')}<span className="attention"> * </span></label>
                                <SelectBox
                                    id={`select-status-bin-location-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={binStatus}
                                    items={[
                                        { value: '1', text: translate('manage_warehouse.bin_location_management.1.status') },
                                        { value: '2', text: translate('manage_warehouse.bin_location_management.2.status') },
                                        { value: '3', text: translate('manage_warehouse.bin_location_management.3.status') },
                                        { value: '4', text: translate('manage_warehouse.bin_location_management.4.status') },
                                        { value: '5', text: translate('manage_warehouse.bin_location_management.5.status') },
                                    ]}
                                    onChange={handleStatusChange}    
                                    multiple={false}
                                />
                            </div>
                            {/* <div className={`form-group ${!errorDepartment ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bin_location_management.department')}<span className="attention"> * </span></label>
                                <SelectBox
                                    id={`select-department-bin-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={binDepartment}
                                    items={dataDepartment}
                                    onChange={this.handleDepartmentChange}    
                                    multiple={false}
                                />
                                <ErrorLabel content = { errorDepartment }/>
                            </div> */}
                            <div className={`form-group`}>
                                <label>{translate('manage_warehouse.bin_location_management.unit')}<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={handleUnitChange} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bin_location_management.name')}<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={handleNameChange} />
                                <ErrorLabel content = { errorName }/>
                            </div>
                            <div className="form-group">
                                <label>{translate('manage_warehouse.bin_location_management.capacity')}</label>
                                <input type="number" className="form-control" onChange={handleCapacityTotalChange} />
                            </div>
                            <div className="form-group">
                                <label>{translate('manage_warehouse.bin_location_management.contained')}</label>
                                <input type="number" className="form-control" disabled value= {binContained} onChange={handleContainedTotalChange} />
                            </div>
                            {/* <div className={`form-group`}>
                                <label>{translate('manage_warehouse.bin_location_management.management_location')}<span className="attention"> * </span></label>
                                <SelectBox
                                    id={`select-management-location-stock-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={binUsers}
                                    items={listUsers.map(x => { return { value: x.id, text: x.name } })}
                                    onChange={this.handleManagementLocationtChange}    
                                    multiple={true}
                                />
                            </div> */}
                            <div className={`form-group`}>
                                <label>{translate('manage_warehouse.bin_location_management.parent')}</label>
                                <TreeSelect data={list} value={[binParentCreate]} handleChange={handleParent} mode="radioSelect" />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <label>{translate('manage_warehouse.bin_location_management.description')}</label>
                                <textarea type="text" className="form-control" onChange={handleDescriptionChange} />
                            </div>
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bin_location_management.enable_good')}</legend>
                                
                                <div className={`form-group ${!errorGood ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.good_management.good')}</label>
                                    <SelectBox
                                        id={`select-good-by-bin-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={good.good ? good.good._id : { value: '', text: translate('manage_warehouse.bin_location_management.choose_good') }}
                                        items={dataGoods}
                                        onChange={handleGoodChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content = { errorGood }/>
                                </div>
                                <div className={`form-group`}>
                                    <label className="control-label">{translate('manage_warehouse.bin_location_management.contained')}</label>
                                    <div>
                                        <input type="number" className="form-control" value={good.contained} placeholder={translate('manage_warehouse.good_management.contained')} disabled onChange={handleContainedChange} />
                                    </div>
                                </div>
                                <div className={`form-group ${!errorCapacity ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('manage_warehouse.bin_location_management.max_quantity')}</label>
                                    <div>
                                        <input type="number" className="form-control" value={good.capacity} placeholder={translate('manage_warehouse.good_management.max_quantity')} onChange={handleCapacityChange} />
                                    </div>
                                    <ErrorLabel content = { errorCapacity }/>
                                </div>

                                <div className="pull-right" style={{marginBottom: "10px"}}>
                                    {state.editInfo ?
                                        <React.Fragment>
                                            <button className="btn btn-success" onClick={handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                            <button className="btn btn-success" disabled={!isGoodsValidated()} onClick={handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                        </React.Fragment>:
                                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isGoodsValidated()} onClick={handleAddGood}>{translate('task_template.add')}</button>
                                    }
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearGood}>{translate('task_template.delete')}</button>
                                </div>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th title={translate('manage_warehouse.bin_location_management.good')}>{translate('manage_warehouse.bin_location_management.good')}</th>
                                            <th title={translate('manage_warehouse.bin_location_management.contained')}>{translate('manage_warehouse.bin_location_management.contained')}</th>
                                            <th title={translate('manage_warehouse.bin_location_management.max_quantity')}>{translate('manage_warehouse.bin_location_management.max_quantity')}</th>
                                            <th>{translate('task_template.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody id={`good-manage-by-stock`}>
                                        { (typeof binEnableGoods === 'undefined' || binEnableGoods.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            binEnableGoods.map((x, index) => 
                                                <tr key={index}>
                                                    <td>{x.good.name}</td>
                                                    <td>{x.contained}</td>
                                                    <td>{x.capacity}</td>
                                                    <td>
                                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditGood(x, index)}><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteGood(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            )   
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createBinLocation: BinLocationActions.createBinLocation,
    getBinLocations: BinLocationActions.getBinLocations,
    edit: BinLocationActions.editBinLocation
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BinCreateForm));