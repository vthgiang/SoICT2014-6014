import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel } from '../../../../common-components';

import { MaterialFormValidator } from './materialFormValidator';
import { materialManagerActions } from '../redux/actions';
class MaterialCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            materialName: "",
            description: "",
            serial: "",
            cost: "",
        }
    }
    componentDidMount() {
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
        let msg = MaterialFormValidator.validateMaterialName(value)
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
            this.validateMaterialCost(this.state.cost, false);
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            this.props.createMaterial(this.state);
        }
    }

    render() {
        const { translate, materials } = this.props;
        const { errorOnMaterialName, errorOnMaterialCode, errorOnMaterialCost,code,materialName, cost, description, serial } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-material" button_name={translate('manage_warehouse.material_manager.add')} title={translate('manage_warehouse.material_manager.add_title')} />

                <DialogModal
                    modalID="modal-create-material" isLoading={materials.isLoading}
                    formID="form-create-material"
                    title={translate('manage_warehouse.material_manager.add_title')}
                    msg_success={translate('manage_warehouse.material_manager.add_success')}
                    msg_faile={translate('manage_warehouse.material_manager.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-material" onSubmit={() => this.save(translate('manage_warehouse.material_manager.add_success'))}>
                        <div className={`form-group ${!errorOnMaterialCode ? "" : "has-error"}`}>
                            <label>{translate('manage_warehouse.material_manager.code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={code} onChange={this.handleMaterialCodeChange} />
                            <ErrorLabel content = {errorOnMaterialCode}/>
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
                            <ErrorLabel/>
                        </div>
                        <div className="form-group">
                            <label>{translate('manage_warehouse.material_manager.description')}</label>
                            <textarea type="text" className="form-control" value={description} onChange={this.handleMaterialDescriptionChange} />
                            <ErrorLabel/>
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

const mapDispatchToProps = {
    createMaterial: materialManagerActions.createMaterial,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MaterialCreateForm));