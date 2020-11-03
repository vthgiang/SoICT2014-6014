import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-redux-multilingual/lib/utils';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { generateCode } from '../../../../../helpers/generateCode';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { millActions } from '../redux/actions';

class ManufacturingEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleClickCreate = () => {
        const code = generateCode("NMSX");
        this.setState((state) => ({
            ...state,
            code: code
        }));
    }

    getListUsers = () => {
        const { translate, user } = this.props;
        let listUsersArray = [{
            value: "",
            text: translate('manufacturing.manufacturing_mill.choose_team_leader')
        }];

        let { userdepartments } = user;
        if (userdepartments) {
            userdepartments = userdepartments[0];
            if (userdepartments.employees && Object.keys(userdepartments.employees).length > 0) { // Nếu nhà máy có nhân viên
                let members = userdepartments.employees[Object.keys(userdepartments.employees)[0]].members;
                if (members.length) {
                    members.map((member) => {
                        listUsersArray.push({
                            value: member._id,
                            text: member.name
                        });
                    });
                }

            }
        }

        return listUsersArray;
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
                    text: item.name,
                    organizationalUnit: item.organizationalUnit._id
                });
            });
        }
        return listWorksArray;

    }

    handleManufacturingWorksChange = (value) => {
        const worksValue = value[0];
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
                worksValueError: msg,
                teamLeaderValue: ""
            }));
        }

        return msg;
    }

    handleTeamLeaderValueChange = (value) => {
        console.log(value[0]);
        const teamLeaderValue = value[0];
        this.validateTeamLeader(teamLeaderValue, true);
    }

    validateTeamLeader(value, willUpdateState = true) {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.manufacturing_mill.team_leader_error');
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                teamLeaderValue: value,
                teamLeaderValueError: msg
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
        console.log(status);
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
        const { name, worksValue, status, teamLeaderValue } = this.state;
        const { translate } = this.props;
        if (this.validateManufacturingWorks(worksValue, false)
            || this.validateStatus(status, false)
            || this.validateTeamLeader(teamLeaderValue, false)
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
                status: this.state.status,
                teamLeader: this.state.teamLeaderValue
            }
            this.props.editManufacturingMill(this.state.millId, data);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.millId !== state.millId) {
            props.getAllUserOfDepartment(props.currentOrganizationalUnit);
            return {
                ...state,
                millId: props.millId,
                code: props.code,
                name: props.name,
                worksValue: props.worksValue,
                teamLeaderValue: props.teamLeaderValue,
                status: String(props.status),
                description: props.description,
                nameError: undefined,
                teamLeaderValueError: undefined,
                worksValueError: undefined,
                statusError: undefined,
            }
        }
        return null;
    }

    // Tìm trong trong listWorksArray object có value = value truyền vào
    findIndex = (array, value) => {
        let result = -1;
        array.map((item, index) => {
            if (item.value === value) {
                result = index
            }
        })
        return result;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.worksValue === this.props.worksValue && nextState.worksValue !== "" && this.state.worksValue !== nextState.worksValue) {
            let listWorks = this.getListWorks();
            let result = this.findIndex(listWorks, nextState.worksValue);
            if (result !== -1) {
                this.props.getAllUserOfDepartment(listWorks[result].organizationalUnit);
            }

            return false;
        }
        return true;
    }



    render() {
        const { user } = this.props;
        console.log(user.userdepartments);

        const { translate, manufacturingMill } = this.props;
        const { code, name, nameError, worksValue, worksValueError, description, status, statusError, teamLeaderValue, teamLeaderValueError } = this.state;

        console.log(teamLeaderValue)
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-mill" isLoading={manufacturingMill.isLoading}
                    formID="form-edit-mill"
                    title={translate('manufacturing.manufacturing_mill.mill_edit')}
                    msg_success={translate('manufacturing.manufacturing_mill.edit_mill_successfully')}
                    msg_faile={translate('manufacturing.manufacturing_mill.edit_mill_failed')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-edit-mill">
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
                                id={`select-works-edit`}
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
                                <label>{translate('manufacturing.manufacturing_mill.team_leader')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`select-teamLeader-edit`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={teamLeaderValue}
                                    items={this.getListUsers()}
                                    onChange={this.handleTeamLeaderValueChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={teamLeaderValueError} />
                            </div>
                        }
                        <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_mill.status')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-status-edit`}
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
                            <input type="text" className="form-control" value={description} onChange={this.handleDescriptionChange}></input>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingWorks, manufacturingMill, user } = state;
    return { manufacturingWorks, manufacturingMill, user }
}

const mapDispatchToProps = {
    createManufacturingMill: millActions.createManufacturingMill,
    editManufacturingMill: millActions.editManufacturingMill,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingEditForm));