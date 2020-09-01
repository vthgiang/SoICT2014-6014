import React, { Component } from 'react';
import { CustomerActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SearchBar, PaginateBar, DataTableSetting, DateTimeConverter } from '../../../../common-components';
import CustomerGroupCreate from './customerGroupCreate';
import CustomerGroupEdit from './customerGroupEdit';

class CustomerGroup extends Component {
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
        const {customerGroup} = this.props;
        const {translate} = this.props;
        const {option, currentRow} = this.state

        return ( 
            <div className="box">
                <div className="box-body">  
                    {/* Button thêm phân quyền mới */}
                    <CustomerGroupCreate/>

                    {/* Form chỉnh sửa thông tin phân quyền */}
                    {
                        // currentRow &&
                        <CustomerGroupEdit/>
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
                    <table className="table table-hover table-striped table-bordered" id="table-manage-customer-group">
                        <thead>
                            <tr>
                                <th>Tên nhóm</th>
                                <th>Mã nhóm</th>
                                <th>Mô tả</th>
                                <th>Ngày tạo</th>
                                <th>Số lượng khách hàng</th>
                                <th style={{ textAlign: 'center' }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnName={translate('table.action')}
                                        columnArr={[
                                            "Tên nhóm",
                                            "Mã nhóm",
                                            "Mô tả",
                                            "Ngày tạo",
                                            "Số lượng khách hàng"
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
                                customerGroup.list.length > 0 ?
                                customerGroup.list.map(group =>
                                        <tr key={`customer-${group._id}`}>
                                            <td> {group.name} </td>
                                            <td> {group.code} </td>
                                            <td> {group.description} </td>
                                            <td><DateTimeConverter dateTime={group.createdAt} type="DD-MM-YYYY"/></td>
                                            <td> 0 </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a className="edit" onClick={this.handleEdit}><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>
                                    ) : customerGroup.isLoading ?
                                        <tr><td colSpan={'6'}>{translate('confirm.loading')}</td></tr> :
                                        <tr><td colSpan={'6'}>{translate('confirm.no_data')}</td></tr>
                            }
                        </tbody>
                    </table>
                    {/* PaginateBar */}
                    <PaginateBar pageTotal={customerGroup.totalPages} currentPage={customerGroup.page} func={this.setPage} />
                </div>
            </div>
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
    const { customerGroup } = state;
    return { customerGroup };
}

const getState = {
    getCustomerGroups: CustomerActions.getCustomerGroups,
}

export default connect(mapState, getState)(withTranslate(CustomerGroup));