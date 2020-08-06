import React, { Component } from 'react';
import { CustomerActions } from '../../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {SearchBar, PaginateBar, DataTableSetting} from '../../../../common-components';
import GroupCreate from './groupCreate';
import GroupEdit from './groupEdit';

class Group extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 10,
            page: 1,
            option: 'name',
            value: ''
         }
    }

    componentDidMount(){
        this.props.getCustomerGroups();
        this.props.getCustomerGroups({
            limit: this.state.limit,
            page: this.state.page
        });
    }

    render() { 
        const {group} = this.props.customer;
        const {translate} = this.props;
        const {option, currentRow} = this.state

        return ( 
            <React.Fragment>

                {/* Button thêm phân quyền mới */}
                <GroupCreate/>

                {/* Form chỉnh sửa thông tin phân quyền */}
                {
                    // currentRow &&
                    <GroupEdit/>
                }

                {/* Thanh tìm kiếm */}
                <SearchBar
                    columns={[
                        { title: 'Tên nhóm', value: 'name' },
                        { title: 'Mã nhóm', value: 'code' }
                    ]}
                    option={option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />

                {/* Bảng dữ liệu phân quyền */}
                <table className="table table-hover table-striped table-bordered" id="table-manage-role">
                    <thead>
                        <tr>
                            <th>Tên nhóm</th>
                            <th>Mã nhóm</th>
                            <th>Mô tả</th>
                            <th>Khuyến mãi áp dụng</th>
                            <th>Ngày tạo</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('table.action')}
                                <DataTableSetting
                                    columnName={translate('table.action')}
                                    columnArr={[
                                        "Tên nhóm",
                                        "Mã nhóm",
                                        "Mô tả",
                                        "Khuyến mãi áp dụng",
                                        "Ngày tạo"
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    tableId="table-manage-customer-group"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            group.list.length > 0 ?
                            group.list.map(group =>
                                    <tr key={`customer-${group._id}`}>
                                        <td> {group.name} </td>
                                        <td> {group.code} </td>
                                        <td> {group.description} </td>
                                        <td> Sale 50% </td>
                                        <td> {group.createdAt} </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a className="edit" onClick={this.handleEdit}><i className="material-icons">edit</i></a>
                                        </td>
                                    </tr>
                                ) : group.isLoading ?
                                    <tr><td colSpan={'8'}>{translate('confirm.loading')}</td></tr> :
                                    <tr><td colSpan={'8'}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>

                {/* PaginateBar */}
                <PaginateBar pageTotal={group.totalPages} currentPage={group.page} func={this.setPage} />
            </React.Fragment>
         );
    }

    // Cac ham thiet lap va tim kiem gia tri
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getCustomers(data);
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getCustomers(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getCustomers(data);
    }

    handleEdit = () => {
        window.$("#modal-edit-customer").modal('show');
    }
}
 

function mapState(state) {
    const { customer } = state;
    return { customer };
}

const getState = {
    getCustomerGroups: CustomerActions.getCustomerGroups,
}

export default connect(mapState, getState)(withTranslate(Group));