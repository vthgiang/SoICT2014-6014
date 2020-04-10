import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ModalEditFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index,
            nameFile: this.props.data.nameFile,
            discFile: this.props.data.discFile,
            number: this.props.data.number,
            status: this.props.data.status,
            file: this.props.data.file,
            urlFile: this.props.data.urlFile,
            fileUpload: this.props.data.fileUpload,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
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
            index: this.props.index,
            nameFile: this.props.data.nameFile,
            discFile: this.props.data.discFile,
            number: this.props.data.number,
            status: this.props.data.status,
            file: this.props.data.file,
            urlFile: this.props.data.urlFile,
            fileUpload: this.props.data.fileUpload,
        })
        window.$(`#modal-editNewFile-${this.props.index + this.props.keys}`).modal("hide");
    }
    handleSunmit() {
        if (this.state.nameFile === "") {
            this.notifyerror("Bạn chưa nhập tên tài liệu đính kèm");
        } else if (this.state.discFile === "") {
            this.notifyerror("Bạn chưa nhập mô tả");
        } else if (this.state.number === "") {
            this.notifyerror("Bạn chưa nhập số lượng");
        } else if (this.state.status === "") {
            this.notifyerror("Bạn chưa nhập trạng thái");
        } else {
            this.props.handleChange(this.state);
            window.$(`#modal-editNewFile-${this.props.index + this.props.keys}`).modal("hide");
        }
    }
    render() {
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editNewFile-${this.props.index + this.props.keys}`} className="edit" title="Chỉnh sửa tài liệu đính kèm" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal fade" id={`modal-editNewFile-${this.props.index + this.props.keys}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.handleCloseModale()} aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chỉnh sửa tài liệu đính kèm:</h4>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nameFile">Tên tài liệu đính kèm:<span className="text-red">&#42;</span></label>
                                        <input type="text" className="form-control" name="nameFile" defaultValue={this.state.nameFile} onChange={this.handleChange} autoComplete="off" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="discFile">Mô tả:<span className="text-red">&#42;</span></label>
                                        <textarea className="form-control" rows="3" name="discFile" defaultValue={this.state.discFile} placeholder="Enter ..." onChange={this.handleChange}></textarea>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="number">Số lượng:<span className="text-red">&#42;</span></label>
                                        <input type="number" className="form-control" name="number" defaultValue={this.state.number} onChange={this.handleChange} autoComplete="off" />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="status">Trạng thái:<span className="text-red">&#42;</span></label>
                                        <select className="form-control" defaultValue={this.state.status} name="status" onChange={this.handleChange}>
                                            <option value="Chưa nộp">Chưa nộp</option>
                                            <option value="Đã nộp">Đã nộp</option>
                                            <option value="Đã trả">Đã trả</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="file">Chọn file đính kèm:</label>
                                        <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={this.handleChangeFile} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModale()}>Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={this.handleSunmit} title="Lưu thay đổi" >Lưu lại</button>
                            </div>
                        </div>
                    </div >
                </div>
            </div>
        );
    }
};
export { ModalEditFile };
