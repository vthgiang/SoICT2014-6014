import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../common-components';
import { BiddingContractActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import { BiddingPackageManagerActions } from '../../bidding-package/biddingPackageManagement/redux/actions';
import { getStorage } from '../../../../config';
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter';
import { ConfigurationActions } from '../../../super-admin/module-configuration/redux/actions';
import { DecisionForImplement } from './decisionAssignImplementContract';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getListDepartments } from '../../../project/projects/components/functionHelper';
import { convertEmployeeToUserInUnit, getDecisionDataWhenUpdateBidPackage, getDepartmentIdByUserId } from './functionHelper';
import moment from 'moment';

const CreateBiddingContract = (props) => {
	const { translate, biddingContract, biddingPackagesManager, modelConfiguration, user } = props;
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
	/**
	 * Function format dữ liệu Date thành string
	 * @param {*} date : Ngày muốn format
	 * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
	 */
	const formatDate = (date, monthYear = false) => {
		if (date) {
			let d = new Date(date),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2)
				month = '0' + month;
			if (day.length < 2)
				day = '0' + day;

			if (monthYear === true) {
				return [month, year].join('-');
			} else return [day, month, year].join('-');
		} else {
			return date
		}
	}

	const initState = {

		contractNameError: undefined,
		contractCodeError: undefined,

		code: "",
		name: "",
		effectiveDate: formatDate(Date.now()),
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

		// decideToImplement: null

		// files: [],

		selectedTab: 'general'
	}
	const [state, setState] = useState(initState);
	const [id, setId] = useState(props.id);
	const listActiveBiddingPackage = biddingPackagesManager?.listActiveBiddingPackage;

	useEffect(() => {
		props.getAllBiddingPackage({ callId: "contract", name: '', status: 3, page: undefined, limit: undefined });
		props.getConfiguration();
	}, [])

	useEffect(() => {
		setId(props.id)

		let bp = props.biddingPackagesManager?.listActiveBiddingPackage?.find(x => x._id == props.id);
		if (bp) {
			const updatedDecision = getDecisionDataWhenUpdateBidPackage(bp, allUsers, listUserDepartment)
			const effecttiveDate = state.effectiveDate;
			setState({
				...state,
				name: "Hợp đồng " + bp.name,
				code: `HD-${bp.code}`,
				endDate: moment(effecttiveDate, "DD-MM-YYYY").add(bp.proposals.executionTime, bp.proposals.unitOfTime).format('DD-MM-YYYY'),
				budget: bp.price,
				addressA: bp.receiveLocal,
				// representativeNameA: bp.customer,
				companyA: bp.customer,
				biddingPackage: props.id,
				decideToImplement: updatedDecision
			})
		}
	}, [props.id]);

	useEffect(() => {
		if (modelConfiguration.biddingConfig != '') {
			const data = modelConfiguration.biddingConfig
			setState({
				...state,
				companyB: data.company,
				addressB: data.address,
				phoneB: data.phone,
				emailB: data.email,
				taxCodeB: data.taxCode,
				representativeNameB: data.representative.name,
				representativeRoleB: data.representative.role,
				bankNameB: data.bank.name,
				bankAccountNumberB: data.bank.accountNumber,
			})
		}
	}, [modelConfiguration.biddingConfig])

	/**
	 * Function lưu giá trị unit vào state khi thay đổi
	 * @param {*} value : Array id package
	 */
	const handleChangeBiddingPackage = (value) => {
		if (value.length === 0) {
			value = null
		};

		let bp = props.biddingPackagesManager?.listActiveBiddingPackage?.find(x => x._id == value[0])
		if (bp) {
			const updatedDecision = getDecisionDataWhenUpdateBidPackage(bp, allUsers, listUserDepartment)
			console.log(113, updatedDecision);
			const effecttiveDate = state.effectiveDate;
			setState({
				...state,
				name: "Hợp đồng " + bp.name,
				code: `HD-${bp.code}`,
				endDate: moment(effecttiveDate, "DD-MM-YYYY").add(bp.proposals.executionTime, bp.proposals.unitOfTime).format('DD-MM-YYYY'),
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

	/** Bắt sự kiện thay đổi multi file đính kèm */
	const handleChangeFile = (file) => {
		console.log(227, file);
		const contractFiles = file.map(x => ({
			url: x.urlFile,
			fileName: x.fileName,
			fileUpload: x.fileUpload
		}))

		setState(state => {
			return {
				...state,
				files: contractFiles,
			}
		});
	}

	const save = () => {
		let formData;
		let splitter = state.effectiveDate.split("-");
		let effectiveDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);
		splitter = state.endDate.split("-");
		let endDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);

		let data = {
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
		}

		formData = convertJsonObjectToFormData(data);
		if (state.files) {
			state.files.forEach(obj => {
				formData.append('files', obj.fileUpload)
			})
		}

		console.log(1718, state, formData)
		props.createBiddingContract(formData);
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
			// className={state.selectedTab === "general" ? "active tab-pane" : "tab-pane"} 
			<div id="general" className="active tab-pane">
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
							id={`select-unit-code-biddingContract-`}
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
							id={`create-biddingContract-start-date--`}
							value={state.effectiveDate}
							onChange={(e) => handleChangeForm(e, 'effectiveDate')}
							dateFormat="day-month-year"
							disabled={false}
						/>
					</div>
					<div className="form-group col-md-6">
						<label>Ngày hết hạn<span className="text-red">*</span></label>
						<DatePicker
							id={`create-biddingContract-end-date--`}
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
							id={`select-biddingContract-unitTime`}
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
							id={`package`}
							className="form-control select2"
							style={{ width: "100%" }}
							items={listActiveBiddingPackage?.map(x => {
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
					<div className="form-group col-md-6">
						<label>File hợp đồng đính kèm</label>
						<UploadFile multiple={true} files={state.files} onChange={handleChangeFile} />
					</div>
				</div>

			</div>
		)
	}

	const partyForm = () => {
		return (
			// className={state.selectedTab === "party" ? "active tab-pane" : "tab-pane"} 
			<div id="party" className="tab-pane">
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
		<React.Fragment>
			<DialogModal
				modalID={`modal-create-package-biddingContract-${id}`}
				formID="form-create-biddingContract"
				title="Thêm hợp đồng"
				disableSubmit={!isFormValidated()}
				func={save}
				size={75}
			>
				<form id="form-create-biddingContract">
					<div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
						{/* Tabbed pane */}
						<ul className="nav nav-tabs">
							{/* Nút tab thông tin cơ bản */}
							<li className="active"><a title='Thông tin chung' data-toggle="tab" href="#general">Thông tin chung</a></li>
							{/* Nút tab các bên tgia */}
							<li><a title='Các bên tham gia' data-toggle="tab" href="#party" >Các bên tham gia</a></li>
							{/* Nút tab quyết định giao triển khai hợp đồng */}
							<li><a title='Quyết định giao triển khai hợp đồng' data-toggle="tab" href={`#decision-${id}`}>Quyết định giao triển khai hợp đồng</a></li>
						</ul>
						<div className="tab-content">
							{generalInfo()}
							{partyForm()}
							<DecisionForImplement
								type={"create"}
								id={`decision-${id}`}
								biddingContract={state}
								handleChange={handleChange}
							/>
						</div>
					</div>
				</form>
			</DialogModal>
		</React.Fragment>
	);

}

const mapStateToProps = state => state;

const mapDispatchToProps = {
	createBiddingContract: BiddingContractActions.createBiddingContract,
	getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
	getConfiguration: ConfigurationActions.getConfiguration,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateBiddingContract));