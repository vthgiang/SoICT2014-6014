import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from '../../../../config'
import { PaginateBar, SelectMulti, DataTableSetting } from '../../../../common-components'

import { TaskProcessActions } from '../../../task/task-process/redux/actions';
import { ModalViewProcess } from './modalViewProcess'
import { ModalEditProcess } from '../../../task/task-process/component/task-process-management/modalEditProcess';
import { forwardRef } from 'react';
import { ModalCreateTaskByProcess } from '../../../task/task-process/component/task-process-management/modalCreateTaskByProcess';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { TaskPertActions } from '../redux/actions';
import c3 from 'c3';
import 'c3/c3.css';
import { RequestChangeTaskProcess } from './requestChangeTaskProcess';
import { getStatusStr } from '../TaskPertHelper';
import { translate } from 'react-redux-multilingual/lib/utils';
import { ChangeProcessTime } from './changeProcessTime';

function TaskProcessManagement(props) {
	const TableId = "table-task-process-template";
	const defaultConfig = { limit: 5 }
	const Limit = getTableConfiguration(TableId, defaultConfig).limit;
	const [state, setState] = useState({
		currentRole: getStorage('currentRole'),
		currentUser: getStorage("userId"),
		currentRow: null,
		pageNumber: 1,
		noResultsPerPage: 1000,
		tableId: TableId,
		listTaskProcess: []
	})
	const { translate, taskProcess, department, handleSelect } = props
	const { currentRow, currentRole, currentUser, tableId, showmodalCreateTaskByProcess, listTaskProcess } = state


	const [show, setShow] = useState({
		analysis: false,
		requestChange: false,
		changeTime: false
	})

	useEffect(() => {
		if (taskProcess && taskProcess.listTaskProcess) {
			console.log(listTaskProcess)
			setState({
				...state,
				listTaskProcess: taskProcess.listTaskProcess
			})
		}

	}, [taskProcess])

	let totalPage = taskProcess.totalPage
	let listOrganizationalUnit = department?.list
	useEffect(() => {
		props.getAllTaskProcess(state.pageNumber, state.noResultsPerPage, "");
	}, [])

	const setPage = async (pageTotal) => {
		let oldCurrentPage = state.pageNumber;
		await setState(state => {
			return {
				...state,
				pageNumber: pageTotal
			}
		})
		let newCurrentPage = state.pageNumber;
		props.getAllTaskProcess(pageTotal, state.noResultsPerPage, "");
	}

	const setLimit = (pageTotal) => {
		// console.log(pageTotal,state.noResultsPerPage );
		if (pageTotal !== state.noResultsPerPage) {
			setState(state => {
				return {
					...state,
					noResultsPerPage: pageTotal
				}
			})
			// props.getAllTaskProcess(state.pageNumber, state.noResultsPerPage, "");
			props.getAllTaskProcess(1, pageTotal, "");
		}
	}
	const handleUpdateData = () => {

	}


	const handleChange = async (e, item) => {
		viewProcess(item)
	}
	useEffect(() => {
		if (currentRow && currentRow != null) {
			window.$(`#modal-view-process-task-list`).modal("show");
		}

	}, [show.analysis])
	const viewProcess = async (item) => {
		// console.log(item)
		await setState(state => {
			return {
				...state,
				currentRow: item,

			}
		});
		setShow({
			...show,
			analysis: !show.analysis
		})
	}
	useEffect(() => {
		if (state.currentRowRequestChange) {
			window.$(`#modal-request-change-task-process`).modal("show");
		}
	}, [show.requestChange])
	const handleRequestChange = (process) => {
		console.log(process)
		setState({
			...state,
			currentRowRequestChange: process,
		})
		setShow({
			...show,
			requestChange: !show.requestChange
		})
	}
	const handleCloseProcess = (event, process) => {
		props.closeProcess(process)
	}
	const handleChangeProcessName = (event) => {
		let val = event.target.value
		console.log(val)
		let data = taskProcess.listTaskProcess.filter(p => {
			console.log(p)
			console.log(p.processName.includes(val))
			return p.processName.includes(val)
		})
		console.log(data)
		setState({
			...state,
			listTaskProcess: data
		})

	}

	useEffect(() => {
		if (state.currentRowChangeTime) {
			window.$(`#modal-change-process-time-${state.currentRowChangeTime._id}`).modal("show");
		}
	}, [show.changeTime])
	const handleChangeTime = (event, item) => {
		setState({
			...state,
			currentRowChangeTime: item
		})
		setShow({
			...show,
			changeTime: !show.changeTime
		})
	}
	return (
		<div className="box">
			<div className="box-body qlcv">
				{state.currentRowChangeTime &&
					<ChangeProcessTime processData={state.currentRowChangeTime} />}
				{
					state.currentRowRequestChange &&
					<RequestChangeTaskProcess process={state.currentRowRequestChange} />
				}
				{
					state.currentRow &&
					<ModalViewProcess
						title={translate("task.task_process.view_task_process_modal")}
						listOrganizationalUnit={listOrganizationalUnit}
						data={currentRow}
						idProcess={currentRow._id}
						xmlDiagram={currentRow.xmlDiagram}
						processName={currentRow.processName}
						processDescription={currentRow.processDescription}
						infoTask={currentRow.taskList}
						creator={currentRow.creator}
					/>
				}


				<div className="form-inline">
					<div className="form-group">

						<input className="form-control" type="text" placeholder={translate('task_template.search_by_name')} onChange={handleChangeProcessName} />
						{/* <button type="button" className="btn btn-success" title={translate('task_template.search')} onClick={handleUpdateData}>{translate('task_template.search')}</button> */}
					</div>
				</div>

				<DataTableSetting
					tableId={tableId}
					columnArr={[
						translate("task.task_process.process_name"),
						translate('task_template.description'),
						translate('task.task_process.manager'),
						translate("task.task_process.creator"),
					]}
					setLimit={setLimit}
				/>
				<table className="table table-bordered table-striped table-hover" id={tableId}>
					<thead>
						<tr>
							<th style={{ width: "70px" }}>{translate('process_analysis.process_list.index')}</th>
							<th title={translate("task.task_process.process_name")}>{translate("task.task_process.process_name")}</th>

							<th title={translate('task.task_process.manager')}>{translate('task.task_process.manager')}</th>
							<th title={translate('manage_risk.risk_status')}>{translate('manage_risk.risk_status')}</th>
							{/* <th title={translate("task.task_process.creator")}>{translate("task.task_process.creator")}</th> */}
							<th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
						</tr>
					</thead>
					<tbody className="task-table">
						{
							(listTaskProcess && listTaskProcess.length !== 0) ? listTaskProcess.map((item, key) => {
								return <tr key={key} >
									<td>{key + 1}</td>
									<td>{item.processName}</td>
									<td>{(item.manager && item.manager.length !== 0) && item.manager.map(x => x.name).join(', ')}</td>
									<td style={{ textAlign: "center" }}>
										{getStatusStr(translate, item.status)}
									</td>
									<td><div class="dropdown">
										<button href="#" class=" btn btn-sm btn-success dropdown-toggle" data-toggle="dropdown">{translate('process_analysis.process_list.select')}<span class="caret"></span></button>
										<ul class="dropdown-menu pull-right" role="menu">

											<li style={{ color: 'blue' }}>
												<a className="edit" style={{ color: '#1C1C1C' }} onClick={(e) => handleChange(e, item)} title={translate('task.task_template.view_detail_of_this_task_template')}>
												<i class="fa fa-hourglass-half" aria-hidden="true"></i><span>{translate('process_analysis.process_list.analysis')}</span>
												</a>
											</li>
											{item.status != 'temp_finished' && !item.manager.map(u => u._id).includes(getStorage('userId')) &&
												<li>
													<a className="edit text-blue" onClick={() => handleRequestChange(item)} ><i className="material-icons">arrow_upward</i>{translate('process_analysis.process_list.request_change_process')}</a>
												</li>}
											{/* {item.status != 'temp_finished' && item.manager.map(u => u._id).includes(getStorage('userId')) &&
												<li style={{ color: 'blue' }}>
													<a className="edit" style={{ color: '#1C1C1C' }} onClick={(e) => handleChangeTime(e, item)} title={translate('task.task_template.view_detail_of_this_task_template')}>
														<i class="fa fa-cog" aria-hidden="true"></i><span>{translate('process_analysis.change_time.change_plan')}</span>
													</a>
												</li>
											} */}
											{item.manager && item.manager.length != 0 && item.manager.map(u => u._id).includes(getStorage('userId')) && item.status != 'temp_finished' &&
												<li>
													<a className="edit text-blue" onClick={(e) => handleCloseProcess(e, item)} title={translate('task.task_template.view_detail_of_this_task_template')}>
														<i className="material-icons">check</i><span>{translate('process_analysis.process_list.finish')}</span>
													</a>
												</li>}


										</ul>
									</div>
									</td>


								</tr>
							}) : null
						}
					</tbody>
				</table>
				{(listTaskProcess && listTaskProcess.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
				<PaginateBar pageTotal={totalPage} currentPage={state.pageNumber} func={setPage} />
			</div>
		</div>
	);
}



function mapState(state) {
	const { user, auth, taskProcess, role, department, taskPert, notifications } = state;
	return { user, auth, taskProcess, role, department, taskPert, notifications };
}

const actionCreators = {
	getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
	deleteXmlDiagram: TaskProcessActions.deleteXmlDiagram,
	deleteTaskProcess: TaskProcessActions.deleteTaskProcess,
	updateTask: TaskPertActions.updateTask,
	closeProcess: TaskPertActions.closeProcess
};
const connectedTaskProcessManagement = connect(mapState, actionCreators)(withTranslate(TaskProcessManagement));
export { connectedTaskProcessManagement as TaskProcessManagement };