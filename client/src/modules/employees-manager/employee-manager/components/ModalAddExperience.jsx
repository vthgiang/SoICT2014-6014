import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ModalAddExperience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: "",
            startDate: "",
            endDate: "",
            position: "",
        }
        this.handleChange = this.handleChange.bind(this)
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
            unit: "",
            position: "",
            startDate: "",
            endDate: "",
        })
        window.$(`#modal-addNewExperience-${this.props.index}`).modal("hide");
    }
    handleSubmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value
        })
        if (this.state.unit === "") {
            this.notifyerror("Bạn chưa nhập đơn vị công tác");
        } else if (this.state.unit === "") {
            this.notifyerror("Bạn chưa nhập từ tháng/năm");
        } else if (this.state.startDate === "") {
            this.notifyerror("Bạn chưa nhập đến tháng/năm");
        } else if (this.state.position === "") {
            this.notifyerror("Bạn chưa nhập chức vụ");
        } else {
            this.props.handleChange(this.state);
            this.setState({
                unit: "",
                startDate: "",
                endDate: "",
                position: "",
            })
            document.getElementById(`formExperience-${this.props.index}`).reset();
            window.$(`#modal-addNewExperience-${this.props.index}`).modal("hide");
        }
    }
    render() {
        return (
            <React.Fragment>
                <a className="btn btn-success pull-right" style={{ marginBottom: 15 }} data-toggle="modal" href={`#modal-addNewExperience-${this.props.index}`} title="Thêm mới kinh nghiệm làm việc">Thêm mới</a>
                <div className="modal fade" id={`modal-addNewExperience-${this.props.index}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.handleCloseModale()} aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Thêm mới kinh nghiệm làm việc:</h4>
                            </div>
                            <form id={`formExperience-${this.props.index}`}>
                                <div className="modal-body">
                                    <div className="col-md-12">
                                        <div className="checkbox" style={{ marginTop: 0 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="unit">Đơn vị công tác:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="unit" onChange={this.handleChange} autoComplete="off" />
                                        </div>

                                        <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                            <label htmlFor="startDate">Từ tháng/năm:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control employeedatepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="mm-yyyy" placeholder="mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                            <label htmlFor="endDate">Đến tháng/năm:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control employeedatepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="mm-yyyy" placeholder="mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="position">chức vụ:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="position" onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button style={{ marginRight: 15 }} type="reset" className="btn btn-default pull-right" onClick={() => this.handleCloseModale()}>Đóng</button>
                                    <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSubmit()} title="Thêm mới kinh nghiệm làm việc" >Thêm mới</button>
                                </div>
                            </form>
                        </div>
                    </div >
                </div>
            </React.Fragment>
        );
    }
};
export { ModalAddExperience };
