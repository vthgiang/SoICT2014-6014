import React, { Component } from 'react';
// import { ExcelRenderer } from 'react-excel-renderer';
class ModalImportFileBHXH extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        //this.fileHandler = this.fileHandler.bind(this);
    }
    // fileHandler = (event) => {
    //     let fileObj = event.target.files[0];
    //     ExcelRenderer(fileObj, (err, resp) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         else {
    //             this.setState({
    //                 cols: resp.cols,
    //                 rows: resp.rows
    //             });
    //         }
    //     });
    // }

    render() {
        return (
            <React.Fragment>
                <a className="btn btn-primary pull-right" style={{ marginBottom: 15, marginLeft: 10 }} data-toggle="modal" href={`#modal-importFileBHXH-${this.props.index+this.props.keys}`} title="Thêm mới bằng file excel">Import file</a>
                <div className="modal fade" id={`modal-importFileBHXH-${this.props.index+this.props.keys}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Thêm quá trình đóng BHXH:</h4>
                            </div>
                            <div className="modal-body" >
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Chọn file Import:</label>
                                        <input type="file" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" title="Thêm quá trình đóng BHXH" >Thêm mới</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};


export { ModalImportFileBHXH };