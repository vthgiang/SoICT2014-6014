import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

import { DialogModal, ErrorLabel } from '../../../../common-components';

import { materialManagerActions } from '../redux/actions';

import { MaterialFormValidator } from './materialFormValidator';

class MaterialEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    handleMaterialCodeChange = (e) => {
        let value = e.target.value;
        this.validateMaterialCode(value, true);
    }

    validateMaterialCode = (value, willUpdateState = true) => {
        let msg = MaterialFormValidator.validateMaterialCode(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMaterialCode: msg,
                    code: value,
                }
            });
        }
        return msg === undefined;
    }

    handleMaterialNameChange = (e) => {
        let value = e.target.value;
        this.validateMaterialName(value, true);
    }
    
    validateMaterialName = (value, willUpdateState = true) => {
        let msg = MaterialFormValidator.validateMaterialName(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMaterialName: msg,
                    materialName: value,
                }
            });
        }
        return msg === undefined;
    }

    handleMaterialCostChange = (e) => {
        let value = e.target.value;
        this.validateMaterialCost(value, true);
    }

    validateMaterialCost = (value, willUpdateState = true) => {
        let msg = MaterialFormValidator.validateMaterialCost(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMaterialCost: msg,
                    cost: value,
                }
            });
        }
        return msg === undefined;
    }

    handleMaterialSerialChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                serial: value
            }
        });
    }

    handleMaterialDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                description: value
            }
        });
    }

    isFormValidated = () => {
        let result =
            this.validateMaterialName(this.state.materialName, false) &&
            this.validateMaterialCode(this.state.code, false) &&
            this.validateMaterialCost(String(this.state.cost), false);
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            this.props.updateMaterial(this.props.materialId, this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.materialId !== prevState.materialId) {
            return {
                ...prevState,
                materialId: nextProps.materialId,
                code: nextProps.code,
                materialName: nextProps.materialName,
                cost: nextProps.cost,
                description: nextProps.description,
                serial: nextProps.serial,
                errorOnMaterialName: undefined,
                errorOnMaterialCode: undefined,
                errorOnMaterialCost: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, materials } = this.props;
        const { errorOnMaterialName, errorOnMaterialCode, errorOnMaterialCost, code, materialName, cost, description, serial } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-material`} isLoading={materials.isLoading}
                    formID={`form-edit-material`}
                    title={translate('manage_warehouse.material_manager.edit')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={50}
                    maxWidth={500}
                >
                    <form id={`form-edit-material`}>
                        <div className={`form-group ${!errorOnMaterialCode ? "" : "has-error"}`}>
                            <label>{translate('manage_warehouse.material_manager.code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={code} onChange={this.handleMaterialCodeChange} />
                            <ErrorLabel content = {errorOnMaterialCode} />
                        </div>
                        <div className={`form-group ${!errorOnMaterialName ? "" : "has-error"}`}>
                            <label>{translate('manage_warehouse.material_manager.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={materialName} onChange={this.handleMaterialNameChange} />
                            <ErrorLabel content = {errorOnMaterialName} />
                        </div>
                        <div className={`form-group ${!errorOnMaterialCost ? "" : "has-error"}`}>
                            <label>{translate('manage_warehouse.material_manager.cost')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" value={cost} onChange={this.handleMaterialCostChange} />
                            <ErrorLabel content = {errorOnMaterialCost} />
                        </div>
                        <div className="form-group">
                            <label>{translate('manage_warehouse.material_manager.serial')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={serial} onChange={this.handleMaterialSerialChange} />
                        </div>
                        <div className="form-group">
                            <label>{translate('manage_warehouse.material_manager.description')}</label>
                            <input type="text" className="form-control" value={description} onChange={this.handleMaterialDescriptionChange} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { materials } = state;
    return { materials };
}

const action = {
    getMaterial: materialManagerActions.getAll,
    updateMaterial: materialManagerActions.updateMaterial
}


export default connect(mapStateToProps, action)(withTranslate(MaterialEditForm));