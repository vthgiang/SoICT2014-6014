import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../common-components';
import { CertificateActions } from '../redux/actions';
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

    handleAbbreviation = (e) => {
        const {value} = e.target;
        let msg;
        this.setState({
            abbreviation: value,
            codeError: msg,
        });
    }

    handleMajor = (value) => {
        this.setState({ majors: value });
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
            abbreviation: this.state.abbreviation,
            majors: this.state.majors,
        }
        console.log('data', data);
        this.props.createCertificate(data);
    }

    render() {
        const { list } = this.props;
        let { nameError, codeError, majors } = this.state;
        console.log('list', list)
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-certificate"
                    formID="form-create-certificate"
                    title="Thêm bằng cấp - chứng chỉ"
                    disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="form-create-certificate">
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>Tên<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className={`form-group ${!codeError ? "" : "has-error"}`}>
                            <label>Tên viết tắt<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleAbbreviation} />
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className="form-group">
                            <label>Chuyên ngành
                            </label>
                            {/* <TreeSelect data={list} value={parent} handleChange={this.handleMajor} mode="radioSelect" /> */}
                            <SelectBox
                                id={`field-certificate-add`}
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={list.filter(item => item.parents.length == 0).map(x => {
                                    return { text: x.name, value: x._id }
                                })}
                                options={{ placeholder: "Chọn thông tin cha" }}
                                onChange={this.handleMajor}
                                value={majors}
                                multiple={true}
                            />
                        </div>
                        
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createCertificate: CertificateActions.createCertificate,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));