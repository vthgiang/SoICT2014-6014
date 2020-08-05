import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LOCAL_SERVER_API } from '../../../../env';
import { FileAddModal, FileEditModal } from './combinedContent';

class FileTab extends Component {
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

    /**
     * Bắt sự kiện thay đổi mã hồ sơ
     * archivedRecordNumber
     */
    handleArchivedRecordNumberChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                archivedRecordNumber: value
            }

        });
        this.props.handleChange("archivedRecordNumber", value);
    }

    // Function thêm tài liệu đính kèm mặc định
    defaulteClick = async (e) => {
        var { translate } = this.props;
        e.preventDefault();
        const defaulteFile = [
            { name: "Hợp đồng mua hàng", description: "Hợp đồng mua hàng", number: "1", file: "", urlFile: "", fileUpload: "" },
            { name: "Ảnh", description: "Ảnh của tài sản", number: "1", file: "", urlFile: "", fileUpload: "" },
            { name: "Tài liệu hướng dẫn sử dụng", description: "Tài liệu hướng dẫn sử dụng", number: "1", file: "", urlFile: "", fileUpload: "" },
        ]
        await this.setState({
            files: [...this.state.files, ...defaulteFile]
        })
        this.props.handleAddFile(this.state.files)
    }

    // Function thêm thông tin tài liệu đính kèm
    handleAddFile = async (data) => {
        const { files } = this.state;
        await this.setState({
            files: [...files, {
                ...data
            }]
        })
        this.props.handleAddFile(this.state.files, data)

    }
    // Function chỉnh sửa thông tin tài liệu đính kèm
    handleEditFile = async (data) => {
        const { files } = this.state;
        files[data.index] = data;
        await this.setState({
            files: files
        })
        this.props.handleEditFile(this.state.files, data)
    }
    // Function xoá thông tin tài liệu đính kèm
    handleDeleteFile = async (index) => {
        var { files } = this.state;
        var data = files[index];
        files.splice(index, 1);
        await this.setState({
            ...this.state,
            files: [...files]
        })
        this.props.handleDeleteFile(this.state.files, data)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                files: nextProps.files,
                archivedRecordNumber: nextProps.archivedRecordNumber,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { files, archivedRecordNumber } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className=" row box-body">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Nơi lưu trữ bản cứng</label>
                            <input type="text" className="form-control" name="archivedRecordNumber" value={archivedRecordNumber} onChange={this.handleArchivedRecordNumberChange} placeholder="Nơi lưu trữ bản cứng" autoComplete="off" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <h4 className="row col-md-6 col-xs-8">Danh sách tài liệu đính kèm:</h4>
                        <FileAddModal handleChange={this.handleAddFile} id={`addFile${id}`} />
                        <button style={{ marginTop: 2, marginBottom: 10, marginRight: 15 }} type="submit" className="btn btn-primary pull-right" onClick={this.defaulteClick} title={translate('manage_employee.add_default_title')}>{translate('manage_employee.add_default')}</button>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>Tên tài liệu</th>
                                    <th>Mô tả</th>
                                    <th>Số lượng</th>
                                    <th>File đính kèm</th>
                                    <th style={{ width: '120px' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof files !== 'undefined' && files.length !== 0) &&
                                    files.map((x, index) => {
                                        return <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.description}</td>
                                            <td>{x.number}</td>
                                            <td>{!x.urlFile ? translate('manage_employee.no_files') :
                                                <a className='intable' target={x._id === undefined ? '_self' : '_blank'}
                                                    href={(x._id === undefined) ? x.urlFile : `${LOCAL_SERVER_API + x.urlFile}`}
                                                    download={x.name}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                            <td >
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_file')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteFile(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    }

                                    )}
                            </tbody>
                        </table>
                        {
                            (typeof files === 'undefined' || files.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </div>

                {
                    this.state.currentRow !== undefined &&
                    <FileEditModal
                        id={`editFile${this.state.currentRow.index}`}
                        _id={this.state.currentRow._id}
                        index={this.state.currentRow.index}
                        name={this.state.currentRow.name}
                        description={this.state.currentRow.description}
                        number={this.state.currentRow.number}
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

const fileTab = connect(null, null)(withTranslate(FileTab));
export { fileTab as FileTab };