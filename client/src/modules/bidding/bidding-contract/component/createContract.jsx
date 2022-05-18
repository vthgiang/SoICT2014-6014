import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../common-components';
import { BiddingContractActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import { BiddingPackageManagerActions } from '../../bidding-package/biddingPackageManagement/redux/actions';
const CreateBiddingContract = (props) => {
	const fakeUnitCostList = [
		{ text: 'VND', value: 'VND' },
		{ text: 'USD', value: 'USD' },
	]
	const fakeUnitTimeList = [
		{ text: 'Ngày', value: 'days' },
		{ text: 'Giờ', value: 'hours' },
		{ text: 'Tháng', value: 'months' },
	]
	// const initState = {

	// 	contractNameError: undefined,
	// 	contractCodeError: undefined,

	// 	code: "",
	// 	name: "",
	// 	effectiveDate: "",
	// 	endDate: "",
	// 	unitTime: "days",
	// 	budget: 0,
	// 	unitCost: fakeUnitCostList[0].value,
	// 	partyA: {
	// 		company: "",
	// 		address: "",
	// 		phone: "",
	// 		taxCode: "",
	// 		representative: {
	// 			name: "",
	// 			role: "",
	// 		},
	// 		bank: {
	// 			name: "",
	// 			accountNumber: "",
	// 		},
	// 	},
	// 	partyB: {
	// 		company: "",
	// 		address: "",
	// 		phone: "",
	// 		taxCode: "",
	// 		representative: {
	// 			name: "",
	// 			role: "",
	// 		},
	// 		bank: {
	// 			name: "",
	// 			accountNumber: "",
	// 		},
	// 	},

	// 	biddingPackage: null,
	// 	project: null,

	// 	file: "",
	// 	fileName: "",
	// 	fileUrl: "",
	// 	fileUpload: "",
	// }
	const initState = {

		contractNameError: undefined,
		contractCodeError: undefined,

		code: "",
		name: "",
		effectiveDate: "",
		endDate: "",
		unitTime: fakeUnitTimeList[0].value,
		budget: 0,
		unitCost: fakeUnitCostList[0].value,

		companyA: "",
		addressA: "",
		phoneA: "",
		taxCodeA: "",
		representativeNameA: "",
		representativeRoleA: "",
		bankNameA: "",
		bankAccountNumberA: "",

		companyB: "",
		addressB: "",
		phoneB: "",
		taxCodeB: "",
		representativeNameB: "",
		representativeRoleB: "",
		bankNameB: "",
		bankAccountNumberB: "",


		biddingPackage: null,
		project: null,

		file: "",
		fileName: "",
		fileUrl: "",
		fileUpload: "",
	}
	const [state, setState] = useState(initState);

	/**
	 * Function lưu giá trị unit vào state khi thay đổi
	 * @param {*} value : Array id package
	 */
	const handleChangeBiddingPackage = (value) => {
		if (value.length === 0) {
			value = null
		};

		let a = props.biddingPackagesManager?.listBiddingPackages?.filter(x => x._id == value[0])

		setState({
			...state,
			biddingPackage: value[0],
		})
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
		const renderFirstItemArr = ['unitCost', 'unitTime'];
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


	/** Bắt sự kiện thay đổi file đính kèm */
	const handleChangeFile = (value) => {
		if (value.length !== 0) {
			setState(state => {
				return {
					...state,
					fileName: value[0].fileName,
					fileUrl: value[0].urlFile,
					fileUpload: value[0].fileUpload
				}
			})
		} else {
			setState(state => {
				return {
					...state,
					fileName: "",
					fileUrl: "",
					fileUpload: ""
				}
			})
		}
	}
	useEffect(() => {
		props.getAllBiddingPackage({ name: '', status: 3, page: 0, limit: 1000 });
	}, [])
	// useEffect(() => {
	// 		let a = props.biddingPackagesManager?.listBiddingPackages?.filter(x => x._id == state.package)
	// 		setState({
	// 				...state,
	// 				page: 0,
	// 				limit: 5,
	// 				keyPeople: []
	// 		})
	// }, [state.package])


	const save = () => {
		const data = {}
		// props.createBiddingContract(data);
		console.log(1718, state)
	}

	const isFormValidated = () => {
		let { translate } = props;
		if (!ValidationHelper.validateName(translate, state.code, 3, 255).status) return false;
		if (!ValidationHelper.validateName(translate, state.name, 6, 255).status) return false;
		if (state.effectiveDate.length === 0) return false;
		if (state.endDate.length === 0) return false;
		if (state.effectiveDate > state.endDate) return false;
		return true;
	}

	const { translate, biddingContract, biddingPackagesManager } = props;
	let files;
	if (state.file) {
		files = [{ fileName: state.fileName, fileUrl: state.fileUrl, fileUpload: state.fileUpload }]
	}
	const listBiddingPackages = biddingPackagesManager?.listBiddingPackages;


	return (
		<React.Fragment>
			<DialogModal
				modalID="modal-create-package-biddingContract"
				formID="form-create-biddingContract"
				title="Thêm hợp đồng"
				// disableSubmit={!isFormValidated()}
				func={save}
				size={75}
			>
				<form id="form-create-career-position">
					<div>
						<div className="row">
							<div className={`form-group col-md-6 col-xs-6 ${!state.contractNameError ? "" : "has-error"}`}>
								<label>Tên hợp đồng<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.name} onChange={(e) => handleChangeForm(e, 'contractName')}></input>
								<ErrorLabel content={state.contractNameError} />
							</div>

							<div className={`form-group col-md-6 col-xs-6 ${!state.contractCodeError ? "" : "has-error"}`}>
								<label>Mã hợp đồng<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.code} onChange={(e) => handleChangeForm(e, 'contractCode')}></input>
								<ErrorLabel content={state.contractCodeError} />
							</div>
						</div>

						<div className="row">
							<div className={`form-group col-md-6 col-xs-6`}>
								<label>Giá trị hợp đồng<span className="text-red">*</span></label>
								<input type="text" className="form-control" value={state.budget} onChange={(e) => handleChangeForm(e, 'budget')}></input>
							</div>

							<div className={`form-group col-md-6 col-xs-6`}>
								<label>Đơn vị chi phí<span className="text-red">*</span></label>
								<SelectBox
									id={`select-unit-code-biddingContract-`}
									className="form-control select2"
									style={{ width: "100%" }}
									items={fakeUnitCostList}
									onChange={(e) => handleChangeForm(e, 'unitCode')}
									value={state.unitCost}
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
									onChange={(e) => handleChangeForm(e, 'unitTime')}
									value={state.unitTime}
									multiple={false}
								/>
							</div>
							<div className="form-group col-md-6">
								<label >Chọn gói thầu</label>
								<SelectBox
									id={`package`}
									className="form-control select2"
									style={{ width: "100%" }}
									items={listBiddingPackages?.map(x => {
										return { text: x.name, value: x._id }
									})}
									options={{ placeholder: "Chọn gói thầu" }}
									onChange={handleChangeBiddingPackage}
									value={state.package}
									multiple={false}
								/>
							</div>
						</div>

						<div className="row">
							<div className="col-md-6">
								<label>File hợp đồng đính kèm</label>
								<UploadFile files={files} onChange={handleChangeFile} />
							</div>
						</div>

					</div>
					<div className='row'>
						<div className="col-md-6">
							<fieldset className="scheduler-border">
								<legend className="scheduler-border">Bên A</legend>
								<div className="row">
									<div className={`form-group col-md-6 col-xs-6`}>
										<label>Công ty<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.companyA} onChange={(e) => handleChangeForm(e, 'companyA')}></input>
									</div>

									<div className={`form-group col-md-6 col-xs-6 `}>
										<label>Địa chỉ<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.addressA} onChange={(e) => handleChangeForm(e, 'addressA')}></input>
									</div>
								</div>
								<div className="row">
									<div className={`form-group col-md-6 col-xs-6`}>
										<label>Số điện thoại<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.phoneA} onChange={(e) => handleChangeForm(e, 'phoneA')}></input>
									</div>

									<div className={`form-group col-md-6 col-xs-6 `}>
										<label>Mã số thuế<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.taxCodeA} onChange={(e) => handleChangeForm(e, 'taxCodeA')}></input>
									</div>
								</div>
								<div className="row">
									<div className={`form-group col-md-6 col-xs-6`}>
										<label>Số tài khoản<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.bankAccountNumberA} onChange={(e) => handleChangeForm(e, 'bankAccountNumberA')}></input>
									</div>

									<div className={`form-group col-md-6 col-xs-6 `}>
										<label>Ngân hàng<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.bankNameA} onChange={(e) => handleChangeForm(e, 'bankNameA')}></input>
									</div>
								</div>
								<div className="row">
									<div className={`form-group col-md-6 col-xs-6`}>
										<label>Người đại diện<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.representativeNameA} onChange={(e) => handleChangeForm(e, 'representativeNameA')}></input>
									</div>

									<div className={`form-group col-md-6 col-xs-6 `}>
										<label>Chức vụ<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.representativeRoleA} onChange={(e) => handleChangeForm(e, 'representativeRoleA')}></input>
									</div>
								</div>
							</fieldset>
						</div>
						<div className="col-md-6">
							<fieldset className="scheduler-border">
								<legend className="scheduler-border">Bên B</legend>
								<div className="row">
									<div className={`form-group col-md-6 col-xs-6`}>
										<label>Công ty<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.companyB} onChange={(e) => handleChangeForm(e, 'companyB')}></input>
									</div>

									<div className={`form-group col-md-6 col-xs-6 `}>
										<label>Địa chỉ<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.addressB} onChange={(e) => handleChangeForm(e, 'addressB')}></input>
									</div>
								</div>
								<div className="row">
									<div className={`form-group col-md-6 col-xs-6`}>
										<label>Số điện thoại<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.phoneB} onChange={(e) => handleChangeForm(e, 'phoneB')}></input>
									</div>

									<div className={`form-group col-md-6 col-xs-6 `}>
										<label>Mã số thuế<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.taxCodeB} onChange={(e) => handleChangeForm(e, 'taxCodeB')}></input>
									</div>
								</div>
								<div className="row">
									<div className={`form-group col-md-6 col-xs-6`}>
										<label>Số tài khoản<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.bankAccountNumberB} onChange={(e) => handleChangeForm(e, 'bankAccountNumberB')}></input>
									</div>

									<div className={`form-group col-md-6 col-xs-6 `}>
										<label>Ngân hàng<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.bankNameB} onChange={(e) => handleChangeForm(e, 'bankNameB')}></input>
									</div>
								</div>
								<div className="row">
									<div className={`form-group col-md-6 col-xs-6`}>
										<label>Người đại diện<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.representativeNameB} onChange={(e) => handleChangeForm(e, 'representativeNameB')}></input>
									</div>

									<div className={`form-group col-md-6 col-xs-6 `}>
										<label>Chức vụ<span className="text-red">*</span></label>
										<input type="text" className="form-control" value={state.representativeRoleB} onChange={(e) => handleChangeForm(e, 'representativeRoleB')}></input>
									</div>
								</div>
							</fieldset>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateBiddingContract));