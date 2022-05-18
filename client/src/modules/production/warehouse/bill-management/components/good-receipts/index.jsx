import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti, DatePicker, DataTableSetting, PaginateBar, ConfirmNotification } from '../../../../../../common-components';

import BillDetailForm from '../genaral/billDetailForm';
import GoodReceiptEditForm from './goodReceiptEditForm';
import GoodDetailModal from './goodDetailModal';
import GoodReceiptCreateForm from './goodReceiptCreateForm';
import { BillActions } from '../../redux/actions';
import QualityControlForm from '../genaral/quatityControlForm';
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';
import Swal from "sweetalert2";
import { UserGuideCreateBillReceipt } from '../config.js';
import "../bill.css";

function ReceiptManagement(props) {

    const tableId = "receipt-management-table";
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        limit: limit,
        page: 1,
        group: '1',
        tableId,
        actionAddLots: '1', // 1: edit bill, 2: add lot in index screen, 3: add lot to damaged goods in detail screen
    })

    const { translate, bills, stocks, user, lots } = props;
    const { listPaginate, totalPages, page, listBillByGroup } = bills;
    const { listStocks } = stocks;
    const { startDate, endDate, group, currentRow, actionAddLots } = state;
    const dataPartner = props.getPartner();
    const userId = localStorage.getItem("userId");

    const handleEdit = async (bill) => {
        await setState({
            ...state,
            currentRow: bill,
            actionAddLots: '1',
        })

        window.$('#modal-edit-bill-receipt').modal('show');
    }

    const handleAddLot = async (bill) => {
        await setState({
            ...state,
            currentRow: bill,
            actionAddLots: '2',
        })

        window.$('#modal-edit-bill-receipt').modal('show');
    }

    const showFilePreview = (data) => {
        const link = process.env.REACT_APP_SERVER + data[0].url;
        Swal.fire({
            html: ` 
            <h4>${data[0].pageName}</h4>
            <div style="margin:0px;padding:0px;overflow:hidden">
               <iframe  frameborder="0" style="overflow:hidden;height:90vh;width:100%" height="100vh" width="100%"
                        src= ${link}
                    />
            </div>`,
            width: "100%",
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: true,
            focusConfirm: false,

        })
    }

    const findIndexOfStaff = (array, id) => {
        let result = -1;
        array.forEach((element, index) => {
            if (element.staff._id === id) {
                result = index;
            }
        });
        return result;
    }

    const handleFinishedQualityControlStaff = async (bill) => {
        const userId = localStorage.getItem("userId");
        let index = findIndexOfStaff(bill.qualityControlStaffs, userId);
        let qcStatus = bill.qualityControlStaffs[index].status ? bill.qualityControlStaffs.status : "";
        let qcContent = bill.qualityControlStaffs[index].content ? bill.qualityControlStaffs[index].content : "";
        await setState({
            ...state,
            currentControl: bill,
            qcStatus: qcStatus,
            qcContent: qcContent
        })
        window.$('#modal-quality-control-bill').modal('show');
    }

    const checkGoodsHaveBeenPlacedInTheWarehouse = (goods) => {
        let countInventory = 0;
        goods.forEach((element) => {
            element.lots.forEach((lot) => {
                if (lot.lot && checkQuantity(lot.lot.stocks)) {
                    countInventory++
                }
            });
        });
        return countInventory === 0;
    }

    const checkGoodsPassedQualityControl = (goods) => {
        let checkPassedQuality = 0;
        goods.forEach((element) => {
            if (element.realQuantity < element.quantity) {
                checkPassedQuality++
            }
        });
        return checkPassedQuality === 0;
    }

    const checkQuantity = (stock) => {
        const { stocks } = props;
        var check = 1;
        stock.map(x => {
            if (stocks.listStocks.length > 0) {
                for (let i = 0; i < stocks.listStocks.length; i++) {
                    if (x.stock === stocks.listStocks[i]._id) {
                        if (x.binLocations.length === 0) {
                            check = 0;
                        } else {
                            let totalQuantity = x.binLocations.reduce(function (accumulator, currentValue) {
                                return Number(accumulator) + Number(currentValue.quantity);
                            }, 0);
                            if (x.quantity === totalQuantity) {
                                check = 1;
                            }
                        }
                    }
                }
            }
        })

        if (check === 1) {
            return false
        }
        return true
    }

    const handleShowGoodDetail = (bill) => {
        setState({
            ...state,
            currentBill: bill,
            actionAddLots: '3',
        })
        window.$('#modal-good-detail').modal('show');
    }

    const handleSearchByStatus = (status) => {
        props.handleSearchByStatus(status);
    }

    return (
        <div id="bill-good-receipts">
            <div className="box-body qlcv">
                <GoodReceiptCreateForm group={group} />
                {
                    state.currentControl &&
                    <QualityControlForm
                        billId={state.currentControl._id}
                        code={state.currentControl.code}
                        status={state.qcStatus}
                        content={state.qcContent}
                        listGoods={state.currentControl.goods}
                    />
                }
                {
                    state.currentBill &&
                    <GoodDetailModal
                        billId={state.currentBill._id}
                        bill={state.currentBill}
                        code={state.currentBill.code}
                        listGoods={state.currentBill.goods}
                        stocks={stocks}
                        lots={lots}
                    />
                }
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.stock')}</label>
                        <SelectMulti
                            id={`select-multi-stock-receipt`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={listStocks.map((x, index) => { return { value: x._id, text: x.name } })}
                            onChange={props.handleStockChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.creator')}</label>
                        <SelectMulti
                            id={`select-multi-creator-receipt`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn người tạo", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={user.list.map(x => { return { value: x.id, text: x.name } })}
                            onChange={props.handleCreatorChange}
                        />
                    </div>
                    <a href="#show-detail" onClick={() => showFilePreview(UserGuideCreateBillReceipt)}>
                        <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px', fontSize: '20px' }} />
                    </a>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.code')}</label>
                        <input type="text" className="form-control" name="code" onChange={props.handleCodeChange} placeholder={translate('manage_warehouse.bill_management.code')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.type')}</label>
                        <SelectMulti
                            id={`select-multi-type-receipt`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: '1', text: translate('manage_warehouse.bill_management.billType.1') },
                                { value: '2', text: translate('manage_warehouse.bill_management.billType.2') }
                            ]}
                            onChange={props.handleTypeChange}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.from_date')}</label>
                        <DatePicker
                            id="book-stock-start-date-receipt"
                            dateFormat="month-year"
                            value={startDate}
                            onChange={props.handleChangeStartDate}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                        <DatePicker
                            id="book-stock-end-date-receipt"
                            dateFormat="month-year"
                            value={endDate}
                            onChange={props.handleChangeEndDate}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{group === '1' ? translate('manage_warehouse.bill_management.supplier') : group === '2' ? translate('manage_warehouse.bill_management.customer') : group === '5' ? translate('manage_warehouse.bill_management.receipt_stock') : translate('manage_warehouse.bill_management.partner')}</label>
                        <SelectMulti
                            id={`select-multi-partner-receipt`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn đối tác", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={dataPartner}
                            onChange={props.handlePartnerChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.status')}</label>
                        <SelectMulti
                            id={`select-multi-status-book-receipt`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn trạng thái", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: '1', text: translate('manage_warehouse.bill_management.bill_receipt_status.1') },
                                { value: '2', text: translate('manage_warehouse.bill_management.bill_receipt_status.2') },
                                { value: '3', text: translate('manage_warehouse.bill_management.bill_receipt_status.3') },
                                { value: '4', text: translate('manage_warehouse.bill_management.bill_receipt_status.4') },
                                { value: '5', text: translate('manage_warehouse.bill_management.bill_receipt_status.5') },
                                { value: '7', text: translate('manage_warehouse.bill_management.bill_receipt_status.7') },
                            ]}
                            onChange={props.handleStatusChange}
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={props.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                    </div>
                </div>
                <div className="box-body row" style={{ display: 'flex', width: "70%", marginLeft: "5%" }}>
                    <ul className="todo-list">
                        <li>
                            <span className="text" style={{ cursor: "pointer" }}><a onClick={() => handleSearchByStatus('1')}>Số lượng phiếu chờ phê duyệt</a></span>
                            <span className="label label-info" style={{ fontSize: '11px' }}>{listBillByGroup.filter(item => item.status === '1').length} Phiếu</span>
                        </li>
                        <li>
                            <span className="text" style={{ cursor: "pointer" }}><a onClick={() => handleSearchByStatus('2')}>Số lượng phiếu chờ thực hiện </a></span>
                            <span className="label label-warning" style={{ fontSize: '11px' }}>{listBillByGroup.filter(item => item.status === '2').length} Phiếu</span>
                        </li>
                    </ul>
                    <ul className="todo-list" style={{marginLeft: "20px"}}>
                        <li>
                            <span className="text" style={{ cursor: "pointer" }}><a onClick={() => handleSearchByStatus('3')}>Số lượng phiếu chờ kiểm định chất lượng</a></span>
                            <span className="label label-info" style={{ fontSize: '11px' }}>{listBillByGroup.filter(item => item.status === '3').length} Phiếu</span>
                        </li>
                        <li>
                            <span className="text" style={{ cursor: "pointer" }}><a onClick={() => handleSearchByStatus('5')}>Số lượng phiếu đã hoàn thành </a></span>
                            <span className="label label-warning" style={{ fontSize: '11px' }}>{listBillByGroup.filter(item => item.status === '5').length} Phiếu</span>
                        </li>
                    </ul>
                </div>
                <BillDetailForm />
                {
                    currentRow &&
                    <GoodReceiptEditForm
                        billId={currentRow._id}
                        fromStock={currentRow.fromStock ? currentRow.fromStock._id : null}
                        code={currentRow.code}
                        group={currentRow.group}
                        type={currentRow.type}
                        status={actionAddLots === '2' ? '5' : currentRow.status}
                        oldStatus={currentRow.status}
                        users={currentRow.users}
                        approvers={currentRow.approvers ? currentRow.approvers : []}
                        listQualityControlStaffs={currentRow.qualityControlStaffs ? currentRow.qualityControlStaffs : []}
                        responsibles={currentRow.responsibles ? currentRow.responsibles : []}
                        accountables={currentRow.accountables ? currentRow.accountables : []}
                        supplier={currentRow.supplier ? currentRow.supplier._id : null}
                        manufacturingMillId={currentRow.manufacturingMill ? currentRow.manufacturingMill._id : null}
                        name={currentRow.receiver ? currentRow.receiver.name : ''}
                        phone={currentRow.receiver ? currentRow.receiver.phone : ''}
                        email={currentRow.receiver ? currentRow.receiver.email : ''}
                        address={currentRow.receiver ? currentRow.receiver.address : ''}
                        description={currentRow.description}
                        listGood={currentRow.goods}
                        creator={currentRow.creator ? currentRow.creator._id : ''}
                        sourceType={currentRow.sourceType}
                        actionAddLots={actionAddLots}
                    />
                }

                <table id={tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>{translate('manage_warehouse.bill_management.index')}</th>
                            <th>{translate('manage_warehouse.bill_management.code')}</th>
                            <th>{translate('manage_warehouse.bill_management.type')}</th>
                            <th>{translate('manage_warehouse.bill_management.status')}</th>
                            <th>{translate('manage_warehouse.bill_management.creator')}</th>
                            <th>{translate('manage_warehouse.bill_management.approved')}</th>
                            <th>{translate('manage_warehouse.bill_management.date')}</th>
                            <th>{translate('manage_warehouse.bill_management.stock')}</th>
                            <th>{translate('manage_warehouse.bill_management.supplier')}</th>
                            <th>{translate('manage_warehouse.bill_management.infor_of_goods')}</th>
                            <th style={{ width: '120px' }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_warehouse.bill_management.index'),
                                        translate('manage_warehouse.bill_management.code'),
                                        translate('manage_warehouse.bill_management.type'),
                                        translate('manage_warehouse.bill_management.status'),
                                        translate('manage_warehouse.bill_management.creator'),
                                        translate('manage_warehouse.bill_management.approved'),
                                        translate('manage_warehouse.bill_management.date'),
                                        translate('manage_warehouse.bill_management.stock'),
                                        translate('manage_warehouse.bill_management.supplier'),
                                        translate('manage_warehouse.bill_management.infor_of_goods')
                                    ]}
                                    setLimit={props.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                            listPaginate.map((x, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{x.code}</td>
                                    <td>{translate(`manage_warehouse.bill_management.billType.${x.type}`)}</td>
                                    <td style={{
                                        color: translate(`manage_warehouse.bill_management.bill_color.${x.status}`),
                                        whiteSpace: 'pre-wrap'
                                    }}>{translate(`manage_warehouse.bill_management.bill_receipt_status.${x.status}`)}</td>
                                    <td>{x.creator ? x.creator.name : "Creator is deleted"}</td>
                                    <td>{x.approvers ? x.approvers.map((a, key) => { return <p key={key}>{a.approver.name}</p> }) : "approver is deleted"}</td>
                                    <td>{props.formatDate(x.updatedAt)}</td>
                                    <td>{x.fromStock ? x.fromStock.name : "Stock is deleted"}</td>
                                    {x.sourceType === '2' && <td>{x.supplier ? x.supplier.name : 'Supplier is deleted'}</td>}
                                    {x.sourceType === '1' && <td>{x.manufacturingMill ? x.manufacturingMill.name : 'manufacturingMill is deleted'}</td>}
                                    <td>
                                        {x.status !== '7' &&
                                            <div>
                                                <div className="timeline-index">
                                                    <div className="timeline-progress" style={{ width:  (x.status === '5' && checkGoodsHaveBeenPlacedInTheWarehouse(x.goods)) ? "100%" : (parseInt(x.status) - 1) / 5 * 100 + "%" }}></div>
                                                    <div className="timeline-items">
                                                        <div className="tooltip-abc-completed">
                                                            <div className={"timeline-item active"} >
                                                            </div>
                                                            <span className="tooltiptext-completed"><p style={{ color: "white" }}>Tạo phiếu thành công</p></span>
                                                        </div>
                                                        <div className={`tooltip-abc${x.status === '1' ? "" : "-completed"}`}>
                                                            <div className={`timeline-item ${x.status === '1' ? "" : "active"}`}>
                                                            </div>
                                                            <span className={`tooltiptext${x.status === '1' ? "" : "-completed"}`}><p style={{ color: "white" }}>{x.status === '1' ? 'Cần tiến hành phê duyệt phiếu' : 'Đã phê duyệt phiếu'}</p></span>
                                                        </div>
                                                        <div className={`tooltip-abc${x.status === '3' || x.status === '4' || x.status === '5' ? "-completed" : ""}`}>
                                                            <div className={`timeline-item ${x.status === '3' || x.status === '4' || x.status === '5' ? "active" : ""}`}>
                                                            </div>
                                                            {(x.status === '3' || x.status === '4' || x.status === '5') && <span className="tooltiptext-completed" ><p style={{ color: "white" }}>{'Phiếu đang trong quá trình thực hiện'}</p></span>}
                                                            {(x.status === '2' || x.status === '1') && <span className="tooltiptext" ><p style={{ color: "white" }}>{'Phiếu chưa thực hiện'}</p></span>}

                                                        </div>

                                                        <div className={`tooltip-abc${props.checkRoleQualityControlStaffs(x) ? "" : "-completed"}`}>
                                                            <div className={`timeline-item ${props.checkRoleQualityControlStaffs(x) ? "" : "active"}`}>
                                                            </div>
                                                            <span className={`tooltiptext${props.checkRoleQualityControlStaffs(x) ? "" : "-completed"}`}><p style={{ color: "white" }}>{props.checkRoleQualityControlStaffs(x) ? 'Chưa kiểm định chất lượng hàng hóa' : 'Kiểm định chất lượng xong'}</p></span>
                                                        </div>
                                                        <div className={`tooltip-abc${x.status !== '5' ? "" : "-completed"}`}>
                                                            <div className={`timeline-item ${x.status !== '5' ? "" : "active"}`}>
                                                            </div>
                                                            <span className={`tooltiptext${x.status !== '5' ? "" : "-completed"}`}><p style={{ color: "white" }}>{x.status !== '5' ? 'Chưa đánh lô hàng hóa' : 'Đánh lô hàng hóa xong'}</p></span>
                                                        </div>
                                                        <div className={`tooltip-abc${(x.status === '5' && checkGoodsHaveBeenPlacedInTheWarehouse(x.goods)) ? "-completed" : ""}`}>
                                                            <div className={`timeline-item ${(x.status === '5' && checkGoodsHaveBeenPlacedInTheWarehouse(x.goods)) ? "active" : ""}`}>
                                                            </div>
                                                            <span className={`tooltiptext${(x.status === '5' && checkGoodsHaveBeenPlacedInTheWarehouse(x.goods)) ? "-completed" : ""}`}><p style={{ color: "white" }}>{(x.status === '5' && checkGoodsHaveBeenPlacedInTheWarehouse(x.goods)) ? 'Đã xếp hết hàng vào kho' : 'Chưa xếp hết hàng hóa vào kho'}</p></span>
                                                        </div>

                                                    </div>
                                                </div>
                                                <a>
                                                    <p className='text-red' style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                                                        {x.status === '5' && (checkGoodsHaveBeenPlacedInTheWarehouse(x.goods) ? "" : "Có hàng hóa chưa xếp vào kho.\n") + (checkGoodsPassedQualityControl(x.goods) ? "" : 'Có hàng hóa không đạt kiểm định.')}
                                                    </p>
                                                </a>
                                            </div>
                                        }
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {/*show detail */}
                                        <a onClick={() => props.handleShowDetailInfo(x._id)}><i className="material-icons">view_list</i></a>
                                        {/*Chỉnh sửa phiếu */}
                                        {props.checkRoleCanEdit(x) && <a onClick={() => handleEdit(x)} className="text-yellow" ><i className="material-icons">edit</i></a>}
                                        {/*Phê duyệt phiếu*/}
                                        {
                                            props.checkRoleApprovers(x) && x.status === '1' &&
                                            <ConfirmNotification
                                                icon="question"
                                                title={translate('manage_warehouse.bill_management.approved_true')}
                                                content={translate('manage_warehouse.bill_management.approved_true') + " " + x.code}
                                                name="check_circle_outline"
                                                className="text-green"
                                                func={() => props.handleFinishedApproval(x)}
                                            />
                                        }
                                        {/*Chuyển sang trạng thái đang thực hiện*/}
                                        {
                                            props.checkRoleCanEdit(x) && x.status === '2' &&
                                            <ConfirmNotification
                                                icon="question"
                                                title={translate('manage_warehouse.bill_management.in_processing')}
                                                content={translate('manage_warehouse.bill_management.in_processing') + " " + x.code}
                                                name="business_center"
                                                className="text-violet"
                                                func={() => props.handleInProcessingStatus(x)}
                                            />
                                        }
                                        {/*Kiểm định chất lượng*/}
                                        {
                                            props.checkRoleQualityControlStaffs(x) && x.status === '3' &&
                                            <a onClick={() => handleFinishedQualityControlStaff(x)} className="text-green" ><i className="material-icons">check_circle</i></a>
                                        }
                                        {/*Hoàn thành phiếu và đánh lô*/}
                                        {
                                            props.checkRoleCanEdit(x) && x.qualityControlStaffs[x.qualityControlStaffs.map(y => y.staff._id).indexOf(userId)].time !== null
                                            && (x.qualityControlStaffs[x.qualityControlStaffs.map(y => y.staff._id).indexOf(userId)].status === 2 || x.qualityControlStaffs[x.qualityControlStaffs.map(y => y.staff._id).indexOf(userId)].status === 3)
                                            && x.status === '4' &&
                                            <a
                                                className="text-green"
                                                title={translate('manage_warehouse.inventory_management.add_lot')}
                                                onClick={() => handleAddLot(x)}
                                            ><i className="material-icons">add_box</i>
                                            </a>
                                        }
                                        {/*Chi tiết hàng hóa*/}
                                        {
                                            props.checkRoleCanEdit(x) && x.status === '5' &&
                                            <a
                                                className="text-violet"
                                                title={translate('manage_warehouse.inventory_management.add_lot')}
                                                onClick={() => handleShowGoodDetail(x)}
                                            ><i className="material-icons">info</i>
                                            </a>
                                        }
                                        {/*Chuyển phiếu sang trạng thái đã hủy*/}
                                        {
                                            props.checkRoleCanEdit(x) && (x.status === '5' || x.status === '3') &&
                                            <ConfirmNotification
                                                icon="question"
                                                title={translate('manage_warehouse.bill_management.cancel_bill')}
                                                content={translate('manage_warehouse.bill_management.cancel_bill') + " " + x.code}
                                                name="cancel"
                                                className="text-red"
                                                func={() => props.handleCancelBill(x)}
                                            />
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {bills.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={totalPages} currentPage={page} func={props.setPage} />
            </div>
        </div >
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editBill: BillActions.editBill,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ReceiptManagement));
