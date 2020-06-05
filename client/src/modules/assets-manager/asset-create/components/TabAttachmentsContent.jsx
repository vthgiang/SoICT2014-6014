import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';

import {ModalAddFile, ModalEditFile,} from './CombineContent';

class TabAttachmentsContent extends Component {
    constructor(props) {
        super(props);
        this.state = {file: []};
    }

    // Bắt sự kiện click edit khen thưởng
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: {...value, index: index}
            }
        });
        window.$(`#modal-edit-file-editFile${index}`).modal('show');
    }
    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const {name, value} = e.target;
        this.props.handleChange(name, value);
    }

    // Function thêm thông tin tài liệu đính kèm
    handleAddFile = async (data) => {
        await this.setState(state => {
            return {
                ...state,
                file: state.file !== undefined ? [...state.file, data] : [{...data}]
            }

        })
        this.props.handleAddFile(this.state.file, data)

    }
    // Function chỉnh sửa thông tin tài liệu đính kèm
    handleEditFile = async (fileEdit) => {
        var {file} = this.state;
        file[fileEdit.index] = fileEdit;
        await this.setState({
            file
        })
        this.props.handleEditFile(this.state.file, file[fileEdit.index])
    }
    // Function xóa tài liệu đính kèm
    handleDeleteFile = async (index) => {
        var {file} = this.state;
        var data = file[index];
        file.splice(index, 1);
        await this.setState({
            ...this.state,
            file: [...file]
        })
        this.props.handleDeleteFile(this.state.file, data)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                file: nextProps.asset.file,
                numberFile: nextProps.asset.numberFile,
            }
        } else {
            return null;
        }
    }

    render() {
        const {id, translate} = this.props;
        const {file, numberFile} = this.state;
        let newFile = ( file !== undefined) ?  file.map(item => ({...item, file: item.urlFile})) : [];
        return (
            <div id={id} className="tab-pane">
                <div className=" row box-body">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Nơi lưu trữ bản cứng</label>
                            <input type="text" className="form-control" name="numberFile" value={numberFile} onChange={this.handleChange} placeholder="Nơi lưu trữ bản cứng" autoComplete="off"/>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <h4 className="row col-md-6">Danh sách tài liệu đính kèm:</h4>
                        <ModalAddFile handleChange={this.handleAddFile} id={`addFile${id}`}/>
                        <table className="table table-striped table-bordered table-hover" style={{marginBottom: 0}}>
                            <thead>
                            <tr>
                                <th>Tên tài liệu</th>
                                <th>Mô tả</th>
                                <th>Số lượng</th>
                                <th>File đính kèm</th>
                                <th style={{width: '120px'}}>{translate('table.action')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(typeof file !== 'undefined' && file.length !== 0) &&
                            newFile.map((x, index) => (
                                <tr key={index}>
                                    <td>{x.nameFile}</td>
                                    <td>{x.discFile}</td>
                                    <td>{x.number}</td>
                                    <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? translate('manage_employee.no_files') :
                                        <a href={x.urlFile} target="_blank"><u>{x.urlFile}</u></a>}</td>
                                    <td>
                                        <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{width: '5px'}} title={translate('manage_employee.edit_file')}><i
                                            className="material-icons">edit</i></a>
                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteFile(index)}><i className="material-icons"></i></a>
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
                    id === "pagetailieu" &&
                    <div className=" box-footer">
                        <button type="reset" title="Thêm tài sản mới" className="btn btn-success col-md-2 pull-right btnuser" onClick={() => this.props.handleSubmit()}>Thêm tài sản mới</button>
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
export {tabAttachments as TabAttachmentsContent};
