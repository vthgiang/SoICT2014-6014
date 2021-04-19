import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';

import { PaginateBar, DataTableSetting, SearchBar, DeleteNotification, ToolTip, ConfirmNotification } from '../../../../common-components';

import { UserActions } from '../redux/actions';

import UserEditForm from './userEditForm';
import UserCreateForm from './userCreateForm';
import ModalImportUser from './modalImportUser';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
class ManageUserTable extends Component {
    constructor(props) {
        super(props);
        const tableId = "table-manage-user";
        const defaultConfig = { limit: 10 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            tableId,
            limit: limit,
            page: 1,
            option: 'name', // Mặc định tìm kiếm theo tên
            value: ''
        }
    }

    handleEdit = (user) => {
        this.setState({
            currentRow: user
        }, () => window.$('#modal-edit-user').modal('show'));
    }

    checkSuperRole = (roles) => {
        var result = false;
        if (roles !== undefined) {
            roles.map(role => {
                if (role.roleId && role.roleId.name === 'Super Admin') {
                    result = true;
                }
                return true;
            });
        }

        return result;
    }

    setPage = (page) => {
        this.setState({ page }, () => {
            const data = {
                limit: this.state.limit,
                page: page,
                key: this.state.option,
                value: this.state.value
            };

            this.props.getUser(data);
        });
    }

    setLimit = (number) => {
        if (this.state.limit !== number) {
            this.setState({ limit: number }, () => {
                const data = {
                    limit: number,
                    page: this.state.page,
                    key: this.state.option,
                    value: this.state.value
                };

                this.props.getUser(data);
            });
        }
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getUser(data);
    }

    componentDidMount() {
        this.props.getUser({ limit: this.state.limit, page: this.state.page });
    }

    sendEmailResetPasswordUser = (email) => {
        this.props.sendEmailResetPasswordUser(email);
    }

    render() {
        const { user, translate } = this.props;
        const { limit, tableId } = this.state;
        return (
            <React.Fragment>
                <div className="dropdown pull-right">
                    <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_user.add_title')} >{translate('manage_user.add')}</button>
                    <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                        <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-user').modal('show')}>{translate('manage_user.add_common')}</a></li>
                        <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-user').modal('show')}>{translate('manage_user.import')}</a></li>
                    </ul>
                </div>

                {/* Form thêm mới người dùng */}
                <UserCreateForm />
                {/* Form import thông tin người dùng */}
                <ModalImportUser limit={limit} />

                {/* Thanh tìm kiếm */}
                <SearchBar
                    columns={[
                        { title: translate('manage_user.name'), value: 'name' },
                        { title: translate('manage_user.email'), value: 'email' }
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />

                {/* Form chỉnh sửa thông tin tài khoản người dùng */}
                {
                    this.state.currentRow &&
                    <UserEditForm
                        userId={this.state.currentRow._id}
                        userEmail={this.state.currentRow.email}
                        userName={this.state.currentRow.name}
                        userActive={this.state.currentRow.active}
                        userRoles={this.state.currentRow.roles.map(role => role && role.roleId ? role.roleId._id : null)}
                        userAvatar={this.state.currentRow.avatar}
                    />
                }

                {/* Bảng dữ liệu tài khoản người dùng */}
                <table className="table table-hover table-striped table-bordered" id={tableId}>
                    <thead>
                        <tr>
                            <th>{translate('manage_user.name')}</th>
                            <th>{translate('manage_user.email')}</th>
                            <th>{translate('manage_user.roles')}</th>
                            <th>{translate('manage_user.status')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('table.action')}
                                <DataTableSetting
                                    columnArr={[
                                        translate('manage_user.name'),
                                        translate('manage_user.email'),
                                        translate('manage_user.roles'),
                                        translate('manage_user.status')
                                    ]}
                                    setLimit={this.setLimit}
                                    tableId={tableId}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !user.isLoading && user.listPaginate && user.listPaginate.length > 0 && user.listPaginate.map(u => (
                                <tr
                                    key={u._id}
                                >
                                    <td>{parse(u.name)}</td>
                                    <td>{u.email}</td>
                                    <td><ToolTip dataTooltip={u.roles.map(role => role && role.roleId ? role.roleId.name : "")} /></td>
                                    <td>{u.active
                                        ? <p><i className="fa fa-circle text-success" style={{ fontSize: "1em", marginRight: "0.25em" }} /> {translate('manage_user.enable')} </p>
                                        : <p><i className="fa fa-circle text-danger" style={{ fontSize: "1em", marginRight: "0.25em" }} /> {translate('manage_user.disable')} </p>}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a onClick={() => this.handleEdit(u)} className="edit text-yellow" href={`#${u._id}`} style={{ width: '5px' }} title={translate('manage_user.edit')}><i className="material-icons">edit</i></a>
                                        <ConfirmNotification
                                            className="text-blue"
                                            title="Gửi email thay đổi mật khẩu"
                                            name="contact_mail"
                                            content={`Xóa mật khẩu cấp 2 của người dùng (nếu có) và gửi email thay đổi mật khẩu đăng nhập tới tài khoản ${u.email}?`}
                                            icon="question"
                                            func={() => this.sendEmailResetPasswordUser(u.email)}
                                        />
                                        {
                                            !this.checkSuperRole(u.roles) &&
                                            <DeleteNotification
                                                content={translate('manage_user.delete')}
                                                data={{ id: u._id, info: u.email }}
                                                func={this.props.destroy}
                                            />
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    user.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        user.listPaginate && user.listPaginate.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                {/* PaginateBar */}
                <PaginateBar display={user?.listPaginate?.length} total={user?.totalDocs} pageTotal={user?.totalPages} currentPage={user?.page} func={this.setPage} />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state;
    return { user };
}

const mapDispatchToProps = {
    getUser: UserActions.get,
    edit: UserActions.edit,
    destroy: UserActions.destroy,
    sendEmailResetPasswordUser: UserActions.sendEmailResetPasswordUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManageUserTable));