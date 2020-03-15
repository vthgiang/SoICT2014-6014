import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DisciplineActions } from '../redux/actions';
class ModalEditPraise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.data._id,
            fullName: this.props.data.employee.fullName,
            employeeNumber: this.props.data.employee.employeeNumber,
            number: this.props.data.number,
            unit: this.props.data.unit,
            type: this.props.data.type,
            reason: this.props.data.reason,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSunmit = this.handleSunmit.bind(this);
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
    handleSunmit(event) {
        var { translate } = this.props;
        var startDate = this.refs.startDate.value;
        if (this.state.employeeNumber === "") {
            this.notifyerror(translate('discipline.check_null_msnv'));
        } else if (this.state.number === "") {
            this.notifyerror(translate('discipline.check_number'));
        } else if (this.state.unit === "") {
            this.notifyerror(translate('discipline.check_unit'));
        } else if (startDate === "") {
            this.notifyerror(translate('discipline.check_start_date'));
        } else if (this.state.type === "") {
            this.notifyerror(translate('discipline.check_type_praise'));
        } else if (this.state.reason === "") {
            this.notifyerror(translate('discipline.check_reason_praise'));
        } else {
            this.props.updatePraise(this.state.id, { ...this.state, startDate });
            window.$(`#modal-viewPraise-${this.state.id}`).modal("hide");
        }

    }
    render() {
        const { translate } = this.props;
        var data = this.state;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-viewPraise-${data.id}`} title={translate('discipline.infor_praise')} data-toggle="modal"><i className="material-icons">view_list</i></a>
                <div className="modal fade" id={`modal-viewPraise-${data.id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">{translate('discipline.infor_praise')}:{data.fullName} - {translate('page.number_decisions')}: {data.number}</h4>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label className="pull-left" style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): {translate('modal.note')}.
                                                        </label>
                                    </div>
                                    <div className="form-group col-md-12" style={{ paddingLeft: 0, paddingRight:0 }}>
                                        <label className="pull-left" htmlFor="employeeNumber">{translate('page.staff_number')}:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="employeeNumber" defaultValue={data.employeeNumber} disabled />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label className="pull-left" htmlFor="number">{translate('page.number_decisions')}:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" defaultValue={data.number} disabled />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label className="pull-left" htmlFor="unit">{translate('discipline.decision_unit')}:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="unit" defaultValue={data.unit} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label className="pull-left" htmlFor="startDate">{translate('discipline.decision_day')}:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback pull-left'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" style={{ height: 33 }} className="form-control datepicker" name="startDate" defaultValue={this.props.data.startDate} ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label className="pull-left" htmlFor="type">{translate('discipline.reward_forms')}:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="type" defaultValue={data.type} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-12" style={{ paddingRight: 0, paddingLeft: 0 }}>
                                        <label className="pull-left" htmlFor="reason">{translate('discipline.reason_praise')}:<span className="required">&#42;</span></label>
                                        <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" defaultValue={data.reason} onChange={this.handleChange}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">{translate('modal.close')}</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={this.handleSunmit} title={translate('modal.update')} >{translate('modal.update')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
function mapState(state) {
    const { discipline } = state;
    return { discipline };
};

const actionCreators = {
    updatePraise: DisciplineActions.updatePraise,
};

const connectedEditPraise = connect(mapState, actionCreators)(withTranslate(ModalEditPraise));
export { connectedEditPraise as ModalEditPraise };