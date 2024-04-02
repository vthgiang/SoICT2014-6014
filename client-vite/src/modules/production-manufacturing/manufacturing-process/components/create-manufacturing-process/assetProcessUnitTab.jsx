import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DatePicker, TimePicker, SelectBox, ErrorLabel, ToolTip, TreeSelect, QuillEditor } from '../../../../../common-components';

const AssetProcessUnitTab = (props) => {

    const [state, setState] = useState({
        listAsset: [{
            nameTask: "test",
            assets: [],
            timeSchedule: 0,
        }],
    })

    const { id, translate, manufacturingLineTemplate } = props;
    // const { listAsset } = state;
    const listAsset = manufacturingLineTemplate && manufacturingLineTemplate.templateById ? manufacturingLineTemplate.templateById.taskList : []
    return (
        <React.Fragment>
            <div>
                <div className="col-md-12 col-lg-12 col-sm-12">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('manufacturing_managerment.management_chain.job_list_title')}</legend>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }} className="col-fixed">{translate('manufacturing_managerment.manufacturing_process.index')}</th>
                                    <th title={`${translate('manufacturing_managerment.manufacturing_process.asset_name')}`}>{translate('manufacturing_managerment.manufacturing_process.asset_name')}</th>
                                    <th title={`${translate('manufacturing_managerment.manufacturing_process.asset_cate')}`}>{translate('manufacturing_managerment.manufacturing_process.asset_cate')}</th>
                                    <th title={`${translate('manufacturing_managerment.manufacturing_process.asset_quantity')}`}>{translate('manufacturing_managerment.manufacturing_process.asset_quantity')}</th>
                                    <th title={`${translate('manufacturing_managerment.manufacturing_process.asset_status')}`}>{translate('manufacturing_managerment.manufacturing_process.asset_status')}</th>
                                    <th title={`${translate('manufacturing_managerment.manufacturing_process.asset_use_time')}`}>{translate('manufacturing_managerment.manufacturing_process.asset_use_time')}</th>
                                </tr>
                            </thead>
                            <tbody id="list-jobs">
                                {
                                    (typeof listAsset === 'undefined' || listAsset.length === 0) ? <tr><td colSpan={6}><center>{translate('task_template.no_data')}</center></td></tr> :
                                        listAsset.map((item, index) =>
                                            <tr key={`${index}`}>
                                                <td>{index + 1}</td>
                                                <td>{item?.name}</td>
                                                <td>{item?.listAssetTask?.assetName}</td>
                                                <td>{item.assets}</td>
                                                <td>{item.assets}</td>
                                                <td>{item?.timeSchedule}</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </fieldset>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {manufacturingLineTemplate} = state;
    return {manufacturingLineTemplate}
}

const mapDispatchToProps = {

}

const connectAssetProcessUnitTab = connect(mapStateToProps, mapDispatchToProps)(withTranslate(AssetProcessUnitTab))

export { connectAssetProcessUnitTab as AssetProcessUnitTab }