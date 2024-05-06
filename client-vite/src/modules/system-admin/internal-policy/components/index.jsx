import React, { useEffect, useState } from 'react';
import { DataTableSetting, DeleteNotification, PaginateBar } from '../../../../common-components';
import { InternalPolicyActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { InternalPolicyCreateModal } from './internalPolicyCreateModal';
import InternalPolicyEditModal from './internalPolicyEditModal';
import InternalPolicyViewModal from './internalPolicyViewModal';
import { formatFullDate } from '../../../../helpers/formatDate';
import moment from 'moment';

function InternalPolicy(props) {
    const { translate, internalPolicies } = props;

    const tableId = "table-management-internal-policy";

    const [listInternalPolicy, setListInternalPolicy] = useState([]);
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [queryParams, setQueryParams] = useState({
        page: 0,
        perPage: limit,
        name: null,
        resource: null,
    })
    const [internalPolicyEdit, setInternalPolicyEdit] = useState({})
    const [internalPolicyView, setInternalPolicyView] = useState({})

    const { page, perPage, name, resource } = queryParams;

    useEffect(() => {
        async function init() {
            props.getInternalPolicies({
                page,
                perPage
            })
        }

        init();
    }, [])

    useEffect(() => {
        if (internalPolicies) {
            setListInternalPolicy(internalPolicies.listInternalPolicy);
        }
    }, [internalPolicies])

    const handleNameChange = (event) => {
        setQueryParams({
            ...queryParams,
            name: event.target.value
        })
    }

    const handleResourceChange = (event) => {
        setQueryParams({
            ...queryParams,
            resource: event.target.value
        })
    }

    const handleLimitChange = (value) => {
        if (Number(value) !== perPage) {
            setQueryParams({
                ...queryParams,
                perPage: Number(value)
            })
            props.getInternalPolicies({
                name: name,
                page: 0,
                perPage: Number(value),
            })
        }
    }

    const handlePageChange = (value) => {
        setQueryParams({
            ...queryParams,
            page: Number(value) - 1
        })
        props.getInternalPolicies({
            name: name,
            page: Number(value) - 1,
            perPage: perPage
        })
    }

    const handleSubmitSearch = () => {
        props.getInternalPolicies({
            name: name,
            resource: resource,
            page: page,
            perPage: perPage
        })
    }

    const handleEdit = (serviceIdentity) => {
        setInternalPolicyEdit(serviceIdentity)

        window.$("#update-internal-policy-modal").modal("show");
    }

    const handleView = async (serviceIdentity) => {
        setInternalPolicyView(serviceIdentity);
        window.$('#view-internal-policy-modal').modal('show');
    }

    const renderPolicyTable = () => (
        <table id={tableId} className="table table-hover table-striped table-bordered">
            <thead>
                <tr>
                    <th style={{ width: '40px' }}>{translate('system_admin.internal_policy.table.no')}</th>
                    <th>{translate('system_admin.internal_policy.table.name')}</th>
                    <th>{translate('system_admin.internal_policy.table.description')}</th>
                    <th>{translate('system_admin.internal_policy.table.resources')}</th>
                    <th>{translate('system_admin.internal_policy.table.actions')}</th>
                    <th>{translate('system_admin.internal_policy.table.status')}</th>
                    <th style={{ width: "120px" }}>
                    {translate('system_admin.internal_policy.table.name')}
                        <DataTableSetting
                            tableId={tableId}
                            hideColumn={false}
                            setLimit={handleLimitChange}
                        />
                    </th>
                </tr>
            </thead>
            <tbody>
                {listInternalPolicy?.length > 0
                    && listInternalPolicy.map((policy, index) =>
                        <tr key={policy?.id}>
                            <td>{index + 1}</td>
                            <td>{policy?.name}</td>
                            <td>{policy?.description}</td>
                            <td>{policy?.resources.join(", ")}</td>
                            <td>{policy?.actions.join(", ")}</td>
                            <td>
                                {
                                    moment().isBetween(moment(policy?.effectiveStartTime), moment(policy?.effectiveEndTime))
                                    ? "Effective"
                                    : "Ineffective"
                                }
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <a className="edit text-green" style={{ width: '5px' }} title="Thông tin chi tiết chính sách" onClick={() => handleView(policy)}><i className="material-icons">visibility</i></a>
                                <a onClick={() => handleEdit(policy)} className="edit" title="Sửa thông tin chính sách"><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('system_admin.internal_policy.delete')}
                                    data={{
                                        id: policy?.id
                                    }}
                                    func={props.deleteInternalPolicy}
                                />
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    )

    return (
        <React.Fragment>
            <InternalPolicyCreateModal />
            <InternalPolicyViewModal
                internalPolicy={internalPolicyView}
            />
            <InternalPolicyEditModal
                id={internalPolicyEdit?.id}
                internalPolicy={internalPolicyEdit}
            />
            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Name */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.internal_policy.table.name')}</label>
                            <input className="form-control" type="text" placeholder="Input service name" name="name" onChange={handleNameChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.internal_policy.table.resources')}</label>
                            <input className="form-control" type="text" name="name" onChange={handleResourceChange} />
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={handleSubmitSearch} >{translate('general.search')}</button>
                        </div>

                        <button
                            type="button"
                            onClick={() => {window.$("#create-internal-policy-modal").modal("show");}}
                            className="btn btn-success pull-right"
                            title={translate('system_admin.internal_policy.add')}
                        >
                            {translate('system_admin.internal_policy.add')}
                        </button>
                    </div>

                    {renderPolicyTable()}

                    <PaginateBar
                        display={internalPolicies?.listInternalPolicy?.length}
                        total={internalPolicies?.totalInternalPolicies}
                        pageTotal={internalPolicies?.totalPages}
                        currentPage={page}
                        func={handlePageChange}
                    />
                </div>
            </div>
        </React.Fragment>

    );
}


function mapState(state) {
    const { internalPolicies } = state
    return { internalPolicies }
}
const actions = {
    getInternalPolicies: InternalPolicyActions.getInternalPolicies,
    deleteInternalPolicy: InternalPolicyActions.deleteInternalPolicy
}

export default connect(mapState, actions)(withTranslate(InternalPolicy))