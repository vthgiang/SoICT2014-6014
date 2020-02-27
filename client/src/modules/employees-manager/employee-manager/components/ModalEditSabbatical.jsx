import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ModalEditSabbatical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: this.props.data._id,
            index: this.props.index,
            status: this.props.data.status,
            reason: this.props.data.reason,
            startDate: this.props.data.startDate,
            endDate: this.props.data.endDate,
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
    handleCloseModale = () => {
        this.setState({
            _id: this.props.data._id,
            index: this.props.index,
            status: this.props.data.status,
            reason: this.props.data.reason,
            startDate: this.props.data.startDate,
            endDate: this.props.data.endDate,
        })
        window.$(`#modal-editNewSabbatical-${this.props.index + this.props.keys}`).modal("hide");
    }
    handleSunmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value
        })
        if (this.state.startDate === "") {
            this.notifyerror("Bạn chưa nhập ngày bắt đầu");
        } else if (this.state.endDate === "") {
            this.notifyerror("Bạn chưa nhập ngày kết thúc");
        } else if (this.state.reason === "") {
            this.notifyerror("Bạn chưa nhập lý do ");
        } else if (this.state.status === "") {
            this.notifyerror("Bạn chưa nhập trạng thái");
        } else {
            this.props.handleChange(this.state);
            window.$(`#modal-editNewSabbatical-${this.props.index + this.props.keys}`).modal("hide");
        }
    }
    render() {
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editNewSabbatical-${this.props.index + this.props.keys}`} className="edit" title="Chỉnh sửa thông tin nghỉ phép" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal fade" id={`modal-editNewSabbatical-${this.props.index + this.props.keys}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.handleCloseModale()} aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chỉnh sửa thông tin nghỉ phép:</h4>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="startDate">Ngày bắt đầu:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" style={{ height: 33 }} defaultValue={this.state.startDate} className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="endDate">Ngày kết thúc:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" style={{ height: 33 }} defaultValue={this.state.endDate} className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reason">Lý do:<span className="required">&#42;</span></label>
                                        <textarea className="form-control" rows="3" style={{ height: 72 }} defaultValue={this.state.reason} name="reason" onChange={this.handleChange}></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Trạng thái:<span className="required">&#42;</span></label>
                                        <select className="form-control" defaultValue="Đã chấp nhận" defaultChecked={this.state.status} name="status" onChange={this.handleChange}>
                                            <option value="Đã chấp nhận">Đã chấp nhận</option>
                                            <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                                            <option value="Không chấp nhận">Không chấp nhận</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModale()}>Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSunmit()} title="Lưu thay đổi" >Lưu lại</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export { ModalEditSabbatical };
