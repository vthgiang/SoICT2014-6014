import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../common-components';
import { StockActions } from '../redux/actions';
import { translate } from 'react-redux-multilingual/lib/utils';
import { generateCode } from '../../../../../helpers/generateCode';

class StockCreateForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            good: '',
            maxQuantity: '',
            minQuantity: ''
        }
        this.EMPTY_ROLE = {
            role: '',
            managementGood: []
        }
        this.state = {
            code: generateCode("ST"),
            name: '',
            status: '1',
            address: '',
            goods: [],
            good: Object.assign({}, this.EMPTY_GOOD),
            managementLocation: [],
            role: Object.assign({}, this.MANAGEMENT_ROLE),
            description: '',
            editInfo: false,
            editInfoRole: false,

        }
    }

    handleNameChange = (e) => {
        let value = e.target.value;
        this.validateName(value, true);
    }

    validateName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    handleAddressChange = (e) => {
        let value = e.target.value;
        this.validateAddress(value, true);
    }

    validateAddress = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnAddress: msg,
                    address: value,
                }
            });
        }
        return msg === undefined;
    }

    handleDepartmentChange = (value) => {
        let manageDepartment = value[0];
        this.validateDepartment(manageDepartment, true);
    }

    validateDepartment = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDepartment: msg,
                    manageDepartment: value,
                }
            });
        }
        return msg === undefined;
    }

    handleManagementLocationtChange = (value) => {
        this.validateManagementLocation(value, true);
    }

    validateManagementLocation = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnManagementLocation: msg,
                    managementLocation: value,
                }
            });
        }
        return msg === undefined;
    }

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value[0]
            }
        })
    }

    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                description: value
            }
        });
    }

    handleGoodsChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                goods: value
            }
        })
    }

    isFormValidated = () => {
        let result =
            this.validateName(this.state.name, false) &&
            this.validateAddress(this.state.address, false)
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            this.props.createStock(this.state);
        }
    }

    getAllDepartment = () => {
        let { translate } = this.props;
        let manageDepartmentArr = [{ value: '', text: translate('manage_warehouse.stock_management.choose_department') }];

        this.props.department.list.map(item => {
            manageDepartmentArr.push({
                value: item._id,
                text: item.name
            })
        })

        return manageDepartmentArr;
    }

    handleMinQuantityChange = (e) => {
        let value = e.target.value;
        this.state.good.minQuantity = value;
        this.setState(state => {
            return {
                ...state
            }
        })
    }

    handleMaxQuantityChange = (e) => {
        let value = e.target.value;
        this.state.good.maxQuantity = value;
        this.setState(state => {
            return {
                ...state
            }
        })
    }

    getAllGoods = () => {
        const { translate } = this.props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.stock_management.choose_good') }];

        this.props.goods.listALLGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.name
            })
        })

        return goodArr;
    }

    getAllRoles = () => {
        const { translate, role } = this.props;
        let roleArr = [{ value: '', text: translate('manage_warehouse.stock_management.choose_role') }];

        role.list.map(item => {
            roleArr.push({
                value: item._id,
                text: item.name
            });
        })

        return roleArr;
    }

    handleGoodChange = (value) => {
        let good = value[0];
        this.validateGood(good, true);
    }

    validateGood = async (value, willUpdateState = true) => {
        const dataGood = await this.getAllGoods();

        let msg = undefined;
        const { translate } = this.props;
        let { good } = this.state;
        if (!value) {
            msg = translate('manage_warehouse.stock_management.validate_good');
        }
        if (willUpdateState) {
            let goodName = dataGood.find(x => x.value === value);
            good.good = { _id: value, name: goodName.text };
            this.setState(state => {
                return {
                    ...state,
                    good: { ...good },
                    errorOnGood: msg
                }
            });
        }
        return msg === undefined;
    }

    handleRoleChange = (value) => {
        let role = value[0];
        this.validateRole(role, true);
    }

    validateRole = async (value, willUpdateState = true) => {
        const dataRoles = await this.getAllRoles();

        let msg = undefined;
        const { translate } = this.props;
        let { role } = this.state;
        if (!value) {
            msg = translate('manage_warehouse.stock_management.validate_good');
        }
        if (willUpdateState) {
            let roleName = dataRoles.find(x => x.value === value);
            role.role = { _id: value, name: roleName.text };
            this.setState(state => {
                return {
                    ...state,
                    role: { ...role },
                    errorOnRole: msg
                }
            });
        }
        return msg === undefined;
    }

    handleManagementGoodChange = (value) => {
        let managementGood = value;
        this.validateManagementRole(managementGood, true);
    }

    validateManagementRole = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        const { role } = this.state;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            role.managementGood = value;
            this.setState(state => {
                return {
                    ...state,
                    errorOnManagementGood: msg,
                    role: { ...role }
                }
            });
        }
        return msg === undefined;
    }

    isGoodsValidated = () => {
        let result =
            this.validateGood(this.state.good.good, false)
        return result;
    }

    isRolesValidated = () => {
        let result =
            this.validateManagementRole(this.state.role.managementGood, false) &&
            this.validateRole(this.state.role.role, false)
        return result;
    }

    handleAddGood = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            let goods = [...(this.state.goods), state.good];
            return {
                ...state,
                goods: goods,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleDeleteGood = async (index) => {
        let { goods } = this.state;
        let newGoods;
        if (goods) {
            newGoods = goods.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                goods: newGoods
            }
        })
    }

    handleEditGood = async (good, index) => {
        this.setState(state => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                good: Object.assign({}, good)
            }
        })
    }

    handleSaveEditGood = async (e) => {
        e.preventDefault();
        const { indexInfo, goods } = this.state;
        let newGoods;
        if (goods) {
            newGoods = goods.map((item, index) => {
                return (index === indexInfo) ? this.state.good : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                editInfo: false,
                goods: newGoods,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleCancelEditGood = async (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleClickCreate = () => {
        const value = generateCode("ST");
        this.setState({
            code: value
        });
    }

    handleAddRole = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            let managementLocation = [...(this.state.managementLocation), state.role];
            return {
                ...state,
                managementLocation: managementLocation,
                role: Object.assign({}, this.EMPTY_ROLE)
            }
        })
    }

    handleDeleteRole = async (index) => {
        let { managementLocation } = this.state;
        let newManagementLocation;
        if (managementLocation) {
            newManagementLocation = managementLocation.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                managementLocation: newManagementLocation
            }
        })
    }

    handleEditRole = async (role, index) => {
        this.setState(state => {
            return {
                ...state,
                editInfoRole: true,
                indexInfoRole: index,
                role: Object.assign({}, role)
            }
        })
    }

    handleSaveEditRole = async (e) => {
        e.preventDefault();
        const { indexInfoRole, managementLocation } = this.state;
        let newManagementLocation;
        if (managementLocation) {
            newManagementLocation = managementLocation.map((item, index) => {
                return (index === indexInfoRole) ? this.state.role : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                editInfoRole: false,
                managementLocation: newManagementLocation,
                role: Object.assign({}, this.EMPTY_ROLE)
            }
        })
    }

    handleCancelEditRole = async (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfoRole: false,
                role: Object.assign({}, this.EMPTY_ROLE)
            }
        })
    }

    handleClearRole = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                role: Object.assign({}, this.EMPTY_ROLE)
            }
        })
    }

    checkHasComponent = (name) => {
        var { auth } = this.props;
        var result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });
        return result;
    }

    render() {
        const { translate, stocks } = this.props;
        const { errorOnName, errorOnAddress, errorOnDepartment, errorOnManagementLocation, errorOnGood, errorOnMinQuantity, errorOnMaxQuantity, code, name,
            managementLocation, status, address, description, manageDepartment, goods, good, errorOnRole, errorOnManagementGood, role } = this.state;
        const departmentManagement = this.getAllDepartment();
        const listGoods = this.getAllGoods();
        const listRoles = this.getAllRoles();
        console.log('state', this.state)

        return (
            <React.Fragment>
                {this.checkHasComponent('create-stock-button') &&
                    <ButtonModal onButtonCallBack={this.handleClickCreate} modalID={`modal-create-stock`} button_name={translate('manage_warehouse.stock_management.add')} title={translate('manage_warehouse.stock_management.add_title')} />
                }
                <DialogModal
                    modalID={`modal-create-stock`} isLoading={stocks.isLoading}
                    formID={`form-create-stock`}
                    title={translate('manage_warehouse.stock_management.add_title')}
                    msg_success={translate('manage_warehouse.stock_management.add_success')}
                    msg_faile={translate('manage_warehouse.stock_management.add_faile')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={75}
                >
                    <form id={`form-create-stock`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.stock_management.code')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={code} disabled />
                                </div>
                                <div className={`form-group ${!errorOnAddress ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.stock_management.address')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={address} onChange={this.handleAddressChange} />
                                    <ErrorLabel content={errorOnAddress} />
                                </div>
                                {/* <div className={`form-group ${!errorOnDepartment ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.stock_management.department')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-status-of-stock`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={manageDepartment}
                                        items={departmentManagement}
                                        onChange={this.handleDepartmentChange}    
                                        multiple={false}
                                    />
                                    <ErrorLabel content = { errorOnDepartment } />
                                </div> */}
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorOnName ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.stock_management.name')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={name} onChange={this.handleNameChange} />
                                    <ErrorLabel content={errorOnName} />
                                </div>
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.stock_management.status')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-status-stock`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        items={[
                                            { value: '1', text: translate('manage_warehouse.stock_management.1.status') },
                                            { value: '2', text: translate('manage_warehouse.stock_management.2.status') },
                                            { value: '3', text: translate('manage_warehouse.stock_management.3.status') },
                                            { value: '4', text: translate('manage_warehouse.stock_management.4.status') },
                                        ]}
                                        onChange={this.handleStatusChange}
                                        multiple={false}
                                    />
                                </div>
                                {/* <div className={`form-group ${!errorOnManagementLocation ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.stock_management.management_location')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-management-location-stock`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={managementLocation}
                                        items={this.props.role.list.map((y, index) => { return { value: y._id, text: y.name}})}
                                        onChange={this.handleManagementLocationtChange}    
                                        multiple={true}
                                    />
                                    <ErrorLabel content = { errorOnManagementLocation } />
                                </div> */}
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.stock_management.description')}</label>
                                    <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.stock_management.management_location')}</legend>

                                    <div className={`form-group ${!errorOnRole ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.stock_management.role')}</label>
                                        <SelectBox
                                            id={`select-role-by-stock-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={role.role ? role.role._id : { value: '', text: translate('manage_warehouse.stock_management.choose_role') }}
                                            items={listRoles}
                                            onChange={this.handleRoleChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={errorOnRole} />
                                    </div>
                                    <div className={`form-group ${!errorOnManagementGood ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.stock_management.management_good')}<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-management-good-stock-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={role.managementGood ? role.managementGood : ''}
                                            items={[
                                                { value: 'product', text: translate('manage_warehouse.stock_management.product') },
                                                { value: 'material', text: translate('manage_warehouse.stock_management.material') },
                                                { value: 'equipment', text: translate('manage_warehouse.stock_management.equipment') },
                                                { value: 'waste', text: translate('manage_warehouse.stock_management.waste') },
                                            ]}
                                            onChange={this.handleManagementGoodChange}
                                            multiple={true}
                                        />
                                        <ErrorLabel content={errorOnManagementGood} />
                                    </div>

                                    <div className="pull-right" style={{ marginBottom: "10px" }}>
                                        {this.state.editInfoRole ?
                                            <React.Fragment>
                                                <button className="btn btn-success" onClick={this.handleCancelEditRole} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                                <button className="btn btn-success" disabled={!this.isRolesValidated()} onClick={this.handleSaveEditRole} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                            </React.Fragment> :
                                            <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isRolesValidated()} onClick={this.handleAddRole}>{translate('task_template.add')}</button>
                                        }
                                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearRole}>{translate('task_template.delete')}</button>
                                    </div>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('manage_warehouse.stock_management.index')}>{translate('manage_warehouse.stock_management.index')}</th>
                                                <th title={translate('manage_warehouse.stock_management.role')}>{translate('manage_warehouse.stock_management.role')}</th>
                                                <th title={translate('manage_warehouse.stock_management.management_good')}>{translate('manage_warehouse.stock_management.management_good')}</th>
                                                <th>{translate('task_template.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-manage-location-by-stock`}>
                                            {
                                                (typeof managementLocation === 'undefined' || managementLocation.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                    managementLocation.map((x, index) =>
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.role.name}</td>
                                                            <td>{x.managementGood ? x.managementGood.map((item, key) => { return <p key={key}>{translate(`manage_warehouse.stock_management.${item}`)}</p> }) : ''}</td>
                                                            <td>
                                                                <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditRole(x, index)}><i className="material-icons"></i></a>
                                                                <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteRole(index)}><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.stock_management.goods')}</legend>

                                    <div className={`form-group ${!errorOnGood ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.good_management.good')}</label>
                                        <SelectBox
                                            id={`select-good-by-stock-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={good.good ? good.good._id : { value: '', text: translate('manage_warehouse.stock_management.choose_good') }}
                                            items={listGoods}
                                            onChange={this.handleGoodChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={errorOnGood} />
                                    </div>

                                    <div className={`form-group ${!errorOnMinQuantity ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('manage_warehouse.stock_management.min_quantity')}</label>
                                        <div>
                                            <input type="number" className="form-control" placeholder={translate('manage_warehouse.stock_management.min_quantity')} value={good.minQuantity} onChange={this.handleMinQuantityChange} />
                                        </div>
                                        <ErrorLabel content={errorOnMinQuantity} />
                                    </div>
                                    <div className={`form-group ${!errorOnMaxQuantity ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('manage_warehouse.stock_management.max_quantity')}</label>
                                        <div>
                                            <input type="number" className="form-control" placeholder={translate('manage_warehouse.stock_management.max_quantity')} value={good.maxQuantity} onChange={this.handleMaxQuantityChange} />
                                        </div>
                                        <ErrorLabel content={errorOnMaxQuantity} />
                                    </div>

                                    <div className="pull-right" style={{ marginBottom: "10px" }}>
                                        {this.state.editInfo ?
                                            <React.Fragment>
                                                <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                                <button className="btn btn-success" disabled={!this.isGoodsValidated()} onClick={this.handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                            </React.Fragment> :
                                            <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isGoodsValidated()} onClick={this.handleAddGood}>{translate('task_template.add')}</button>
                                        }
                                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>{translate('task_template.delete')}</button>
                                    </div>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('manage_warehouse.stock_management.good')}>{translate('manage_warehouse.stock_management.good')}</th>
                                                <th title={translate('manage_warehouse.stock_management.min_quantity')}>{translate('manage_warehouse.stock_management.min_quantity')}</th>
                                                <th title={translate('manage_warehouse.stock_management.max_quantity')}>{translate('manage_warehouse.stock_management.max_quantity')}</th>
                                                <th>{translate('task_template.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-manage-by-stock`}>
                                            {
                                                (typeof goods === 'undefined' || goods.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                    goods.map((x, index) =>
                                                        <tr key={index}>
                                                            <td>{x.good.name}</td>
                                                            <td>{x.minQuantity}</td>
                                                            <td>{x.maxQuantity}</td>
                                                            <td>
                                                                <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditGood(x, index)}><i className="material-icons"></i></a>
                                                                <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteGood(index)}><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}
function mapStateToProps(state) {
    const { stocks, department, role, goods, auth } = state;
    return { stocks, department, role, goods, auth };
}

const mapDispatchToProps = {
    createStock: StockActions.createStock,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockCreateForm));