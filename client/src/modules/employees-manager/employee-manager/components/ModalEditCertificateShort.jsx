import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ModalEditCertificateShort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index,
            urlFile: this.props.data.urlFile,
            fileUpload: this.props.data.fileUpload,
            file: this.props.data.file,
            startDate: this.props.data.startDate,
            endDate: this.props.data.endDate,
            nameCertificateShort: this.props.data.nameCertificateShort,
            unit: this.props.data.unit,

        }
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
    handleCloseModale = () => {
        this.setState({
            index: this.props.index,
            urlFile: this.props.data.urlFile,
            fileUpload: this.props.data.fileUpload,
            file: this.props.data.file,
            startDate: this.props.data.startDate,
            endDate: this.props.data.endDate,
            nameCertificateShort: this.props.data.nameCertificateShort,
            unit: this.props.data.unit,
        })
        window.$(`#modal-editNewCertificateShort-${this.props.index + this.props.keys}`).modal("hide");
    }
    handleSubmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value,
            nameCertificateShort: this.refs.nameCertificateShort.value,
            unit: this.refs.unit.value,
        })
        if (this.state.nameCertificateShort === "") {
            this.notifyerror("Bạn chưa nhập tên chứng chỉ");
        } else if (this.state.unit === "") {
            this.notifyerror("Bạn chưa nhập nơi cấp");
        } else if (this.state.startDate === "") {
            this.notifyerror("Bạn chưa nhập ngày cấp");
        } else if (this.state.endDate === "") {
            this.notifyerror("Bạn chưa nhập ngày hết hạn");
        } else {
            this.props.handleChange(this.state);
            window.$(`#modal-editNewCertificateShort-${this.props.index + this.props.keys}`).modal("hide");
        }
    }
    render() {
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editNewCertificateShort-${this.props.index + this.props.keys}`} className="edit" title="Chỉnh sửa thông tin chứng chỉ" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal fade" id={`modal-editNewCertificateShort-${this.props.index + this.props.keys}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.handleCloseModale()} aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chỉnh sửa thông tin chứng chỉ:</h4>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nameCertificateShort">Tên chứng chỉ:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" ref="nameCertificateShort" defaultValue={this.state.nameCertificateShort} name="nameCertificateShort" autoComplete="off" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="unit">Nơi cấp:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" ref="unit" defaultValue={this.state.unit} name="unit" autoComplete="off" />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="startDate">Ngày cấp:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" className="form-control datepicker" defaultValue={this.state.startDate} name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="endDate">Ngày hết hạn:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" className="form-control datepicker" defaultValue={this.state.endDate} name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="file">Chọn file đính kèm:</label>
                                        <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" ref="file" name="file" onChange={this.handleChangeFile} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModale()}>Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSubmit()} title="Lưu thay đổi" >Lưu lại</button>
                            </div>
                        </div>
                    </div >
                </div>
            </div>
        );
    }
};
export { ModalEditCertificateShort };
