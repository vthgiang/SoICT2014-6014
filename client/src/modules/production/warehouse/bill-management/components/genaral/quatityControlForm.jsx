import React, { useState, useEffect } from 'react';
import { BillActions } from "../../redux/actions";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { DialogModal, SelectBox, UploadFile } from '../../../../../../common-components';

function QualityControlForm(props) {
    const [state, setState] = useState({

    })

    const handleStatusChange = (value) => {
        const status = value[0];
        setState({
            ...state,
            status: status
        });
    }

    const handleContentChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            content: value
        });
    }

    if (props.billId !== state.billId) {
        setState({
            ...state,
            billId: props.billId,
            code: props.code,
            status: props.status,
            content: props.content
        })
    }

    const save = () => {
        const userId = localStorage.getItem("userId");
        const data = {
            qualityControlStaffs: {
                staff: userId,
                status: state.status !== "" ? state.status : 1,
                content: state.content,
            }
        }
        props.editBill(state.billId, data);
    }

    const checkLots = (lots, quantity) => {
        if (lots.length === 0) {
            return false;
        } else {
            let totalQuantity = 0;
            for (let i = 0; i < lots.length; i++) {
                totalQuantity += Number(lots[i].quantity);
            }
            if (Number(quantity) !== Number(totalQuantity)) {
                return false;
            }
        }
        return true;
    }

    const handleQualityControl = (good, index) => {

    }
    const { translate, bills, listGoods } = props;
    const { status, content, code } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-quality-control-bill" isLoading={bills.isLoading}
                formID="form-quality-control-bill"
                title={translate('manage_warehouse.bill_management.quality_control_bill')}
                msg_success={translate('manage_warehouse.bill_management.edit_successfully')}
                msg_failure={translate('manage_warehouse.bill_management.edit_failed')}
                func={save}
                // disableSubmit={!this.isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-quality-control-bill">
                    <div className="form-group">
                        <label>{translate('manage_warehouse.bill_management.code')}<span className="text-red">*</span></label>
                        <input type="text" value={code} className="form-control" disabled={true}></input>
                    </div>
                    <div className="form-group">
                        <label>{translate('manage_warehouse.bill_management.status')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`select-quality-control-status-bill`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={status}
                            items={[{
                                value: 1, text: translate('manufacturing.command.qc_status.1.content')
                            }, {
                                value: 2, text: translate('manufacturing.command.qc_status.2.content')
                            }, {
                                value: 3, text: translate('manufacturing.command.qc_status.3.content')
                            }]}
                            onChange={handleStatusChange}
                            multiple={false}
                        />
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('manage_warehouse.bill_management.quality_control_of_each_goods')}<span className="text-red">*</span></label>
                        <fieldset className="scheduler-border">
                            {/* Bảng thông tin chi tiết */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                        <th title={translate('manage_warehouse.bill_management.good_code')}>{translate('manage_warehouse.bill_management.good_code')}</th>
                                        <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                        <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                        <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                        <th title={translate('manage_warehouse.bill_management.quantity_passed_test')}>{translate('manage_warehouse.bill_management.quantity_passed_test')}</th>
                                        <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.description')}</th>
                                        <th>{translate('task_template.action')}</th>
                                    </tr>
                                </thead>

                                <tbody id={`good-bill-edit`}>
                                    {
                                        (typeof listGoods === 'undefined' || listGoods.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            listGoods.map((x, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.good.code}</td>
                                                    <td>{x.good.name}</td>
                                                    <td>{x.good.baseUnit}</td>
                                                    {(checkLots(x.lots, x.quantity)) ? <td>{x.quantity}</td> :
                                                        <td>
                                                            <span>{x.quantity}</span>
                                                        </td>}
                                                    {(checkLots(x.lots, x.quantity)) ?
                                                        <td>{x.lots.map((lot, index) =>
                                                            <div key={index}>
                                                                {lot.lot.code && <p>{lot.lot.code}/{lot.quantity} {x.good.baseUnit}</p>}
                                                            </div>)}
                                                        </td> :
                                                        <td>{''}</td>
                                                    }
                                                    <td>{x.description}</td>
                                                    <td>
                                                        <a
                                                            className="text-blue"
                                                            title={translate('manage_warehouse.inventory_management.add_lot')}
                                                            onClick={() => handleQualityControl(x, index)}
                                                        ><i className="material-icons">adjust</i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </fieldset>
                    </div>
                </form>
                <form id="form-quality-control-bill">
                    <div className="form-group">
                        <label>{translate('manage_warehouse.bill_management.description')}</label>
                        <textarea type="text" value={content} onChange={handleContentChange} className="form-control"></textarea>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { bills } = state;
    return { bills }
}

const mapDispatchToProps = {
    editBill: BillActions.editBill
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QualityControlForm))
