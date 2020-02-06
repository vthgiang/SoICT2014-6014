import React, { Component } from 'react';

class ActionColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { columnName, hideColumn } = this.props;
        return ( 
            <React.Fragment>
                { columnName }
                <button type="button" data-toggle="collapse" data-target="#setting-table" style={{ border: "none", background: "none" }}><i className="fa fa-gear"></i></button>
                <div id="setting-table" className="row collapse" style={{ width: "26%" }}>
                    <span className="pop-arw arwTop L-auto" style={{ right: "13px" }}></span>
                    {
                        hideColumn && 
                            <div className="col-xs-12">
                            <label style={{ marginRight: "15px" }}>Ẩn cột:</label>
                            <select id="multiSelectShowColumn" multiple="multiple">
                                <option value="1">Tên mẫu</option>
                                <option value="2">Mô tả</option>
                                <option value="3">Số lần sử dụng</option>
                                <option value="4">Người tạo</option>
                                <option value="5">Đơn vị</option>
                                <option value="6">Hoạt động</option>
                            </select>
                        </div>
                    }
                    <div className="col-xs-12" style={{ marginTop: "10px" }}>
                        <label style={{ marginRight: "15px" }}>Số dòng/trang:</label>
                        <input className="form-control" type="text" defaultValue={1} />
                    </div>
                    <div className="col-xs-2 col-xs-offset-6" style={{ marginTop: "10px" }}>
                        <button type="button" className="btn btn-success">Cập nhật</button>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export default ActionColumn;