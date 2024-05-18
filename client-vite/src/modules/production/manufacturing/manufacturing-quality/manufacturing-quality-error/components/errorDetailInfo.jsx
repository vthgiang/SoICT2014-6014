import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DialogModal } from '../../../../../../common-components'
import { manufacturingQualityErrorActions } from '../redux/actions'

function ErrorDetailInfo(props) {
	const { translate, errorDetailId, manufacturingQualityError } = props
	const { currentError } = manufacturingQualityError

	useEffect(() => {
		const getData = async () => {
			await props.getDetailManufacturingQualityError(errorDetailId)
		}
		if (errorDetailId) {
			getData()
		}
	}, [errorDetailId])

	return (
		<>
			<DialogModal
				modalID={`modal-detail-info-error`}
				isLoading={false}
				title={translate('manufacturing.quality.error.detail')}
				formID={`form-detail-error`}
				size={75}
				maxWidth={600}
				hasSaveButton={false}
				hasNote={false}
			>

				<form id={`form-detail-error`}>
					<div className='row'>
						<div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
							<div className='form-group'>
								<strong>{translate('manufacturing.quality.error.code')}:&emsp;</strong>
								{currentError?.code}
							</div>
							<div className='form-group'>
								<strong>{translate('manufacturing.quality.error.name')}:&emsp;</strong>
								{currentError?.name}
							</div>
							<div className='form-group'>
								<strong>{translate('manufacturing.quality.error.aql')}:&emsp;</strong>
								{currentError?.aql}
							</div>
							<div className='form-group'>
								<strong>{translate('manufacturing.quality.error.cause')}:&emsp;</strong>
								{currentError?.cause}
							</div>
						</div>

						<div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
							<div className='form-group'>
								<strong>{translate('manufacturing.quality.error.group')}:&emsp;</strong>
								{currentError?.group}
							</div>
							<div className='form-group'>
								<strong>{translate('manufacturing.quality.error.reporter')}:&emsp;</strong>
								{currentError?.reporter.name}
							</div>
							<div className='form-group'>
								<strong>{translate('manufacturing.quality.created_at')}:&emsp;</strong>
								{currentError?.createdAt}
							</div>
							<div className='form-group'>
								<strong>{translate('manufacturing.quality.error.description')}:&emsp;</strong>
								{currentError?.description}
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
							<strong>{translate('manufacturing.quality.error.recognize')}:&emsp;</strong>
							<ul>
								{currentError?.recognize.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						</div>
					</div>
					<div className='row'>
						<div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
							<strong>{translate('manufacturing.quality.error.resolution')}:&emsp;</strong>
							<ul>
								{currentError?.resolution.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						</div>
					</div>
				</form>
			</DialogModal>
		</>
	)
}

function mapStateToProps(state) {
	const { manufacturingQualityError } = state
	return { manufacturingQualityError }
}

const mapDispatchToProps = {
	getDetailManufacturingQualityError: manufacturingQualityErrorActions.getDetailManufacturingQualityError,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ErrorDetailInfo))
