import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DisciplineActions } from '../redux/actions';
class ModalAddDiscipline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNumber: "",
            number: "",
            unit: "",
            startDate: "",
            endDate: "",
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

    handleCloseModal = () => {
        this.setState({
            employeeNumber: "",
            number: "",
            unit: "",
            startDate: "",
            endDate: "",
            type: "",
            reason: "",
        });
        document.getElementById("formAddDiscipline").reset();
        window.$(`#modal-addNewDiscipline`).modal("hide");
    }

    handleSunmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value
        })
        if (this.state.employeeNumber === "") {
            this.notifyerror("Bạn chưa nhập mã nhân viên");
        } else if (this.state.number === "") {
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
            this.props.createNewDiscipline(this.state);
            this.setState({
                employeeNumber: "",
                number: "",
                unit: "",
                startDate: "",
                endDate: "",
                type: "",
                reason: "",
            });
            document.getElementById("formAddDiscipline").reset();
            window.$(`#modal-addNewDiscipline`).modal("hide");
        }

    }
    render() {
        return (
            <div className="modal fade" id="modal-addNewDiscipline" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close"  onClick={()=>this.handleCloseModal()} aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới kỷ luật:</h4>
                        </div>
                        <form id="formAddDiscipline">
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                    </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Mã nhân viên:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" onChange={this.handleChange} name="employeeNumber" placeholder="Mã số nhân viên" />
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
                                        <textarea className="form-control" rows="3" name="reason" placeholder="Enter ..." onChange={this.handleChange}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" onClick={()=>this.handleCloseModal()}>Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSunmit()} title="Thêm mới kỷ luật" >Thêm mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { Discipline } = state;
    return { Discipline };
};

const actionCreators = {
    createNewDiscipline: DisciplineActions.createNewDiscipline,
};

const connectedAddDiscipline = connect(mapState, actionCreators)(ModalAddDiscipline);
export { connectedAddDiscipline as ModalAddDiscipline };