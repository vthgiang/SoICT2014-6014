import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../common-components';
import { BiddingContractActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import { BiddingPackageManagerActions } from '../../bidding-package/biddingPackageManagement/redux/actions';
import { getStorage } from '../../../../config';
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter';
import { DecisionForImplement } from './decisionAssignImplementContract';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getListDepartments } from '../../../project/projects/components/functionHelper';
import { getDecisionDataWhenUpdateBidPackage } from './functionHelper';
const EditBiddingContract = (props) => {
	const { translate, biddingContract, biddingPackagesManager, user } = props;
	const allUsers = user && user.list
	const listUserDepartment = user && user.usersInUnitsOfCompany
	const fakeUnitCostList = [
		{ text: 'VND', value: 'VND' },
		{ text: 'USD', value: 'USD' },
	]

	const fakeUnitTimeList = [
		{ text: 'Ngày', value: 'days' },
		{ text: 'Giờ', value: 'hours' },
		{ text: 'Tháng', value: 'months' },
	]

	const initState = {
		contractNameError: undefined,
		contractCodeError: undefined,

		id: "",

		code: "",
		name: "",
		effectiveDate: "",
		endDate: "",
		unitOfTime: fakeUnitTimeList[0].value,
		budget: 0,
		currenceUnit: fakeUnitCostList[0].value,

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
	const listBiddingPackages = biddingPackagesManager?.listBiddingPackages;

	useEffect(() => {
		props.getAllBiddingPackage({ name: '', status: 3, page: undefined, limit: undefined });

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
				unitOfTime: fakeUnitTimeList.find(x => x.value === data.unitOfTime).value,
				budget: data.budget,
				currenceUnit: fakeUnitCostList.find(x => x.value === data.currenceUnit).value,

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

				biddingPackage: data.biddingPackage?._id,
				project: data.project,

				decideToImplement: data.decideToImplement,

				files: data.files,
			})
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

	/**
	 * Function lưu giá trị unit vào state khi thay đổi
	 * @param {*} value : Array id package
	 */
	const handleChangeBiddingPackage = (value) => {
		if (value.length === 0) {
			value = null
		};

		let bp = props.biddingPackagesManager?.listBiddingPackages?.find(x => x._id == value[0])
		if (bp) {
			const updatedDecision = getDecisionDataWhenUpdateBidPackage(bp, allUsers, listUserDepartment)

			setState({
				...state,
				name: "Hợp đồng " + bp.name,
				budget: bp.price,
				addressA: bp.receiveLocal,
				// representativeNameA: bp.customer,
				companyA: bp.customer,
				biddingPackage: value[0],
				decideToImplement: updatedDecision
			})
		} else {
			setState({
				...state,
				biddingPackage: value[0],
			})
		}
	}

	const handleChangeForm = (event, currentKey) => {
		if (currentKey === 'contractName') {
			let { translate } = props;
			let { message } = ValidationHelper.validateName(translate, event.target.value, 6, 255);
			setState({
				...state,
				name: event.target.value,
				contractNameError: message,
			})
			return;
		}
		if (currentKey === 'contractCode') {
			let { translate } = props;
			let { message } = ValidationHelper.validateName(translate, event.target.value, 3, 255);
			setState({
				...state,
				code: event.target.value,
				contractCodeError: message,
			})
			return;
		}
		const justRenderEventArr = ['effectiveDate', 'endDate'];
		if (justRenderEventArr.includes(currentKey)) {
			setState({
				...state,
				[currentKey]: event,
			})
			return;
		}
		const renderFirstItemArr = ['currenceUnit', 'unitOfTime'];
		if (renderFirstItemArr.includes(currentKey)) {
			setState({
				...state,
				[currentKey]: event[0],
			})
			return;
		}

		setState({
			...state,
			[currentKey]: event?.target?.value,
		})
	}

	/**
	 * Function lưu các trường thông tin vào state
	 * @param {*} name : Tên trường
	 * @param {*} value : Giá trị của trường
	 */
	const handleChange = (name, value) => {
		setState({
			...state,
			[name]: value,
		});
	}

	/** Bắt sự kiện thay đổi multi file đính kèm */
	const handleChangeFile = (file) => {
		let newFiles = [], oldFiles = [], contractFiles;
		if (file) {
			file.forEach(obj => {
				if (obj.urlFile) {
					newFiles = [...newFiles, obj]
				} else {
					oldFiles = [...oldFiles, obj]
				}
			})
		}

		if (newFiles && newFiles.length > 0) {
			contractFiles = newFiles.map(x => ({
				url: x.urlFile,
				fileName: x.fileName,
				fileUpload: x.fileUpload
			}))
		}

		setState(state => {
			return {
				...state,
				contractFiles,
				oldFiles,
				files: oldFiles
			}
		});

		console.log(249, state.files, state.contractFiles);
	}

	const save = () => {
		let formData;
		let splitter = state.effectiveDate.split("-");
		let effectiveDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);
		splitter = state.endDate.split("-");
		let endDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);

		let data = {
			id: state.id,

			name: state.name,
			code: state.code,
			effectiveDate: effectiveDate,
			endDate: endDate,
			unitOfTime: state.unitOfTime,
			budget: state.budget,
			currenceUnit: state.currenceUnit,
			creator: getStorage("userId"),
			biddingPackage: state.biddingPackage,
			partyA: {
				company: state.companyA,
				address: state.addressA,
				email: state.emailA,
				phone: state.phoneA,
				taxCode: state.taxCodeA,
				representative: {
					name: state.representativeNameA,
					role: state.representativeRoleA,
				},
				bank: {
					name: state.bankNameA,
					accountNumber: state.bankAccountNumberA,
				},
			},
			partyB: {
				company: state.companyB,
				address: state.addressB,
				email: state.emailB,
				phone: state.phoneB,
				taxCode: state.taxCodeB,
				representative: {
					name: state.representativeNameB,
					role: state.representativeRoleB,
				},
				bank: {
					name: state.bankNameB,
					accountNumber: state.bankAccountNumberB,
				},
			},
			decideToImplement: state.decideToImplement,

			files: state.files,
		}

		formData = convertJsonObjectToFormData(data);
		if (state.contractFiles) {
			state.contractFiles.forEach(obj => {
				formData.append('files', obj.fileUpload)
			})
		}

		console.log(1718, data, state, formData)
		props.editBiddingContract(formData, id);
	}

	const isFormValidated = () => {
		let { translate } = props;
		if (!ValidationHelper.validateName(translate, state.code, 3, 255).status) return false;
		if (!ValidationHelper.validateName(translate, state.name, 6, 255).status) return false;
		if (state.effectiveDate.length === 0) return false;
		if (state.endDate.length === 0) return false;

		let splitter = state.effectiveDate.split("-");
		let effectiveDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);
		splitter = state.endDate.split("-");
		let endDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);

		if (effectiveDate > endDate) return false;

		return true;
	}

	// Các hàm xử lý tabbedPane
	const handleChangeContent = async (content) => {
		await setState(state => {
			return {
				...state,
				selectedTab: content
			}
		})
	}

	const generalInfo = () => {
		return (
			// <div className={state.selectedTab === "general" ? "active tab-pane" : "tab-pane"} id="general">
			<div className={"active tab-pane"} id={`edit-general-${id}`}>
				<div className='row'>
					<div className={`form-group col-md-6 ${!state.contractNameError ? "" : "has-error"}`}>
						<label>Tên hợp đồng<span className="text-red">*</span></label>
						<input type="text" className="form-control" value={state.name} onChange={(e) => handleChangeForm(e, 'contractName')}></input>
						<ErrorLabel content={state.contractNameError} />
					</div>

					<div className={`form-group col-md-6 ${!state.contractCodeError ? "" : "has-error"}`}>
						<label>Mã hợp đồng<span className="text-red">*</span></label>
						<input type="text" className="form-control" value={state.code} onChange={(e) => handleChangeForm(e, 'contractCode')}></input>
						<ErrorLabel content={state.contractCodeError} />
					</div>
				</div>

				<div className="row">
					<div className={`form-group col-md-6`}>
						<label>Giá trị hợp đồng<span className="text-red">*</span></label>
						<input type="number" className="form-control" value={state.budget} onChange={(e) => handleChangeForm(e, 'budget')}></input>
					</div>

					<div className={`form-group col-md-6`}>
						<label>Đơn vị chi phí<span className="text-red">*</span></label>
						<SelectBox
							id={`select-unit-code-biddingContract-${id}`}
							className="form-control select2"
							style={{ width: "100%" }}
							items={fakeUnitCostList}
							onChange={(e) => handleChangeForm(e, 'currenceUnit')}
							value={state.currenceUnit}
							multiple={false}
						/>
					</div>
				</div>

				<div className="row">
					<div className="form-group col-md-6">
						<label>Ngày có hiệu lực<span className="text-red">*</span></label>
						<DatePicker
							id={`create-biddingContract-start-date--${id}`}
							value={state.effectiveDate}
							onChange={(e) => handleChangeForm(e, 'effectiveDate')}
							dateFormat="day-month-year"
							disabled={false}
						/>
					</div>
					<div className="form-group col-md-6">
						<label>Ngày hết hạn<span className="text-red">*</span></label>
						<DatePicker
							id={`create-biddingContract-end-date--${id}`}
							value={state.endDate}
							onChange={(e) => handleChangeForm(e, 'endDate')}
							dateFormat="day-month-year"
							disabled={false}
						/>
					</div>
				</div>

				<div className="row">
					<div className="form-group col-md-6">
						<label>Đơn vị thời gian<span className="text-red">*</span></label>
						<SelectBox
							id={`select-biddingContract-unitTime--${id}`}
							className="form-control select2"
							style={{ width: "100%" }}
							items={fakeUnitTimeList}
							onChange={(e) => handleChangeForm(e, 'unitOfTime')}
							value={state.unitOfTime}
							multiple={false}
						/>
					</div>
					<div className="form-group col-md-6">
						<label >Chọn gói thầu<span className="text-red">*</span></label>
						<SelectBox
							id={`bidding-contract-select-package--${id}`}
							className="form-control select2"
							style={{ width: "100%" }}
							items={listBiddingPackages?.map(x => {
								return { text: x.name, value: x._id }
							})}
							options={{ placeholder: "Chọn gói thầu" }}
							onChange={handleChangeBiddingPackage}
							value={state.biddingPackage}
							multiple={false}
						/>
					</div>
				</div>

				<div className="row">
					{/* <div className="col-md-6">
								<label>File hợp đồng đính kèm</label>
								<UploadFile files={files} onChange={handleChangeFile} />
							</div> */}
					<div className="form-group col-md-6" id={`file-bidding-contract-${id}`}>
						<label>File hợp đồng đính kèm</label>
						<UploadFile id={`file-bidding-contract-${id}`} multiple={true} files={state.files} onChange={handleChangeFile} />
					</div>
				</div>

			</div>
		)
	}

	const partyForm = () => {
		return (
			// <div className={state.selectedTab === "party" ? "active tab-pane" : "tab-pane"} id="party" >
			<div className={"tab-pane"} id={`edit-party-${id}`} >
				<div className="col-md-6">
					<fieldset className="scheduler-border">
						<legend className="scheduler-border">Bên A</legend>
						<div className="row">
							<div className={`form-group col-md-6`}>
								<label>Công ty<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.companyA} onChange={(e) => handleChangeForm(e, 'companyA')}></input>
							</div>

							<div className={`form-group col-md-6 `}>
								<label>Địa chỉ<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.addressA} onChange={(e) => handleChangeForm(e, 'addressA')}></input>
							</div>
						</div>
						<div className="row">
							<div className={`form-group col-md-6 `}>
								<label>Email<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.emailA} onChange={(e) => handleChangeForm(e, 'emailA')}></input>
							</div>

							<div className={`form-group col-md-6`}>
								<label>Số điện thoại<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.phoneA} onChange={(e) => handleChangeForm(e, 'phoneA')}></input>
							</div>
						</div>
						<div className="row">
							<div className={`form-group col-md-6`}>
								<label>Người đại diện<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.representativeNameA} onChange={(e) => handleChangeForm(e, 'representativeNameA')}></input>
							</div>

							<div className={`form-group col-md-6 `}>
								<label>Chức vụ<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.representativeRoleA} onChange={(e) => handleChangeForm(e, 'representativeRoleA')}></input>
							</div>
						</div>
						<div className="row">
							<div className={`form-group col-md-6`}>
								<label>Số tài khoản<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.bankAccountNumberA} onChange={(e) => handleChangeForm(e, 'bankAccountNumberA')}></input>
							</div>

							<div className={`form-group col-md-6 `}>
								<label>Ngân hàng<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.bankNameA} onChange={(e) => handleChangeForm(e, 'bankNameA')}></input>
							</div>
						</div>
						<div className="row">
							<div className={`form-group col-md-6 `}>
								<label>Mã số thuế<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.taxCodeA} onChange={(e) => handleChangeForm(e, 'taxCodeA')}></input>
							</div>
						</div>
					</fieldset>
				</div>
				<div className="col-md-6">
					<fieldset className="scheduler-border">
						<legend className="scheduler-border">Bên B</legend>
						<div className="row">
							<div className={`form-group col-md-6`}>
								<label>Công ty<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.companyB} onChange={(e) => handleChangeForm(e, 'companyB')}></input>
							</div>

							<div className={`form-group col-md-6 `}>
								<label>Địa chỉ<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.addressB} onChange={(e) => handleChangeForm(e, 'addressB')}></input>
							</div>
						</div>
						<div className="row">
							<div className={`form-group col-md-6 `}>
								<label>Email<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.emailB} onChange={(e) => handleChangeForm(e, 'emailB')}></input>
							</div>
							<div className={`form-group col-md-6`}>
								<label>Số điện thoại<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.phoneB} onChange={(e) => handleChangeForm(e, 'phoneB')}></input>
							</div>
						</div>
						<div className="row">
							<div className={`form-group col-md-6`}>
								<label>Người đại diện<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.representativeNameB} onChange={(e) => handleChangeForm(e, 'representativeNameB')}></input>
							</div>

							<div className={`form-group col-md-6 `}>
								<label>Chức vụ<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.representativeRoleB} onChange={(e) => handleChangeForm(e, 'representativeRoleB')}></input>
							</div>
						</div>
						<div className="row">
							<div className={`form-group col-md-6`}>
								<label>Số tài khoản<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.bankAccountNumberB} onChange={(e) => handleChangeForm(e, 'bankAccountNumberB')}></input>
							</div>

							<div className={`form-group col-md-6 `}>
								<label>Ngân hàng<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.bankNameB} onChange={(e) => handleChangeForm(e, 'bankNameB')}></input>
							</div>
						</div>
						<div className="row">
							<div className={`form-group col-md-6 `}>
								<label>Mã số thuế<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.taxCodeB} onChange={(e) => handleChangeForm(e, 'taxCodeB')}></input>
							</div>
						</div>
					</fieldset>
				</div>
			</div>
		)
	}

	return (
		<DialogModal
			modalID={`modal-edit-bidding-contract--${id}`}
			formID={`form-edit-bidding-contract-${id}`}
			title="Chỉnh sửa hợp đồng"
			disableSubmit={!isFormValidated()}
			func={save}
			size={75}
		>
			<form id={`form-edit-bidding-contract-${id}`}>
				<div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
					{/* Tabbed pane */}
					<ul className="nav nav-tabs">
						{/* Nút tab thông tin cơ bản */}
						<li className="active"><a title='Thông tin chung' data-toggle="tab" href={`#edit-general-${id}`}>Thông tin chung</a></li>
						{/* Nút tab các bên tgia */}
						<li><a title='Các bên tham gia' data-toggle="tab" href={`#edit-party-${id}`} >Các bên tham gia</a></li>
						{/* Nút tab quyết định giao triển khai hợp đồng */}
						<li><a title='Quyết định giao triển khai hợp đồng' data-toggle="tab" href={`#edit-decision-${id}`}>Quyết định giao triển khai hợp đồng</a></li>
					</ul>
					<div className="tab-content">
						{generalInfo()}
						{partyForm()}
						<DecisionForImplement
							type={"edit"}
							id={`edit-decision-${id}`}
							biddingContract={state}
							handleChange={handleChange}
						/>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditBiddingContract));