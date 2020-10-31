import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmCustomerActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { CrmGroupActions } from '../../group/redux/actions';
import { CrmStatusActions } from '../../status/redux/actions';
import { DataTableSetting, PaginateBar, ConfirmNotification, SelectMulti, ExportExcel } from '../../../../common-components';
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

    /**
     * Hàm xử lý khi click button import khách hàng
     */
    importCustomer = () => {
        this.setState({
            importCustomer: true,
        }, () => window.$('#modal-customer-import').modal('show'));
    }

    /**
     * Hàm xử lý khi click button thêm khách hàng bằng tay
     */
    createCustomer = () => {
        this.setState({
            createCustomer: true,
        }, () => window.$('#modal-customer-create').modal('show'))
    }

    /**
     * Hàm xử lý khi click nút xem chi tiết khách hàng
     * @param {*} id 
     */
    handleInfo = (id) => {
        this.setState({
            customerId: id
        }, () => window.$('#modal-crm-customer-info').modal('show'));
    }

    /**
     * Hàm xử lý khi click nút edit khách hàng
     * @param {*} id 
     */
    handleEdit = (id) => {
        this.setState({
            customerIdEdit: id,
        }, () => window.$('#modal-crm-customer-edit').modal('show'));
    }

    // Cac ham thiet lap va tim kiem gia tri
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
        this.props.getCustomers(data);
    }

    setPage = (pageNumber) => {
        let { limit } = this.state;
        let page = (pageNumber - 1) * (limit);

        this.setState({
            page: parseInt(page),
        }, () => {
            this.props.getCustomers(this.state);
        });
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

    /**
     * Hàm xử lý click button xóa khách hàng
     * @param {*} id 
     */
    deleteCustomer = (id) => {
        if (id) {
            this.props.deleteCustomer(id);
        }
    }

    convertDataToExportData = (data) => {
        const { translate } = this.props;
        if (data) {
            console.log('data', data);
            data = data.map((o, index) => ({
                STT: index + 1,
                code: o.code,
                name: o.name,
                owner: o.owner && o.owner.length > 0 ? o.owner.map(ow => ow.name).join(', ') : "Deleted",
                status: o.status && o.status.length > 0 ? o.status[o.status.length - 1].name : "Deleted",
                customerSource: o.customerSource ? o.customerSource : 'Deleted',
                customerType: o.customerType ? o.customerType : 'Deleted',
                group: o.group ? o.group.name : "Deleted",
                represent: o.represent ? o.represent : 'Deleted',
                mobilephoneNumber: o.mobilephoneNumber ? o.mobilephoneNumber : 'Deleted',
                email: o.email ? o.email : 'Deleted',
                email2: o.email2 ? o.email2 : 'Deleted',
                address: o.address ? o.address : 'Deleted',
                gender: o.gender ? o.gender : 'Deleted',
                birthDate: o.birthDate ? new Date(o.birthDate) : 'Deleted',
                companyEstablishmentDate: o.companyEstablishmentDate ? new Date(o.companyEstablishmentDate) : 'Deleted',
                taxNumber: o.taxNumber ? o.taxNumber : 'Deleted',
                address2: o.address2 ? o.address2 : 'Deleted',
                telephoneNumber: o.telephoneNumber ? o.telephoneNumber : 'Deleted',
                location: o.location ? o.location : 'Deleted',
                website: o.website ? o.website : 'Deleted',
                linkedIn: o.linkedIn ? o.linkedIn : 'Deleted',
            }))
        }

        let exportData = {
            fileName: 'Thông tin khách hàng',
            dataSheets: [
                {
                    sheetName: 'sheet1',
                    sheetTitle: 'Thông tin khách hàng',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: 'STT', width: 7 },
                                { key: "code", value: translate('crm.customer.code') },
                                { key: "name", value: translate('crm.customer.name'), width: 20 },
                                { key: "owner", value: translate('crm.customer.owner'), width: 25 },
                                { key: "status", value: translate('crm.customer.status') },
                                { key: "customerSource", value: translate('crm.customer.source') },
                                { key: "customerType", value: translate('crm.customer.customerType') },
                                { key: "group", value: translate('crm.customer.group'), width: 25 },
                                { key: "represent", value: translate('crm.customer.represent'), width: 25 },
                                { key: "mobilephoneNumber", value: translate('crm.customer.mobilephoneNumber'), width: 25 },
                                { key: "email", value: translate('crm.customer.email'), width: 25 },
                                { key: "email2", value: translate('crm.customer.secondaryEmail'), width: 25 },
                                { key: "address", value: translate('crm.customer.address'), width: 25 },
                                { key: "gender", value: translate('crm.customer.gender'), width: 25 },
                                { key: "birthDate", value: translate('crm.customer.birth'), width: 25 },
                                { key: "companyEstablishmentDate", value: translate('crm.customer.companyEstablishmentDate'), width: 25 },
                                { key: "taxNumber", value: translate('crm.customer.taxNumber'), width: 25 },
                                { key: "address2", value: translate('crm.customer.address2'), width: 25 },
                                { key: "telephoneNumber", value: translate('crm.customer.telephoneNumber'), width: 25 },
                                { key: "location", value: translate('crm.customer.location'), width: 25 },
                                { key: "website", value: translate('crm.customer.website'), width: 25 },
                                { key: "linkedIn", value: translate('crm.customer.linkedIn'), width: 25 },
                            ],
                            data: data,
                        }
                    ]
                }
            ]
        }
        return exportData;
    }



    render() {
        const { translate, crm, user } = this.props;
        const { customers } = crm;
        const { importCustomer, createCustomer, limit, page, customerIdEdit, customerId } = this.state;

        let pageTotal = (crm.customers.totalDocs % limit === 0) ?
            parseInt(crm.customers.totalDocs / limit) :
            parseInt((crm.customers.totalDocs / limit) + 1);
        let cr_page = parseInt((page / limit) + 1);

        // Lấy danh sách đơn vị
        let units;
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }

        // Lấy danh sách nhóm khách hàng
        let listGroups;
        if (crm.groups.list && crm.groups.list.length > 0) {
            listGroups = crm.groups.list.map(o => ({ value: o._id, text: o.name }))
        }

        // Lấy danh sách trạng thái khách hàng
        let listStatus;
        if (crm.status.list && crm.status.list.length > 0) {
            listStatus = crm.status.list.map(o => ({ value: o._id, text: o.name }))
        }

        let exportData = [];
        if (customers && customers.list && customers.list.length > 0) {
            exportData = this.convertDataToExportData(customers.list);
        }

        return (
            <div className="box">
                <div className="box-body qlcv">

                    {/* Nút thêm khách hàng */}
                    <div className="form-inline">
                        {/* export excel danh sách khách hàng */}
                        <ExportExcel id="export-customer" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginTop: 0 }} />

                        {/* Button dropdown thêm mới khách hàng */}
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
                    {createCustomer && <CreateForm />}

                    {/* form xem chi tiết khách hàng */}
                    {customerId && <InfoForm customerId={customerId} />}

                    {/* form edit khách hàng */}
                    {customerIdEdit && <EditForm customerIdEdit={customerIdEdit} />}

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
                            <label>{translate('crm.customer.status')}</label>
                            {
                                listStatus &&
                                <SelectMulti id="multiSelectUnit12"
                                    items={listStatus}
                                    onChange={this.handleSelectOrganizationalUnit}
                                    options={{ nonSelectedText: listStatus.length !== 0 ? translate('task.task_management.select_department') : "Chưa có trạng thái khách hàng", allSelectedText: translate(`task.task_management.select_all_department`) }}
                                >
                                </SelectMulti>
                            }
                        </div>
                        <div className="form-group ">
                            <label>{translate('crm.customer.group')}</label>
                            {
                                listGroups &&
                                <SelectMulti id="multiSelectUnit13"
                                    items={listGroups}
                                    onChange={this.handleSelectOrganizationalUnit}
                                    options={{ nonSelectedText: listGroups.length !== 0 ? translate('task.task_management.select_department') : "Chưa có nhóm khách hàng", allSelectedText: translate(`task.task_management.select_all_department`) }}
                                >
                                </SelectMulti>
                            }
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group" >
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.search} title={translate('form.search')}>{translate('form.search')}</button>
                        </div>
                    </div>
                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-customer" style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>{translate('crm.customer.code')}</th>
                                <th>{translate('crm.customer.name')}</th>
                                <th>{translate('crm.customer.group')}</th>
                                <th>{translate('crm.customer.status')}</th>
                                <th>{translate('crm.customer.owner')}</th>
                                <th>{translate('crm.customer.mobilephoneNumber')}</th>
                                <th>{translate('crm.customer.address')}</th>
                                <th style={{ width: "120px" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnArr={[
                                            translate('crm.customer.code'),
                                            translate('crm.customer.name'),
                                            translate('crm.customer.group'),
                                            translate('crm.customer.status'),
                                            translate('crm.customer.owner'),
                                            translate('crm.customer.mobilephoneNumber'),
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
                                customers.list && customers.list.length > 0 ?
                                    customers.list.map(cus =>
                                        <tr key={cus._id}>
                                            <td>{cus.code}</td>
                                            <td>{cus.name}</td>
                                            <td>{cus.group && cus.group.name ? cus.group.name : null}</td>
                                            <td>{cus.status && cus.status.length > 0 ? cus.status[cus.status.length - 1].name : null}</td>
                                            <td>{cus.owner && cus.owner.length > 0 ? cus.owner.map(o => o.name).join(', ') : null}</td>
                                            <td>{cus.mobilephoneNumber}</td>
                                            <td>{cus.address}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a className="text-green" onClick={() => this.handleInfo(cus._id)}><i className="material-icons">visibility</i></a>
                                                <a className="text-yellow" onClick={() => this.handleEdit(cus._id)}><i className="material-icons">edit</i></a>
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
                                    ) : null
                            }
                        </tbody>
                    </table>
                    {
                        customers.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            customers.list && customers.list.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={this.setPage} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.props.getCustomers(this.state);
        this.props.getDepartment();
        this.props.getGroups();
        this.props.getStatus();
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
    getStatus: CrmStatusActions.getStatus,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomer));