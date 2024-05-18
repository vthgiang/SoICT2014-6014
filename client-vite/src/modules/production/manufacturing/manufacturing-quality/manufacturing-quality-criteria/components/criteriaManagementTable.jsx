import React, { useState, useEffect } from 'react';
import { DataTableSetting, SelectBox, DatePicker, ConfirmNotification } from "../../../../../../common-components";
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { formatDate } from '../../../../../../helpers/formatDate';
import CriterialDetailInfo from './criterialDetailInfo';
import { manufacturingQualityCriteriaActions } from '../redux/actions';

function CriteriaManagementTable(props) {
    const tableId = "criteria-management-table";
    const { translate, manufacturingQualityCriteria } = props;
    const [criteriaDetailId, setCriteriaDetailId] = useState("");

    const handleShowDetailCriteria = (id) => {
        setCriteriaDetailId(id)
        window.$(`#modal-detail-info-criteria`).modal('show')
    }

    useEffect(() => {
        const getData = async () => {
            await props.getAllManufacturingQualityCriterias();
        }
        getData();
    }, []);

    return (
        <>
        <CriterialDetailInfo criteriaDetailId={criteriaDetailId} />
            <div className="box-body qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.criteria.code')}</label>
                        <input type="text" className="form-control" placeholder="CR202012212" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.criteria.name')}</label>
                        <input type="text" className="form-control" autoComplete="off" />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.status')}</label>
                        <SelectBox
                            id="select-error-group"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: "", text: `---${translate('manufacturing.quality.choose_status')}---` },
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
                            <th>{translate('manufacturing.quality.criteria.code')}</th>
                            <th>{translate('manufacturing.quality.criteria.name')}</th>
                            <th>{translate('manufacturing.quality.criteria.creator')}</th>
                            <th>{translate('manufacturing.quality.operation')}</th>
                            <th>{translate('manufacturing.quality.created_at')}</th>
                            <th>{translate('manufacturing.quality.status')}</th>
                            <th>{translate('general.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manufacturing.quality.index'),
                                        translate('manufacturing.quality.criteria.code'),
                                        translate('manufacturing.quality.criteria.name'),
                                        translate('manufacturing.quality.criteria.creator'),
                                        translate('manufacturing.quality.operation'),
                                        translate('manufacturing.quality.status'),
                                        translate('manufacturing.quality.created_at'),
                                        translate('manufacturing.quality.status'),
                                    ]}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {manufacturingQualityCriteria.listCriterias.map((criteria, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{criteria.code}</td>
                                <td>{criteria.name}</td>
                                <td>{criteria.creator.name}</td>
                                <td>{criteria.operation}</td>
                                <td>{formatDate(criteria.createdAt)}</td>
                                <td style={{ color: translate(`manufacturing.quality.${criteria.status}.color`) }}>
                                    {translate(`manufacturing.quality.${criteria.status}.content`)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <a className='text-green' title={translate('manufacturing.quality.view')} onClick={() => handleShowDetailCriteria(criteria._id)}>
                                        <i className='material-icons'>visibility</i>
                                    </a>
                                    <a className='text-yellow' title={translate('manufacturing.quality.edit')}>
                                        <i className='material-icons'>edit</i>
                                    </a>
                                    <ConfirmNotification
                                        icon='delete'
                                        title={translate('manufacturing.quality.delete')}
                                        content={translate('manufacturing.quality.delete') + ' ' + criteria.code}
                                        name='delete'
                                        className='text-red'
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function mapStateToProps(state) {
    const { manufacturingQualityCriteria } = state
    return { manufacturingQualityCriteria }
}

const mapDispatchToProps = {
    getAllManufacturingQualityCriterias: manufacturingQualityCriteriaActions.getAllManufacturingQualityCriterias,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CriteriaManagementTable));
