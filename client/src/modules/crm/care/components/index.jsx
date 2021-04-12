import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, PaginateBar, SelectBox, SelectMulti } from '../../../../common-components';
import { formatFunction } from '../../common/index';
import { CrmCustomerActions } from '../../customer/redux/actions';
import { CrmCareActions } from '../redux/action';
import CreateCareForm from './createForm';
import EditCareForm from './editForm';
import InfoCareForm from './infoForm';
import CompleteCareForm from './completeForm'
import CreateCareCommonForm from '../../common/createCareCommonForm'
import { CrmCareTypeActions } from '../../careType/redux/action';
import { UserActions } from '../../../super-admin/user/redux/actions';

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

    handleInfo = (id) => {
        this.setState({
            careInfoId: id,
        }, () => window.$('#modal-crm-care-info').modal('show'))
    }

    handleEdit = (id) => {
        this.setState({
            careEditId: id,
        }, () => window.$('#modal-crm-care-edit').modal('show'))
    } 
    handleComplete = (id) => {
        this.setState({
            careCompleteId: id,
        }, () => window.$('#modal-crm-care-complete').modal('show'))
    }
  


    deleteCare = (id) => {
        if (id) {
            this.props.deleteCare(id);
        }
    }

    setPage = (pageNumber) => {
        const { limit } = this.state;
        const page = (pageNumber - 1) * (limit);

        this.setState({
            page: parseInt(page),
        }, () => this.props.getCares(this.state));
    }

    componentDidMount() {
        this.props.getCares(this.state);
        this.props.getCustomers();
        this.props.getCareTypes({});
        this.props.getDepartment();
        this.props.getAllEmployeeOfUnitByRole(localStorage.getItem('currentRole'));
    }

    render() {
        const { crm, translate } = this.props;
        const { cares } = crm;
        const { careInfoId, careEditId, limit, page,careCompleteId } = this.state;

        let pageTotal = (cares.totalDocs % limit === 0) ?
            parseInt(cares.totalDocs / limit) :
            parseInt((cares.totalDocs / limit) + 1);
        const cr_page = parseInt((page / limit) + 1);
        console.log('CRM',crm)
        return (
            <div className="box">
                <div className="box-body qlcv">
                   { cares && <CreateCareForm />}
                    {/* form xem chi tieets */}
                    {
                        careInfoId && <InfoCareForm careInfoId={careInfoId} />
                    }

                    {/* form edit  */}
                    {
                        careEditId && <EditCareForm careEditId={careEditId} />
                    }
                     {
                        careCompleteId && <CompleteCareForm />
                    }
    
                    {/* search form */}
                    <div className="form-inline" >
                        <div className="form-group unitSearch">
                            <label>{"Hoạt động chăm sóc khách hàng"}</label>
                            <SelectBox id="SelectUnit1"
                                defaultValue={''}
                                items={[{value:'2',text:'Chọn tất cả'},{value:'1',text:'Do tôi phụ trách'},]}
                                onChange={this.handleSelectOrganizationalUnit}
                                style ={{width : '100%'}}
                            >
                            </SelectBox>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('crm.care.caregiver')}</label>
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} name="customerCode" onChange={this.handleChangeCreator} placeholder={`Mã nhân viên`} />
                        </div>
                    </div>
                    <div className="form-inline" >
                        <div className="form-group">
                            <label className="form-control-static">{translate('crm.care.careType')}</label>
                            <SelectMulti id="multiSelectUnit12"
                                defaultValue={''}
                                items={[
                                    { value: 0, text: 'Gọi điện chăm sóc' },
                                    { value: 1, text: 'Nhắn tin' },
                                    { value: 2, text: 'Email' },
                                    { value: 3, text: 'Hẹn gặp mặt' },
                                ]}
                                onChange={this.handleSelectOrganizationalUnit}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('crm.care.status')}</label>
                            <SelectMulti id="multiSelectUnit3"
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
                        <div className="form-group" >
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.search} title={'Xuất báo cáo'}>{'Xuất báo cáo'}</button>
                        </div>
                    </div>

                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group" style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                               
                                <th>{translate('crm.care.name')}</th>
                                <th>{translate('crm.care.careType')}</th>
                                <th>{translate('crm.care.customer')}</th>
                                <th>{translate('crm.care.description')}</th>
                                <th>{translate('crm.care.priority')}</th>
                                <th>{translate('crm.care.caregiver')}</th>
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
                                       
                                        <td>{o.name ? o.name : ''}</td>
                                        <td>{o.careType ? o.careType.map(cr => cr.name).join(', ') : ''}</td>
                                        <td>{o.customer ? o.customer.name : ''}</td>
                                        <td>{o.description}</td>
                                        <td>ưu tiên cao</td>
                                        <td>{o.customerCareStaffs ? o.customerCareStaffs.map(cg => cg.name).join(', ') : ''}</td>                      
                                        <td>{this.formatCareStatus(o.status)}</td>
                                        <td>{o.startDate ? formatFunction.formatDate(o.startDate) : ''}</td>
                                        <td>{o.endDate ? formatFunction.formatDate(o.endDate) : ''}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a className="text-green" onClick={() => this.handleInfo(o._id)}><i className="material-icons">visibility</i></a>
                                            <a className="text-yellow" onClick={() => this.handleEdit(o._id)}><i className="material-icons">edit</i></a>
                                            <a className="text-green" onClick={() => this.handleComplete(o._id)}><i className="material-icons">add_task</i></a>
                                             <ConfirmNotification
                                                icon="question"
                                                title="Xóa thông tin về khách hàng"
                                                content="<h3>Xóa thông tin khách hàng</h3>"
                                                name="delete"
                                                className="text-red"
                                                func={() => this.props.deleteCare(o._id)}
                                            />
                                        </td>
                                    </tr>
                                )) : null
                            }

                        </tbody>
                    </table>
                    {
                        cares && cares.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            cares.list && cares.list.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>

                    }
                    {/* Phan trang */}
                    {
                        <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={this.setPage} />
                    }
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
    getCares: CrmCareActions.getCares,
    deleteCare: CrmCareActions.deleteCare,
    getCustomers: CrmCustomerActions.getCustomers,
    getCareTypes: CrmCareTypeActions.getCareTypes,
    getDepartment: UserActions.getDepartmentOfUser, 
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCare));