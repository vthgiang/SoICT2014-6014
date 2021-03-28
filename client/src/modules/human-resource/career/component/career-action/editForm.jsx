import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ErrorLabel, SelectBox, TreeSelect } from '../../../../../common-components';
import { CareerReduxAction } from '../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';

function EditForm(props) {
    const [state, setState] = useState({
        name: ' '
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
                actionLabel: props.actionLabel,
                isLabel: props.isLabel,
            },
            careerId: props.careerId,
            name: props.careerName,
            package: props.careerPackage,
            code: props.careerCode,
            parent: props.careerParent,
            showParent: props.careerParent,
            actionLabel: props.actionLabel,
            isLabel: props.isLabel,

            nameError: undefined,
            codeError: undefined
        })
    }, [props.careerId])

    const handleName = (e) => {
        const { value } = e.target;
        const { translate } = props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
        setState({
            ...state,
            name: value,
            nameError: message
        });
    }

    const handleCode = (e) => {
        const { value } = e.target;
        let msg;
        setState({
            ...state,
            code: value,
            codeError: msg,
        });
    }

    const handlePackage = (e) => {
        const { value } = e.target;
        const { translate } = props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
        setState({
            ...state,
            package: value,
            // nameError: message
        });
    }

    const handleParent = (value) => {
        setState({
            ...state,
            parent: value[0]
        });
    };

    const handleActionLabel = (value) => {
        setState({
            ...state,
            actionLabel: value
        });
    };

    const isValidateForm = () => {
        let { name, showParent, parent, code } = state;
        let { translate } = props;
        if (
            !ValidationHelper.validateName(translate, name, 1, 255).status
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
        props.editCareerAction(state);
    }


    const { translate, documents } = props;
    const { listData, unChooseNode } = props;
    const { name, code, parent, showParent, codeError, nameError, actionLabel, careerId, isLabel } = state;
    const { list } = listData;
    let listCareer = [];
    for (let i in list) {
        if (!unChooseNode.includes(list[i].id)) {
            listCareer.push(list[i]);
        }
    }

    const disabled = !isValidateForm();
    const { career } = props;
    const listLabel = career.listAction.filter(e => e.isLabel === 1);

    console.log('statesssss', state);

    return (
        <div id="edit-career-action">
            {/* {!showParent &&
                    <div className={`form-group`}>
                        <label>Gói thầu</label>
                        <input type="text" className="form-control" onChange={this.handlePackage} value={this.state.package} />
                    </div>
                } */}
            <div className={`form-group ${nameError === undefined ? "" : "has-error"}`}>
                <label>Tên<span className="text-red">*</span></label>
                <input type="text" className="form-control" onChange={handleName} value={name} />
                <ErrorLabel content={nameError} />
            </div>
            { isLabel === 1 &&
                <div className={`form-group `}>
                    <label>Nhãn dán<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={handleCode} value={code} />
                    <ErrorLabel content={codeError} />
                </div>
            }
            { showParent && isLabel !== 1 &&
                <div className="form-group">
                    <label>{translate('document.administration.archives.parent')}</label>
                    <TreeSelect data={listData} value={[parent]} handleChange={handleParent} mode="radioSelect" />
                </div>
            }
            { isLabel !== 1 &&
                <div className="form-group">
                    <label className="form-control-static">Nhóm hoạt động</label>
                    {/* <TreeSelect data={dataTreeAction} value={action?.id} handleChange={this.handleAction} mode="radioSelect" /> */}
                    <SelectBox
                        id={`select-career-action-select-label-${careerId}`}
                        lassName="form-control select2"
                        style={{ width: "100%" }}
                        items={listLabel.map(e => {
                            return { text: e.name, value: e._id }
                        })}
                        options={{ placeholder: "Chọn hoạt động công việc" }}
                        onChange={handleActionLabel}
                        value={actionLabel}
                        multiple={true}
                    />
                </div>
            }
            <div className="form-group">
                <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} disabled={disabled} onClick={save}>{translate('form.save')}</button>
                <button className="btn btn-danger" onClick={() => {
                    window.$(`#edit-career-action`).slideUp()
                }}>{translate('form.close')}</button>
            </div>
        </div >
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editCareerAction: CareerReduxAction.editCareerAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));