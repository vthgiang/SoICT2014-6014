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
import { ViewDecisionForImplement } from './viewDecision';
import { contractDocxCreate } from './contractDocxCreator';
import { saveAs } from "file-saver";
import { Packer } from "docx";
// var JSZip = require("jszip");
import * as JSZip from 'jszip';
import { TagActions } from '../../tags/redux/actions';
import { acceptanceRecordDocxCreate } from './acceptanceRecordCreator';
import { taskReportDocxCreate } from './reportsListCreator';

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


		decideToImplement: null,
		biddingPackage: null,
		project: null,

		// files: [],
		// contractFiles: [],

		selectedTab: 'general'
	}

	const [state, setState] = useState(initState);
	const [id, setId] = useState(props.id)
	const { translate, biddingContract, biddingPackagesManager, tasks, tag } = props;
	const listActiveBiddingPackage = biddingPackagesManager?.listActiveBiddingPackage;

	useEffect(() => {
		setId(props.id)
	}, [props.id])

	useEffect(() => {
		props.getListTag({});
	}, []);

	let alltag = [];
	if (tag && tag.listTag) {
		alltag = tag?.listTag
	}

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

				decideToImplement: data.decideToImplement,

				files: data.files,
			})

			if (data.project) {
				props.getTasksByProject(data.project?._id);
			}
		}
	}, [props.id, JSON.stringify(props.data?.project?._id)])

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

	const isEqualTagArray = (arr1, arr2) => {
		// trả về mảng các phần tử mảng 1 có trong mảng 2
		const filteredArr = arr1.filter(value => arr2.includes(value))

		if (arr1.length === arr2.length && filteredArr.length === arr1.length) {
			return true; // bằng nhau
		}
		return false;
	}

	const convertTagIdToTagName = (listTag, id) => {
		const tag = listTag?.find(x => String(x._id) === String(id));
		// return tag?.name;
		return tag?.description;
	}

	const getALlTagOfBiddingTask = (tasks, allTag) => {
		let tagsList = [];

		for (let t of tasks) {
			tagsList.push(t.tag)
		}

		let uniqueTagsArr = [];

		for (let t of tagsList) {
			let isExist = uniqueTagsArr.find(x => JSON.stringify(x) === JSON.stringify(t))
			if (!isExist) {
				uniqueTagsArr.push(t);
			}
		}
		let objectTmp = {};
		for (let u of uniqueTagsArr) {
			let fmTagStr = u?.map(x => convertTagIdToTagName(allTag, x)).join(", ")
			objectTmp[JSON.stringify(u)] = {
				tag: fmTagStr,
				tasks: [],
			}
			for (let x of tasks) {
				if (JSON.stringify(x.tag) === JSON.stringify(u)) {
					objectTmp[JSON.stringify(u)].tasks.push(x);
				}
			}
		}

		let res = [];
		for (let i in objectTmp) {
			let o = objectTmp[i];

			res.push(o);
		}

		return res;
	}


	const generateReportsZip = async (state) => {
		let zip = new JSZip();
		// zip.file("Hello.txt", "Hello World\n");
		// var img = zip.folder("images");
		let report = zip.folder(`Bao_cao_cong_viec`); // reports
		let acceptance = zip.folder(`Bien_ban_nghiem_thu`); // acceptanceRecord


		const acceptanceRecord = acceptanceRecordDocxCreate(alltag, state);

		await Packer.toBlob(acceptanceRecord).then(blob => {
			acceptance.file("Biên bản nghiệm thu hợp đồng đợt xxx.docx", blob)
		});

		await Packer.toBlob(acceptanceRecord).then(blob => {
			zip.file("Biên bản nghiệm thu hợp đồng đợt xxx.docx", blob)
		});

		const taskByTagArr = getALlTagOfBiddingTask(state?.biddingPackage?.proposals?.tasks ?? [], alltag);
		for (let x = 0; x < taskByTagArr?.length; x++) {
			let taskByTagitem = taskByTagArr[x];
			let docGenerator = taskReportDocxCreate(taskByTagitem, state);

			await Packer.toBlob(docGenerator).then(blob => {
				console.log(blob);
				report.file(`${x + 1}-BC Txx-${taskByTagitem?.tag}.docx`, blob)
			});
		}

		zip.generateAsync({ type: "blob" }).then(function (content) {
			saveAs(content, `Tài liệu báo cáo thực hiện gói thầu theo hợp đồng số ${state?.code}`);
		});
	}

	const generateDEMO = (state) => {
		// const doc = acceptanceRecordDocxCreate(alltag, state);
		const taskByTagArr = getALlTagOfBiddingTask(state?.biddingPackage?.proposals?.tasks ?? [], alltag);
		const test = taskByTagArr[0];

		const doc = taskReportDocxCreate(test, state);

		Packer.toBlob(doc).then(blob => {
			console.log(blob);
			saveAs(blob, `demoooooo.docx`);
			console.log("Document created successfully");
		});
	}

	const generateContract = (state) => {
		const doc = contractDocxCreate(state);

		Packer.toBlob(doc).then(blob => {
			console.log(blob);
			saveAs(blob, `${state.name}.docx`);
			console.log("Document created successfully");
		});
	}

	const generalInfo = () => {
		return (
			<div>
				<div style={{ display: 'flex', justifyContent: "flex-end" }}>
					{/* <div className="btn btn-danger" onClick={() => generateDEMO(state)}>Tải file DM</div> */}
					<div className="btn btn-success" onClick={() => generateContract(state)}>Tải file hợp đồng</div>
				</div>
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
						<li className="active"><a href="#general" onClick={() => handleChangeContent("general")} data-toggle="tab" title='Thông tin chung'>Thông tin chung</a></li>
						{/* Nút tab quyết định giao triển khai hợp đồng */}
						<li ><a href={`#view-decision-${id}`} onClick={() => handleChangeContent(`#view-decision-${id}`)} data-toggle="tab" title='Thông tin quyết định giao triển khai hợp đồng'>Thông tin quyết định giao triển khai hợp đồng</a></li>
						{/* Nút tab gói thầu*/}
						<li><a href="#bidding-package" onClick={() => handleChangeContent("bidding-package")} data-toggle="tab" title='Thông tin gói thầu'>Thông tin gói thầu</a></li>
						{/* Nút tab dự án */}
						<li><a href="#project" onClick={() => handleChangeContent("project")} data-toggle="tab" title='Thông tin dự án'>Thông tin dự án</a></li>
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
									inContractDetail={true}
									id={`view_general${state.id}`}
									biddingPackage={state.biddingPackage && state.biddingPackage}
								/>
							}
						</div>
						<div className={state.selectedTab === "project" ? "active tab-pane" : "tab-pane"} id="project">
							{/* <div style={{ display: 'flex', justifyContent: "flex-end" }}>
								<div className="btn btn-primary" onClick={() => generateReportsZip(state)}>Tải báo cáo theo đầu mục công việc</div>
							</div> */}
							{state.project ?
								<div>
									<div style={{ display: 'flex', justifyContent: "flex-end" }}>
										<div className="btn btn-primary" onClick={() => generateReportsZip(state)}>Tải báo cáo theo đầu mục công việc</div>
									</div>
									<DetailContent
										projectDetailId={state.project && state.project._id}
										projectDetail={state.project}
										currentProjectTasks={tasks && tasks.tasksByProject}
									/>

								</div> : <span>Chưa có dự án theo hợp đồng này</span>
							}
						</div>
						<div className={state.selectedTab === `#view-decision-${id}` ? "active tab-pane" : "tab-pane"} id={`#view-decision-${id}`}>
							<ViewDecisionForImplement
								id={`view-decision-${id}`}
								biddingContract={state}
							/>
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
	getTasksByProject: taskManagementActions.getAllTasksByProject,
	getListTag: TagActions.getListTag,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ViewBiddingContract));