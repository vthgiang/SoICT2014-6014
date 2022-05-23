import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../common-components';
import { BiddingContractActions } from '../redux/actions';
import { BiddingPackageManagerActions } from '../../bidding-package/biddingPackageManagement/redux/actions';
import { AuthActions } from '../../../auth/redux/actions';
import { GeneralTab } from '../../bidding-package/biddingPackageInfo/components/generalTab';
import DetailContent from '../../../project/projects/components/detailContent';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import moment from 'moment';
const ViewBiddingContract = (props) => {
	const [showFile, setShowFile] = useState(false)
	const initState = {
		contractNameError: undefined,
		contractCodeError: undefined,

		id: "",

		code: "",
		name: "",
		effectiveDate: Date.now(),
		endDate: Date.now(),
		unitOfTime: "",
		budget: 0,
		currenceUnit: "",

		companyA: "",
		addressA: "",
		phoneA: "",
		emailA: "",
		taxCodeA: "",
		representativeNameA: "",
		representativeRoleA: "",
		bankNameA: "",
		bankAccountNumberA: "",

		companyB: "",
		addressB: "",
		phoneB: "",
		emailB: "",
		taxCodeB: "",
		representativeNameB: "",
		representativeRoleB: "",
		bankNameB: "",
		bankAccountNumberB: "",


		biddingPackage: null,
		project: null,

		// files: [],
		// contractFiles: [],

		selectedTab: 'general'
	}

	const [state, setState] = useState(initState);
	const [id, setId] = useState(props.id)
	const { translate, biddingContract, biddingPackagesManager, tasks } = props;
	const listBiddingPackages = biddingPackagesManager?.listBiddingPackages;

	useEffect(() => {
		props.getAllBiddingPackage({ name: '', status: 3, page: 0, limit: 1000 });
	}, [])

	useEffect(() => {
		setId(props.id)
	}, [props.id])

	useEffect(() => {
		const { data } = props;

		if (data) {
			setState({
				...state,
				id: data._id,

				code: data.code,
				name: data.name,
				effectiveDate: formatDate(data.effectiveDate),
				endDate: formatDate(data.endDate),
				unitOfTime: data.unitOfTime,
				budget: data.budget,
				currenceUnit: data.currenceUnit,
				createdDate: formatDate(data.createdDate),

				timeOfEffection: formatTimeOfEffection(data.unitOfTime, data.effectiveDate, data.endDate),

				companyA: data.partyA.company,
				addressA: data.partyA.address,
				phoneA: data.partyA.phone,
				emailA: data.partyA.email,
				taxCodeA: data.partyA.taxCode,
				representativeNameA: data.partyA.representative.name,
				representativeRoleA: data.partyA.representative.role,
				bankNameA: data.partyA.bank.name,
				bankAccountNumberA: data.partyA.bank.accountNumber,

				companyB: data.partyB.company,
				addressB: data.partyB.address,
				phoneB: data.partyB.phone,
				emailB: data.partyB.email,
				taxCodeB: data.partyB.taxCode,
				representativeNameB: data.partyB.representative.name,
				representativeRoleB: data.partyB.representative.role,
				bankNameB: data.partyB.bank.name,
				bankAccountNumberB: data.partyB.bank.accountNumber,

				biddingPackage: data.biddingPackage,
				project: data.project,

				files: data.files,
			})

			if (data.project) {
				props.getTasksByProject(data.project?._id);
			}
		}
	}, [props.id])

	// Function format dữ liệu Date thành string
	const formatDate = (date, monthYear = false) => {
		if (!date) return null;
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) {
			month = '0' + month;
		}

		if (day.length < 2) {
			day = '0' + day;
		}

		if (monthYear === true) {
			return [month, year].join('-');
		} else {
			return [day, month, year].join('-');
		}
	}

	const formatTimeOfEffection = (unitOfTime, effectiveDate, endDate) => {
		let result = 100
		let fmEndDate = moment(endDate)
		let fmEffDate = moment(effectiveDate)
		result = fmEndDate.diff(fmEffDate, unitOfTime, true)

		return result.toFixed(2)
	}

	// hàm xử lý tabbedPane
	const handleChangeContent = async (content) => {
		await setState(state => {
			return {
				...state,
				selectedTab: content
			}
		})
	}

	// downloafd file
	const requestDownloadFile = (e, path, fileName) => {
		e.preventDefault()
		props.downloadFile(path, fileName)
	}

	const generalInfo = () => {
		return (
			<div style={{ lineHeight: 2, marginLeft: "5px" }} className="row">
				<div className='col-md-6'>
					<div ><strong>Tên hợp đồng: </strong><span>{state.name}</span></div>
					<div ><strong>Mã hợp đồng: </strong><span>{state.code}</span></div>
					<div ><strong>Giá trị hợp đồng: </strong><span>{state.budget} ({state.currenceUnit})</span></div>
				</div>

				<div className='col-md-6'>
					<div ><strong>Ngày ký kết: </strong><span>{state.createdDate}</span></div>
					<div ><strong>Ngày có kiệu lực: </strong><span>{state.effectiveDate}</span></div>
					<div ><strong>Thời hạn hợp đồng: </strong><span>{state.timeOfEffection} ({state.unitOfTime})</span></div>
				</div>
			</div>
		)
	}

	const partyForm = () => {
		return (
			// className={state.selectedTab === "party" ? "active tab-pane" : "tab-pane"} id="party" 
			<div style={{ lineHeight: 2 }}>
				<div className="col-md-6">
					<fieldset className="scheduler-border">
						<legend className="scheduler-border">Bên A</legend>
						<div><strong>Công ty: </strong><span>{state.companyA}</span></div>
						<div><strong>Địa chỉ: </strong><span>{state.addressA}</span></div>
						<div><strong>Email: </strong><span>{state.emailA}</span></div>
						<div><strong>Điện thoại: </strong><span>{state.phoneA}</span></div>
						<div><strong>Số tài khoản: </strong><span>{state.bankAccountNumberA}</span></div>
						<div><strong>Ngân hàng: </strong><span>{state.bankNameA}</span></div>
						<div><strong>Mã số thuế: </strong><span>{state.taxCodeA}</span></div>
						<div><strong>Người đại diện: </strong><span>{state.representativeNameA}</span></div>
						<div><strong>Chức vụ: </strong><span>{state.representativeRoleA}</span></div>
					</fieldset>
				</div>
				<div className="col-md-6">
					<fieldset className="scheduler-border">
						<legend className="scheduler-border">Bên B</legend>
						<div><strong>Công ty: </strong><span>{state.companyB}</span></div>
						<div><strong>Địa chỉ: </strong><span>{state.addressB}</span></div>
						<div><strong>Email: </strong><span>{state.emailB}</span></div>
						<div><strong>Điện thoại: </strong><span>{state.phoneB}</span></div>
						<div><strong>Số tài khoản: </strong><span>{state.bankAccountNumberB}</span></div>
						<div><strong>Ngân hàng: </strong><span>{state.bankNameB}</span></div>
						<div><strong>Mã số thuế: </strong><span>{state.taxCodeB}</span></div>
						<div><strong>Người đại diện: </strong><span>{state.representativeNameB}</span></div>
						<div><strong>Chức vụ: </strong><span>{state.representativeRoleB}</span></div>
					</fieldset>
				</div>
			</div>
		)
	}



	return (
		<DialogModal
			modalID={`modal-view-bidding-contract--${id}`}
			formID={`form-edit-bidding-contract-${id}`}
			title="Xem chi tiết hợp đồng"
			hasSaveButton={false}
			size={75}
		>
			<form id={`form-edit-bidding-contract-${id}`}>
				<div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
					{/* Tabbed pane */}
					<ul className="nav nav-tabs">
						{/* Nút tab thông tin cơ bản */}
						<li className="active"><a href="#general" onClick={() => handleChangeContent("general")} data-toggle="tab">Thông tin chung</a></li>
						{/* Nút tab gói thầu*/}
						<li><a href="#bidding-package" onClick={() => handleChangeContent("bidding-package")} data-toggle="tab">Thông tin gói thầu</a></li>
						{/* Nút tab dự án */}
						<li><a href="#project" onClick={() => handleChangeContent("project")} data-toggle="tab">Thông tin dự án</a></li>
					</ul>
					<div className="tab-content">
						<div className={state.selectedTab === "general" ? "active tab-pane" : "tab-pane"} id="general">
							{generalInfo()}
							<div style={{ marginLeft: "20px", lineHeight: 2 }}>
								<strong>File đính kèm: </strong>
								{state.files?.length > 0 ?
									<span onClick={() => setShowFile(!showFile)} style={{ cursor: "pointer", padding: "2px" }}>
										{showFile ? `Ẩn files` : `Hiển thị (${state.files?.length} files)`}
										<i className={showFile ? "fa fa-sort-desc" : "fa fa-sort-asc"} style={{ marginLeft: "5px" }} aria-hidden="true"></i>
									</span> : <span>Không có files</span>
								}
								{showFile && state.files?.map(x => {
									return <div>
										{!x.url ? translate('human_resource.profile.no_files') :
											<a className='intable'
												style={{ cursor: "pointer" }}
												onClick={(e) => requestDownloadFile(e, `.${x.url}`, x.name)}>
												<i className="fa fa-download"> &nbsp;{x.fileName}</i>
											</a>
										}
										<br />
									</div>
								})}
							</div>
							<br />
							{partyForm()}

						</div>
						<div className={state.selectedTab === "bidding-package" ? "active tab-pane" : "tab-pane"} id="bidding-package">
							{/* tab thông tin của gói thầu */}
							{state.biddingPackage &&
								<GeneralTab
									id={`view_general${state.id}`}
									biddingPackage={state.biddingPackage && state.biddingPackage}
								/>
							}
						</div>
						<div className={state.selectedTab === "project" ? "active tab-pane" : "tab-pane"} id="project">
							{
								state.project ?
									<DetailContent
										projectDetailId={state.project && state.project._id}
										projectDetail={state.project}
										currentProjectTasks={tasks && tasks.tasksbyproject}
									/> : <span>Chưa có dự án theo hợp đồng này</span>
							}
						</div>
					</div>
				</div>
			</form>
		</DialogModal>
	);

}

const mapStateToProps = state => state;

const mapDispatchToProps = {
	editBiddingContract: BiddingContractActions.editBiddingContract,
	getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
	downloadFile: AuthActions.downloadFile,
	getTasksByProject: taskManagementActions.getTasksByProject,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ViewBiddingContract));