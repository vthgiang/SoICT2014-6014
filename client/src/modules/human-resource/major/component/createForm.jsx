import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../common-components';
import { MajorActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
        const {value} = e.target;
        let msg;
        this.setState({
            code: value,
            codeError: msg,
        });
    }

    handleParent = (value) => {
        this.setState({ parents: value });
    };

    isValidateForm = () => {
        let {name} = this.state;
        let {translate} = this.props;
        if(!ValidationHelper.validateName(translate, name, 1, 255).status) return false;
        return true;
    }

    save = () => {
        const data = {
            name: this.state.name,
            code: this.state.code,
            parents: this.state.parents,
        }
        console.log('data', data);
        this.props.createMajor(data);
    }

    render() {
        const { translate } = this.props;
        const { list } = this.props;
        let { nameError, codeError, parents } = this.state;
        console.log('list', list)
        return (
            <React.Fragment>
                <DialogModal
                    modalID="create-major"
                    formID="create-major"
                    title="Thêm chuyên ngành"
                    disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="create-major">
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>Tên<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className="form-group">
                            <label>{translate('document.administration.archives.parent')}</label>
                            <SelectBox
                                id={`field-major-add`}
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={list.filter(item => item.parents.length == 0).map(x => {
                                    return { text: x.name, value: x._id }
                                })}
                                options={{ placeholder: "Chọn thông tin cha" }}
                                onChange={this.handleParent}
                                value={parents}
                                multiple={true}
                            />
                        </div>
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
    createMajor: MajorActions.createMajor,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));