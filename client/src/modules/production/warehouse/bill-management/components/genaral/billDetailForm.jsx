import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { formatDate} from '../../../../../../helpers/formatDate';
import { DialogModal} from '../../../../../../common-components';
import { taskManagementActions } from '../../../../../task/task-management/redux/actions';
import { Gantt } from '../../../../../../common-components';

import QuantityLotDetailForm from './quantityLotDetail';
import BillLogs from './billLogs';
import dayjs from 'dayjs'

let INFO_SEARCH = { // bộ lọc tìm kiếm
    unitsSelected: null,
    startMonth: dayjs().subtract(3, 'month').format("YYYY-MM"),
    endMonth: dayjs().format("YYYY-MM"),
}

const CRITERIA = { NOT_COEFFICIENT: 0, COEFFICIENT: 1 };
const TYPEPOINT = { AUTOMATIC_POINT: 0, EMPLOYEE_POINT: 1, APPROVED_POINT: 2 };

// giá trị tìm kiếm mặc định mỗi khi search
const DEFAULT_SEARCH = {
    "general-task-chart": {},
    "gantt-chart": {
        status: ['inprocess'],
    },
    "employee-distribution-chart": {
        status: ["inprocess", "wait_for_approval", "finished", "delayed", "canceled"],
    },
    "in-process-unit-chart": {},
    "task-results-domain-chart": {
        typePoint: TYPEPOINT.AUTOMATIC_POINT
    },
    "task-status-chart": {},
    "average-results-chart": {
        typePoint: TYPEPOINT.AUTOMATIC_POINT,
        criteria: CRITERIA.NOT_COEFFICIENT
    },
    "load-task-organization-chart": {},
    "all-time-sheet-log-by-unit": {}
}

const DEFAULT_INFOSEARCH = {
    taskStatus: ["inprocess"]
}

function BillDetailForm(props) {

    const [state, setState] = useState({
        unitsSelected: [],
        startMonth: INFO_SEARCH.startMonth,
        endMonth: INFO_SEARCH.endMonth,
        infoSearch: Object.assign({}, DEFAULT_INFOSEARCH),
        dataCalendar: {},
        currentZoom: props.translate('system_admin.system_setting.backup.date'),
    })

    useEffect(() => {
        let data = {
            ...DEFAULT_SEARCH,
            "common-params": {
                organizationalUnitId: ["62a8092c5387be19102a8eaf"],
                startMonth: state.startMonth,
                endMonth: state.endMonth,
            },
        }
        // service mới, lưu vào state redux : props.tasks.taskDashboardCharts:[ general-task-chart, ]
        props.getOrganizationTaskDashboardChart(data);
    }, [])

    /*Lịch*/
    const handleZoomChange = (zoom) => {
        setState({
            ...state,
            currentZoom: zoom
        });
    }

    const handleShowDetailQuantity = async (lot) => {
        await setState({
            ...state,
            quantityDetail: lot
        })

        window.$('#modal-detail-lot-quantity').modal('show');
    }

    const handleViewVersion = (e) => {
        e.preventDefault();
        window.$('#modal-detail-logs-version-bill').modal('show');
    }

    const getDataChart = () => {
        const { tasks, bills } = props;
        const { taskDashboardCharts } = tasks
        const { billDetail } = bills;
        let billCode = billDetail.code;
        let dataTaskChart1 = [];
        let dataTaskChart2 = [];
        let dataAllTaskChart = [];
        if (taskDashboardCharts && taskDashboardCharts['gantt-chart']
            && taskDashboardCharts['gantt-chart'].dataChart
            && taskDashboardCharts['gantt-chart'].dataChart.dataAllTask
            && taskDashboardCharts['gantt-chart'].dataChart.dataAllTask.length > 0) {
            taskDashboardCharts['gantt-chart'].dataChart.dataAllTask.forEach(item => {
                if (item.text && item.text.includes(billCode)) {
                    dataTaskChart1.push(item);
                }
            })
        }
        if (taskDashboardCharts && taskDashboardCharts['gantt-chart']
            && taskDashboardCharts['gantt-chart'].dataChart
            && taskDashboardCharts['gantt-chart'].dataChart.dataAllTask
            && taskDashboardCharts['gantt-chart'].dataChart.dataAllTask.length > 0) {
            taskDashboardCharts['gantt-chart'].dataChart.dataAllTask.forEach(item => {
                if (dataTaskChart1 && dataTaskChart1.length > 0) {
                    dataTaskChart1.forEach(item1 => {
                        if (item1.parent === item.id) {
                            dataTaskChart2.push(item);
                        }
                    })
                }
            })
        }
        if (dataTaskChart2 && dataTaskChart2.length > 0 && dataTaskChart1 && dataTaskChart1.length > 0) {
            dataTaskChart1.forEach((item, index) => {
                dataAllTaskChart.push(dataTaskChart2[index]);
                dataAllTaskChart.push(item);
            })
        }
        return dataAllTaskChart;
    }

    useEffect(() => {
        let dataAllTaskChart = getDataChart();
        const { bills } = props;
        const { billDetail } = bills;
        if (billDetail._id !== state.billId) {
            if (dataAllTaskChart && dataAllTaskChart.length > 0) {
                let countInTime = 0;
                let countDelayed = 0;
                let countNotAchived = 0;
                for (let i = 1; i < dataAllTaskChart.length; i = i + 2) {
                    if (dataAllTaskChart[i].process === 1) {
                        countInTime = countInTime + 1;
                    }
                    if (dataAllTaskChart[i].process === 0) {
                        countDelayed = countDelayed + 1;
                    }
                    if (dataAllTaskChart[i].process === 2) {
                        countNotAchived = countNotAchived + 1;
                    }
                }
                setState({
                    ...state,
                    dataCalendar: {
                        ...state.dataCalendar,
                        countAllTask: {
                            delay: countDelayed,
                            intime: countInTime,
                            notAchived: countNotAchived,
                        },
                        dataAllTask: {
                            ...state.dataCalendar.dataAllTask,
                            data: dataAllTaskChart
                        },
                        lineAllTask: dataAllTaskChart.length / 2
                    },
                })
            }
        }
    }, [props.bills.billDetail._id])

    const { translate, bills } = props;
    const { billDetail } = bills;
    const { quantityDetail, dataCalendar, currentZoom, infoSearch } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-bill`}
                formID={`form-detail-bill`}
                title={translate(`manage_warehouse.bill_management.detail_title.${billDetail.group}`)}
                msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                msg_failure={translate('manage_warehouse.bin_location_management.add_faile')}
                size={75}
                hasSaveButton={false}
                hasNote={false}
            >
                <BillLogs logs={billDetail ? billDetail.logs : []} group={billDetail.group} />
                {
                    quantityDetail &&
                    <QuantityLotDetailForm quantityDetail={quantityDetail} group={billDetail.group} />
                }
                <form id={`form-detail-bill`} >
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.code')}:&emsp;</strong>
                                    {billDetail.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.type')}:&emsp;</strong>
                                    {translate(`manage_warehouse.bill_management.billType.${billDetail.type}`)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate(`manage_warehouse.bill_management.status`)}:&emsp;</strong>
                                    {billDetail ? <a style={{ color: translate(`manage_warehouse.bill_management.bill_color.${billDetail.status}`) }}>{translate(`manage_warehouse.bill_management.bill_status.${billDetail.status}`)}</a> : []}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.stock')}:&emsp;</strong>
                                    {billDetail.fromStock ? billDetail.fromStock.name : "Stock is deleted"}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.creator')}:&emsp;</strong>
                                    {billDetail.creator ? billDetail.creator.name : "Creator is deleted"}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.date')}:&emsp;</strong>
                                    {formatDate(billDetail.createdAt)}
                                </div>
                                {billDetail.group === '1' && billDetail.sourceType === '1' &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.mill')}:&emsp;</strong>
                                        {billDetail.manufacturingMill ? billDetail.manufacturingMill.name : "Mill is deleted"}
                                    </div>
                                }
                                {billDetail.group === '1' && billDetail.sourceType === '2' &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.supplier')}:&emsp;</strong>
                                        {billDetail.supplier ? billDetail.supplier.name : "Supplier is deleted"}
                                    </div>
                                }
                                {(billDetail.group === '2' || billDetail.group === '3') &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.customer')}:&emsp;</strong>
                                        {billDetail.customer ? billDetail.customer.name : "Customer is deleted"}
                                    </div>
                                }
                                {billDetail.group === '5' &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.receipt_stock')}:&emsp;</strong>
                                        {billDetail.toStock ? billDetail.toStock.name : "Stock is deleted"}
                                    </div>
                                }
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.description')}:&emsp;</strong>
                                    {billDetail.description}
                                </div>
                            </div>
                        </div>

                        {billDetail.group !== '4' &&
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.receiver')}</legend>
                                    <div className={`form-group`}>
                                        <strong>{translate('manage_warehouse.bill_management.name')}:&emsp;</strong>
                                        {billDetail.receiver ? billDetail.receiver.name : ''}
                                    </div>
                                    <div className={`form-group`}>
                                        <strong>{translate('manage_warehouse.bill_management.phone')}:&emsp;</strong>
                                        {billDetail.receiver ? billDetail.receiver.phone : ''}
                                    </div>
                                    <div className={`form-group`}>
                                        <strong>{translate('manage_warehouse.bill_management.email')}:&emsp;</strong>
                                        {billDetail.receiver ? billDetail.receiver.email : ''}
                                    </div>
                                    <div className={`form-group`}>
                                        <strong>{translate('manage_warehouse.bill_management.address')}:&emsp;</strong>
                                        {billDetail.receiver ? billDetail.receiver.address : ''}
                                    </div>
                                </fieldset>
                            </div>
                        }
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{"Danh sách công việc"}</legend>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                            <th title={"Tên công việc"}>{"Tên công việc"}</th>
                                            <th title={"Người tham gia"}>{"Người tham gia"}</th>
                                            <th title={"Thời gian bắt đầu"}>{"Thời gian bắt đầu"}</th>
                                            <th title={"Thời gian kết thúc"}>{"Thời gian kết thúc"}</th>
                                        </tr>
                                    </thead>
                                    <tbody id={`good-edit-manage-by-archive`}>
                                        {(typeof billDetail.stockWorkAssignment !== 'undefined' && billDetail.stockWorkAssignment.length > 0) &&
                                            billDetail.stockWorkAssignment.map((x, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.nameField}</td>
                                                    <td>{x.workAssignmentStaffs && x.workAssignmentStaffs.length > 0 && x.workAssignmentStaffs.map((y, index2) =>
                                                        <div key={index2}>{y.name}</div>
                                                    )}</td>
                                                    <td>{x.startDate + x.startTime}</td>
                                                    <td>{x.endDate + x.endTime}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                        {dataCalendar && dataCalendar.dataAllTask && dataCalendar.dataAllTask.data &&
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="gantt qlcv" >
                                    <Gantt
                                        ganttId="gantt-chart"
                                        ganttData={dataCalendar?.dataAllTask}
                                        zoom={currentZoom}
                                        status={infoSearch.taskStatus}
                                        count={dataCalendar?.countAllTask}
                                        line={dataCalendar?.lineAllTask}
                                        unit={true}
                                        onZoomChange={handleZoomChange}
                                    />
                                    <div className="form-inline" style={{ textAlign: 'center' }}>
                                        <div className="form-group">
                                            <div id="in-time"></div>
                                            <label id="label-for-calendar">{translate('task.task_management.in_time')}{dataCalendar?.countAllTask?.intime}</label>
                                        </div>
                                        <div className="form-group">
                                            <div id="delay"></div>
                                            <label id="label-for-calendar">{translate('task.task_management.delayed_time')}{dataCalendar?.countAllTask?.delay}</label>
                                        </div>
                                        <div className="form-group">
                                            <div id="not-achieved"></div>
                                            <label id="label-for-calendar">{translate('task.task_management.not_achieved')}{dataCalendar?.countAllTask?.notAchived}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                            <th title={translate('manage_warehouse.bill_management.code')}>{translate('manage_warehouse.bill_management.code')}</th>
                                            <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                            <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                            {billDetail.group !== '3' && <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>}
                                            {billDetail.group !== '3' && <th title={translate('manage_warehouse.bill_management.number_passed')}>{translate('manage_warehouse.bill_management.number_passed')}</th>}
                                            {billDetail.group === '3' && <th title={translate('manage_warehouse.bill_management.quantity_issue')}>{translate('manage_warehouse.bill_management.quantity_issue')}</th>}
                                            {billDetail.group === '3' && <th title={translate('manage_warehouse.bill_management.quantity_return')}>{translate('manage_warehouse.bill_management.quantity_return')}</th>}
                                            {billDetail.group === '4' && <th title={translate('manage_warehouse.bill_management.real_quantity')}>{translate('manage_warehouse.bill_management.real_quantity')}</th>}
                                            {billDetail.group === '4' && <th title={translate('manage_warehouse.bill_management.difference')}>{translate('manage_warehouse.bill_management.difference')}</th>}
                                            <th title={translate('manage_warehouse.bill_management.lot_with_unit')}>{translate('manage_warehouse.bill_management.lot_with_unit')}</th>
                                            <th title={translate('manage_warehouse.bill_management.description')}>{translate('manage_warehouse.bill_management.description')}</th>
                                        </tr>
                                    </thead>
                                    <tbody id={`good-edit-manage-by-archive`}>
                                        {(typeof billDetail.goods !== 'undefined' && billDetail.goods.length > 0) &&
                                            billDetail.goods.map((x, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.good ? x.good.code : ''}</td>
                                                    <td>{x.good ? x.good.name : ''}</td>
                                                    <td>{x.good ? x.good.baseUnit : ''}</td>
                                                    {billDetail.group !== '3' && <td>{x.quantity}</td>}
                                                    {billDetail.group !== '3' && <td>{x.realQuantity} <a href="#" onClick={() => handleShowDetailQuantity(x)}> (Chi tiết)</a></td>}
                                                    {billDetail.group === '3' && <td>{x.quantity}</td>}
                                                    {billDetail.group === '3' && <td>{x.returnQuantity} <a href="#" onClick={() => handleShowDetailQuantity(x)}> (Chi tiết)</a></td>}
                                                    {billDetail.group === '4' && <td>{x.realQuantity}</td>}
                                                    {billDetail.group === '4' && <td>{x.damagedQuantity}</td>}
                                                    <td>{x.lots && x.lots.length > 0 && x.lots.map((lot, index) =>
                                                        <div key={index}>
                                                            {lot.code && <p>{lot.code}/{lot.quantity} {x.good.baseUnit}</p>}
                                                        </div>)}
                                                    </td>
                                                    <td>{x.description}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleViewVersion}>{translate('manage_warehouse.bill_management.view_version')}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getOrganizationTaskDashboardChart: taskManagementActions.getOrganizationTaskDashboardChart
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BillDetailForm));
