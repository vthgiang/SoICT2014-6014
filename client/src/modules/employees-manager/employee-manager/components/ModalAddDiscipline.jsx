import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ModalAddDiscipline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: " ",
            number: "",
            unit: "",
            type: "",
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
    handleCloseModale = () => {
        this.setState({
            _id: " ",
            number: "",
            unit: "",
            type: "",
            reason: "",
            startDate: "",
            endDate: "",
        })
        window.$(`#modal-addNewDiscipline-${this.props.index}`).modal("hide");
    }
    handleSunmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value
        })
        if (this.state.number === "") {
            this.notifyerror("Bạn chưa nhập số quyết định");
        } else if (this.state.unit === "") {
            this.notifyerror("Bạn chưa nhập cấp ra quyết định");
        } else if (this.state.startDate === "") {
            this.notifyerror("Bạn chưa nhập ngày có hiệu lực");
        } else if (this.state.endDate === "") {
            this.notifyerror("Bạn chưa nhập ngày hết hiệu lực");
        } else if (this.state.type === "") {
            this.notifyerror("Bạn chưa nhập hình thức kỷ luật");
        } else if (this.state.reason === "") {
            this.notifyerror("Bạn chưa nhập lý do kỷ luật");
        } else {
            this.props.handleChange(this.state);
            this.setState({
                _id: " ",
                number: "",
                unit: "",
                type: "",
                reason: "",
            })
            document.getElementById(`formDiscipline-${this.props.index}`).reset();
            window.$(`#modal-addNewDiscipline-${this.props.index}`).modal("hide");
        }

    }
    render() {
        return (
            <React.Fragment>
                <a className="btn btn-success pull-right" style={{ marginBottom: 15 }} data-toggle="modal" href={`#modal-addNewDiscipline-${this.props.index}`} title="Thêm mới thông tin kỷ luật">Thêm mới</a>
                <div className="modal fade" id={`modal-addNewDiscipline-${this.props.index}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.handleCloseModale()} aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Thêm mới kỷ luật:</h4>
                            </div>
                            <form id={`formDiscipline-${this.props.index}`}>
                                <div className="modal-body">
                                    <div className="col-md-12">
                                        <div className="checkbox" style={{ marginTop: 0 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                    </label>
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                            <label htmlFor="number">Số quyết định:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="number" onChange={this.handleChange} autoComplete="off" placeholder="Số ra quyết định" />
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                            <label htmlFor="unit">Cấp ra quyết định:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="unit" onChange={this.handleChange} autoComplete="off" placeholder="Cấp ra quyết định" />
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                            <label htmlFor="startDate">Ngày có hiệu lực:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                            <label htmlFor="endDate">Ngày hết hiệu lực:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="type">Hình thức kỷ luật:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="type" onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="reason">Lý do kỷ luật:<span className="required">&#42;</span></label>
                                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" placeholder="Enter ..." onChange={this.handleChange}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button style={{ marginRight: 15 }} type="reset" className="btn btn-default pull-right" onClick={() => this.handleCloseModale()}>Đóng</button>
                                    <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSunmit()} title="Thêm mới kỷ luật" >Thêm mới</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};
export { ModalAddDiscipline };