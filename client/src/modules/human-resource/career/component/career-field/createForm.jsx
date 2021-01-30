import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../../common-components';
import { CareerReduxAction } from '../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';
class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: []
        }
    }

    handleName = (e) => {
        const { value } = e.target;
        const { translate } = this.props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({
            name: value,
            nameError: message
        });
    }

    handleCode = (e) => {
        const { value } = e.target;
        let msg;
        this.setState({
            code: value,
            codeError: msg,
        });
    }

    handleParent = (value) => {
        this.setState({ parent: value[0] });
    };

    isValidateForm = () => {
        let { name } = this.state;
        let { translate } = this.props;
        if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false;
        return true;
    }

    handlePosition = (value) => {
        this.setState({ position: value });
        console.log('position...', this.state);
    };

    save = () => {
        const data = {
            name: this.state.name,
            code: this.state.code,
            parent: this.state.parent,
            position: this.state.position,
        }
        console.log('data', data);
        this.props.createCareerField(data);
    }

    render() {
        const { translate, career } = this.props;
        const { list } = this.props;
        let { parent, nameError, codeError } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-career-field"
                    formID="form-create-career-field"
                    title="Thêm lĩnh vực công việc"
                    // disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="form-create-career-field">
                        <div className="form-group">
                            <label>Chọn thông tin cha</label>
                            <TreeSelect data={list} value={parent} handleChange={this.handleParent} mode="radioSelect" />
                        </div>
                        {(!this.state.name || this.state.name === "") &&
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
                                    onChange={this.handlePosition}
                                    value={this.state.position}
                                    multiple={true}
                                />
                            </div>
                        }

                        {this.state.position.length === 0 &&
                            //  ${!nameError ? "" : "has-error"} ${!codeError ? "" : "has-error"}
                            <div>
                                <div className={`form-group`}>
                                    <label>Tên<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" onChange={this.handleName} />
                                    {/* <ErrorLabel content={nameError} /> */}
                                </div>
                                <div className={`form-group`}>
                                    <label>Nhãn<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" onChange={this.handleCode} />
                                    {/* <ErrorLabel content={nameError} /> */}
                                </div>
                            </div>
                        }
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createCareerField: CareerReduxAction.createCareerField,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));