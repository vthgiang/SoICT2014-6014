import React, { Component } from 'react';

class ModalEditOrganizational extends Component {
    render() {
        var { department, listAll, value } = this.props;
        //var value = 20150539;
        return (
            <div className="modal fade" id="modal-editOrganizational">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thay đổi cơ cấu tổ chức: {department}</h4>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12" style={{ paddingLeft: 0 }}>
                                <div className="form-group col-md-6">
                                    <label>Trưởng {department.toLowerCase()}:</label>
                                    {listAll &&
                                        <select className="form-control select2" style={{ width: '100%' }} defaultValue={value}>
                                            {
                                                listAll.map((x, index) => (
                                                    <option key={index} value={x.employeeNumber} style={{ height: 30 }}>{x.fullName} - {x.employeeNumber}</option>
                                                ))
                                            }
                                        </select>
                                    }
                                </div>
                            </div>
                            <div className="col-md-12" style={{ paddingLeft: 0 }}>
                                <div className="form-group col-md-6">
                                    <label>Phó {department.toLowerCase()}:</label>
                                    <select className="form-control select2" multiple="multiple" style={{ width: '100%' }}>

                                        <option style={{ height: 30 }}></option>

                                    </select>
                                </div>
                            </div>
                            <div className="col-md-12" style={{ paddingLeft: 0 }}>
                                <div className="form-group col-md-6" >
                                    <label>Thêm nhân viên vào {department.toLowerCase()}:</label>
                                    {listAll &&
                                        <select className="form-control select2" multiple="multiple" style={{ width: '100%' }}>
                                            {
                                                listAll.map((x, index) => (
                                                    <option key={index} value={x.employeeNumber} style={{ height: 30 }}>{x.fullName} - {x.employeeNumber}</option>
                                                ))
                                            }
                                            <option style={{ height: 30 }}></option>
                                        </select>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                    {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
            </div >

        )
    }
};

export { ModalEditOrganizational };