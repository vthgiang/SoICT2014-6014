import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    ModalAddFile, ModalEditFile,
} from './CombineContent';

class TabAttachmentsContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Bắt sự kiện click edit khen thưởng
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-file-editFile${index}`).modal('show');
    }
    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.props.handleChange(name, value);
    }
    // Function thêm tài liệu đính kèm mặc định
    defaulteClick = async (e) => {
        e.preventDefault();
        const defaulteFile = [
            { nameFile: "Bằng cấp", discFile: "Bằng tốt nghiệp trình độ học vấn cao nhất", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Sơ yếu lý lịch", discFile: "Sơ yếu lý lịch có công chứng", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Ảnh", discFile: "Ảnh 4X6", number: "3", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Bản sao CMND/Hộ chiếu", discFile: "Bản sao chứng minh thư nhân dân hoặc hộ chiếu có công chứng", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Giấy khám sức khoẻ", discFile: "Giấy khám sức khoẻ có dấu đỏ", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Giấy khai sinh", discFile: "Giấy khái sinh có công chứng", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Đơn xin việc", discFile: "Đơn xin việc viết tay", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "CV", discFile: "CV của nhân viên", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Cam kết", discFile: "Giấy cam kết làm việc", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Tạm trú tạm vắng", discFile: "Giấy xác nhận tạm trú tạm vắng", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " }
        ]
        await this.setState({
            file: defaulteFile
        })
        this.props.handleAddFile(this.state.file)
    }

    // Function thêm thông tin tài liệu đính kèm
    handleAddFile = async (data) => {
        const { file } = this.state;
        await this.setState({
            file: [...file, {
                ...data
            }]
        })
        this.props.handleAddFile(this.state.file)

    }
    // Function chỉnh sửa thông tin tài liệu đính kèm
    handleEditFile = async (data) => {
        const { file } = this.state;
        file[data.index] = data;
        await this.setState({
            file: file
        })
        this.props.handleEditFile(this.state.file)
    }
    // Function xoá kinh nghiệm làm việc
    delete = async (index) => {
        var { file } = this.state;
        file.splice(index, 1);
        await this.setState({
            ...this.state,
            file: [...file]
        })
        this.props.handleDeleteFile(this.state.file)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                file: nextProps.file,
                numberFile: nextProps.employee.numberFile,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { file, numberFile } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className=" row box-body">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>{translate('manage_employee.attachments_code')}</label>
                            <input type="text" className="form-control" name="numberFile" value={numberFile} onChange={this.handleChange} placeholder={translate('manage_employee.attachments_code')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <h4 className="row col-md-6">{translate('manage_employee.list_attachments')}:</h4>
                        <ModalAddFile handleChange={this.handleAddFile} id={`addFile${id}`} />
                        <button style={{ marginBottom: 5, marginRight: 15 }} type="submit" className="btn btn-primary pull-right" onClick={this.defaulteClick} title={translate('manage_employee.add_default_title')}>{translate('manage_employee.add_default')}</button>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.file_name')}</th>
                                    <th>{translate('table.description')}</th>
                                    <th>{translate('manage_employee.number')}</th>
                                    <th>{translate('table.status')}</th>
                                    <th>{translate('manage_employee.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof file !== 'undefined' && file.length !== 0) &&
                                    file.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.nameFile}</td>
                                            <td>{x.discFile}</td>
                                            <td>{x.number}</td>
                                            <td>{x.status}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? "Chưa có file" :
                                                <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}</td>
                                            <td >
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_file')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof file === 'undefined' || file.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </div>
                {
                    id === "pageAttachments" &&
                    <div className=" box-footer">
                        <button type="reset" title="Thêm nhân viên mới" className="btn btn-success col-md-2 pull-right btnuser" onClick={() => this.props.handleSubmit()}>{translate('manage_employee.add_staff')}</button>
                    </div>
                }

                {
                    this.state.currentRow !== undefined &&
                    <ModalEditFile
                        id={`editFile${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        nameFile={this.state.currentRow.nameFile}
                        discFile={this.state.currentRow.discFile}
                        number={this.state.currentRow.number}
                        status={this.state.currentRow.status}
                        file={this.state.currentRow.file}
                        urlFile={this.state.currentRow.urlFile}
                        fileUpload={this.state.currentRow.fileUpload}
                        handleChange={this.handleEditFile}
                    />
                }
            </div>
        );
    }
};

const tabAttachments = connect(null, null)(withTranslate(TabAttachmentsContent));
export { tabAttachments as TabAttachmentsContent };