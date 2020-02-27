import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ModalAddContract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameContract: "",
            typeContract: "",
            file: "",
            urlFile: " ",
            fileUpload: " "
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
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

    handleChangeFile(event) {
        const { name } = event.target;
        var file = event.target.files[0];
        var url = URL.createObjectURL(file);
        var fileLoad = new FileReader();
        fileLoad.readAsDataURL(file);
        fileLoad.onload = () => {
            this.setState({
                [name]: file.name,
                urlFile: url,
                fileUpload: file
            })
        };
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleCloseModale = () => {
        this.setState({
            nameContract: "",
            typeContract: "",
            file: "",
            urlFile: " ",
            fileUpload: " ",
            startDate: "",
            endDate: "",
        })
        window.$(`#modal-addNewContract-${this.props.index}`).modal("hide");
    }
    handleSubmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value
        })
        if (this.state.nameContract === "") {
            this.notifyerror("Bạn chưa nhập tên hợp đồng");
        } else if (this.state.typeContract === "") {
            this.notifyerror("Bạn chưa nhập lợi hợp đồng");
        } else if (this.state.startDate === "") {
            this.notifyerror("Bạn chưa nhập ngày có hiệu lực");
        } else if (this.state.endDate === "") {
            this.notifyerror("Bạn chưa nhập ngày hết hạn");
        } else {
            this.props.handleChange(this.state);
            this.setState({
                nameContract: "",
                typeContract: "",
                file: "",
                urlFile: " ",
                fileUpload: " "
            })
            document.getElementById(`formContract-${this.props.index}`).reset();
            window.$(`#modal-addNewContract-${this.props.index}`).modal("hide");
        }
    }
    render() {
        return (
            <React.Fragment>
                <a className="btn btn-success pull-right" style={{ marginBottom: 15 }} data-toggle="modal" href={`#modal-addNewContract-${this.props.index}`} title="Thêm mới hợp đồng lao động">Thêm mới</a>
                <div className="modal fade" id={`modal-addNewContract-${this.props.index}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.handleCloseModale()} aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Thêm mới hợp đồng lao động:</h4>
                            </div>
                            <form id={`formContract-${this.props.index}`}>
                                <div className="modal-body">
                                    <div className="col-md-12">
                                        <div className="checkbox" style={{ marginTop: 0 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nameContract">Tên hợp đồng:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="nameContract" onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="typeContract">Loại hợp đồng:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="typeContract" onChange={this.handleChange} autoComplete="off" />
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
                                            <label htmlFor="endDate">Ngày hết hạn:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="file">Chọn file đính kèm:</label>
                                            <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={this.handleChangeFile} />
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button style={{ marginRight: 15 }} type="reset" className="btn btn-default pull-right" onClick={() => this.handleCloseModale()}>Đóng</button>
                                    <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSubmit()} title="Thêm mới hợp đồng lao động" >Thêm mới</button>
                                </div>
                            </form>
                        </div>
                    </div >
                </div>
            </React.Fragment>
        );
    }
};
export { ModalAddContract };
