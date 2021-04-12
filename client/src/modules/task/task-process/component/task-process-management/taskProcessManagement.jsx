import React, { Component, useEffect,useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from '../../../../../config';

import { PaginateBar, SelectMulti, DataTableSetting } from '../../../../../common-components';

import { TaskProcessActions } from '../../redux/actions';
import { ModalViewProcess } from './modalViewProcess';
import { ModalEditProcess } from './modalEditProcess';
import { forwardRef } from 'react';
import { ModalCreateTaskByProcess } from './modalCreateTaskByProcess';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function TaskProcessManagement(props) {
	const TableId = "table-task-process-template";
	const defaultConfig = { limit: 5 }
	const Limit = getTableConfiguration(TableId, defaultConfig).limit;
	const [state, setState] = useState({
		currentRole: getStorage('currentRole'),
		currentUser: getStorage("userId"),
		currentRow: {},
		pageNumber: 1,
		noResultsPerPage: Limit,
		tableId: TableId,
	})
	const { translate, taskProcess, department } = props
	const { currentRow, currentRole, currentUser, tableId ,showmodalCreateTaskByProcess} = state
	let listTaskProcess = [];
	if (taskProcess && taskProcess.listTaskProcess) {
		listTaskProcess = taskProcess.listTaskProcess
	}
	let totalPage = taskProcess.totalPage
	let listOrganizationalUnit = department?.list
	useEffect(() => {
		props.getAllTaskProcess(state.pageNumber, state.noResultsPerPage, "");
	}, [])
	const showEditProcess = async (item) => {
		// console.log(currentRow);
		setState(state => {
			return {
				...state,
				currentRow: item,
			}
		});
		window.$(`#modal-edit-process-task-list`).modal("show");
	}

	const deleteTaskProcess = async (taskProcessId) => {
		
		props.deleteTaskProcess(taskProcessId, state.pageNumber, state.noResultsPerPage, "");
	}

	const viewProcess = async (item) => {
		// console.log(item)
		setState(state => {
			return {
				...state,
				currentRow: item,
			}
		});
		window.$(`#modal-view-process-task-list`).modal("show");
	}

	const showModalCreateTaskByProcess = async () => {
		await setState(state => {
			return {
				...state,
				showmodalCreateTaskByProcess: true
			}
		});
		window.$(`#modal-create-task-by-process`).modal("show");
	}

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
	const handleUpdateData = ()=>{

	}

	const isManager = (itemProcess) => {
		let { currentUser } = state;
		let check = false;
		let manager = itemProcess.manager;
		// console.log(manager, currentUser);
		for (let x in manager) {
			if (manager[x].id === currentUser) {
				check = true;
			}
		}
		return check;
	}

	

	return (
		<div className="box">
			<div className="box-body qlcv">
				{
					state.currentRow !== undefined &&
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
				{
					state.currentRow !== undefined &&
					<ModalEditProcess
						title={'Chỉnh sửa quy trình'}
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
				{/* Button thêm mới */}
				<div className="pull-right" style={{ marginTop: 5 }}>
					<button type="button" className="btn btn-success pull-right" data-toggle="dropdown" aria-expanded="true" title='Thêm' onClick={(event) => { showModalCreateTaskByProcess(event) }}>{translate('task_template.add')}</button>
				</div>
				{showmodalCreateTaskByProcess &&
					<ModalCreateTaskByProcess
						title={"Quy trình không theo mẫu"}
						listOrganizationalUnit={listOrganizationalUnit}
					/>
				}
				<div className="form-inline">
					<div className="form-group">
						<label className="form-control-static">{translate('task_template.name')}</label>
						<input className="form-control" type="text" placeholder={translate('task_template.search_by_name')} />
						<button type="button" className="btn btn-success" title={translate('task_template.search')} onClick={handleUpdateData}>{translate('task_template.search')}</button>
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
							<th title={translate("task.task_process.process_name")}>{translate("task.task_process.process_name")}</th>
							<th title={translate('task_template.description')}>{translate('task_template.description')}</th>
							<th title={translate('task.task_process.manager')}>{translate('task.task_process.manager')}</th>
							<th title={translate("task.task_process.creator")}>{translate("task.task_process.creator")}</th>
							<th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
						</tr>
					</thead>
					<tbody className="task-table">
						{
							(listTaskProcess && listTaskProcess.length !== 0) ? listTaskProcess.map((item, key) => {
								return <tr key={key} >
									<td>{item.processName}</td>
									<td>{item.processDescription}</td>
									<td>{(item.manager && item.manager.length !== 0) && item.manager.map(x => x.name).join(', ')}</td>
									<td>{item.creator?.name}</td>
									<td>
										<a onClick={() => { viewProcess(item) }} title={translate('task.task_template.view_detail_of_this_task_template')}>
											<i className="material-icons">view_list</i>
										</a>
										{isManager(item) &&
											<React.Fragment>
												<a className="edit" onClick={() => { showEditProcess(item) }} title={translate('task_template.edit_this_task_template')}>
													<i className="material-icons">edit</i>
												</a>
												<a className="delete" onClick={() => { deleteTaskProcess(item._id) }} title={translate('task_template.delete_this_task_template')}>
													<i className="material-icons"></i>
												</a>
											</React.Fragment>
										}

										{/* <a className="delete" onClick={() => { deleteDiagram(item._id) }} title={translate('task_template.delete_this_task_template')}>
												<i className="material-icons"></i>
											</a>
											<a className="" style={{ color: "#28A745" }} onClick={() => { showModalCreateTask(item) }} title={translate('task_template.delete_this_task_template')}>
												<i className="material-icons">add_box</i>
											</a> */}
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
	const { user, auth, taskProcess, role, department } = state;
	return { user, auth, taskProcess, role, department };
}

const actionCreators = {
	getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
	deleteXmlDiagram: TaskProcessActions.deleteXmlDiagram,
	deleteTaskProcess: TaskProcessActions.deleteTaskProcess
};
const connectedTaskProcessManagement = connect(mapState, actionCreators)(withTranslate(TaskProcessManagement));
export { connectedTaskProcessManagement as TaskProcessManagement };
