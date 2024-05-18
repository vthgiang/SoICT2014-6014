import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { commandActions } from '../redux/actions'
import { manufacturingQualityCriteriaActions } from '../../manufacturing-quality/manufacturing-quality-criteria/redux/actions'
import { manufacturingQualityErrorActions } from '../../manufacturing-quality/manufacturing-quality-error/redux/actions'
import { manufacturingQualityInspectionActions } from '../../manufacturing-quality/manufacturing-quality-inspection/redux/actions'
import { DialogModal, SelectBox } from '../../../../../common-components'

const QualityControlForm = (props) => {
	const { 
		manufacturingCommand, 
		manufacturingQualityCriteria, 
		manufacturingQualityError,
		commandId, 
		code, 
		translate 
	} = props
	const [inspectionNum, setInspectionNum] = useState(0)
	const [passedNum, setPassedNum] = useState(0)
	const [errorNum, setErrorNum] = useState(0)
	const [criteria, setCriteria] = useState('1')
	const [segment, setSegment] = useState('1')
	const [finalResult, setFinalResult] = useState(1)
	const [errorList, setErrorList] = useState([])

	const handleAddError = () => {
		setErrorList([...errorList, ''])
	}

	const handleRemoveError = (index) => {
		setErrorList(prev => prev.filter((_, i) => i !== index))
	}

	const getCriteriaArray = () => {
		let criteriaArr = [{ value: '1', text: translate('manufacturing.command.choose_qc_criteria') }]
		manufacturingQualityCriteria.listCriterias?.map(criteria => {
			criteriaArr.push({ value: criteria._id, text: criteria.name })
		})
		return criteriaArr
	}

	const getSegmentArray = () => {
		let segmentArr = [{ value: '1', text: translate('manufacturing.command.choose_qc_segment') }]

		manufacturingCommand.currentCommand.workOrders?.map(wo => {
			const inspection = manufacturingCommand.currentCommand
				.inspections.find(ins => ins.workOrder == wo._id)
			
			if (!inspection) { // Chưa kiểm định
				segmentArr.push({ value: wo._id, text: wo.operation })
			}
		})
		
		segmentArr.push({ value: '0', text: "Thành phẩm" })
		return segmentArr
	}
	
	const getFinalResultArr = () => {
		let statusArr = []
		statusArr.push({ value: 1, text: translate('manufacturing.command.qc_status.2.content') })
		statusArr.push({ value: 2, text: translate('manufacturing.command.qc_status.3.content') })

		return statusArr
	}

	const getErrorArray = () => {
		let errorArr = []
		manufacturingQualityError.listErrors.map(error => {
			errorArr.push({ value: error._id, text: error.name })
		})
		return errorArr
	}

	const handleInspectionNumChange = (e) => {
		setInspectionNum(e.target.value)
	}

	const handlePassedNumChange = (e) => {
		setPassedNum(e.target.value)
	}

	const handleErrorNumChange = (e) => {
		setErrorNum(e.target.value)
	}

	const handleCriteriaChange = (value) => {
		setCriteria(value[0])
	}

	const handleSegmentChange = (value) => {
		setSegment(value[0])
	}

	const handleFinalResultChange = (value) => {
		setFinalResult(value[0])
	}

	const handleErrorListChange = (value, index) => {
		const newErrorList = [...errorList]
		newErrorList[index] = value[0]
		setErrorList(newErrorList)
	}

	const isFormValidated = () => {
		if (!inspectionNum || !passedNum || !errorNum || !criteria || !segment || !finalResult) {
			return false
		}
		return true
	}

	const save = () => {
		const userId = localStorage.getItem('userId')
		const data = {
			code,
			manufacturingCommand: commandId,
			workOrder: segment,
			type: segment == '0'? 2 : 1,
			responsible: userId,
			criteria,
			result: {
				inspectionNum,
				passedNum,
				errorNum,
				errorList,
				final: finalResult
			}
		}
		props.createManufacturingQualityInspection(data)
	}

	useEffect(() => {
		if (commandId) {
			props.getDetailManufacturingCommand(commandId)
			
			const data = {
				good: manufacturingCommand.currentCommand.good
			}
			
			props.getAllManufacturingQualityCriterias(data)
		}
	}, [commandId])

	useEffect(() => {
		props.getAllManufacturingQualityErrors()
	}, [])

	return (
		<>
			<DialogModal
				modalID='modal-quality-control'
				isLoading={manufacturingCommand.isLoading}
				formID='form-quality-control'
				title={translate('manufacturing.command.quality_control_command')}
				disableSubmit={!isFormValidated()}
				msg_success={translate('manufacturing.command.edit_successfully')}
				msg_failure={translate('manufacturing.command.edit_failed')}
				func={save}
				size={50}
				maxWidth={500}
			>
				<form id='form-quality-control'>
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className='form-group'>
								<label>
									{translate('manufacturing.command.code')}
									<span className='text-red'>*</span>
								</label>
								<input type='text' value={code} className='form-control' disabled={true}></input>
							</div>
						</div>
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className='form-group'>
								<label>
									{translate('manufacturing.command.qc_criteria')}
									<span className='text-red'>*</span>
								</label>
								<SelectBox
									id={`select-criteria`}
									className='form-control select2'
									items={getCriteriaArray()}
									value={criteria}
									onChange={handleCriteriaChange}
									style={{ width: '100%' }}
									multiple={false}
								/>
							</div>
						</div>
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className='form-group'>
								<label>
									{translate('manufacturing.command.qc_segment')}
									<span className='text-red'>*</span>
								</label>
								<SelectBox
									id={`select-segment`}
									className='form-control select2'
									items={getSegmentArray()}
									value={segment}
									onChange={handleSegmentChange}
									style={{ width: '100%' }}
									multiple={false}
								/>
							</div>
						</div>
						<div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<div className='form-group'>
								<label>
									{translate('manufacturing.command.inspection_num')}
									<span className='text-red'>*</span>
								</label>
								<input type='number' className='form-control' value={inspectionNum} onChange={handleInspectionNumChange}></input>
							</div>
						</div>
						<div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<div className='form-group'>
								<label>
									{translate('manufacturing.command.passed_num')}
									<span className='text-red'>*</span>
								</label>
								<input type='number' className='form-control' value={passedNum} onChange={handlePassedNumChange}></input>
							</div>
						</div>
						<div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<div className='form-group'>
								<label>
									{translate('manufacturing.command.error_num')}
									<span className='text-red'>*</span>
								</label>
								<input type='number' className='form-control' value={errorNum} onChange={handleErrorNumChange}></input>
							</div>
						</div>
						<div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
								<div className="form-group">
									<label>
										{translate('manufacturing.command.qc_result')}
										<span className='text-red'>*</span>
									</label>
									<SelectBox
										id={`select-final-result`}
										className='form-control select2'
										items={getFinalResultArr()}
										value={finalResult}
										onChange={handleFinalResultChange}
										style={{ width: '100%' }}
										multiple={false}
									/>
								</div>
						</div>
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className='form-group'>
								<label>
									{translate('manufacturing.command.error_list')}
								</label>
								<table className='table table-hover table-striped table-bordered'>
									<thead>
										<tr>
											<th>
												<label>{translate('manufacturing.command.error_name')}</label>
											</th>
											<th style={{ width: '4rem' }} className='text-center'>
												<a href='#add-manager' className='text-green' onClick={handleAddError}>
													<i className='material-icons'>add_box</i>
												</a>
											</th>
										</tr>
									</thead>
									<tbody>
										{errorList.map((_, index) => (
											<tr key={index}>
												<td>
												<SelectBox
													id={`select-error-${index}`}
													className='form-control select2'
													items={getErrorArray()}
													style={{ width: '100%' }}
													value={errorList[index]}
													onChange={(value) => handleErrorListChange(value, index)}
													multiple={false}
												/>
												</td>
												<td>
													<a
														href='#delete-error'
														className='text-red'
														style={{ border: 'none' }}
														onClick={() => handleRemoveError(index)}
													>
														<i className='fa fa-trash'></i>
													</a>
												</td>

											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</form>
			</DialogModal>
		</>
	)
}

function mapStateToProps(state) {
	const { manufacturingCommand, manufacturingQualityCriteria, manufacturingQualityError } = state
	return { manufacturingCommand, manufacturingQualityCriteria, manufacturingQualityError }
}

const mapDispatchToProps = {
	getDetailManufacturingCommand: commandActions.getDetailManufacturingCommand,
	handleEditCommand: commandActions.handleEditCommand,
	getAllManufacturingQualityCriterias: manufacturingQualityCriteriaActions.getAllManufacturingQualityCriterias,
	getAllManufacturingQualityErrors: manufacturingQualityErrorActions.getAllManufacturingQualityErrors,
	createManufacturingQualityInspection: manufacturingQualityInspectionActions.createManufacturingQualityInspection,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QualityControlForm))
