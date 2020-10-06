import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmCustomerActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { CrmGroupActions } from '../../group/redux/actions';
import { DataTableSetting, PaginateBar, ConfirmNotification, SelectMulti } from '../../../../common-components';
import CreateForm from './createForm';
import InfoForm from './infoForm';
import EditForm from './editForm';
import CrmCustomerImportFile from './importFileForm';

class CrmCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 0,
            option: 'name',
            value: ''
        }
    }

    importCustomer = async () => {
        await this.setState({
            importCustomer: true,
        })
        window.$('#modal-customer-import').modal('show');
    }

    createCustomer = () => {
        window.$('#modal-crm-customer-create').modal('show');
    }

    render() {
        const { translate, crm, user } = this.props;
        const { list } = crm.customers;
        const { customer, importCustomer, limit, page } = this.state;

        let pageTotal = (crm.customers.totalDocs % limit === 0) ?
            parseInt(crm.customers.totalDocs / limit) :
            parseInt((crm.customers.totalDocs / limit) + 1);
        let cr_page = parseInt((page / limit) + 1);

        let units;
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }

        return (
            <div className="box">
                <div className="box-body qlcv">
                    {/* Nút thêm khách hàng */}
                    <div className="form-inline">
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={'Thêm khách hàng'} >Thêm khách hàng</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a style={{ cursor: 'pointer' }} title={`Nhập bằng file`} onClick={this.importCustomer}>
                                    {translate('human_resource.salary.add_import')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} title={`Nhập bằng tay`} onClick={this.createCustomer}>
                                    {`Thêm bằng tay`}</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* form import khách hàng */}
                    {importCustomer && <CrmCustomerImportFile />}

                    {/* form thêm mới khách hàng bằng tay */}
                    <CreateForm />

                    {customer !== undefined && <InfoForm customer={customer} />}
                    {customer !== undefined && <EditForm customer={customer} />}

                    {/* search form */}
                    <div className="form-inline" style={{ marginBottom: '2px' }}>
                        <div className="form-group unitSearch">
                            <label>{translate('task.task_management.department')}</label>
                            {units &&
                                <SelectMulti id="multiSelectUnit1"
                                    defaultValue={units.map(item => { return item._id })}
                                    items={units.map(item => { return { value: item._id, text: item.name } })}
                                    onChange={this.handleSelectOrganizationalUnit}
                                    options={{ nonSelectedText: units.length !== 0 ? translate('task.task_management.select_department') : "Bạn chưa có đơn vị", allSelectedText: translate(`task.task_management.select_all_department`) }}>
                                </SelectMulti>
                            }
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Mã khách hàng</label>
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} name="customerCode" onChange={this.handleChangeCreator} placeholder={`Mã nhân viên`} />
                        </div>
                    </div>

                    <div className="form-inline" style={{ marginBottom: '2px' }}>
                        <div className="form-group">
                            <label>Trạng thái</label>
                            <SelectMulti id="multiSelectUnit12"
                                items={[
                                    { value: 0, text: 'Khách hàng mới' },
                                    { value: 1, text: 'Quan tâm tới sản phẩm' },
                                    { value: 2, text: 'Đã mua hàng' },
                                ]}
                                onChange={this.handleSelectOrganizationalUnit}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group ">
                            <label>Nhóm khách hàng</label>
                            <SelectMulti id="multiSelectUnit13"
                                items={[
                                    { value: 0, text: 'Bắc' },
                                    { value: 1, text: 'Trung' },
                                    { value: 2, text: 'Nam' },
                                ]}
                                onChange={this.handleSelectOrganizationalUnit}
                            >
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group" >
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.search} title={translate('form.search')}>{translate('form.search')}</button>
                        </div>
                    </div>
                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-customer">
                        <thead>
                            <tr>
                                <th>{translate('crm.customer.code')}</th>
                                <th>{translate('crm.customer.name')}</th>
                                <th>{translate('crm.customer.mobilephoneNumber')}</th>
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
                                list && list.length > 0 ?
                                    list.map(cus =>
                                        <tr key={cus._id}>
                                            <td>{cus.code}</td>
                                            <td>{cus.name}</td>
                                            <td>{cus.mobilephoneNumber}</td>
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
                                                    func={() => this.props.deleteCustomer(cus._id)}
                                                />
                                            </td>
                                        </tr>
                                    ) : crm.customers.isLoading ?
                                        <tr><td colSpan={6}>{translate('general.loading')}</td></tr> :
                                        <tr><td colSpan={6}>{translate('general.no_data')}</td></tr>
                            }
                        </tbody>
                    </table>

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={this.setPage} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.props.getCustomers(this.state);
        this.props.getDepartment();
        this.props.getGroups({});
    }

    handleInfo = async (customer) => {
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
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getCustomers(data);
    }

    setPage = async (pageNumber) => {
        let { limit } = this.state;
        let page = (pageNumber - 1) * (limit);

        await this.setState({
            page: parseInt(page),
        });
        this.props.getCustomers(this.state);
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
}


function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getDepartment: UserActions.getDepartmentOfUser,
    getCustomers: CrmCustomerActions.getCustomers,
    deleteCustomer: CrmCustomerActions.deleteCustomer,

    getGroups: CrmGroupActions.getGroups,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomer));