import React, { Component } from 'react';
class ModalAddCertificate extends Component {
    constructor(props){
        super(props);
        this.state={
            
        }
        this.handleChange= this.handleChange.bind(this)
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    render() {
        return (
            <div className="modal fade" id="modal-addNewCertificate" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới bằng cấp:</h4>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="checkbox" style={{ marginTop: 0 }}>
                                    <label style={{ paddingLeft: 0 }}>
                                        (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nameCertificate">Tên bằng cấp:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="nameCertificate" onChange={this.handleChange} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="addressCertificate">Nơi đào tạo:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="addressCertificate" onChange={this.handleChange} autoComplete="off" />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                    <label htmlFor="yearCertificate">Năm tốt nghiệp:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="yearCertificate" onChange={this.handleChange} autoComplete="off" />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="typeCertificate">Xếp loại:<span className="required">&#42;</span></label>
                                    <select className="form-control" defaultValue="Đã chấp nhận" name="typeCertificate" onChange={this.handleChange}>
                                        <option value="Xuất sắc">Xuất sắc</option>
                                        <option value="Giỏi">Giỏi</option>
                                        <option value="Khá">Khá</option>
                                        <option value="Trung bình khá">Trung bình khá</option>
                                        <option value="Trung bình">Trung bình</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="urlCertificate">Chọn file đính kèm:</label>
                                    <input type="file" className="form-control" name="urlCertificate" onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-success" title="Thêm mới đơn xin nghỉ" >Thêm mới</button>
                        </div>
                    </div>
                </div >
            </div>
        );
    }
};
export { ModalAddCertificate };
