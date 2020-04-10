import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EmployeeManagerActions } from '../../employee-manager/redux/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DisciplineActions } from '../redux/actions';
class ModalAddPraise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNumber: "",
            number: "",
            unit: "",
            startDate: "",
            type: "",
            reason: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeMSNV = this.handleChangeMSNV.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleChangeMSNV(event) {
        const { name, value } = event.target;
        if (value !== "") {
            this.props.checkMSNV(value);
        };
        this.setState({
            [name]: value
        });
    }

    handleCloseModal = () => {
        this.setState({
            employeeNumber: "",
            number: "",
            unit: "",
            startDate: "",
            type: "",
            reason: "",
        });
        document.getElementById("formAddPraise").reset();
        window.$(`#modal-addPraise`).modal("hide");
    }

    handleSunmit = async () => {
        var { translate } = this.props;
        await this.setState({
            startDate: this.refs.startDate.value,
        })
        if (this.state.employeeNumber === "") {
            this.notifyerror(translate('discipline.check_null_msnv'));
        } else if (this.props.employeesManager.checkMSNV === false) {
            this.notifyerror(translate('discipline.check_msnv'));
        } else if (this.state.number === "") {
            this.notifyerror(translate('discipline.check_number'));
        } else if (this.state.unit === "") {
            this.notifyerror(translate('discipline.check_unit'));
        } else if (this.state.startDate === "") {
            this.notifyerror(translate('discipline.check_start_date'));
        } else if (this.state.type === "") {
            this.notifyerror(translate('discipline.check_type_praise'));
        } else if (this.state.reason === "") {
            this.notifyerror(translate('discipline.check_reason_praise'));
        } else {
            this.props.createNewPraise(this.state);
            this.setState({
                employeeNumber: "",
                number: "",
                unit: "",
                startDate: "",
                type: "",
                reason: "",
            });
            this.notifysuccess(translate('modal.add_success'));
            document.getElementById("formAddPraise").reset();
            window.$(`#modal-addPraise`).modal("hide");
        }
    }
    render() {
        const { translate } = this.props;
        return (
            <div className="modal fade" id="modal-addPraise" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => this.handleCloseModal()} aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">{translate('discipline.add_praise_title')}:</h4>
                        </div>
                        <form id="formAddPraise">
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): {translate('modal.note')}.
                                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">{translate('page.staff_number')}:<span className="text-red">&#42;</span></label>
                                        <input type="text" className="form-control" onChange={this.handleChangeMSNV} name="employeeNumber" placeholder={translate('page.staff_number')} />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="number">{translate('page.number_decisions')}:<span className="text-red">&#42;</span></label>
                                        <input type="text" className="form-control" name="number" onChange={this.handleChange} autoComplete="off" placeholder={translate('page.number_decisions')} />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="unit">{translate('discipline.decision_unit')}:<span className="text-red">&#42;</span></label>
                                        <input type="text" className="form-control" name="unit" onChange={this.handleChange} autoComplete="off" placeholder={translate('discipline.decision_unit')} />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="startDate">{translate('discipline.decision_day')}:<span className="text-red">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="type">{translate('discipline.reward_forms')}:<span className="text-red">&#42;</span></label>
                                        <input type="text" className="form-control" name="type" onChange={this.handleChange} autoComplete="off" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reason">{translate('discipline.reason_praise')}:<span className="text-red">&#42;</span></label>
                                        <textarea className="form-control" rows="3" name="reason" placeholder="Enter ..." onChange={this.handleChange}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModal()}>{translate('modal.close')}</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSunmit()} title={translate('discipline.add_praise_title')} >{translate('modal.create')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { discipline,employeesManager } = state;
    return { discipline, employeesManager };
};

const actionCreators = {
    createNewPraise: DisciplineActions.createNewPraise,
    checkMSNV: EmployeeManagerActions.checkMSNV,
};

const connectedAddPraise = connect(mapState, actionCreators)(withTranslate(ModalAddPraise));
export { connectedAddPraise as ModalAddPraise };