import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SearchBar, DeleteNotification, PaginateBar, DataTableSetting, ToolTip, ConfirmNotification } from '../../../../common-components';

import { TagActions } from '../redux/actions';
import EditForm from './editForm';
import DetailForm from './detailForm';
import CreateForm from './createForm';

import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import Swal from 'sweetalert2';
import { convertEmpIdToName } from '../../bidding-package/biddingPackageManagement/components/employeeHelper';
import { EmployeeManagerActions } from '../../../human-resource/profile/employee-management/redux/actions';
function TagTable(props) {
    const tableId_constructor = "table-manage-tag";
    const defaultConfig = { name: '', page: 0, limit: 20 }
    const limit = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        limit: limit,
        page: 0,
        name: '', // Mặc định tìm kiếm theo tên
    })

    useEffect(() => {
        props.getAllEmployee();
        props.getListTag({ name: state.name, page: state.page, limit: state.limit });
    }, [])

    let { tagDuplicate, tagDuplicateName } = state;
    // Cac ham xu ly du lieu voi modal
    const handleAddTag = async (tag) => {
        setState({
            ...state,
        });
        window.$('#modal-create-tag-create').modal('show');
    }

    const handleEdit = async (tag) => {
        setState({
            ...state,
            currentRow: tag
        });
        setTimeout(() => {
            window.$(`#modal-edit-tag-${tag._id}`).modal('show')
        }, 500);
    }

    const handleView = async (tag) => {
        setState({
            ...state,
            currentRowView: tag
        });
        setTimeout(() => {
            window.$(`#modal-detail-tag-${tag._id}`).modal('show')
        }, 500);
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
        props.getListTag(data);
    }

    const setName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            name: value
        });
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
        props.getListTag(data);
    }

    const searchWithOption = async () => {
        const data = {
            limit: state.limit,
            page: state.page,
            name: state.name
        };
        props.getListTag(data);
    }

    const { tag, translate, employeesManager } = props;
    const { currentRow, currentRowView, tableId, isLoading } = state;
    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    return (
        <React.Fragment>

            <div className="box">
                <div className="box-body">
                    <div>
                        <button className="btn btn-success pull-right" type="button" title="Add tag" onClick={handleAddTag}>Thêm mới</button>
                    </div>

                    {/* Button thêm chuyên ngành mới */}
                    {
                        <CreateForm
                            id={`create`}
                        />
                    }

                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">
                        <div className="form-group" style={{ marginRight: '20px' }}>
                            <label className="form-control-static" style={{ marginRight: '20px' }}>Tên</label>
                            <input type="text" className="form-control" name="name" onChange={setName} placeholder={"Nhập tên tag"} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={searchWithOption}>{translate('asset.general_information.search')}</button>
                        </div>
                    </div>
                    <br />


                    {/* Bảng dữ liệu tag */}
                    <table className="table table-hover table-striped table-bordered" id={tableId}>
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Mô tả</th>
                                <th>Nhân sự phù hợp</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnName={translate('table.action')}
                                        columnArr={[
                                            "Tên",
                                            "Mô tả",
                                            "Nhân sự phù hợp"
                                        ]}
                                        setLimit={setLimit}
                                        tableId={tableId}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tag?.listTag?.map(tag =>
                                    <tr key={`tagList${tag._id}`} style={tagDuplicateName && tagDuplicateName.includes(tag.name.trim().toLowerCase().replaceAll(" ", "")) ? { color: "orangered", fontWeight: "bold" } : { color: "" }}>
                                        <td> {tag.name} </td>
                                        <td> {tag.description} </td>
                                        <td> {tag?.employees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a onClick={() => handleView(tag)} title="detail"><i className="material-icons">view_list</i></a>
                                            <a className="edit" title='edit' onClick={() => handleEdit(tag)}><i className="material-icons">edit</i></a>
                                            {
                                                <ConfirmNotification
                                                    icon="question"
                                                    title="Xóa tag"
                                                    name="delete"
                                                    className="text-red"
                                                    content={`<h4>Delete tag: ${tag.name}</h4>`}
                                                    func={() => props.deleteTag(tag._id)}
                                                />
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                    {/* modal chỉnh sưa tag */}
                    {
                        <EditForm
                            id={currentRow?._id ?? null}
                            tagItem={currentRow ?? currentRow}
                        />
                    }
                    {/* modal chỉnh sưa tag */}
                    {
                        <DetailForm
                            id={currentRowView?._id ?? null}
                            tagItem={currentRowView ?? currentRowView}
                        />
                    }
                    {
                        tag.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            tag.listTag && tag.listTag.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    {/* PaginateBar */}
                    <PaginateBar display={tag.listTag?.length} total={tag?.totalDocs} pageTotal={tag?.totalPages} currentPage={tag?.page} func={setPage} />
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { tag, employeesManager } = state;
    return { tag, employeesManager };
}

const mapDispatchToProps = {
    getListTag: TagActions.getListTag,
    deleteTag: TagActions.deleteTag,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TagTable));
