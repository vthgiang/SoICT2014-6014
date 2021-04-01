import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../../common-components';
import { CareerReduxAction } from '../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';
function CreateForm(props) {
    const [state, setState] = useState({
        position: [],
    });

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

    const handleParent = (value) => {
        setState({
            ...state,
            parent: value[0]
        });
    }

    const isValidateForm = () => {
        let { name, code, position } = state;
        let { translate } = props;
        if (position?._id) return true;
        if (
            !ValidationHelper.validateName(translate, name, 1, 255).status || !code
        ) return false;
        return true;
    }

    const handlePosition = (value) => {
        setState({
            ...state,
            position: value
        });
        console.log('position...', state);
    };

    const save = () => {
        const data = {
            name: state.name,
            code: state.code,
            parent: state.parent,
            position: state.position,
        }
        console.log('data', data);
        props.createCareerField(data);
    }

    const { translate, career } = props;
    const { list } = props;
    let { parent, nameError, codeError } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-career-field"
                formID="form-create-career-field"
                title="Thêm lĩnh vực công việc"
                //disableSubmit={!isValidateForm()}
                func={save}
            >
                <form id="form-create-career-field">
                    <div className="form-group">
                        <label>Chọn thông tin cha</label>
                        <TreeSelect data={list} value={parent} handleChange={handleParent} mode="radioSelect" />
                    </div>
                    {(!state.name || state.name === "") &&
                        <div className="form-group">
                            <label>Chọn vị trí công việc đang có</label>
                            <SelectBox
                                id={`field-career-add-position`}
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={career?.listPosition.map(x => {
                                    return { text: x.name, value: x._id }
                                })
                                    // TODO: cần thêm filter lọc các vị trí đã có trong lĩnh vực cha
                                }
                                options={{ placeholder: "Chọn vị trí công việc đang có" }}
                                onChange={handlePosition}
                                value={state.position}
                                multiple={true}
                            />
                        </div>
                    }

                    {state.position.length === 0 &&
                        //  ${!nameError ? "" : "has-error"} ${!codeError ? "" : "has-error"}
                        <div>
                            <div className={`form-group`}>
                                <label>Tên<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={handleName} />
                                {/* <ErrorLabel content={nameError} /> */}
                            </div>
                            <div className={`form-group`}>
                                <label>Nhãn<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={handleCode} />
                                {/* <ErrorLabel content={nameError} /> */}
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
    createCareerField: CareerReduxAction.createCareerField,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));