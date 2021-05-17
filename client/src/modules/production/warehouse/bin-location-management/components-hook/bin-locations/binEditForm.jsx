import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { BinLocationActions } from '../../redux/actions';
import './binLocation.css';

import { SelectBox, TreeSelect, ErrorLabel } from '../../../../../../common-components';

function BinEditForm(props) {
    const EMPTY_GOOD = {
        good: '',
        capacity: '',
        contained: ''
    }

    const [state, setState] = useState({
        binEnableGoods: [],
        good: Object.assign({}, EMPTY_GOOD),
        editInfo: false,
    })

    useEffect(() => {
        setState({
            ...state,
            binId: props.binId,
            binParent: props.binParent,
            binCode: props.binCode,
            binName: props.binName,
            binStatus: props.binStatus,
            binUnit: props.binUnit,
            binUsers: props.binUsers,
            binPath: props.binPath,
            binContained: props.binContained,
            binCapacity: props.binCapacity,
            binDescription: props.binDescription,
            binDepartment: props.binDepartment,
            binEnableGoods: props.binEnableGoods,
            binStock: props.binStock,
            errorName: undefined,
            errorCode: undefined
        })
    }, [props.binId])

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
        let goodArr = [{ value: '', text: translate('manage_warehouse.good_management.choose_category') }];

        goods.listALLGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.name
            })
        })

        return goodArr;
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
            msg = translate('manage_warehouse.category_management.validate_name');
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

    const handleAddGood = async (e) => {
        e.preventDefault();
        let binEnableGoods = [...(state.binEnableGoods), state.good];
        await setState({
            ...state,
            binEnableGoods: binEnableGoods,
            good: Object.assign({}, EMPTY_GOOD)
        })
    }

    const handleClearGood = () => {
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

    const handleStatusChange = (value) => {
        setState({
            ...state,
            binStatus: value[0]
        })
    }

    const handleDepartmentChange = (value) => {
        setState({
            ...state,
            binDepartment: value[0]
        })
    }

    const handleUnitChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            binUnit: value
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
        console.log(value);
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
            binParent: value[0]
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
            validateName(state.binName, false)

        return result;
    }

    const save = async () => {
        const { binLocations } = props;
        const { binId, binCode, binName, binStatus, binUnit, binUsers, binPath, binContained,
            binParent, binCapacity, binDescription, binDepartment, binEnableGoods, binStock } = state;
        const { list } = binLocations.binLocation;

        let node = "";
        node = list.filter(item => item._id === binId)[0];

        let array = [];
        if (node) {
            array = findChildrenNode(list, node);
        }

        await props.editBinLocation(binId, {
            code: binCode,
            name: binName,
            status: binStatus,
            unit: binUnit,
            users: binUsers,
            parent: binParent,
            capacity: binCapacity,
            description: binDescription,
            department: binDepartment,
            enableGoods: binEnableGoods,
            contained: binContained ? binContained : 0,
            stock: binStock,
            array: array
        });
    }

    findChildrenNode = (list, node) => {
        let array = [];
        let queue_children = [node];
        while (queue_children.length > 0) {
            let tmp = queue_children.shift();
            array = [...array, tmp._id];
            let children = list.filter(child => child.parent === tmp._id);
            queue_children = queue_children.concat(children);
        }
        return array
    }

    const { translate, user, binLocations } = props;
    const { binCode, binName, binStatus, binUnit, binUsers, binParent, binCapacity,
        binDescription, binDepartment, binEnableGoods, errorName, errorCapacity, errorGood, good, binStock } = state;
    const { list } = binLocations.binLocationByStock;
    const dataDepartment = getAllDepartment();
    const dataGoods = getAllGoods();
    const listUsers = list;

    return (
        <div id="edit-bin-location">
            <div className="scroll-row">
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group`}>
                        <label>{translate('manage_warehouse.bin_location_management.code')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" value={binCode} disabled onChange={handleCodeChange} />
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('manage_warehouse.bin_location_management.status')}<span className="attention"> * </span></label>
                        <SelectBox
                            id={`select-status-bin-location`}
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
                    {/* <div className={`form-group`}>
                        <label>{translate('manage_warehouse.bin_location_management.department')}<span className="attention"> * </span></label>
                        <SelectBox
                            id={`select-department-bin`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={binDepartment ? binDepartment : { value: '', text: translate('manage_warehouse.bin_location_management.choose_department')}}
                            items={dataDepartment}
                            onChange={this.handleDepartmentChange}    
                            multiple={false}
                        />
                    </div> */}
                    <div className={`form-group`}>
                        <label>{translate('manage_warehouse.bin_location_management.unit')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" value={binUnit} onChange={handleUnitChange} />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                        <label>{translate('manage_warehouse.bin_location_management.name')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" value={binName} onChange={handleNameChange} />
                        <ErrorLabel content={errorName} />
                    </div>
                    <div className="form-group">
                        <label>{translate('manage_warehouse.bin_location_management.capacity')}<span className="attention"> * </span></label>
                        <input type="number" className="form-control" value={binCapacity ? binCapacity : ""} onChange={handleCapacityTotalChange} />
                    </div>
                    {/* <div className={`form-group`}>
                        <label>{translate('manage_warehouse.bin_location_management.management_location')}<span className="attention"> * </span></label>
                        <SelectBox
                            id={`select-management-location-stock`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={binUsers ? binUsers : []}
                            items={listUsers.map(x => { return { value: x.id, text: x.name } })}
                            onChange={this.handleManagementLocationtChange}    
                            multiple={true}
                        />
                    </div> */}
                    <div className={`form-group`}>
                        <label>{translate('manage_warehouse.bin_location_management.parent')}</label>
                        <TreeSelect data={list} value={binParent ? [binParent] : ""} handleChange={handleParent} mode="radioSelect" />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <label>{translate('manage_warehouse.bin_location_management.description')}</label>
                        <textarea type="text" className="form-control" value={binDescription} onChange={handleDescriptionChange} />
                    </div>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('manage_warehouse.bin_location_management.enable_good')}</legend>

                        <div className={`form-group ${!errorGood ? "" : "has-error"}`}>
                            <label>{translate('manage_warehouse.good_management.good')}</label>
                            <SelectBox
                                id={`select-good-by-bin`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={good.good._id ? good.good._id : { value: '', text: translate('manage_warehouse.good_management.choose_category') }}
                                items={dataGoods}
                                onChange={handleGoodChange}
                                multiple={false}
                            />
                            <ErrorLabel content={errorGood} />
                        </div>
                        <div className={`form-group`}>
                            <label className="control-label">{translate('manage_warehouse.bin_location_management.contained')}</label>
                            <div>
                                <input type="number" className="form-control" value={good.contained} disabled placeholder={translate('manage_warehouse.good_management.contained')} onChange={handleContainedChange} />
                            </div>
                        </div>
                        <div className={`form-group ${!errorCapacity ? "" : "has-error"}`}>
                            <label className="control-label">{translate('manage_warehouse.bin_location_management.max_quantity')}</label>
                            <div>
                                <input type="number" className="form-control" value={good.capacity} placeholder={translate('manage_warehouse.good_management.max_quantity')} onChange={handleCapacityChange} />
                            </div>
                            <ErrorLabel content={errorCapacity} />
                        </div>

                        <div className="pull-right" style={{ marginBottom: "10px" }}>
                            {state.editInfo ?
                                <React.Fragment>
                                    <button className="btn btn-success" onClick={handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                    <button className="btn btn-success" disabled={!isGoodsValidated()} onClick={handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                </React.Fragment> :
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
                                {(typeof binEnableGoods === 'undefined' || binEnableGoods.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
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
            </div>
            <div className="form-group">
                <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} onClick={save}>{translate('form.save')}</button>
                <button className="btn btn-danger" onClick={() => {
                    window.$(`#edit-bin-location`).slideUp()
                }}>{translate('form.close')}</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editBinLocation: BinLocationActions.editBinLocation,
    getBinLocations: BinLocationActions.getBinLocations
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BinEditForm));