import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PaginateBar, SelectMulti, DataTableSetting, ConfirmNotification } from '../../../../common-components';
import CreateCareForm from './createForm';
import { CrmCustomerActions } from '../../customer/redux/actions';
import { CrmCareActions } from '../redux/action';
import InfoCareForm from './infoForm';
import EditCareForm from './editForm';
import { formatFunction } from '../../common/index';

class CrmCare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 0,
        }
    }

    formatCareStatus(input) {
        input = parseInt(input);
        if (input === 0) return 'Chưa thực hiện';
        if (input === 1) return 'Đang thực hiện';
        if (input === 2) return 'Đang tạm hoãn';
        if (input === 3) return 'Đã hoàn thành';
    }

    handleInfo = async (id) => {
        await this.setState({
            careInfoId: id,
        })
        window.$('#modal-crm-care-info').modal('show');
    }

    handleEdit = async (id) => {
        await this.setState({
            careEditId: id,
        })
        window.$('#modal-crm-care-edit').modal('show');
    }

    componentDidMount() {
        this.props.getCareTypes();
        this.props.getCustomers();
    }

    render() {
        const { crm, translate } = this.props;
        const { cares } = crm;
        const { careInfoId, careEditId } = this.state;

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <CreateCareForm />
                    {/* form xem chi tieets */}
                    {
                        careInfoId && <InfoCareForm careInfoId={careInfoId} />
                    }

                    {/* form edit  */}
                    {
                        careEditId && <EditCareForm careEditId={careEditId} />
                    }

                    {/* search form */}
                    <div className="form-inline" >
                        <div className="form-group unitSearch">
                            <label>{translate('task.task_management.department')}</label>
                            <SelectMulti id="multiSelectUnit1"
                                defaultValue={''}
                                items={[]}
                                onChange={this.handleSelectOrganizationalUnit}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('crm.care.caregiver')}</label>
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} name="customerCode" onChange={this.handleChangeCreator} placeholder={`Mã nhân viên`} />
                        </div>
                    </div>
                    <div className="form-inline" >
                        <div className="form-group">
                            <label className="form-control-static">{translate('crm.care.careType')}</label>
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} name="customerCode" onChange={this.handleChangeCreator} placeholder={`Mã nhân viên`} />
                        </div>

                        <div className="form-group">
                            <label className="form-control-static">{translate('crm.care.status')}</label>
                            <SelectMulti id="multiSelectUnit12"
                                defaultValue={''}
                                items={[
                                    { value: 0, text: 'Chưa thưc hiện' },
                                    { value: 1, text: 'Đang thực hiện' },
                                    { value: 2, text: 'Đang trì hoãn' },
                                    { value: 3, text: 'Đã hoàn thành' },
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

                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group" style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>{translate('crm.care.customer')}</th>
                                <th>{translate('crm.care.name')}</th>
                                <th>{translate('crm.care.caregiver')}</th>
                                <th>{translate('crm.care.careType')}</th>
                                <th>{translate('crm.care.status')}</th>
                                <th>{translate('crm.care.startDate')}</th>
                                <th>{translate('crm.care.endDate')}</th>
                                <th>{translate('crm.care.action')}</th>
                                {/* <th style={{ width: "120px" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnArr={[
                                            translate('crm.group.name'),
                                            translate('crm.group.code'),
                                            translate('crm.group.description'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        tableId="table-manage-crm-group"
                                    />
                                </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cares.list && cares.list.length > 0 ? cares.list.map(o => (
                                    <tr key={o._id}>
                                        <td>{o.customer ? o.customer.map(cus => cus.name).join(', ') : ''}</td>
                                        <td>{o.name ? o.name : ''}</td>
                                        <td>{o.caregiver ? o.caregiver.map(cg => cg.name).join(', ') : ''}</td>
                                        <td>{o.careType ? o.careType.map(cr => cr.name).join(', ') : ''}</td>
                                        <td>{this.formatCareStatus(o.status)}</td>
                                        <td>{o.startDate ? formatFunction.formatDate(o.startDate) : ''}</td>
                                        <td>{o.endDate ? formatFunction.formatDate(o.endDate) : ''}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a className="text-green" onClick={() => this.handleInfo(o._id)}><i className="material-icons">visibility</i></a>
                                            <a className="text-yellow" onClick={() => this.handleEdit(o._id)}><i className="material-icons">edit</i></a>
                                            <ConfirmNotification
                                                icon="question"
                                                title="Xóa thông tin về khách hàng"
                                                content="<h3>Xóa thông tin khách hàng</h3>"
                                                name="delete"
                                                className="text-red"
                                                func={() => this.props.deleteCustomer()}
                                            />
                                        </td>
                                    </tr>
                                )) : null
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getCareTypes: CrmCareActions.getCares,
    getCustomers: CrmCustomerActions.getCustomers,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCare));