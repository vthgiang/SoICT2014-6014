import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ModalAddFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameFile: "",
            discFile: "",
            number: "",
            status: "Đã nộp",
            file: "",
            urlFile: " ",
            fileUpload: " "
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
            nameFile: "",
            discFile: "",
            number: "",
            status: "Đã nộp",
            urlFile: "",
            file: " ",
            fileUpload: " "
        })
        window.$(`#modal-addNewFile-${this.props.index}`).modal("hide");
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
            this.setState({
                nameFile: "",
                discFile: "",
                number: "",
                status: "Đã nộp",
                urlFile: "",
                file: " ",
                fileUpload: " "
            })
            document.getElementById(`formFile-${this.props.index}`).reset();
            window.$(`#modal-addNewFile-${this.props.index}`).modal("hide");
        }

    }
    render() {
        return (
            <React.Fragment>
                <a className="btn btn-success pull-right" style={{ marginBottom: 15 }} data-toggle="modal" href={`#modal-addNewFile-${this.props.index}`} title="Thêm mới tài liệu đính kèm">Thêm mới</a>
                <div className="modal fade" id={`modal-addNewFile-${this.props.index}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.handleCloseModale()} aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Thêm mới tài liệu đính kèm:</h4>
                            </div>
                            <form id={`formFile-${this.props.index}`}>
                                <div className="modal-body">
                                    <div className="col-md-12">
                                        <div className="checkbox" style={{ marginTop: 0 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nameFile">Tên tài liệu đính kèm:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="nameFile" onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="discFile">Mô tả:<span className="required">&#42;</span></label>
                                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="discFile" placeholder="Enter ..." onChange={this.handleChange}></textarea>
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                            <label htmlFor="number">Số lượng:<span className="required">&#42;</span></label>
                                            <input type="number" className="form-control" name="number" onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                            <label htmlFor="status">Trạng thái:<span className="required">&#42;</span></label>
                                            <select className="form-control" defaultValue="Đã nộp" name="status" onChange={this.handleChange}>
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
                                    <button style={{ marginRight: 15 }} type="reset" className="btn btn-default pull-right" onClick={() => this.handleCloseModale()}>Đóng</button>
                                    <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={this.handleSunmit} title="Thêm mới tài liệu đính kèm" >Thêm mới</button>
                                </div>
                            </form>
                        </div>
                    </div >
                </div>
            </React.Fragment>
        );
    }
};
export { ModalAddFile };
