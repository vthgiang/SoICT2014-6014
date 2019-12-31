import React, { Component } from 'react';

class SearchDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <form style={{ marginTop: '20px', width: "100%" }} >
                    <div className="form-group" style={{width: '50%'}}>
                        <label className="d-inline" style={{ width: '100px'}}>Loại</label>
                        <select className="d-inline" style={{
                            height: '34px',
                            padding: '6px 12px',
                            border: '1px solid #ccc',
                            width: '300px',
                            backgroundColor: 'white'  
                        }}>
                            <option value="">Biểu mẫu</option>
                            <option value="">Tài liệu</option>
                            <option value="">Công văn</option>
                            <option value="">Văn bản</option>
                        </select>
                    </div>
                    <div className="form-group" style={{width: '50%'}}>
                        <label className="d-inline" style={{ width: '100px'}}>Danh mục</label>
                        <select className="d-inline" style={{
                            height: '34px',
                            padding: '6px 12px',
                            border: '1px solid #ccc',
                            width: '300px',
                            backgroundColor: 'white'  
                        }}>
                            <optgroup label="Sản xuất">
                                <option value="1">Nhà kho</option>
                                <option value="2">Nghiên cứu sản phẩm</option>
                            </optgroup>
                            <optgroup label="Công đoàn">
                                <option value="3">Khu vực 1</option>
                            </optgroup>
                            <optgroup label="Nhân sự">
                            </optgroup>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="d-inline" style={{ width: '98px'}}>Tên tài liệu </label>{" "}
                        <input className="d-inline" style={{
                                height: '34px',
                                padding: '6px 12px',
                                border: '1px solid #ccc',
                                width: '300px',
                            }}>
                        </input>
                        <button style={{ marginTop: '-3px', marginLeft: '2px' }} className="d-inline btn btn-primary">Tìm kiếm</button>
                    </div>
                </form>
                <table className="table table-bordered table-hover" style={{ marginTop: "35px" }}>
                    <thead className="bg bg-purple">
                        <tr>
                            <th>Tên tài liệu</th>
                            <th>Ngày áp dụng</th>
                            <th>File</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mẫu xin nghỉ phép</td>
                            <td>10/10/2019</td>
                            <td><a href="/"><u>download 15kB</u></a></td>
                            <td>
                                <a className="btn btn-success" data-toggle="modal" href="#modal-doc-detail1"><i className="fa fa-folder-open-o"></i></a>
                                
                            </td>
                        </tr>
                        <tr>
                            <td>Mẫu xin nghỉ phép</td>
                            <td>10/10/2019</td>
                            <td><a href="/"><u>download 15kB</u></a></td>
                            <td>
                                <a className="btn btn-success" data-toggle="modal" href="#modal-doc-detail1"><i className="fa fa-folder-open-o"></i></a>
                                
                            </td>
                        </tr>
                        <tr>
                            <td>Mẫu xin nghỉ phép</td>
                            <td>10/10/2019</td>
                            <td><a href="/"><u>download 15kB</u></a></td>
                            <td>
                                <a className="btn btn-success" data-toggle="modal" href="#modal-doc-detail1"><i className="fa fa-folder-open-o"></i></a>
                                
                            </td>
                        </tr>
                        <tr>
                            <td>Mẫu xin nghỉ phép</td>
                            <td>10/10/2019</td>
                            <td><a href="/"><u>download 15kB</u></a></td>
                            <td>
                                <a className="btn btn-success" data-toggle="modal" href="#modal-doc-detail1"><i className="fa fa-folder-open-o"></i></a>
                                
                            </td>
                        </tr>
                        <tr>
                            <td>Mẫu xin nghỉ phép</td>
                            <td>10/10/2019</td>
                            <td><a href="/"><u>download 15kB</u></a></td>
                            <td>
                                <a className="btn btn-success" data-toggle="modal" href="#modal-doc-detail1"><i className="fa fa-folder-open-o"></i></a>
                                
                            </td>
                        </tr>
                        <tr>
                            <td>Mẫu xin nghỉ phép</td>
                            <td>10/10/2019</td>
                            <td><a href="/"><u>download 15kB</u></a></td>
                            <td>
                                <a className="btn btn-success" data-toggle="modal" href="#modal-doc-detail1"><i className="fa fa-folder-open-o"></i></a>
                                
                            </td>
                        </tr>
                        <tr>
                            <td>Mẫu xin nghỉ phép</td>
                            <td>10/10/2019</td>
                            <td><a href="/"><u>download 15kB</u></a></td>
                            <td>
                                <a className="btn btn-success" data-toggle="modal" href="#modal-doc-detail1"><i className="fa fa-folder-open-o"></i></a>
                                
                            </td>
                        </tr>
                        <tr>
                            <td>Mẫu xin nghỉ phép</td>
                            <td>10/10/2019</td>
                            <td><a href="/"><u>download 15kB</u></a></td>
                            <td>
                                <a className="btn btn-success" data-toggle="modal" href="#modal-doc-detail1"><i className="fa fa-folder-open-o"></i></a>
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="modal fade" id="modal-doc-detail1">
                    <div className="modal-dialog"  style={{ width: '80%'}}>
                        <div className="modal-content">
                            <div className="modal-header bg-purple">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h4 className="modal-title">Mẫu xin nghỉ phép</h4>
                            </div>
                            <div className="modal-body">
                            <form style={{ marginTop: '20px', width: "100%" }} >
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Thông tin cơ bản</legend>
                                    <div className="form-group" style={{width: '50%'}}>
                                        <label className="d-inline" style={{ width: '100px'}}>Loại</label>
                                        <select className="d-inline" style={{
                                            height: '34px',
                                            padding: '6px 12px',
                                            border: '1px solid #ccc',
                                            width: '300px',
                                            backgroundColor: 'white'  
                                        }}>
                                            <option value="">Biểu mẫu</option>
                                            <option value="">Tài liệu</option>
                                            <option value="">Công văn</option>
                                            <option value="">Văn bản</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{width: '50%'}}>
                                        <label className="d-inline" style={{ width: '100px'}}>Danh mục</label>
                                        <select className="d-inline" style={{
                                            height: '34px',
                                            padding: '6px 12px',
                                            border: '1px solid #ccc',
                                            width: '300px',
                                            backgroundColor: 'white'  
                                        }}>
                                            <optgroup label="Sản xuất">
                                                <option value="1">Nhà kho</option>
                                                <option value="2">Nghiên cứu sản phẩm</option>
                                            </optgroup>
                                            <optgroup label="Công đoàn">
                                                <option value="3">Khu vực 1</option>
                                            </optgroup>
                                            <optgroup label="Nhân sự">
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{width: '100%'}}>
                                        <label>Mô tả</label><br></br>
                                        <textarea style={{ width: '80%', height: '150px', marginLeft: '100px',marginTop: '-30px', padding: '10px 10px 10px 10px'}}>
                                        Công ty tư vấn thiết kế kiến trúc và kỹ thuật sân bay ADPi (Pháp) đã trình Bộ Giao thông Vận tải 7 phương án điều chỉnh quy hoạch sân bay Nội Bài; đưa sân bay này đạt công suất 100 triệu hành khách hàng năm, đáp ứng nhu cầu vận tải đến năm 2030
                                        </textarea>
                                    </div>
                                    <div className="form-group" style={{width: '50%'}}>
                                        <label className="d-inline" style={{ width: '100px'}}>Ngày áp dụng</label>
                                        <input className="d-inline" 
                                            style={{
                                                height: '34px',
                                                padding: '6px 12px',
                                                border: '1px solid #ccc',
                                                width: '300px',
                                                backgroundColor: 'white'  
                                            }}
                                            defaultValue={'12/11/2019'}    
                                        >
                                        </input>
                                    </div>
                                </fieldset>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Phiên bản</legend>
                                    <div className="form-group">
                                        <label className="d-inline" style={{ width: '100px'}}>Phiên bản </label><br/>
                                        <div style={{ marginLeft: '30px' }}>
                                            <a><span><b> 3.0 </b></span><u>download 15kB</u></a><br/>
                                            <a><span><b> 2.0 </b></span><u>download 15kB</u></a><br/>
                                            <a><span><b> 1.0 </b></span><u>download 15kB</u></a><br/>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Liên kết văn bản</legend>
                                    <div className="form-group">
                                        <p style={{ marginLeft: '30px', color: 'red'}}>Xem thêm: nội dung 2.3.1 trong tài liệu cho nhân viên mới nội dung 4.2 trong tài liệu bảo hộ lao động</p>
                                        <p style={{ marginLeft: '30px'}}>1. Mẫu xin nghỉ phép <a><u>download 15 kB</u></a> <strong>Chi tiết</strong></p>
                                        <p style={{ marginLeft: '30px'}}>2. Mẫu xin nghỉ phép <a><u>download 15 kB</u></a> <strong>Chi tiết</strong></p>
                                        <p style={{ marginLeft: '30px'}}>3. Mẫu xin nghỉ phép <a><u>download 15 kB</u></a> <strong>Chi tiết</strong></p>
                                        <p style={{ marginLeft: '30px'}}>4. Mẫu xin nghỉ phép <a><u>download 15 kB</u></a> <strong>Chi tiết</strong></p>
                                        <p style={{ marginLeft: '30px'}}>5. Mẫu xin nghỉ phép <a><u>download 15 kB</u></a> <strong>Chi tiết</strong></p>
                                    </div>
                                </fieldset>
                                
                            </form>
                            </div>
                            <div className="modal-footer">
                            <button type="button" className="btn btn-danger pull-left" data-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-success">Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export default SearchDocument;