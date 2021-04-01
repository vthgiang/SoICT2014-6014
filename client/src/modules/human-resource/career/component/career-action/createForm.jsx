import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../../common-components';
import { CareerReduxAction } from '../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';
function CreateForm(props) {
    const [state, setState] = useState({
        parent: [],
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
            parent: value,
            position: [],
            package: undefined
        });
    };

    const handlePosition = (value) => {
        setState({
            ...state,
            position: value
        });
        console.log('position...', state);
    };

    const isValidateForm = () => {
        let { name, code } = state;
        let { translate } = props;
        if (
            !ValidationHelper.validateName(translate, name, 1, 255).status || !code
        ) return false;
        return true;
    }

    const save = () => {
        const data = {
            name: state.name,
            code: state.code,
            parent: state.parent,
            position: state.position,
            package: state.package,
        }
        console.log('data', data);
        props.createCareerAction(data);
    }

    const { translate, career } = props;
    const { list } = props;
    let { parent, position, nameError, codeError } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-career-action"
                formID="form-create-career-action"
                title="Thêm hoạt động công việc"
                //disableSubmit={!isValidateForm()}
                func={save}
            >
                <form id="form-create-career-action">
                    {/* {parent.length === 0 &&
                            <div className={`form-group `}>
                                <label>Gói thầu</label>
                                <input type="text" className="form-control" onChange={this.handlePackage} />
                            </div>
                        }  */}
                    <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                        <label>Tên<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={handleName} />
                        <ErrorLabel content={nameError} />
                    </div>
                    {/* <div className="form-group">
                            <label>Chọn thông tin cha</label>
                            <TreeSelect data={list} value={parent} handleChange={this.handleParent} mode="radioSelect" />
                        </div> */}
                    {
                        <div className="form-group">
                            <label>Chọn hoạt động chi tiết</label>
                            <SelectBox
                                id={`position-career-add-detail-label`}
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={list.map(x => {
                                    return { text: x.name, value: x._id }
                                })}
                                options={{ placeholder: "Chọn hoạt động chi tiết" }}
                                onChange={handleParent}
                                value={parent}
                                multiple={true}
                            />
                        </div>
                    }
                    {parent.length === 0 &&
                        <div className="form-group">
                            <label>Vị trí công việc</label>
                            <SelectBox
                                id={`position-career-add`}
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={career?.listPosition.map(x => {
                                    return { text: x.name, value: x._id }
                                })}
                                options={{ placeholder: "Chọn vị trí công việc" }}
                                onChange={handlePosition}
                                value={position}
                                multiple={true}
                            />
                        </div>
                    }

                    <div className={`form-group ${!codeError ? "" : "has-error"}`}>
                        <label>Nhãn<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={handleCode} />
                        <ErrorLabel content={nameError} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createCareerAction: CareerReduxAction.createCareerAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));