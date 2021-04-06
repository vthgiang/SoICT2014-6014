import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../../common-components';
import { CareerReduxAction } from '../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';
function CreateForm(props) {
    const [state, setState] = useState({
        action: [],
    });

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
    }

    const handleField = (value) => {
        setState({
            ...state,
            field: value
        });
        console.log('field...', state);
    };

    const handleAction = (value) => {
        setState({
            ...state,
            action: value
        });
        console.log('action...', state);
    };

    const isHavingAction = (action) => {
        if (action.length === 0) return false;
        return true;
    }

    const isHavingParent = (parent) => {
        if (!parent || parent === "") return false;
        return true;
    }

    const isBelongToAnyFields = (field) => {
        if (!field || field?.length === 0) return false;
        return true;
    }

    const validatePositionName = (name) => {
        let { translate } = props;
        if (
            !ValidationHelper.validateName(translate, name, 1, 255).status
        ) return false;
        return true;
    }

    const validatePositionCode = (code) => {
        if (!code) return false;
        return true;
    }

    const isValidateForm = () => {
        let { name, code, action, parent } = state;
        if (isHavingAction(action) && isHavingParent(parent)) return true;
        if (
            !(validatePositionCode(code) && validatePositionName(name))
        ) return false;
        return true;
    }

    const save = () => {
        const data = {
            name: state.name,
            code: state.code,
            package: state.package,
            parent: state.parent,
            field: state.field,
            action: state.action,
        }
        console.log('data', data);
        props.createCareerPosition(data);
    }

    const { translate, career } = props;
    const { list } = props;
    let { parent, field, nameError, codeError, action } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-career-position"
                formID="form-create-career-position"
                title="Thêm vị trí công việc"
                disableSubmit={!isValidateForm()}
                func={save}
            >
                <form id="form-create-career-position">
                    {/* <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>Gói thầu</label>
                            <input type="text" className="form-control" onChange={this.handlePackage} />
                            <ErrorLabel content={nameError} />
                        </div> */}
                    {!isBelongToAnyFields(state.field) &&
                        < div className="form-group">
                            <label>Chọn thông tin cha
                                {isHavingAction(state.action) && <span className="text-red">*</span>}
                            </label>
                            <TreeSelect data={list} value={parent} handleChange={handleParent} mode="radioSelect" />
                            {isHavingAction(state.action) &&
                                <ErrorLabel content={nameError} />
                            }
                        </div>
                    }
                    {!(isHavingParent(state.parent) || isHavingAction(state.action)) &&
                        <div className="form-group">
                            <label>Lĩnh vực</label>
                            <SelectBox
                                id={`field-career-add`}
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={career?.listField.map(x => {
                                    return { text: x.name, value: x._id }
                                })}
                                options={{ placeholder: "Chọn lĩnh vực" }}
                                onChange={handleField}
                                value={field}
                                multiple={true}
                            />
                        </div>
                    }
                    {!(validatePositionCode(state.code) || validatePositionName(state.name) ||
                        isBelongToAnyFields(state.field)) &&
                        <div className="form-group">
                            <label>Chọn hoạt động công việc đang có</label>
                            <SelectBox
                                id={`position-career-add-action`}
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={career?.listAction.filter(e => e.isLabel === 0).map(x => {
                                    return { text: x.name, value: x._id }
                                }) // TODO: cần lọc ra hoạt động công việc đã có trong đây rồi
                                }
                                options={{ placeholder: "Chọn hoạt động công việc đang có" }}
                                onChange={handleAction}
                                value={action}
                                multiple={true}
                            />
                        </div>
                    }
                    {!isHavingAction(state.action) &&
                        //${!nameError ? "" : "has-error"} ${!codeError ? "" : "has-error"}
                        <div>
                            <div className={`form-group `}>
                                <label>Tên<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={handleName} />
                                <ErrorLabel content={nameError} />
                            </div>
                            <div className={`form-group `}>
                                <label>Nhãn<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={handleCode} />
                                <ErrorLabel content={nameError} />
                            </div>
                        </div>
                    }
                </form>
            </DialogModal>
        </React.Fragment >
    );
}
const mapStateToProps = state => state;

const mapDispatchToProps = {
    createCareerPosition: CareerReduxAction.createCareerPosition,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));