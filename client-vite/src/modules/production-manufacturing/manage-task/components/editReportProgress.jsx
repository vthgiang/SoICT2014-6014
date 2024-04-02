import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DatePicker } from '../../../../common-components';

const EditReportProgressModal = (props) => {
    const { translate } = props;
    const tableId = "report-progress-tableId";

    const handleChangeManufactureDate = (value) => {

    }

    const handleEditItem = (value) => {

    }

    const handleSaveItem = (value) => {

    }

    return (
        <React.Fragment>
            <DialogModal
                size="75"
                modalID={`report-progress-manufacturing`}
                formID="report-progress-manufacturing"
                title={"Cập nhật số lượng sản phẩm"}
                bodyStyle={{ padding: "10px" }}
                hasSaveButton={false}
            >
                <div>
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Cập nhật tiến độ công việc</legend>
                            <div className="form-group">
                                <label className="control-label">Tên công việc</label>
                                <input type="text" className="form-control" disabled={true} value="Công việc 1"></input>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Người thực hiện</label>
                                <input type="text" className="form-control" value="Người thực hiện"></input>
                            </div>
                            <div className="form-group col-lg-6 col-sm-6 col-md-6">
                                <label className="control-label">Ngày thực hiện</label>
                                <DatePicker
                                    id="manufacture-on-date"
                                    dateFormat="date-month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                    onChange={(value) => handleChangeManufactureDate(value)}
                                    disabled={false} />
                            </div>
                            <div className="form-group col-lg-6 col-sm-6 col-md-6">
                                <label className="control-label">Thời gian tiêu chuẩn</label>
                                <input className="form-control" value="30" disabled={true} type="number"></input>
                            </div>
                            <table id={tableId} className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th className="col-fixed" style={{ width: 60 }}>Ca</th>
                                        <th>Số BTP hoàn thiện</th>
                                        <th>Số BTP yêu cầu</th>
                                        <th>Tiến độ (%)</th>
                                        <th>Thời gian thực hiện</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-red">Ca 1</td>
                                        <td>
                                            <div className="form-group">
                                                <input className="form-control" type="number" value="30" disabled={true}></input>
                                            </div>
                                        </td>
                                        <td>100 (sp)</td>
                                        <td className="text-red">57%</td>
                                        <td>01:00:05</td>
                                        <td>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('general.edit')} onClick={(item) => handleEditItem(item)}><i className="material-icons">edit</i></a>
                                            <a className="save" style={{ width: '5px' }} title={translate('general.save')} onClick={(item) => handleSaveItem(item)}><i className="material-icons">save</i></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-red">Ca 2</td>
                                        <td>
                                            <div className="form-group">
                                                <input className="form-control" type="number" value="30" disabled={true}></input>
                                            </div>
                                        </td>
                                        <td>100 (sp)</td>
                                        <td className="text-red">57%</td>
                                        <td>01:00:05</td>
                                        <td>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('general.edit')} onClick={(item) => handleEditItem(item)}><i className="material-icons">edit</i></a>
                                            <a className="save" style={{ width: '5px' }} title={translate('general.save')} onClick={(item) => handleSaveItem(item)}><i className="material-icons">save</i></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-red">Ca 3</td>
                                        <td>
                                            <div className="form-group">
                                                <input className="form-control" type="number" value="30" disabled={true}></input>
                                            </div>
                                        </td>
                                        <td>100 (sp)</td>
                                        <td className="text-red">57%</td>
                                        <td>01:00:05</td>
                                        <td>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('general.edit')} onClick={(item) => handleEditItem(item)}><i className="material-icons">edit</i></a>
                                            <a className="save" style={{ width: '5px' }} title={translate('general.save')} onClick={(item) => handleSaveItem(item)}><i className="material-icons">save</i></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* Công thức tính số sản phẩm yêu cầu được hoàn thành */}
                            <div className="form-group">
                                <label className="control-label">Công thức tính sản phẩm yêu cầu</label>
                                <input type="text" placeholder="times/(1.15*timeOfProduct)" className="form-control"></input>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const connectEditReportProgress = connect()(withTranslate(EditReportProgressModal))
export { connectEditReportProgress as EditReportProgressModal }