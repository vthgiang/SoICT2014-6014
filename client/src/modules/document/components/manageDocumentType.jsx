import React, { Component } from 'react';

class ManageDocumentType extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <a className="btn btn-success pull-right" data-toggle="modal" href="#modal-create-type">Thêm mới</a>
                <div className="modal fade" id="modal-create-type">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg bg-purple">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                <h4 className="modal-title">Thêm mới loại văn bản</h4>
                            </div>
                            <div className="modal-body">
                                <form style={{ marginBottom: '20px' }} >
                                    <div className="form-group">
                                        <label>Tên</label>
                                        <input type="text" className="form-control" name="name" onChange={ this.inputChange }/>
                                    </div>
                                    <div className="form-group">
                                        <label>Mô tả</label>
                                        <textarea className="form-control" name="description" onChange={ this.inputChange } style={{ height: '250px' }}/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger pull-left" data-dismiss="modal">Hủy</button>
                                <button type="button" className="btn btn-success" data-dismiss="modal">Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <table className="table table-bordered table-hover" style={{ marginTop: '50px'}}>
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Biểu mẫu</td>
                                    <td>Biểu mẫu</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm"><i className="fa fa-pencil"></i></button>{" "}
                                        <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Văn bản</td>
                                    <td>Mô tả về văn bản</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm"><i className="fa fa-pencil"></i></button>{" "}
                                        <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tài liệu</td>
                                    <td>Mô tả về tài liệu</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm"><i className="fa fa-pencil"></i></button>{" "}
                                        <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Công văn</td>
                                    <td>Mô tả về công văn</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm"><i className="fa fa-pencil"></i></button>{" "}
                                        <button className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                            
            </React.Fragment>
         );
    }
}
 
export default ManageDocumentType;