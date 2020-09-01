import React, { Component } from 'react';
import { CustomerActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {SearchBar, PaginateBar, DataTableSetting, ButtonModal} from '../../../../common-components';
import CustomerCreate from './customerCreate';
import CustomerEdit from './customerEdit';
import CustomerInformation from './customerInformation';
import CustomerImportFile from './customerImportFile';

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
        const {customer} = this.props;
        const {translate} = this.props;
        const {option, currentRow} = this.state

        return ( 
            <div class="box">
                <div className="box-body">
                    <CustomerCreate/>
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success pull-right dropdown-toggle" data-toggle="dropdown" aria-expanded="true" title="Thêm mới kế hoạch làm việc" >Thêm mới</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }} >
                            <li><a title={'Thêm mới khách hàng từ file excel'} onClick={this.handleImport}>Import file Excel</a></li>
                            <li><a title={'Thêm mới khách hàng'} onClick={this.handleCreate}>Thêm bằng tay</a></li>
                        </ul>
                    </div>
                    <a type="button" className="btn btn-primary pull-right" style={{marginRight: '2px'}}>Xuất file</a>
                    {
                        currentRow !== undefined &&
                        <CustomerEdit
                            id={currentRow._id}
                            name={currentRow.name}
                            code={currentRow.code}
                            phone={currentRow.phone}
                            email={currentRow.email}
                            group={currentRow.group._id}
                        />
                    }
                    {
                        currentRow !== undefined &&
                        <CustomerInformation
                            id={currentRow._id}
                            name={currentRow.name}
                            liabilities={currentRow.liabilities}
                        />
                    }
                    {
                        <CustomerImportFile/>
                    }
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
                                <th>Số điện thoại</th>
                                <th>Khu vực</th>
                                <th>Email</th>
                                <th>Nhóm khách hàng</th>
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
                                customer.list.length > 0 ?
                                customer.list.map(customer =>
                                        <tr key={`customer-${customer._id}`}>
                                            <td> {customer.name} </td>
                                            <td> {customer.code} </td>
                                            <td> {customer.phone} </td>
                                            <td> {customer.location} </td>
                                            <td> {customer.email} </td>
                                            <td> {customer.group ? customer.group.name : null} </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a className="text-green" onClick={() => this.handleInformation(customer)}><i className="material-icons">visibility</i></a>
                                                <a className="edit" onClick={()=>this.handleEdit(customer)}><i className="material-icons">edit</i></a>
                                                <a className="text-red"><i className="material-icons">delete</i></a>
                                            </td>
                                        </tr>
                                    ) : customer.isLoading ?
                                        <tr><td colSpan={'8'}>{translate('confirm.loading')}</td></tr> :
                                        <tr><td colSpan={'8'}>{translate('confirm.no_data')}</td></tr>
                            }
                        </tbody>
                    </table>

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={customer.totalPages} currentPage={customer.page} func={this.setPage} />
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

    handleCreate = () => {
        window.$("#modal-create-customer").modal('show');
    }

    handleImport = () => {
        window.$("#modal-customer-import").modal('show');
    }

    handleEdit = async (customer) => {
        await this.setState({
            currentRow: customer
        })
        window.$("#modal-edit-customer").modal('show');
    }

    handleInformation = async (customer) => {
        await this.setState({
            currentRow: customer
        })
        window.$("#modal-customer-information").modal('show');
    }
}
 

function mapState(state) {
    const { customer, customerGroup } = state;
    return { customer, customerGroup };
}

const getState = {
    getCustomers: CustomerActions.getCustomers
}

export default connect(mapState, getState)(withTranslate(CustomerManagement));