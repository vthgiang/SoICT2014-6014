import React, { useState, useEffect } from 'react';
import { BillActions } from "../../redux/actions";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { DialogModal, SelectBox, UploadFile } from '../../../../../../common-components';

function QualityControlForm(props) {
    const [state, setState] = useState({
        quantityPassedTest: [],
    })

    const { translate, bills, listGoods } = props;
    const { status, content, code } = state;
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

    const handleQualityControlEachProduct = (index, value) => {
        const data = [...listGoods];
        data[index].realQuantity = value.toString();
        setState({
            ...state,
            listGoods: data
        });
        checkLots(data[index].quantity, index);
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

    const isFormValidated = () => {
        let count = 0;
        state.listGoods && state.listGoods.forEach(item => {
            if (item.realQuantity === '' || parseInt(item.realQuantity) > item.quantity || parseInt(item.realQuantity) < 0) {
                count++;
            }
        })
        return count === 0;
    }

    const save = () => {
        const userId = localStorage.getItem("userId");
        const data = {
            qualityControlStaffs: {
                staff: userId,
                status: state.status !== "" ? state.status : 1,
                content: state.content,
            },
            goods: state.listGoods,
            status: (state.status !== "" || state.status === 1) ? "4" : "3",
            oldStatus: "3",
        }
        props.editBill(state.billId, data);
    }

    const checkLots = (quantity, index) => {
        if (listGoods[index].realQuantity > quantity || listGoods[index].realQuantity < 0 || listGoods[index].realQuantity === "") {
            return [false, "Số lượng kiểm định phải nhỏ hơn số lượng gốc và lớn hơn 0, không được để trống"];
        }
        return [true, ""];
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-quality-control-bill" isLoading={bills.isLoading}
                formID="form-quality-control-bill"
                title={translate('manage_warehouse.bill_management.quality_control_bill')}
                msg_success={translate('manage_warehouse.bill_management.edit_successfully')}
                msg_failure={translate('manage_warehouse.bill_management.edit_failed')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={700}
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
                            }
                                // , {
                                //     value: 3, text: translate('manufacturing.command.qc_status.3.content')
                                // }
                            ]}
                            onChange={handleStatusChange}
                            multiple={false}
                        />
                    </div>
                    {(typeof listGoods === 'undefined' || listGoods.length === 0) ? '' :
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
                                        </tr>
                                    </thead>

                                    <tbody id={`good-bill-edit`}>
                                        {
                                            listGoods.map((x, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.good.code}</td>
                                                    <td>{x.good.name}</td>
                                                    <td>{x.good.baseUnit}</td>
                                                    <td>{x.quantity}</td>
                                                    <td>
                                                        {(checkLots(x.quantity, index))[0] ?
                                                            <input placeholder='Nhập số lượng đạt kiểm định' style={{ 'border': 'green 1px solid' }} type="number" value={x.realQuantity} className="form-control" onChange={(e) => handleQualityControlEachProduct(index, e.target.value)} />
                                                            :
                                                            <div className="tooltip-abc">
                                                                <input placeholder='Nhập số lượng đạt kiểm định' style={{ 'border': 'red 1px solid', 'paddingBottom': '15px', 'color': "red" }} type="number" value={x.realQuantity} className="form-control" onChange={(e) => handleQualityControlEachProduct(index, e.target.value)} />
                                                                <span className="tooltiptext"><p style={{ color: "white" }}>{checkLots(x.quantity, index)[1]}</p></span>
                                                            </div>}
                                                    </td>
                                                    <td>{x.description}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    }
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
