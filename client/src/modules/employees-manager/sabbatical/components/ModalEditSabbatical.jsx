import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SabbaticalActions } from '../redux/actions';
class ModalEditSabbatical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.data._id,
            fullName: this.props.data.employee.fullName,
            employeeNumber: this.props.data.employee.employeeNumber,
            status: this.props.data.status,
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
        var startDate = this.refs.startDate.value;
        var endDate = this.refs.endDate.value;
        if (this.state.employeeNumber === "") {
            this.notifyerror("Bạn chưa nhập mã nhân viên");
        } else if (startDate === "") {
            this.notifyerror("Bạn chưa nhập ngày bắt đầu");
        } else if (endDate === "") {
            this.notifyerror("Bạn chưa nhập ngày kết thúc");
        } else if (this.state.reason === "") {
            this.notifyerror("Bạn chưa nhập lý do ");
        } else if (this.state.status === "") {
            this.notifyerror("Bạn chưa nhập trạng thái");
        } else {
            this.props.updateSabbatical(this.state.id, { ...this.state, startDate, endDate });
            window.$(`#modal-editSabbatical-${this.props.data._id}`).modal("hide");
        }

    }

    render() {
        var data = this.state;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editSabbatical-${data.id}`} title="Thông tin bảng lương" data-toggle="modal"><i className="material-icons">view_list</i></a>
                <div className="modal fade" id={`modal-editSabbatical-${data.id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chỉnh sửa đơn xin nghỉ:</h4>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Mã nhân viên:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="employeeNumber" defaultValue={data.employeeNumber} disabled />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="startDate">Ngày bắt đầu:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" style={{ height: 33 }} className="form-control datepicker" name="startDate" defaultValue={this.props.data.startDate} ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="endDate">Ngày kết thúc:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" style={{ height: 33 }} className="form-control datepicker" name="endDate" defaultValue={this.props.data.endDate} ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reason">Lý do:<span className="required">&#42;</span></label>
                                        <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" defaultValue={data.reason} onChange={this.handleChange}></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Trạng thái:<span className="required">&#42;</span></label>
                                        <select className="form-control" name="status" defaultValue={data.status} onChange={this.handleChange} >
                                            <option value="Đã chấp nhận">Đã chấp nhận</option>
                                            <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                                            <option value="Không chấp nhận">Không chấp nhận</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" title="Lưu lại các thay đổi" onClick={this.handleSunmit} className="btn btn-success pull-right">Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { sabbatical } = state;
    return { sabbatical };
};

const actionCreators = {
    updateSabbatical: SabbaticalActions.updateSabbatical,
};

const connectedEditSabbatical = connect(mapState, actionCreators)(ModalEditSabbatical);
export { connectedEditSabbatical as ModalEditSabbatical };