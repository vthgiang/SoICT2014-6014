import React, { useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal } from '../../../../../../common-components';
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';

function ModalSelectIssueBill(props) {
    const tableId = "select-issue-bill";
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;
    const [state, setState] = useState({
        limit: limit,
        billSelected: '',
        checkSelectedBill: false,
        checkedId: ''
    })

    function formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                day = '' + d.getDate(),
                month = '' + (d.getMonth() + 1),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    const handleSelectBill = (value) => {
        setState({ 
            ...state, 
            billSelected: value,
            checkedId: value._id,
        })
    }
    const save =  () => {
        props.onDataChange(state.billSelected);
    }

    const { listBills, translate } = props;
    const {checkedId} = state

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-select-bill-issue`}
                formID={`modal-select-bill-issue`}
                title="Chọn phiếu đã xuất kho"
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={checkedId === ''}
                func={save}
                size="75"
            >
                <div className={`form-group`}>
                    <fieldset className="scheduler-border">
                        {/* Bảng thông tin chi tiết */}
                        <table id={tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                            <thead>
                                <tr>
                                    <th className="col-fixed not-sort" style={{ width: 45 }}>
                                    </th>
                                    <th>{translate('manage_warehouse.bill_management.code')}</th>
                                    <th>{translate('manage_warehouse.bill_management.type')}</th>
                                    <th>{translate('manage_warehouse.bill_management.status')}</th>
                                    <th>{translate('manage_warehouse.bill_management.creator')}</th>
                                    <th>{translate('manage_warehouse.bill_management.approved')}</th>
                                    <th>{translate('manage_warehouse.bill_management.date')}</th>
                                    <th>{translate('manage_warehouse.bill_management.stock')}</th>
                                    <th>{translate('manage_warehouse.bill_management.customer')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof listBills !== undefined && listBills.length !== 0) &&
                                    listBills.map((x, index) => (
                                        <tr key={index}>
                                            <td >
                                                <input type='checkbox' defaultChecked={false} checked={checkedId == x._id} onChange={() => handleSelectBill(x)}></input>
                                            </td>
                                            <td>{x.code}</td>
                                            <td>{translate(`manage_warehouse.bill_management.billType.${x.type}`)}</td>
                                            <td style={{ color: translate(`manage_warehouse.bill_management.bill_color.${x.status}`) }}>{translate(`manage_warehouse.bill_management.bill_issue_status.${x.status}`)}</td>
                                            <td>{x.creator ? x.creator.name : "Creator is deleted"}</td>
                                            <td>{x.approvers ? x.approvers.map((a, key) => { return <p key={key}>{a.approver.name}</p> }) : "approver is deleted"}</td>
                                            <td>{formatDate(x.updatedAt)}</td>
                                            <td>{x.fromStock ? x.fromStock.name : "Stock is deleted"}</td>
                                            <td>{x.customer ? x.customer.name : 'Partner is deleted'}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof listBills === 'undefined' || listBills.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalSelectIssueBill));
