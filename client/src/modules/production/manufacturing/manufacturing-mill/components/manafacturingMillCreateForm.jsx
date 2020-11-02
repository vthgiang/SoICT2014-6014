import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-redux-multilingual/lib/utils';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { generateCode } from '../../../../../helpers/generateCode';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { worksActions } from '../../manufacturing-works/redux/actions';
import { millActions } from '../redux/actions';

class ManufacturingMillCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            name: '',
            worksValue: '',
            description: '',
            status: '',
            teamLeaderValue: ''
        }
    }

    handleClickCreate = () => {
        const code = generateCode("NMSX");
        this.setState((state) => ({
            ...state,
            code: code
        }));
    }

    getListUsers = async () => {

    }

    getListWorks = () => {
        const { translate, manufacturingWorks } = this.props;
        let listWorksArray = [{
            value: "",
            text: translate('manufacturing.manufacturing_mill.choose_works')
        }];

        const { listWorks } = manufacturingWorks;

        if (listWorks) {
            listWorks.map((item) => {
                listWorksArray.push({
                    value: item._id,
                    text: item.name
                });
            });
        }
        return listWorksArray;

    }

    handleManufacturingWorksChange = async (value) => {
        const worksValue = value[0];
        console.log(worksValue);
        await this.props.getDetailManufacturingWorks(worksValue);
        this.validateManufacturingWorks(worksValue, true);
    }

    validateManufacturingWorks(value, willUpdateState) {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.manufacturing_mill.worksValue_error');
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                worksValue: value,
                worksValueError: msg
            }));
        }

        return msg;
    }

    handleNameChange = (e) => {
        const { value } = e.target;
        this.setState({
            name: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({ nameError: message })
    }

    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        });
    }

    handleStatusChange = (value) => {
        const status = value[0];
        this.validateStatus(status, true);
    }

    validateStatus = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.manufacturing_mill.status_error');
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                status: value,
                statusError: msg
            }))
        }

        return msg;
    }

    isFormValidated = () => {
        const { name, worksValue, status } = this.state;
        const { translate } = this.props;
        if (this.validateManufacturingWorks(worksValue, false)
            || this.validateStatus(status, false)
            || !ValidationHelper.validateName(translate, name, 6, 255).status
        ) {
            return false
        }
        return true
    }

    save = () => {
        if (this.isFormValidated) {
            const data = {
                code: this.state.code,
                name: this.state.name,
                manufacturingWorks: this.state.worksValue,
                description: this.state.description,
                status: this.state.status
            }
            console.log(data);
            this.props.createManufacturingMill(data);
        }
    }



    render() {
        const { manufacturingWorks } = this.props;
        console.log(manufacturingWorks.detailWorks)
        const { translate, manufacturingMill } = this.props;
        const { code, name, nameError, worksValue, worksValueError, description, status, statusError, teamLeaderValue, teamLeaderValueError } = this.state;
        return (
            <React.Fragment>
                <ButtonModal onButtonCallBack={this.handleClickCreate} modalID="modal-create-mill" button_name={translate('manufacturing.manufacturing_mill.create_mill')} title={translate('manufacturing.manufacturing_mill.create_mill')} />
                <DialogModal
                    modalID="modal-create-mill" isLoading={manufacturingMill.isLoading}
                    formID="form-create-mill"
                    title={translate('manufacturing.manufacturing_mill.create_manufacturing_mill')}
                    msg_success={translate('manufacturing.manufacturing_mill.create_mill_successfully')}
                    msg_faile={translate('manufacturing.manufacturing_mill.create_mill_failed')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-mill">
                        <div className="form-group">
                            <label>{translate('manufacturing.manufacturing_mill.code')}<span className="text-red">*</span></label>
                            <input type="text" value={code} className="form-control" disabled={true}></input>
                        </div>
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_mill.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange={this.handleNameChange}></input>
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className={`form-group ${!worksValueError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_mill.works')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-works`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={worksValue}
                                items={this.getListWorks()}
                                onChange={this.handleManufacturingWorksChange}
                                multiple={false}
                            />
                            <ErrorLabel content={worksValueError} />
                        </div>
                        {
                            this.state.worksValue !== "" &&
                            <div className={`form-group ${!teamLeaderValueError ? "" : "has-error"}`}>
                                <label>{translate('manufacturing.manufacturing_mill.teamLeader')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`select-teamLeader`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={teamLeaderValue}
                                    items={this.getListWorks()}
                                    onChange={this.handleManufacturingWorksChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={teamLeaderValueError} />
                            </div>
                        }
                        <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_mill.status')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-status`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={status}
                                items={[
                                    { value: "", text: translate('manufacturing.manufacturing_mill.choose_status') },
                                    { value: "1", text: translate('manufacturing.manufacturing_mill.1') },
                                    { value: "0", text: translate('manufacturing.manufacturing_mill.0') }
                                ]}
                                onChange={this.handleStatusChange}
                                multiple={false}
                            />
                            <ErrorLabel content={statusError} />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.manufacturing_mill.description')}</label>
                            <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange}></textarea>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingWorks, manufacturingMill } = state;
    return { manufacturingWorks, manufacturingMill }
}

const mapDispatchToProps = {
    createManufacturingMill: millActions.createManufacturingMill,
    getDetailManufacturingWorks: worksActions.getDetailManufacturingWorks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingMillCreateForm));