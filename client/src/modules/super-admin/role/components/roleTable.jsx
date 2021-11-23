import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SearchBar, DeleteNotification, PaginateBar, DataTableSetting, ToolTip } from '../../../../common-components';

import { RoleActions } from '../redux/actions';
import { UserActions } from '../../user/redux/actions';

import RoleCreateForm from './roleCreateForm';
import RoleInfoForm from './roleInfoForm';

import { ROLE_TYPE } from '../../../../helpers/constants';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
function RoleTable(props) {

    const tableId_constructor = "table-manage-role";
    const defaultConfig = { limit: 10 }
    const limit = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        limit: limit,
        page: 1,
        option: 'name', // Mặc định tìm kiếm theo tên
        value: ''
    })

    let { roleDuplicate, roleDuplicateName } = state;
    // Cac ham xu ly du lieu voi modal
    const handleEdit = async (role) => {
        await setState({
            ...state,
            currentRow: role
        });
        window.$('#modal-edit-role').modal('show')
    }

    // const handleCheck
    const handleCheck = () => {
        let roleDuplicateName = [];
        let roleDuplicate = [];

        // lấy ds tất cả các role name
        let allRoleNames = role.list.map(role => role && role._id ? role.name.trim().toLowerCase().replaceAll(" ", "") : "");

        // lấy ds các name bị trùng
        roleDuplicateName = [...new Set(
            allRoleNames.filter((value, index, self) => self.indexOf(value) !== index))]
        // console.log(allRoleNames);

        // lấy danh sách các role có name bị trùng
        roleDuplicate = role.list.filter(role => roleDuplicateName.includes(role.name.trim().toLowerCase().replaceAll(" ", "")))
        console.log(roleDuplicate);

        roleDuplicate = roleDuplicate.map(role => role.name.trim()).sort(Intl.Collator().compare); // sort theo alphabet ignorecase


        setState({
            ...state,
            roleDuplicate,
            roleDuplicateName
        });

        let { option, limit, value, page } = state;
        const data = {
            limit,
            page,
            key: option,
            value
        };
        props.get(data);

    }

    // Cac ham thiet lap va tim kiem gia tri
    const setOption = (title, option) => {
        setState({
            ...state,
            [title]: option
        });
    }

    const searchWithOption = () => {
        let { option, limit, value } = state;
        const data = {
            limit,
            page: 1,
            key: option,
            value
        };
        props.get(data);
    }

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        let { option, limit, value } = state;
        const data = {
            limit,
            page,
            key: option,
            value
        };
        props.get(data);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        let { option, value, page } = state;
        const data = {
            limit: number,
            page,
            key: option,
            value
        };
        props.get(data);
    }

    // Function lưu các trường thông tin vào state
    const handleChange = (name, value) => {
        // if (name === 'roleAttributes') { //
        //     if (value) {
        //         var partValue = value.split('-');
        //         value = [partValue[2], partValue[1], partValue[0]].join('-');
        //     } else {
        //         value = null
        //     }
        // }
        // if (name === "assetType") {
        //     value = JSON.stringify(value);
        // }

        setState({
            ...state,
            [name]: value
        });
    }

    useEffect(() => {
        props.get();
        props.get({ page: state.page, limit: state.limit });
        props.getUser();
    }, [])

    const deleteRole = (roleId) => {
        props.destroy(roleId);
    }

    const { role, translate } = props;
    const { currentRow, option, tableId } = state;

    return (
        <React.Fragment>

            {/* Button thêm phân quyền mới */}
            <RoleCreateForm handleChange={handleChange} />


            {/* Button kiểm tra tất cả phân quyền hợp lệ không*/}
            <div style={{ display: 'flex', marginBottom: 6, float: 'right' }}>
                <button style={{ marginRight: 10 }} type="button" className="pull-right btn btn-info" onClick={handleCheck}>Kiểm tra</button>
            </div>

            {/* Form chỉnh sửa thông tin phân quyền */}
            {
                currentRow &&
                <RoleInfoForm
                    roleId={currentRow._id}
                    roleName={currentRow.name}
                    roleType={currentRow.type ? currentRow.type.name : null}
                    roleParents={currentRow.parents.map(parent => parent ? parent._id : null)}
                    roleUsers={currentRow.users.map(user => user && user.userId ? user.userId._id : null)}
                    handleChange={handleChange}
                    roleAttributes={currentRow.attributes}
                />
            }

            {/* Thanh tìm kiếm */}
            <SearchBar
                columns={[
                    { title: translate('manage_role.name'), value: 'name' }
                ]}
                option={option}
                setOption={setOption}
                search={searchWithOption}
            />

            {/* Kết quả kiểm tra trùng lặp */}
            {roleDuplicate && roleDuplicate.length !== 0 && (
                <React.Fragment>
                    <br />
                    <p style={{ fontWeight: "bold", color: "orangered" }}>Các phân quyền sau bị trùng: {roleDuplicate.join(', ')}</p>

                </React.Fragment>
            )}
            {roleDuplicate && roleDuplicate.length == 0 && (
                <React.Fragment>
                    <br />
                    <p style={{ fontWeight: "bold", color: "green" }}>Tất cả phân quyền đều hợp lệ</p>

                </React.Fragment>
            )}


            {/* Bảng dữ liệu phân quyền */}
            <table className="table table-hover table-striped table-bordered" id={tableId}>
                <thead>
                    <tr>
                        <th>{translate('manage_role.name')}</th>
                        <th>{translate('manage_role.extends')}</th>
                        <th>{translate('manage_role.users')}</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>
                            {translate('table.action')}
                            <DataTableSetting
                                columnName={translate('table.action')}
                                columnArr={[
                                    translate('manage_role.name'),
                                    translate('manage_role.extends'),
                                    translate('manage_role.users')
                                ]}
                                setLimit={setLimit}
                                tableId={tableId}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        role.listPaginate && role.listPaginate.length > 0 &&
                        role.listPaginate.map(role =>
                            <tr key={`roleList${role._id}`} style={roleDuplicateName && roleDuplicateName.includes(role.name.trim().toLowerCase().replaceAll(" ", "")) ? { color: "orangered", fontWeight: "bold" } : { color: "" }}>
                                <td> {role.name} </td>
                                <td><ToolTip dataTooltip={role?.parents?.length ? role.parents.map(parent => parent ? parent.name : "") : []} /></td>
                                <td><ToolTip dataTooltip={role?.users?.length ? role.users.map(user => user && user.userId ? user.userId.name : "") : []} /></td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="edit" href={`#${role._id}`} onClick={() => handleEdit(role)}><i className="material-icons">edit</i></a>
                                    {
                                        role.type && role.type.name === ROLE_TYPE.COMPANY_DEFINED &&
                                        <DeleteNotification
                                            content={translate('manage_role.delete')}
                                            data={{ id: role._id, info: role.name }}
                                            func={props.destroy}
                                        />
                                    }
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {
                role.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    role.listPaginate && role.listPaginate.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
            {/* PaginateBar */}
            <PaginateBar display={role.listPaginate.length} total={role.totalDocs} pageTotal={role.totalPages} currentPage={role.page} func={setPage} />
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { role } = state;
    return { role };
}

const mapDispatchToProps = {
    get: RoleActions.get,
    getUser: UserActions.get,
    destroy: RoleActions.destroy
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoleTable));
