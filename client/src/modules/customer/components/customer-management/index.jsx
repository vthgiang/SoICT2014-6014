import React, { Component } from 'react';
import { CustomerActions } from '../../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {SearchBar, PaginateBar, DataTableSetting} from '../../../../common-components';
import CustomerCreate from './customerCreate';
import CustomerEdit from './customerEdit';

class CustomerManagement extends Component {
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
        this.props.getCustomers();
        this.props.getCustomers({
            limit: this.state.limit,
            page: this.state.page
        });
    }

    render() { 
        const {customers} = this.props.customer;
        const {translate} = this.props;
        const {option, currentRow} = this.state

        return ( 
            <React.Fragment>

                {/* Button thêm phân quyền mới */}
                <CustomerCreate/>

                {/* Form chỉnh sửa thông tin phân quyền */}
                {
                    // currentRow &&
                    <CustomerEdit/>
                }

                {/* Thanh tìm kiếm */}
                <SearchBar
                    columns={[
                        { title: 'Tên khách hàng', value: 'name' },
                        { title: 'Khu vực', value: 'location' }
                    ]}
                    option={option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />

                {/* Bảng dữ liệu phân quyền */}
                <table className="table table-hover table-striped table-bordered" id="table-manage-role">
                    <thead>
                        <tr>
                            <th>Tên khách hàng</th>
                            <th>Mã khách hàng</th>
                            <th>Ngày sinh</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Khu vực</th>
                            <th>Giới tính</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('table.action')}
                                <DataTableSetting
                                    columnName={translate('table.action')}
                                    columnArr={[
                                        "Tên khách hàng",
                                        "Mã khách hàng",
                                        "Số điện thoại",
                                        "Địa chỉ",
                                        "Khu vực"
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    tableId="table-manage-customer"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            customers.list.length > 0 ?
                            customers.list.map(customer =>
                                    <tr key={`customer-${customer._id}`}>
                                        <td> {customer.name} </td>
                                        <td> {customer.code} </td>
                                        <td> {customer.birth} </td>
                                        <td> {customer.phone} </td>
                                        <td> {customer.address} </td>
                                        <td> {customer.location.name} </td>
                                        <td> {customer.gender} </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a className="edit" onClick={this.handleEdit}><i className="material-icons">edit</i></a>
                                        </td>
                                    </tr>
                                ) : customers.isLoading ?
                                    <tr><td colSpan={'8'}>{translate('confirm.loading')}</td></tr> :
                                    <tr><td colSpan={'8'}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>

                {/* PaginateBar */}
                <PaginateBar pageTotal={customers.totalPages} currentPage={customers.page} func={this.setPage} />
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
    getCustomers: CustomerActions.getCustomers,
}

export default connect(mapState, getState)(withTranslate(CustomerManagement));