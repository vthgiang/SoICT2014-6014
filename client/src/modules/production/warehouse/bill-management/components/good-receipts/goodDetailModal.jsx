import React, { useState } from 'react';
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { DialogModal } from '../../../../../../common-components';
import GoodReturnCreateForm from '../good-returns/goodReturnCreateForm';


function GoodDetailModal(props) {
    const [state, setState] = useState({

    })

    const handleCreateBillReturn = () => {
        window.$('#modal-create-bill-return').modal('show');
    }
    const { translate, listGoods } = props;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-good-detail"
                title={translate(`manage_warehouse.bill_management.good_detail`)}
                size={50}
                hasSaveButton={false}
                hasNote={false}
            >
                <GoodReturnCreateForm group={"3"} isHideButtonCreate={true}/>
                <div className={`form-group`}>
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
                                    <th title={translate('manage_warehouse.bill_management.quantity_return_supplier')}>{translate('manage_warehouse.bill_management.quantity_return_supplier')}</th>
                                    <th title={translate('manage_warehouse.bill_management.action')}>{translate('manage_warehouse.bill_management.action')}</th>
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
                                                <td>{x.quantity}</td>
                                                <td>
                                                    <span style={{ color: "green" }}>{x.realQuantity}</span>
                                                </td>
                                                <td>
                                                    <span style={{ color: "red" }}>{x.damagedQuantity}</span>
                                                </td>
                                                <td>
                                                    {/*Xếp hàng vào kho */}
                                                    <a href='/inventory-management' className="text-green"><i title={translate('manage_warehouse.bill_management.arrange_goods_into_the_warehouse')} className="material-icons">precision_manufacturing</i></a>
                                                    {/*Trả hàng */}
                                                    <a onClick={() => handleCreateBillReturn()} className="text-red"><i title={translate('manage_warehouse.bill_management.good_return')} className="material-icons">assignment_returned</i></a>
                                                </td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </fieldset>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { bills } = state;
    return { bills }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodDetailModal))
