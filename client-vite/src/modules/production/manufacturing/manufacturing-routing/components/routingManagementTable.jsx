import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { manufacturingRoutingActions } from '../redux/actions';
import { worksActions } from '../../manufacturing-works/redux/actions';
import { formatDate } from '../../../../../helpers/formatDate';
import { DataTableSetting, DatePicker, SelectBox, ConfirmNotification } from '../../../../../common-components'
import RoutingDetailInfo from './routingDetailInfo';
import RoutingCreateForm from './routing-create-form';

const RoutingManagementTable = (props) => {
    const tableId = "manufacturing-routing-manager-table"
    const { translate, manufacturingRouting, manufacturingWorks } = props;
    const [detailRoutingId, setDetailRoutingId] = useState("")

    const handleShowDetailManufacturingRouting = (routingId) => {
        setDetailRoutingId(routingId)
        window.$('#modal-detail-info-manufacturing-routing').modal('show');
    }

    const getWorksArr = () => {
        let worksArr = [
            { value: "", text: `---${translate('manufacturing.routing.choose_works')}---` }
        ]
        manufacturingWorks.listWorks.forEach(work => {
            worksArr.push({value: work._id, text: work.name})
        })
        return worksArr
    }

    useEffect(() => {
        const getData = async () => {
            await props.getAllManufacturingRoutings()
            await props.getAllManufacturingWorks()
        }
        getData()
    }, [])

    return (
        <>
            <RoutingDetailInfo detailRoutingId={detailRoutingId} />
            <div className="box-body qlcv">
                <RoutingCreateForm />
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.routing.code')}</label>
                        <input type="text" className="form-control" placeholder="DT19032024" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.routing.name')}</label>
                        <input type="text" className="form-control" autoComplete="off" placeholder="Quy trình sản xuất thuốc bột" />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.routing.works')}</label>
                        <SelectBox
                            id="select-works-filter"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={getWorksArr()}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.routing.created_at')}</label>
                        <DatePicker
                            id="created-created-date"
                            disabled={false}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.routing.status')}</label>
                        <SelectBox
                            id="select-status-filter"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: "", text: `---${translate('manufacturing.routing.choose_status')}---` },
                                { value: "1", text: `${translate('manufacturing.routing.1.content')}`},
                                { value: "2", text: `${translate('manufacturing.routing.2.content')}`}
                            ]}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static"></label>
                        <button type="button" className="btn btn-success" title={translate('manufacturing.routing.search')}>{translate('manufacturing.quality.search')}</button>
                    </div>
                </div>
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('manufacturing.routing.index')}</th>
                            <th>{translate('manufacturing.routing.code')}</th>
                            <th>{translate('manufacturing.routing.name')}</th>
                            <th>{translate('manufacturing.routing.works')}</th>
                            <th>{translate('manufacturing.routing.creator')}</th>
                            <th>{translate('manufacturing.routing.created_at')}</th>
                            <th>{translate('manufacturing.routing.status')}</th>
                            <th>{translate('general.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manufacturing.routing.index'),
                                        translate('manufacturing.routing.code'),
                                        translate('manufacturing.routing.name'),
                                        translate('manufacturing.routing.works'),
                                        translate('manufacturing.routing.creator'),
                                        translate('manufacturing.routing.created_at'),
                                        translate('manufacturing.routing.status')
                                    ]}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {manufacturingRouting.listRoutings.map((routing, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{routing.code}</td>
                                <td>{routing.name}</td>
                                <td>{routing.manufacturingWorks.name}</td>
                                <td>{routing.creator.name}</td>
                                <td>{formatDate(routing.createdAt)}</td>
                                <td style={{ color: translate(`manufacturing.routing.${routing.status}.color`) }}>
                                    {translate(`manufacturing.routing.${routing.status}.content`)}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <a
                                        style={{ width: '5px' }}
                                        className='text-green'
                                        title={translate('manufacturing.routing.detail')}
                                        onClick={() => {
                                            handleShowDetailManufacturingRouting(routing._id)
                                        }}
                                    >
                                        <i className='material-icons'>visibility</i>
                                    </a>
                                    <a
                                        style={{ width: '5px' }}
                                        className='text-yellow'
                                        title={translate('manufacturing.routing.edit')}
                                        onClick={() => {
                                            handleShowDetailManufacturingRouting(routing._id)
                                        }}
                                    >
                                        <i className='material-icons'>edit</i>
                                    </a>
                                    <ConfirmNotification
                                        icon='question'
                                        title={translate('manufacturing.routing.cancel')}
                                        content={translate('manufacturing.routing.cancel') + ' ' + routing.code}
                                        name='cancel'
                                        className='text-red'
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

function mapStateToProps(state) {
    const { manufacturingRouting, manufacturingWorks } = state
    return { manufacturingRouting, manufacturingWorks }
}

const mapDispatchToProps = {
    getAllManufacturingRoutings: manufacturingRoutingActions.getAllManufacturingRoutings,
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoutingManagementTable));
