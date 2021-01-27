import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../../common-components';
import { CareerReduxAction } from '../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';
class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = { }
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

    handlePackage = (e) => {
        const { value } = e.target;
        const { translate } = this.props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({
            package: value,
            // nameError: message
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

    handleField = (value) => {
        this.setState({ field: value });
        console.log('field...', this.state);
    };

    isValidateForm = () => {
        let { name } = this.state;
        let { translate } = this.props;
        if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false;
        return true;
    }

    save = () => {
        const data = {
            name: this.state.name,
            code: this.state.code,
            package: this.state.package,
            parent: this.state.parent,
            field: this.state.field,
        }
        console.log('data', data);
        this.props.createCareerPosition(data);
    }

    render() {
        const { translate, career } = this.props;
        const { list } = this.props;
        let { parent, field, nameError, codeError } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-career-position"
                    formID="form-create-career-position"
                    title="Thêm vị trí công việc"
                    disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="form-create-career-position">
                        {/* <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>Gói thầu</label>
                            <input type="text" className="form-control" onChange={this.handlePackage} />
                            <ErrorLabel content={nameError} />
                        </div> */}
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>Tên<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className="form-group">
                            <label>Chọn thông tin cha</label>
                            <TreeSelect data={list} value={parent} handleChange={this.handleParent} mode="radioSelect" />
                        </div>
                        { !parent &&
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
                                    onChange={this.handleField}
                                    value={field}
                                    multiple={true}
                                />
                            </div>
                        }

                        <div className={`form-group ${!codeError ? "" : "has-error"}`}>
                            <label>Nhãn<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleCode} />
                            <ErrorLabel content={nameError} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createCareerPosition: CareerReduxAction.createCareerPosition,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));