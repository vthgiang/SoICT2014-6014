import React, { Component } from 'react';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

class TaskReportViewForm extends Component {
    render() {
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-view-taskreport" isLoading={false}
                    formID="form-view-tasktemplate"
                    title="Xem chi tiết báo cáo"
                    hasSaveButton={false}
                >
                    {/* Modal Body */}
                    <div className="form-inline">
                        <button id="exportButton" className="btn btn-sm btn-success " style={{ marginBottom: '10px' }}><span className="fa fa-file-excel-o"></span> Export to Excel</button>
                    </div>
                    <div className="row row-equal-height" >
                        <table className="table table-hover table-striped table-bordered" id="report_manager">
                            <thead>
                                <tr>
                                    <th style={{ width: '120px', textAlign: 'center' }}>Công việc</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>Người thực hiện</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>Người phê duyệt</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Điểm tự đánh giá
                                    </th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Điểm hệ thống tự tính
                                    </th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Ngày bắt đầu
                                    </th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Ngày kết thúc
                                    </th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Mức độ ưu tiên
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Công việc thứ 1</td>
                                    <td>Phạm thị Nhung</td>
                                    <td>Nguyễn Thị Thủy</td>
                                    <td>80</td>
                                    <td>85</td>
                                    <td>14/7/2020</td>
                                    <td>14/7/2020</td>
                                    <td>Cao</td>
                                </tr>

                            </tbody>
                        </table>

                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default TaskReportViewForm;