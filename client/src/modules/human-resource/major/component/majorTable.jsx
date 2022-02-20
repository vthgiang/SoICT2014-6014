import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SearchBar, DeleteNotification, PaginateBar, DataTableSetting, ToolTip, ConfirmNotification } from '../../../../common-components';

import { MajorActions } from '../redux/actions';
import EditForm from './editForm';
import CreateForm from './createForm';

import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import Swal from 'sweetalert2';
function MajorTable(props) {

    console.log("prob ------", props);

    const tableId_constructor = "table-manage-major";
    const defaultConfig = { name: '', page: 1, limit: 100 }
    const limit = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        limit: limit,
        page: 1,
        name: '', // Mặc định tìm kiếm theo tên
        page: ''
    })

    let { majorDuplicate, majorDuplicateName } = state;
    // Cac ham xu ly du lieu voi modal
    const handleAddMajor = async (major) => {
        await setState({
            ...state,
        });
        window.$('#create-major').modal('show');
    }

    const handleEdit = async (major) => {
        await setState({
            ...state,
            currentRow: major
        });
        window.$('#edit-major').modal('show')
    }

    const handleDelete = (major) => {
        const { translate } = props;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            console.log('Confirm delete');
            props.deleteMajor(major._id);            
        })
    }

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        let { name, limit } = state;
        const data = {
            limit,
            page,
            name: name,
        };
        props.get(data);
    }

    const setName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            name: value
        });
        let { name, page, limit } = state;
        const data = {
            limit: limit,
            page: page,
            name: name,
        };
        props.get(data);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        let { name, page } = state;
        const data = {
            limit: number,
            page,
            name: name,
        };
        props.get(data);
    }

    const searchWithOption = async () => {
        const data = {
            limit: state.limit,
            page: state.page,
            name: state.name
        };
        await props.get(data);
    }

    useEffect(() => {
        props.get({ name: '', page: 1, limit: 1000 });
        props.get({ name: state.name, page: state.page, limit: state.limit });
    }, [])

    const { major, translate } = props;
    const { currentRow, option, tableId, isLoading } = state;
    console.log("isLoading")

    return (
        <React.Fragment>

            {/* Button kiểm tra tất cả chuyên ngành hợp lệ không*/}
            <div style={{ display: 'flex', marginBottom: 6, float: 'right' }}>
                <a className="btn btn-success pull-right" href="#create-major" title="Add major" onClick={handleAddMajor}>Thêm</a>
            </div>

            {/* Button thêm chuyên ngành mới */}
            {
                <CreateForm 
                    list={major?.listMajor}
                />
            }

            {/* Thanh tìm kiếm */}
            <div className="form-inline">
                <div className="form-group" style={{ marginRight: '20px' }}>
                    <label className="form-control-static" style={{ marginRight: '20px' }}>Chuyên ngành</label>
                    <input type="text" className="form-control" name="name" onChange={setName} placeholder={"Nhập tên chuyên ngành"} autoComplete="off" />
                </div>
                <div className="form-group">
                    <label></label>
                    <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={searchWithOption}>{translate('asset.general_information.search')}</button>
                </div>
            </div>

            {/* Kết quả kiểm tra trùng lặp */}
            {/* {majorDuplicate && majorDuplicate.length !== 0 && (
                <React.Fragment>
                    <br />
                    <p style={{ fontWeight: "bold", color: "orangered" }}>Các chuyên ngành sau bị trùng: {majorDuplicate.join(', ')}</p>

                </React.Fragment>
            )}
            {majorDuplicate && majorDuplicate.length == 0 && (
                <React.Fragment>
                    <br />
                    <p style={{ fontWeight: "bold", color: "green" }}>Tất cả chuyên ngành đều hợp lệ</p>

                </React.Fragment>
            )} */}


            {/* Bảng dữ liệu chuyên ngành */}
            <table className="table table-hover table-striped table-bordered" id={tableId}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Code</th>
                        {/* <th>Chuyên ngành cha</th> */}
                        <th>Mô tả</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>
                            {translate('table.action')}
                            <DataTableSetting
                                columnName={translate('table.action')}
                                columnArr={[
                                    "Tên",
                                    "Code",
                                    "Chuyên ngành cha"
                                ]}
                                setLimit={setLimit}
                                tableId={tableId}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        major?.listMajor?.map(major =>
                            <tr key={`majorList${major._id}`} style={majorDuplicateName && majorDuplicateName.includes(major.name.trim().toLowerCase().replaceAll(" ", "")) ? { color: "orangered", fontWeight: "bold" } : { color: "" }}>
                                <td> {major.name} </td>
                                <td> {major.code} </td>
                                {/* <td><ToolTip dataTooltip={major?.parents?.length ? major.parents.map(parent => parent ? parent.name : "") : []} /></td> */}
                                <td> {major.description} </td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="edit" href={`#${major._id}`} onClick={() => handleEdit(major)}><i className="material-icons">edit</i></a>
                                    {/* <a className="delete" href={`#${major._id}`} onClick={() => handleDelete(major)}><i className="material-icons">delete</i></a> */}
                                    {
                                        <ConfirmNotification
                                            icon="question"
                                            title="Xóa chuyên ngành"
                                            name="delete"
                                            className="text-red"
                                            content={`<h4>Delete ${major.name + " - " + major.code}</h4>`}
                                            func={() => props.deleteMajor(major._id)}
                                        />
                                    }
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {/* Form chỉnh sửa thông tin chuyên ngành */}

            {
                currentRow &&
                <EditForm
                    majorId={currentRow._id}
                    majorName={currentRow.name}
                    majorCode={currentRow.code}
                    listData={major?.listMajor}
                    majorParent={currentRow.parents.map(parent => parent ? parent._id : null)}
                />  
            }
            {
                major.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    major.listPaginate && major.listPaginate.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
            {/* PaginateBar */}
            <PaginateBar display={major.listPaginate?.length} total={major?.totalDocs} pageTotal={major?.totalPages} currentPage={major?.page} func={setPage} />
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { major } = state;
    return { major };
}

const mapDispatchToProps = {
    get: MajorActions.getListMajor,
    deleteMajor: MajorActions.deleteMajor
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MajorTable));
