import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, Errorstrong, ButtonModal } from '../../../../../common-components';
import { StockActions } from '../redux/actions';
import { translate } from 'react-redux-multilingual/lib/utils';

function StockDetailForm(props) {
    const [state, setState] = useState({

    })

    if (props.stockId !== state.stockId || props.code !== state.code || props.name !== state.name ||
        props.status !== state.status || props.address !== state.address || props.goods !== state.goods ||
        props.managementLocation !== state.managementLocation || props.manageDepartment !== state.manageDepartment || props.description !== state.description) {
        setState({
            ...state,
            stockId: props.stockId,
            code: props.code,
            name: props.name,
            status: props.status,
            address: props.address,
            goods: props.goodsManagement,
            managementLocation: props.managementLocation,
            manageDepartment: props.manageDepartment,
            description: props.description,
        })
    }

    const { translate, stocks, department, role } = props;
    const { code, name, managementLocation, status, address, description, manageDepartment, goods, good } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-stock`} isLoading={stocks.isLoading}
                formID={`form-detail-stock`}
                title={translate('manage_warehouse.stock_management.detail_stock')}
                msg_success={translate('manage_warehouse.stock_management.add_success')}
                msg_failure={translate('manage_warehouse.stock_management.add_faile')}
                size={75}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-stock`} >
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <strong>{translate('manage_warehouse.stock_management.code')}:&emsp;</strong>
                                {code}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manage_warehouse.stock_management.address')}:&emsp;</strong>
                                {address}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <strong>{translate('manage_warehouse.stock_management.name')}:&emsp;</strong>
                                {name}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manage_warehouse.stock_management.status')}:&emsp;</strong>
                                {/* <span style={{ color: translate(`manage_warehouse.stock_management.${status}.color`)}}>{translate(`manage_warehouse.stock_management.${status}.status`)}</span> */}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <strong>{translate('manage_warehouse.stock_management.description')}:&emsp;</strong>
                                {description}
                            </div>
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.stock_management.management_location')}</legend>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th title={translate('manage_warehouse.stock_management.index')}>{translate('manage_warehouse.stock_management.index')}</th>
                                            <th title={translate('manage_warehouse.stock_management.role')}>{translate('manage_warehouse.stock_management.role')}</th>
                                            <th title={translate('manage_warehouse.stock_management.management_good')}>{translate('manage_warehouse.stock_management.management_good')}</th>
                                        </tr>
                                    </thead>
                                    <tbody id={`good-edit-manage-by-stock`}>
                                        {
                                            (typeof managementLocation === 'undefined' || managementLocation.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                managementLocation.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.role.name}</td>
                                                        <td>{x.managementGood ? x.managementGood.map((item, key) => { return <p key={key}>{translate(`manage_warehouse.stock_management.${item}`)}</p> }) : ''}</td>
                                                    </tr>
                                                )
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.stock_management.goods')}</legend>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th title={translate('manage_warehouse.stock_management.good')}>{translate('manage_warehouse.stock_management.good')}</th>
                                            <th title={translate('manage_warehouse.stock_management.min_quantity')}>{translate('manage_warehouse.stock_management.min_quantity')}</th>
                                            <th title={translate('manage_warehouse.stock_management.max_quantity')}>{translate('manage_warehouse.stock_management.max_quantity')}</th>
                                        </tr>
                                    </thead>
                                    <tbody id={`good-edit-manage-by-stock`}>
                                        {
                                            (typeof goods === 'undefined' || goods.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                goods.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{x.good.name}</td>
                                                        <td>{x.minQuantity}</td>
                                                        <td>{x.maxQuantity}</td>
                                                    </tr>
                                                )
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { stocks, department, role, goods } = state;
    return { stocks, department, role, goods };
}

const mapDispatchToProps = {
    getStock: StockActions.getStock
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockDetailForm));
