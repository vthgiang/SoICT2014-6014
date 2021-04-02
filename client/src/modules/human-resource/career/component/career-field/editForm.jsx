import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ErrorLabel, TreeSelect } from '../../../../../common-components';
import { CareerReduxAction } from '../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';

function EditForm(props) {
    const [state, setState] = useState({
        name: '',
        code: ''
    });

    useEffect(() => {
        setState({
            ...state,
            oldData: {
                careerId: props.careerId,
                name: props.careerName,
                package: props.careerPackage,
                code: props.careerCode,
                parent: props.careerParent,
                actionLabel: !props.actionLabel ? '' : props.actionLabel,
                isLabel: !props.isLabel ? '' : props.isLabel,
                nameError: '',
                codeError: ''
            },
            careerId: props.careerId,
            name: props.careerName,
            package: props.careerPackage,
            code: props.careerCode,
            parent: props.careerParent,
            showParent: props.careerParent.length === 0 ? false : true,
            actionLabel: !props.actionLabel ? '' : props.actionLabel,
            isLabel: !props.isLabel ? '' : props.isLabel,
            nameError: '',
            codeError: ''
        })
    }, [props.careerId])

    const handleName = (e) => {
        let { value } = e.target;
        const { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        setState({
            ...state,
            name: value,
            nameError: !message ? '' : message
        });
    }

    const handleCode = (e) => {
        let { value } = e.target;
        const { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        setState({
            ...state,
            code: value,
            codeError: !message ? '' : message,
        });
    }

    const handleParent = (value) => {
        setState({
            ...state,
            parent: value[0]
        });
    };

    const validateFieldName = (name) => {
        let { translate } = props;
        if (
            !ValidationHelper.validateName(translate, name, 1, 255).status
        ) return false;
        return true;
    }

    const validateFieldCode = (code) => {
        if (!code) return false;
        return true;
    }

    const isValidateForm = () => {
        let { name, showParent, parent, code } = state;
        if (
            !(validateFieldCode(code) && validateFieldName(name))
        ) return false;
        if (showParent && !parent) return false;
        return true;
    }

    const findNode = (element, id) => {
        if (element.id === id) {
            return element
        }
        else if (element.children) {
            let i;
            let result = "";
            for (i = 0; i < element.children.length; i++) {
                result = findNode(element.children[i], id);
            }
            return result;
        }
        return null;
    }
    // tìm các node con cháu
    const findChildrenNode = (list, node) => {
        let array = [];
        let queue_children = [node];
        while (queue_children.length > 0) {
            let tmp = queue_children.shift();
            array = [...array, tmp._id];
            let children = list.filter(child => child.parent === tmp._id);
            queue_children = queue_children.concat(children);
        }
        return array;
    }

    const save = () => {
        const { documents } = props;
        const { archiveId, name, description, archiveParent } = state;
        const { list } = documents.administration.archives;

        console.log('state data', state);
        props.editCareerField(state);

        // this.props.editDocumentArchive(archiveId, {
        //     name,
        //     description,
        //     parent: archiveParent,
        //     array: array,
        // });
    }

    const { translate, documents } = props;
    const { listData, unChooseNode } = props;
    const { name, code, parent, showParent, codeError, nameError } = state;
    const { list } = listData;
    let listCareer = [];
    for (let i in list) {
        if (!unChooseNode.includes(list[i].id)) {
            listCareer.push(list[i]);
        }
    }
    const disabled = !isValidateForm();
    return (
        <div id="edit-career-field">
            <div className={`form-group ${nameError === '' ? "" : "has-error"}`}>
                <label>Tên<span className="text-red">*</span></label>
                <input type="text" className="form-control" onChange={handleName} value={name} />
                <ErrorLabel content={nameError} />
            </div>
            <div className={`form-group ${codeError === '' ? "" : "has-error"}`}>
                <label>Nhãn dán<span className="text-red">*</span></label>
                <input type="text" className="form-control" onChange={handleCode} value={code} />
                <ErrorLabel content={codeError} />
            </div>
            {showParent &&
                <div className="form-group">
                    <label>{translate('document.administration.archives.parent')}</label>
                    <TreeSelect data={listData} value={[parent]} handleChange={handleParent} mode="radioSelect" />
                </div>
            }
            <div className="form-group">
                <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} disabled={disabled} onClick={save}>{translate('form.save')}</button>
                <button className="btn btn-danger" onClick={() => {
                    window.$(`#edit-career-field`).slideUp()
                }}>{translate('form.close')}</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editCareerField: CareerReduxAction.editCareerField,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));