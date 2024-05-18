import React, { useEffect } from 'react';
import { DataTableSetting, SelectBox, DatePicker } from "../../../../../../common-components";
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { manufacturingQualityInspectionActions } from '../redux/actions';
import { formatDate } from '../../../../../../helpers/formatDate';

function InspectionManagementTable(props) {
    const tableId = "criteria-management-table";
    const { translate, manufacturingQualityInspection } = props;

    useEffect(() => {
        const getData = async () => {
            await props.getAllManufacturingQualityInspections();
        }
        getData();
    }, [])

    return (    
        <>
            <div className="box-body qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.inspection.code')}</label>
                        <input type="text" className="form-control" placeholder="QC202012212" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.inspection.type')}</label>
                        <SelectBox
                            id="select-inspection-type"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: "", text: `---${translate('manufacturing.quality.inspection.choose_type')}---` },
                            ]}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.manufacturing_command')}</label>
                        <input type="text" className="form-control" placeholder="LSX2602024" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.inspection.result')}</label>
                        <SelectBox
                            id="select-inspection-result"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: "", text: `---${translate('manufacturing.quality.inspection.choose_result')}---` },
                            ]}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.quality.status')}</label>
                        <SelectBox
                            id="select-inspection-status"
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
                            <th>{translate('manufacturing.quality.inspection.code')}</th>
                            <th>{translate('manufacturing.quality.manufacturing_command')}</th>
                            <th>{translate('manufacturing.quality.inspection.type')}</th>
                            <th>{translate('manufacturing.quality.created_at')}</th>
                            <th>{translate('manufacturing.quality.inspection.responsible')}</th>
                            <th>{translate('manufacturing.quality.inspection.result')}</th>
                            <th>{translate('general.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manufacturing.quality.index'),
                                        translate('manufacturing.quality.inspection.code'),
                                        translate('manufacturing.quality.manufacturing_command'),
                                        translate('manufacturing.quality.inspection.type'),
                                        translate('manufacturing.quality.created_at'),
                                        translate('manufacturing.quality.inspection.responsible'),
                                        translate('manufacturing.quality.inspection.result'),
                                        translate('manufacturing.quality.createdat')
                                    ]}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {manufacturingQualityInspection.listInspections.map((inspection, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{inspection.code}</td>
                                <td>{inspection.manufacturingCommand.code}</td>
                                <td>{translate(`manufacturing.quality.inspection_types.${inspection.type}`)}</td>
                                <td>{formatDate(inspection.createdAt)}</td>
                                <td>{inspection.responsible.name}</td>
                                <td style={{ color: translate(`manufacturing.quality.inspection_results.${inspection.result.final}.color`) }}>
                                    {translate(`manufacturing.quality.inspection_results.${inspection.result.final}.content`)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <a className='text-green' title={translate('manufacturing.quality.view')}>
                                        <i className='material-icons'>visibility</i>
                                    </a>
                                    <a className='text-yellow' title={translate('manufacturing.quality.edit')}>
                                        <i className='material-icons'>edit</i>
                                    </a>
                                    <a className='text-red' title={translate('manufacturing.quality.delete')}>
                                        <i className='material-icons'>delete</i>
                                    </a>
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
    const { manufacturingQualityInspection } = state
    return { manufacturingQualityInspection }
}

const mapDispatchToProps = {
    getAllManufacturingQualityInspections: manufacturingQualityInspectionActions.getAllManufacturingQualityInspections,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InspectionManagementTable));
