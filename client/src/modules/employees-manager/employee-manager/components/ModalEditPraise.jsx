import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ModalEditPraise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: this.props.data._id,
            index: this.props.index,
            number: this.props.data.number,
            unit: this.props.data.unit,
            startDate: this.props.data.startDate,
            type: this.props.data.type,
            reason: this.props.data.reason,
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
            number: this.props.data.number,
            unit: this.props.data.unit,
            startDate: this.props.data.startDate,
            type: this.props.data.type,
            reason: this.props.data.reason,
        })
        window.$(`#modal-editPraise-${this.props.index + this.props.keys}`).modal("hide");
    }
    handleSunmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
        })
        if (this.state.number === "") {
            this.notifyerror("Bạn chưa nhập số quyết định");
        } else if (this.state.unit === "") {
            this.notifyerror("Bạn chưa nhập cấp ra quyết định");
        } else if (this.state.startDate === "") {
            this.notifyerror("Bạn chưa nhập ngày ra quyết định");
        } else if (this.state.type === "") {
            this.notifyerror("Bạn chưa nhập hình thức khen thưởng");
        } else if (this.state.reason === "") {
            this.notifyerror("Bạn chưa nhập lý do khen thưởng");
        } else {
            this.props.handleChange(this.state);
            window.$(`#modal-editPraise-${this.props.index + this.props.keys}`).modal("hide");
        }

    }
    render() {
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editPraise-${this.props.index + this.props.keys}`} className="edit" title="Chỉnh sửa thông tin khen thưởng" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal fade" id={`modal-editPraise-${this.props.index + this.props.keys}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.handleCloseModale()} aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chỉnh sửa thông tin khen thưởng:</h4>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="number">Số quyết định:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" defaultValue={this.state.number} name="number" onChange={this.handleChange} autoComplete="off" placeholder="Số ra quyết định" />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="unit">Cấp ra quyết định:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="unit" defaultValue={this.state.unit} onChange={this.handleChange} autoComplete="off" placeholder="Cấp ra quyết định" />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="startDate">Ngày ra quyết định:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" className="form-control datepicker" defaultValue={this.state.startDate} name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="type">Hình thức khen thưởng:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="type" defaultValue={this.state.type} onChange={this.handleChange} autoComplete="off" />
                                    </div>
                                    <div className="form-group col-md-12" style={{ paddingRight: 0, paddingLeft: 0 }}>
                                        <label htmlFor="reason">Thành tích (Lý do):<span className="required">&#42;</span></label>
                                        <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" defaultValue={this.state.reason} placeholder="Enter ..." onChange={this.handleChange}></textarea>
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

export { ModalEditPraise };