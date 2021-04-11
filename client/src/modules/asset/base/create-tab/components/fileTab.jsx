import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { FileAddModal, FileEditModal } from './combinedContent';

import { AuthActions } from '../../../../auth/redux/actions';

function FileTab(props) {
    const [state, setState] =useState({
        files: []
    })
    const [prevProps, setPrevProps] = useState({
        id: null
    })

    // Bắt sự kiện click edit khen thưởng
    const handleEdit = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-file-editFile${index}`).modal('show');
    }

    // Function lưu các trường thông tin vào state
    const handleChange = (e) => {
        const { name, value } = e.target;
        props.handleChange(name, value);
    }

    // Function thêm tài liệu đính kèm mặc định
    const defaulteClick = async (e) => {
        var { translate } = props;
        e.preventDefault();

        const defaulteFile = [
            { name: "Hợp đồng mua hàng", description: "Hợp đồng mua hàng", files: [] },
            { name: "Ảnh", description: "Ảnh của tài sản", files: [] },
            { name: "Tài liệu hướng dẫn sử dụng", description: "Tài liệu hướng dẫn sử dụng", files: [] },
        ]

        const filelist = state.files
        filelist.push(...defaulteFile)
        console.log(filelist)
        await setState(state =>{
            return{
                ...state,
                files: filelist
            }
        })

        props.handleAddFile(state.files)
    }

    // Function thêm thông tin tài liệu đính kèm
    const handleAddFile = async (data) => {
        let { files } = state;
        if (!files) {
            files = [];
        }

        await setState(state => {
            return {
                ...state,
                files: [...files, {
                    ...data
                }]
            }
        })
        props.handleAddFile(state.files, data)
    }

    // Function chỉnh sửa thông tin tài liệu đính kèm
    const handleEditFile = async (data) => {
        const { files } = state;
        files[data.index] = data;
        await setState(state =>{
            return{
                ...state,
                files: files
            }
            
        })
        props.handleEditFile(state.files, data)
    }

    // Function xoá thông tin tài liệu đính kèm
    const handleDeleteFile = async (index) => {
        var { files } = state;
        var data = files[index];
        files.splice(index, 1);
        await setState({
            ...state,
            files: [...files]
        })
        props.handleDeleteFile(state.files, data)
    }

   const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        props.downloadFile(path, fileName);
    }

    if(props.id !== props.id){
        setState(state => {
            return{
                ...state,
                id: props.id,
                files: props.files,
                archivedRecordNumber: props.archivedRecordNumber,
            }
        })
        setPrevProps(props)
    }
    
    const { id, translate } = props;
    const { files, archivedRecordNumber, currentRow } = state;
    console.log(files)
    return (
        <div id={id} className="tab-pane">
            <div className=" row box-body">

                {/* Danh sách tài liệu đính kèm */}
                <div className="col-md-12">
                    {/* Form thêm tài liệu đính kèm */}
                    <FileAddModal handleChange={handleAddFile} id={`addFile${id}`} />
                    {/* Button mặc định */}
                    <button style={{ marginTop: 2, marginBottom: 10, marginRight: 15 }} type="submit" className="btn btn-primary pull-right" onClick={defaulteClick} title={translate('manage_asset.add_default_title')}>{translate('manage_asset.add_default')}</button>

                    {/* Bảng tài liệu đính kèm */}
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('asset.general_information.file_name')}</th>
                                <th>{translate('asset.general_information.description')}</th>
                                <th>{translate('asset.general_information.attached_file')}</th>
                                <th style={{ width: '120px' }}>{translate('table.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(files && files.length !== 0) &&
                                files.map((x, index) => {
                                    return <tr key={index}>
                                        <td>{x.name}</td>
                                        <td>{x.description}</td>
                                        <td>{!(x.files && x.files.length) ? translate('confirm.no_data') :
                                            <ul style={{ listStyle: 'none' }}>
                                                {x.files.map((child, index) => {
                                                    return (
                                                        <React.Fragment>
                                                            <li>
                                                                <a style={{ cursor: "pointer" }} onClick={(e) => requestDownloadFile(e, child.url, child.fileName)} >{child.fileName}</a>
                                                            </li>
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </ul>
                                        }</td>
                                        <td >
                                            <a onClick={() => handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.general_information.edit_document')}><i className="material-icons">edit</i></a>
                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteFile(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    {
                        (!files || files.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </div>
            </div>

            {/* Form chỉnh sửa tài liệu đính kèm */}
            {
                currentRow &&
                <FileEditModal
                    id={`editFile${currentRow.index}`}
                    _id={currentRow._id}
                    index={currentRow.index}
                    name={state.currentRow.name}
                    description={currentRow.description}
                    files={currentRow.files}
                    handleEditFile={handleEditFile}
                />
            }
        </div>
    );
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const fileTab = connect(null, actionCreators)(withTranslate(FileTab));
export { fileTab as FileTab };