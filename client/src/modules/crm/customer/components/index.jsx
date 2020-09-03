import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmCustomerActions } from '../redux/actions';
import { getStorage } from '../../../../config';
import { DataTableSetting, PaginateBar, ConfirmNotification, SearchBar } from '../../../../common-components';
import CreateForm from './createForm';
import InfoForm from './infoForm';
import EditForm from './editForm';

class CrmCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 10,
            page: 1,
            option: 'name',
            value: ''
         }
    }

    render() { 
        const { translate, crm } = this.props;
        const { list, listPaginate } = crm.customer;
        const { option, value, customer } = this.state;

        return ( 
            <div class="box">
                <div className="box-body">
                    <CreateForm/>
                    { customer !== undefined && <InfoForm customer={customer} /> }
                    { customer !== undefined && <EditForm customer={customer} /> }

                    <SearchBar
                        columns={[
                            { title: translate('crm.customer.name'), value: 'name' },
                            { title: translate('crm.customer.code'), value: 'code' },
                            { title: translate('crm.customer.phone'), value: 'phone' },
                            { title: translate('crm.customer.email'), value: 'email' },
                            { title: translate('crm.customer.address'), value: 'address' },
                        ]}
                        option={option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />
                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-customer">
                        <thead>
                            <tr>
                                <th>{translate('crm.customer.name')}</th>
                                <th>{translate('crm.customer.code')}</th>
                                <th>{translate('crm.customer.phone')}</th>
                                <th>{translate('crm.customer.email')}</th>
                                <th>{translate('crm.customer.address')}</th>
                                <th style={{ width: "120px" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnArr={[
                                            translate('crm.customer.name'),
                                            translate('crm.customer.code'),
                                            translate('crm.customer.phone'),
                                            translate('crm.customer.email'),
                                            translate('crm.customer.address')
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        tableId="table-manage-crm-customer"
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listPaginate.length > 0 ?
                                    listPaginate.map(cus =>
                                        <tr key={cus._id}>
                                            <td>{cus.name}</td>
                                            <td>{cus.code}</td>
                                            <td>{cus.phone}</td>
                                            <td>{cus.email}</td>
                                            <td>{cus.address}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a className="text-green" onClick={() => this.handleInfo(cus)}><i className="material-icons">visibility</i></a>
                                                <a className="text-yellow" onClick={() => this.handleEdit(cus)}><i className="material-icons">edit</i></a>
                                                <ConfirmNotification
                                                    icon="question"
                                                    title="Xóa thông tin về khách hàng"
                                                    content="<h3>Xóa thông tin khách hàng</h3>"
                                                    name="delete"
                                                    className="text-red"
                                                    func={()=>this.props.deleteCustomer(cus._id)}
                                                />
                                            </td>
                                        </tr>
                                    ) : crm.customer.isLoading ?
                                        <tr><td colSpan={6}>{translate('general.loading')}</td></tr> :
                                        <tr><td colSpan={6}>{translate('general.no_data')}</td></tr>
                            }
                        </tbody>
                    </table>

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={crm.customer.totalPages} currentPage={crm.customer.page} func={this.setPage} />
                </div>
            </div>
         );
    }

    componentDidMount(){
        let company = getStorage('companyId');
        let { limit, page } = this.state;
        this.props.getCustomers({company});
        this.props.getCustomers({company, limit, page});
    }

    handleInfo = async (customer) => {
        console.log("FJLSKDJFLKSDF", customer)
        await this.setState({ customer });

        window.$('#modal-crm-customer-info').modal('show');
    }

    handleEdit = async (customer) => {
        await this.setState({ customer });

        window.$('#modal-crm-customer-edit').modal('show');
    }

    // Cac ham thiet lap va tim kiem gia tri
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async () => {
        const company = getStorage('companyId');
        const data = {
            company,
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getCustomers(data);
    }

    setPage = (page) => {
        const company = getStorage('companyId');
        this.setState({ page });
        const data = {
            company,
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getCustomers(data);
    }

    setLimit = (number) => {
        const company = getStorage('companyId');
        this.setState({ limit: number });
        const data = {
            company,
            limit: number,
            page: this.state.page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getCustomers(data);
    }
}
 

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getCustomers: CrmCustomerActions.getCustomers,
    deleteCustomer: CrmCustomerActions.deleteCustomer,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomer));