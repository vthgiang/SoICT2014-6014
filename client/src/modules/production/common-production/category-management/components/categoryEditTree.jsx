import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { CategoryActions } from '../redux/actions';

function CategoryEditTree(props) {
    const [state, setState] = useState({

    })

    const handleCode = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            categoryCode: value
        })
    }

    const handleName = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            categoryName: value
        })
    }

    const handleDescription = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            categoryDescription: value
        })
    }

    const handleParent = (value) => {
        setState({
            ...state,
            categoryParent: value[0]
        });
    };

    const validateName = async (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            await setState({
                ...state,
                categoryName: value,
                errorName: msg
            })
        }

        return msg === undefined;
    }

    const validateCode = async (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            await setState({
                ...state,
                categoryCode: value,
                errorCode: msg
            })
        }

        return msg === undefined;
    }

    const handleValidateName = (e) => {
        const value = e.target.value.trim();
        validateName(value, true);
    }

    const handleValidateCode = (e) => {
        const value = e.target.value.trim();
        validateCode(value, true);
    }

    const isValidateForm = () => {
        return validateName(state.categoryName, false) &&
            validateCode(state.categoryCode, false);
    }

    const save = () => {
        const { categoryId, categoryName, categoryDescription, categoryParent, categoryCode } = state;
        props.editCategory(categoryId, {
            name: categoryName,
            code: categoryCode,
            description: categoryDescription,
            parent: categoryParent
        });
    }

    useEffect(() => {
        setState({
            ...state,
            categoryId: props.categoryId,
            categoryName: props.categoryName,
            categoryCode: props.categoryCode,
            categoryDescription: props.categoryDescription,
            categoryParent: props.categoryParent,
            errorName: undefined,
            errorCode: undefined
        })
    }, [props.categoryId])

    const { translate, categories } = props;
    const { list } = categories.categoryToTree;
    const { categoryName, categoryDescription, categoryParent, categoryCode, errorName, errorCode } = state;

    return (
        <div id="edit-category-good">
            <div className={`form-group ${errorCode === undefined ? "" : "has-error"}`}>
                <label>{translate('manage_warehouse.category_management.code')}<span className="text-red">*</span></label>
                <input type="text" className="form-control" onChange={handleValidateCode} value={categoryCode} />
                <ErrorLabel content={errorCode} />
            </div>
            <div className={`form-group ${errorName === undefined ? "" : "has-error"}`}>
                <label>{translate('manage_warehouse.category_management.name')}<span className="text-red">*</span></label>
                <input type="text" className="form-control" onChange={handleValidateName} value={categoryName} />
                <ErrorLabel content={errorName} />
            </div>
            <div className="form-group">
                <label>{translate('document.administration.archives.parent')}</label>
                <TreeSelect data={list} value={[categoryParent]} handleChange={handleParent} mode="radioSelect" />
            </div>
            <div className="form-group">
                <label>{translate('manage_warehouse.category_management.description')}</label>
                <textarea style={{ minHeight: '120px' }} type="text" className="form-control" onChange={handleDescription} value={categoryDescription} />
            </div>
            <div className="form-group">
                <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} onClick={save}>{translate('form.save')}</button>
                <button className="btn btn-danger" onClick={() => {
                    window.$(`#edit-category-good`).slideUp()
                }}>{translate('form.close')}</button>
            </div>
        </div>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editCategory: CategoryActions.editCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryEditTree));