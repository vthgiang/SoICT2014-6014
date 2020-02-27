import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    handleSunmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value
        })
        if (this.state.employeeNumber === "") {
            this.notifyerror("Bạn chưa nhập mã nhân viên");
        } else if (this.state.startDate === "") {
            this.notifyerror("Bạn chưa nhập ngày bắt đầu");
        } else if (this.state.endDate === "") {
            this.notifyerror("Bạn chưa nhập ngày kết thúc");
        } else if (this.state.reason === "") {
            this.notifyerror("Bạn chưa nhập lý do ");
        } else if (this.state.status === "") {
            this.notifyerror("Bạn chưa nhập trạng thái");
        } else {
            this.props.createNewSabbatical(this.state);
            window.$(`#modal-addNewSabbatical`).modal("hide");
        }
    }
    render() {
        return (
            <div className="modal fade" id="modal-addNewSabbatical" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới đơn xin nghỉ:</h4>
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
                                    <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                    <label htmlFor="startDate">Ngày bắt đầu:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" style={{ height: 33 }} className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="endDate">Ngày kết thúc:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" style={{ height: 33 }} className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reason">Lý do:<span className="required">&#42;</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" onChange={this.handleChange}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="employeeNumber">Trạng thái:<span className="required">&#42;</span></label>
                                    <select className="form-control" defaultValue="Đã chấp nhận" name="status" onChange={this.handleChange}>
                                        <option value="Đã chấp nhận">Đã chấp nhận</option>
                                        <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                                        <option value="Không chấp nhận">Không chấp nhận</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSunmit()} title="Thêm mới đơn xin nghỉ" >Thêm mới</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { Sabbatical } = state;
    return { Sabbatical };
};

const actionCreators = {
    createNewSabbatical: SabbaticalActions.createNewSabbatical,
};

const connectedAddSabbatical = connect(mapState, actionCreators)(ModalAddSabbatical);
export { connectedAddSabbatical as ModalAddSabbatical };
