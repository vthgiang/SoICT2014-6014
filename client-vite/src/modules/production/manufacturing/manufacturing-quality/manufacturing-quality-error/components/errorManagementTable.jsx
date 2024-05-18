import React, { useEffect, useState } from 'react';
import { DataTableSetting, SelectBox, DatePicker, ConfirmNotification, PaginateBar } from "../../../../../../common-components";
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { manufacturingQualityErrorActions } from '../redux/actions';
import { formatDate } from '../../../../../../helpers/formatDate';
import ErrorDetailInfo from './errorDetailInfo';

function ErrorManagementTable(props) {
    const tableId = "error-management-table";
    const { translate, manufacturingQualityError } = props;
    const { totalPages } = manufacturingQualityError;

    const [page, setPage] = useState(1);
    const [errorDetailId, setErrorDetailId] = useState("");

    const handleShowDetailError = async (errorId) => {
        setErrorDetailId(errorId)
        window.$(`#modal-detail-info-error`).modal('show')
    }

    const handleChangePage = async (page) => {
        setPage(page);
        await props.getAllManufacturingQualityErrors({ page: page, limit: 5 });
    }

    useEffect(() => {
        const getData = async () => {
            await props.getAllManufacturingQualityErrors({ page, limit: 5});
        }
        getData();
    }, [])

    return (
        <>
            <ErrorDetailInfo errorDetailId={errorDetailId} />
            <div className="box-body qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.error.code')}</label>
                        <input type="text" className="form-control" placeholder="ER202012212" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.error.name')}</label>
                        <input type="text" className="form-control" autoComplete="off" />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.error.group')}</label>
                        <SelectBox
                            id="select-error-group"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: "", text: `---${translate('manufacturing.quality.error.choose_group')}---` },
                                { value: "machine", text: translate('manufacturing.quality.error_groups.machine') },
                                { value: "material", text: translate('manufacturing.quality.error_groups.material') },
                                { value: "man", text: translate('manufacturing.quality.error_groups.man') },
                                { value: "method", text: translate('manufacturing.quality.error_groups.method') },
                                { value: "measurement", text: translate('manufacturing.quality.error_groups.measurement') },
                                { value: "enviroment", text: translate('manufacturing.quality.error_groups.enviroment') },
                            ]}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.created_at')}</label>
                        <DatePicker
                            id="error-created-date"
                            disabled={false}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group"></div>
                    <div className="form-group">
                        <label className="form-control-static"></label>
                        <button type="button" className="btn btn-success" title={translate('manufacturing.quality.search')}>{translate('manufacturing.quality.search')}</button>
                    </div>
                </div>
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('manufacturing.quality.index')}</th>
                            <th>{translate('manufacturing.quality.error.code')}</th>
                            <th>{translate('manufacturing.quality.error.name')}</th>
                            <th>{translate('manufacturing.quality.error.group')}</th>
                            <th>{translate('manufacturing.quality.error.cause')}</th>
                            <th>{translate('manufacturing.quality.error.aql')}</th>
                            <th>{translate('manufacturing.quality.error.reporter')}</th>
                            <th>{translate('manufacturing.quality.created_at')}</th>
                            <th>{translate('general.action')}

                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manufacturing.quality.index'),
                                        translate('manufacturing.quality.error.code'),
                                        translate('manufacturing.quality.error.name'),
                                        translate('manufacturing.quality.error.group'),
                                        translate('manufacturing.quality.error.cause'),
                                        translate('manufacturing.quality.error.aql'),
                                        translate('manufacturing.quality.error.reporter'),
                                        translate('manufacturing.quality.created_at')
                                    ]}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {manufacturingQualityError.listErrors.map((error, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{error.code}</td>
                                <td>{error.name}</td>
                                <td>{error.group}</td>
                                <td>{error.cause}</td>
                                <td>{error.aql}</td>
                                <td>{error.reporter.name}</td>
                                <td>{formatDate(error.createdAt)}</td>
                                <td style={{ textAlign: "center" }}>
                                    <a className='text-green' title={translate('manufacturing.quality.view')} onClick={() => handleShowDetailError(error._id)}>
                                        <i className='material-icons'>visibility</i>
                                    </a>
                                    <a className='text-yellow' title={translate('manufacturing.quality.edit')}>
                                        <i className='material-icons'>edit</i>
                                    </a>
                                    <ConfirmNotification
                                        icon='delete'
                                        title={translate('manufacturing.quality.delete')}
                                        content={translate('manufacturing.quality.delete') + ' ' + error.code}
                                        name='delete'
                                        className='text-red'
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={handleChangePage} />
            </div>
        </>
    );
}

function mapStateToProps(state) {
    const { manufacturingQualityError } = state
    return { manufacturingQualityError }
}

const mapDispatchToProps = {
    getAllManufacturingQualityErrors: manufacturingQualityErrorActions.getAllManufacturingQualityErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ErrorManagementTable))
