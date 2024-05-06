import React, { useEffect, useState } from 'react';
import { DataTableSetting, DeleteNotification, PaginateBar } from '../../../../common-components';
import { ExternalServiceConsumerActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import ExternalServiceConsumerCreateModal from './externalServiceConsumerCreateModal';
import ExternalServiceConsumerEditModal from './externalServiceConsumerEditModal';
import ExternalServiceConsumerViewModal from './externalServiceConsumerViewModal';

function ExternalServiceConsumer(props) {
    const { translate, externalServiceConsumers } = props;

    const tableId = "table-management-external-service-consumer";

    const [listExternalServiceConsumer, setListExternalServiceConsumer] = useState([]);
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [queryParams, setQueryParams] = useState({
        page: 0,
        perPage: limit,
        name: null,
        apiPrefix: null,
        clientId: null,
    })
    const [externalServiceConsumerEdit, setExternalServiceConsumerEdit] = useState({})
    const [externalServiceConsumerView, setExternalServiceConsumerView] = useState({})

    const { page, perPage, name, description } = queryParams;

    useEffect(() => {
        async function init() {
            props.getExternalServiceConsumers({
                page,
                perPage
            })
        }

        init();
    }, [])

    useEffect(() => {
        if (externalServiceConsumers) {
            setListExternalServiceConsumer(externalServiceConsumers.listExternalServiceConsumer);
        }
    }, [externalServiceConsumers])

    const handleNameChange = (event) => {
        setQueryParams({
            ...queryParams,
            name: event.target.value
        })
    }

    const handleDescriptionChange = (event) => {
        setQueryParams({
            ...queryParams,
            apiPrefix: event.target.value
        })
    }

    const handleLimitChange = (value) => {
        if (Number(value) !== perPage) {
            setQueryParams({
                ...queryParams,
                perPage: Number(value)
            })
            props.getExternalServiceConsumers({
                name: name,
                description: description,
                page: 0,
                perPage: Number(value)
            })
        }
    }

    const handlePageChange = (value) => {
        setQueryParams({
            ...queryParams,
            page: Number(value) - 1
        })
        props.getExternalServiceConsumers({
            name: name,
            description: description,
            page: Number(value) - 1,
            perPage: perPage
        })
    }

    const handleSubmitSearch = () => {
        props.getExternalServiceConsumers({
            name: name,
            description: description,
            page: page,
            perPage: perPage
        })
    }

    const handleEdit = (serviceIdentity) => {
        setExternalServiceConsumerEdit(serviceIdentity)

        window.$("#update-external-service-consumer-modal").modal("show");
    }

    const handleView = async (serviceIdentity) => {
        setExternalServiceConsumerView(serviceIdentity);
        window.$('#view-external-service-consumer-modal').modal('show');
    }

    const renderServiceIdentityTable = () => (
        <table id={tableId} className="table table-hover table-striped table-bordered">
            <thead>
                <tr>
                    <th style={{ width: '40px' }}>{translate('system_admin.external_service_consumer.table.no')}</th>
                    <th>{translate('system_admin.external_service_consumer.table.name')}</th>
                    <th>{translate('system_admin.external_service_consumer.table.description')}</th>
                    <th>{translate('system_admin.external_service_consumer.table.clientId')}</th>
                    <th>{translate('system_admin.external_service_consumer.table.clientSecret')}</th>
                    <th style={{ width: "120px" }}>
                        {translate('system_admin.external_service_consumer.table.method')}
                        <DataTableSetting
                            tableId={tableId}
                            hideColumn={false}
                            setLimit={handleLimitChange}
                        />
                    </th>
                </tr>
            </thead>
            <tbody>
                {listExternalServiceConsumer?.length > 0
                    && listExternalServiceConsumer.map((identity, index) =>
                        <tr key={identity?._id}>
                            <td>{index + 1}</td>
                            <td>{identity?.name}</td>
                            <td>{identity?.description}</td>
                            <td>{identity?.clientCredential.clientId}</td>
                            <td>{identity?.clientCredential.clientSecret}</td>
                            <td style={{ textAlign: 'center' }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('system_admin.external_service_consumer.view')} onClick={() => handleView(identity)}><i className="material-icons">visibility</i></a>
                                <a onClick={() => handleEdit(identity)} className="edit" title={translate('system_admin.external_service_consumer.edit')}><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('system_admin.external_service_consumer.delete')}
                                    data={{
                                        id: identity?.id
                                    }}
                                    func={props.deleteExternalServiceConsumer}
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
            <ExternalServiceConsumerCreateModal />
            <ExternalServiceConsumerViewModal
                externalServiceConsumer={externalServiceConsumerView}
            />
            <ExternalServiceConsumerEditModal
                id={externalServiceConsumerEdit?.id}
                externalServiceConsumer={externalServiceConsumerEdit}
            />
            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Name */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.external_service_consumer.table.name')}</label>
                            <input className="form-control" type="text" placeholder="Input service name" name="name" onChange={handleNameChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.external_service_consumer.table.description')}</label>
                            <input className="form-control" type="text" placeholder="" name="name" onChange={handleDescriptionChange} />
                        </div>

                        <button
                            type="button"
                            onClick={() => {window.$("#create-external-service-consumer-modal").modal("show");}}
                            className="btn btn-success pull-right"
                            title={translate('system_admin.external_service_consumer.add')}
                        >
                            {translate('system_admin.external_service_consumer.add')}
                        </button>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 15 }}>
                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={handleSubmitSearch} >{translate('general.search')}</button>
                        </div>
                    </div>

                    {renderServiceIdentityTable()}

                    <PaginateBar
                        display={externalServiceConsumers?.listExternalServiceConsumer?.length}
                        total={externalServiceConsumers?.totalExternalServiceConsumers}
                        pageTotal={externalServiceConsumers?.totalPages}
                        currentPage={page}
                        func={handlePageChange}
                    />
                </div>
            </div>
        </React.Fragment>

    );
}


function mapState(state) {
    const { externalServiceConsumers } = state
    return { externalServiceConsumers }
}
const actions = {
    getExternalServiceConsumers: ExternalServiceConsumerActions.getExternalServiceConsumers,
    deleteExternalServiceConsumer: ExternalServiceConsumerActions.deleteExternalServiceConsumer
}

export default connect(mapState, actions)(withTranslate(ExternalServiceConsumer))