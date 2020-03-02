import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EmployeeManagerActions } from '../../employee-manager/redux/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SabbaticalActions } from '../redux/actions';
class ModalAddSabbatical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNumber: "",
            startDate: "",
            endDate: "",
            status: "Đã chấp nhận",
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
            startDate: "",
            endDate: "",
            status: "Đã chấp nhận",
            reason: "",
        });
        document.getElementById("formAddSabbatical").reset();
        window.$(`#modal-addNewSabbatical`).modal("hide");
    }

    handleSunmit = async () => {
        var { translate } = this.props;
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value
        })
        if (this.state.employeeNumber === "") {
            this.notifyerror(translate('sabbatical.check_null_msnv'));
        } else if (this.props.employeesManager.checkMSNV === false) {
            this.notifyerror(translate('sabbatical.check_msnv'));
        } else if (this.state.startDate === "") {
            this.notifyerror(translate('sabbatical.check_start_day'));
        } else if (this.state.endDate === "") {
            this.notifyerror(translate('sabbatical.check_end_day'));
        } else if (this.state.reason === "") {
            this.notifyerror(translate('sabbatical.check_reason'));
        } else if (this.state.status === "") {
            this.notifyerror(translate('sabbatical.check_status'));
        } else {
            this.props.createNewSabbatical(this.state);
            this.setState({
                employeeNumber: "",
                startDate: "",
                endDate: "",
                status: "Đã chấp nhận",
                reason: "",
            });
            this.notifysuccess(translate('modal.add_success'));
            document.getElementById("formAddSabbatical").reset();
            window.$(`#modal-addNewSabbatical`).modal("hide");
        }
    }
    render() {
        const { translate } = this.props;
        return (
            <div className="modal fade" id="modal-addNewSabbatical" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => this.handleCloseModal()} aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">{translate('sabbatical.add_sabbatical_title')}:</h4>
                        </div>
                        <form id="formAddSabbatical">
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): {translate('modal.note')}.
                                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">{translate('table.employee_number')}:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChangeMSNV} />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="startDate">{translate('sabbatical.start_date')}:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" style={{ height: 33 }} className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="endDate">{translate('sabbatical.end_date')}:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" style={{ height: 33 }} className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reason">{translate('sabbatical.reason')}:<span className="required">&#42;</span></label>
                                        <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" onChange={this.handleChange}></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">{translate('table.status')}:<span className="required">&#42;</span></label>
                                        <select className="form-control" defaultValue="Đã chấp nhận" name="status" onChange={this.handleChange}>
                                            <option value="Đã chấp nhận">Đã chấp nhận</option>
                                            <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                                            <option value="Không chấp nhận">Không chấp nhận</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModal()}>{translate('modal.close')}</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSunmit()} title={translate('sabbatical.add_sabbatical_title')} >{translate('modal.create')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { sabbatical, employeesManager } = state;
    return { sabbatical, employeesManager };
};

const actionCreators = {
    createNewSabbatical: SabbaticalActions.createNewSabbatical,
    checkMSNV: EmployeeManagerActions.checkMSNV,
};

const connectedAddSabbatical = connect(mapState, actionCreators)(withTranslate(ModalAddSabbatical));
export { connectedAddSabbatical as ModalAddSabbatical };
