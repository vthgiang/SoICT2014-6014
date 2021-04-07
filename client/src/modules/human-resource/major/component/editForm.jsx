import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ErrorLabel, TreeSelect } from '../../../../common-components';
import { MajorActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

function EditForm(props) {
    const [state, setState] = useState({
        name: '',
        code: ''
    })

    const { translate, documents } = props;
    const { listData, unChooseNode } = props;
    const { name, code, parent, codeError, nameError } = state;
    const { list } = listData;
    let listCareer = [];

    useEffect(() => {
        setState({
            ...state,
            oldData: {
                majorId: props.majorId,
                name: props.majorName,
                code: props.majorCode,
                parent: props.majorParent,
                nameError: '',
                codeError: ''
            },
            majorId: props.majorId,
            name: props.majorName,
            code: props.majorCode,
            parent: props.majorParent,
            showParent: props.majorParent.length === 0 ? false : true,
            nameError: '',
            codeError: ''
        })
    }, [props.majorId])

    const handleName = (e) => {
        const { value } = e.target;
        const { translate } = props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
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

    const validateMajorName = (name) => {
        let { translate } = props;
        if (
            !ValidationHelper.validateName(translate, name, 1, 255).status
        ) return false;
        return true;
    }

    const validateMajorCode = (code) => {
        if (!code) return false;
        return true;
    }

    const isValidateForm = () => {
        let { name, code, showParent, parent } = state;
        if (
            !validateMajorName(name) || !validateMajorCode(code)
        ) return false;
        if (
            showParent && (!parent || parent?.length === 0)
        ) return false;
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

        props.updateMajor(state);
    }

    for (let i in list) {
        if (!unChooseNode.includes(list[i].id)) {
            listCareer.push(list[i]);
        }
    }
    const disabled = !isValidateForm();
    return (
        <div id="edit-major">
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
            {state.showParent &&
                <div className="form-group">
                    <label>{translate('document.administration.archives.parent')}</label>
                    <TreeSelect data={listData} value={parent} handleChange={handleParent} mode="radioSelect" />
                </div>
            }
            <div className="form-group">
                <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} disabled={disabled} onClick={save}>{translate('form.save')}</button>
                <button className="btn btn-danger" onClick={() => {
                    window.$(`#edit-major`).slideUp()
                }}>{translate('form.close')}</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    updateMajor: MajorActions.updateMajor,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));