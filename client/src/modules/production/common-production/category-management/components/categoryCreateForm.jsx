import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { CategoryActions } from '../redux/actions';
function CategoryCreateForm(props) {
    const [state, setState] = useState({
        code: "",
        name: "",
        description: "",
        type: "product",
    })

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
                errorOnCode: msg,
                code: value,
            });
        }
        return msg === undefined;
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
                errorOnName: msg,
                name: value,
            });
        }
        return msg === undefined;
    }

    const handleTypeChange = (value) => {
        setState({
            ...state,
            type: value[0]
        });
    }

    const handleDescriptionChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            description: value
        });
    }

    const isFormValidated = () => {
        let result =
            validateName(state.name, false) &&
            validateCode(state.code, false)
        return result;
    }

    const save = () => {
        if (isFormValidated()) {
            props.createCategory(state);
        }
    }

    const { translate, categories } = props;
    const { errorOnName, errorOnCode, id, code, name, type, description } = state;
    return (
        <React.Fragment>
            <ButtonModal modalID="modal-create-category" button_name={translate('manage_warehouse.category_management.add')} title={translate('manage_warehouse.category_management.add_title')} />

            <DialogModal
                modalID="modal-create-category" isLoading={categories.isLoading}
                formID="form-create-category"
                title={translate('manage_warehouse.category_management.add_title')}
                msg_success={translate('manage_warehouse.category_management.add_success')}
                msg_faile={translate('manage_warehouse.category_management.add_faile')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-create-category">
                    <div className={`form-group ${!errorOnCode ? "" : "has-error"}`}>
                        <label>{translate('manage_warehouse.category_management.code')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={code} onChange={handleCodeChange} />
                        <ErrorLabel content={errorOnCode} />
                    </div>
                    <div className={`form-group ${!errorOnName ? "" : "has-error"}`}>
                        <label>{translate('manage_warehouse.category_management.name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={name} onChange={handleNameChange} />
                        <ErrorLabel content={errorOnName} />
                    </div>
                    <div className="form-group">
                        <label>{translate('manage_warehouse.category_management.type')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`type${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={type}
                            items={[{ value: "product", text: translate('manage_warehouse.category_management.product') },
                            { value: "material", text: translate('manage_warehouse.category_management.material') },
                            { value: "equipment", text: translate('manage_warehouse.category_management.equipment') },
                            { value: "waste", text: translate('manage_warehouse.category_management.waste') }
                            ]}
                            onChange={handleTypeChange}
                            multiple={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('manage_warehouse.category_management.description')}</label>
                        <textarea type="text" className="form-control" value={description} onChange={handleDescriptionChange} />
                        <ErrorLabel />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { categories } = state;
    return { categories };
}

const mapDispatchToProps = {
    createCategory: CategoryActions.createCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryCreateForm));