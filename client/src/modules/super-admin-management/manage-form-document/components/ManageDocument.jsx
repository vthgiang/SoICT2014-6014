import React, { Component } from 'react';

class ManageDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className="box-body">
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
                    </form>
                    <div className="row">
                        <div className="col-sm-8">
                            <label className="d-inline" style={{ width: '98px'}}>Tên tài liệu </label>{" "}
                            <input className="d-inline" style={{
                                height: '34px',
                                padding: '6px 12px',
                                border: '1px solid #ccc',
                                width: '300px',
                            }}></input>
                            <button style={{ marginTop: '-3px', marginLeft: '2px' }} className="d-inline btn btn-primary">Tìm kiếm</button>
                        </div>
                        <div className="col-sm-4">
                            <a className="btn btn-success pull-right" data-toggle="modal" href="#modal-id">Thêm mới</a>
                            <div className="modal fade" id="modal-id">
                                <div className="modal-dialog" style={{ width: '98%'}}>
                                    <div className="modal-content">
                                        <div className="modal-header bg bg-purple">
                                            <h3 className="modal-title" style={{ textAlign: 'center'}}>Thêm mới tài liệu, văn bản, biểu mẫu, ...</h3>
                                        </div>
                                        <div className="modal-body" style={{ height: '1000px'}}>
                                            <div style={{ marginLeft: '10px'}}>
                                                <form>
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border">Thông tin về loại tài liệu, văn bản, biểu mẫu</legend>
                                                        
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>Tên</label>
                                                                    <input type="text" className="form-control"/>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Loại</label>
                                                                    <select name id="input" className="form-control" required="required">
                                                                        <option value />
                                                                    </select>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Danh mục</label>
                                                                    <select name id="input" className="form-control" required="required">
                                                                        <option value />
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>Mô tả</label>
                                                                    <textarea type="text" className="form-control" style={{ height: '182px'}}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    
                                                    </fieldset>
                                                    <br/>
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border">Phiên bản</legend>
                                                    
                                                        <div className="row">
                                                            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div>
                                                            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                                                <div className="form-group">
                                                                    <label>Tên phiên bản</label>
                                                                    <input type="text" className="form-control"/>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Mô tả</label>
                                                                    <textarea style={{ height: '150px'}} type="text" className="form-control"/>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Ngày tạo</label>
                                                                    <div className="input-group">
                                                                        <div className="input-group-addon">
                                                                        <i className="fa fa-calendar" />
                                                                        </div>
                                                                        <input type="date" className="form-control" data-inputmask="'alias': 'dd/mm/yyyy'" data-mask />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Ngày áp dụng</label>
                                                                    <div className="input-group">
                                                                        <div className="input-group-addon">
                                                                        <i className="fa fa-calendar" />
                                                                        </div>
                                                                        <input type="date" className="form-control" data-inputmask="'alias': 'dd/mm/yyyy'" data-mask />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="exampleInputFile">Upload file<span style={{ color: 'red'}}>*</span></label>
                                                                    <input type="file" id="exampleInputFile" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="exampleInputFile">Upload file scan</label>
                                                                    <input type="file" id="exampleInputFile" />
                                                                </div>
                                                                <table className="table table-bordered table-hover" style={{ marginTop: "35px"}}>
                                                                    <thead className="bg bg-primary">
                                                                        <tr>
                                                                            <th>Tên phiên bản</th>
                                                                            <th>File</th>
                                                                            <th>File scan</th>
                                                                            <th>Mô tả</th>
                                                                            <th>Ngày tạo</th>
                                                                            <th>Ngày áp dụng</th>
                                                                            <th>Hành động</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>1.0</td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td> Mô tả về phiên bản 1.0</td>
                                                                            <td>1/11/2019</td>
                                                                            <td>30/11/2019</td>
                                                                            <td>
                                                                                <button className="btn btn-primary btn-sm"><i className="fa fa-pencil"></i></button>{" "}
                                                                                <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>2.0</td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td> Mô tả về phiên bản 2.0</td>
                                                                            <td>1/11/2019</td>
                                                                            <td>30/11/2019</td>
                                                                            <td>
                                                                                <button className="btn btn-primary btn-sm"><i className="fa fa-pencil"></i></button>{" "}
                                                                                <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div> 
                                                        </div>
                                                    </fieldset>
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border">Thông tin khác</legend>
                                                        <div className="form-group">
                                                            <label>Những vị trí nhân viên có quyền xem mẫu này<span style={{ color: 'red'}}>*</span></label>
                                                            <select 
                                                                name="abstract" 
                                                                className="form-control select2" 
                                                                multiple="multiple" 
                                                                style={{ width: '100%' }} 
                                                                defaultValue='1'
                                                                ref="abstract"
                                                            >   
                                                                <option value='1'>Nhân viên phòng hành chính</option>
                                                                <option value='2'>Nhân viên phòng DBCL</option>
                                                                <option value='3'>Tất cả nhân viên</option>
                                                            </select>
                                                        </div>
                                                        <p style={{ fontSize: '14px'}}><strong>Liên kết văn bản</strong></p>
                                                        <div className="row">
                                                            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div>
                                                            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                                                <div className="form-group">
                                                                    <label>Mô tả</label>
                                                                    <textarea style={{ height: '150px'}} type="text" className="form-control"/>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Các tài liệu liên kết</label>
                                                                    <select 
                                                                        name="abstract" 
                                                                        className="form-control select2" 
                                                                        multiple="multiple" 
                                                                        style={{ width: '100%' }} 
                                                                        defaultValue='1'
                                                                        ref="abstract"
                                                                    >   
                                                                    <option value='1'>Tài liệu cho nhân viên mới</option>
                                                                    <option value='2'>Tài liệu bảo hộ lao động</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Nơi lưu trữ bản cứng</label>
                                                            <input type="text" className="form-control" defaultValue="Ngăn 03, tủ 04, nhà D5"/>
                                                        </div>
                                                    </fieldset> 
                                                </form>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-danger pull-left" data-dismiss="modal">Thoát</button>
                                            <button type="button" className="btn btn-primary">Lưu</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
            
                    <table className="table table-bordered table-hover" style={{ marginTop: "35px" }}>
                        <thead className="bg bg-purple">
                            <tr>
                                <th>Tên tài liệu</th>
                                <th>Mô tả</th>
                                <th>Ngày tạo</th>
                                <th>Ngày áp dụng</th>
                                <th>Phiên bản</th>
                                <th>Số lần xem</th>
                                <th>Số lần download</th>
                                <th style={{ width: '110px'}}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Tài liệu số 1</td>
                                <td>Mô tả tài liệu số 1</td>
                                <td>30/11/2019</td>
                                <td>1/12/2019</td>
                                <td>1.1.0</td>
                                <td>12 
                                    <span title="Nguyễn Văn A, 17:00 20/7/19
Nguyễn Văn B, 17:00 20/7/19
Nguyễn Văn C, 17:00 20/7/19
Nguyễn Văn D, 17:00 20/7/19" style={{fontSize: '12px', color: 'blue'}}>(chi tiết)</span></td>
                                <td>12 
                                    <span title="Nguyễn Văn A, 17:00 20/7/19
Nguyễn Văn B, 17:00 20/7/19
Nguyễn Văn C, 17:00 20/7/19
Nguyễn Văn D, 17:00 20/7/19" style={{fontSize: '12px', color: 'blue'}}>(chi tiết)</span></td>
                                <td>
                                    <a className="btn btn-primary btn-sm" data-toggle="modal" href="#modal-id"><i className="fa fa-pencil"></i></a>
                                    <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Tài liệu số 1</td>
                                <td>Mô tả tài liệu số 1</td>
                                <td>30/11/2019</td>
                                <td>1/12/2019</td>
                                <td>1.1.0</td>
                                <td>12 
                                    <span title="Nguyễn Văn A, 17:00 20/7/19
Nguyễn Văn B, 17:00 20/7/19
Nguyễn Văn C, 17:00 20/7/19
Nguyễn Văn D, 17:00 20/7/19" style={{fontSize: '12px', color: 'blue'}}>(chi tiết)</span></td>
                                <td>12 
                                    <span title="Nguyễn Văn A, 17:00 20/7/19
Nguyễn Văn B, 17:00 20/7/19
Nguyễn Văn C, 17:00 20/7/19
Nguyễn Văn D, 17:00 20/7/19" style={{fontSize: '12px', color: 'blue'}}>(chi tiết)</span></td>
                                <td>
                                    <a className="btn btn-primary btn-sm" data-toggle="modal" href="#modal-id"><i className="fa fa-pencil"></i></a>
                                    <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Tài liệu số 1</td>
                                <td>Mô tả tài liệu số 1</td>
                                <td>30/11/2019</td>
                                <td>1/12/2019</td>
                                <td>1.1.0</td>
                                <td>12 
                                    <span title="Nguyễn Văn A, 17:00 20/7/19
Nguyễn Văn B, 17:00 20/7/19
Nguyễn Văn C, 17:00 20/7/19
Nguyễn Văn D, 17:00 20/7/19" style={{fontSize: '12px', color: 'blue'}}>(chi tiết)</span></td>
                                <td>12 
                                    <span title="Nguyễn Văn A, 17:00 20/7/19
Nguyễn Văn B, 17:00 20/7/19
Nguyễn Văn C, 17:00 20/7/19
Nguyễn Văn D, 17:00 20/7/19" style={{fontSize: '12px', color: 'blue'}}>(chi tiết)</span></td>
                                <td>
                                    <a className="btn btn-primary btn-sm" data-toggle="modal" href="#modal-id"><i className="fa fa-pencil"></i></a>
                                    <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Tài liệu số 1</td>
                                <td>Mô tả tài liệu số 1</td>
                                <td>30/11/2019</td>
                                <td>1/12/2019</td>
                                <td>1.1.0</td>
                                <td>12 
                                    <span title="Nguyễn Văn A, 17:00 20/7/19
Nguyễn Văn B, 17:00 20/7/19
Nguyễn Văn C, 17:00 20/7/19
Nguyễn Văn D, 17:00 20/7/19" style={{fontSize: '12px', color: 'blue'}}>(chi tiết)</span></td>
                                <td>12 
                                    <span title="Nguyễn Văn A, 17:00 20/7/19
Nguyễn Văn B, 17:00 20/7/19
Nguyễn Văn C, 17:00 20/7/19
Nguyễn Văn D, 17:00 20/7/19" style={{fontSize: '12px', color: 'blue'}}>(chi tiết)</span></td>
                                <td>
                                    <a className="btn btn-primary btn-sm" data-toggle="modal" href="#modal-id"><i className="fa fa-pencil"></i></a>
                                    <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
         );
    }
}
 
export default ManageDocument;