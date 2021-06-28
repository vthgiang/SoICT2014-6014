import React from 'react';
import PropTypes from 'prop-types';
import { CrmUnitActions } from '../redux/actions';
import{DepartmentActions} from'../../../super-admin/organizational-unit/redux/actions'
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { formatFunction } from '../../common';
import CrmUnitAddForm from './crmUnitAddForm';
import '../../customer/components/customer.css';


function CrmUnitConfiguration(props) {
    useEffect(() => {
        props.getCrmUnits();
        props.getOrganizationalUnit();
    }, [])
    const { crm } = props;
    const { crmUnits } = crm;

    return (
        <React.Fragment>
            <div className="box generalConfiguration">
                <div className="box-body qlcv">
                    {/* {
                        statusIdEdit && data && <CustomerStatusEditForm statusIdEdit={statusIdEdit} data={data} />
                    } */}

                    <div className="description-box nav-tabs-custom">
                        <div className="tab-content">
                            <ul className="nav nav-tabs-left">
                                <li className="active"><a href="#customer-status" data-toggle="tab" >Đơn vị chăm sóc khách hàng</a></li>
                            </ul>
                        </div>
                        <div className="tab-content tab-content-right">
                            {/* Tab trạng thái khách hàng */}
                            <div id={`customer-status`} className="tab-pane active">
                                <div className="description-box">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 class="box-title" style={{ color: 'rgb(68,68,68)' }}>Danh sách các đơn vị chăm sóc khách hàng</h4>
                                        {/* <CustomerStatusAddForm /> */}
                                        <CrmUnitAddForm/>
                                    </div>
                                    <ul id="sortItem" className="todo-list">
                                        {
                                            crm.crmUnits && crm.crmUnits.list && crm.crmUnits.list.length > 0 ?
                                                crm.crmUnits.list.map((o, index) => (
                                                    <li key={index}>
                                                        <a data-toggle="collapse" href={`#collapse_${index}`}>
                                                            <span style={{ margin: '0 5px', display: 'inline-block' }}>
                                                                {`${index + 1}.`}
                                                            </span>
                                                            <span className="text">{o.organizationalUnit.name}</span>
                                                            <div className="tools">
                                                                <i className="fa fa-trash-o"
                                                                    // onClick={() => deleteStatus(o._id)} 
                                                                    title="Xóa đơn vị"></i>
                                                            </div>
                                                        </a>

                                                        <div id={`collapse_${index}`} class="collapse" >
                                                            <ul>
                                                                <li>Mô tả: {o.organizationalUnit.description}</li>
                                                                <li>Người tạo: {` ${o.creator ? o.creator.name : ''}`}</li>
                                                                <li>Ngày tạo: {` ${formatFunction.formatDate(o.createdAt)}`}</li>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                )) : null
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getCrmUnits: CrmUnitActions.getCrmUnits,
    createCrmUnit: CrmUnitActions.createCrmUnit,
    getOrganizationalUnit : DepartmentActions.get,
    deleteCrmUnit: CrmUnitActions.deleteCrmUnit,
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmUnitConfiguration));