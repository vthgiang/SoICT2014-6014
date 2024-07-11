import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, SelectBox } from '../../../../../../common-components'
import { generateCode } from '../../../../../../helpers/generateCode'
import { manufacturingMetricActions } from '../../redux/actions'
import RiskFormula from './riskFormula'

const KpiCreateForm = (props) => {
  const { translate, manufacturingMetric } = props
  const [kpi, setKpi] = useState({
    code: generateCode('KPI'),
    name: '',
    target: '',
    category: '',
    unit: ''
  })
  const [formula, setFormula] = useState([])
  const [thresholds, setThresholds] = useState([])

  const handleFormulaChange = (formula) => {
    setFormula(formula)
  }

  const handleAddThreshold = () => {
    setThresholds([
      ...thresholds,
      {
        level: 1,
        lowValue: '',
        highValue: ''
      }
    ])
  }

  const handleRemoveThreshold = (index) => {
    const newThresholds = thresholds.filter((_, i) => i !== index)
    setThresholds(newThresholds)
  }

  const handleThresholdLevelChange = (value, index) => {
    const newThresholds = thresholds
    newThresholds[index].level = value[0]
    setThresholds(newThresholds)
  }

  const handleThresholdInputChange = (e, index) => {
    const value = e.target.value
    const name = e.target.name
    const newThresholds = [...thresholds]
    newThresholds[index][name] = value
    setThresholds(newThresholds)
  }

  const handleKpiInputChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setKpi({
      ...kpi,
      [name]: value
    })
  }

  const handleKpiCategoryChange = (value) => {
    setKpi({
      ...kpi,
      category: value[0]
    })
  }

  const isFormValidated = () => {
    if (kpi.name === '' || kpi.category === '' || kpi.target === '' || kpi.unit === '' || formula.length === 0) {
      return false
    }
    return true
  }

  const save = () => {
    const newKpi = {
      code: kpi.code,
      name: kpi.name,
      category: kpi.category,
      target: kpi.target,
      unit: kpi.unit,
      formula: formula.map((e) => e.code).join(' '),
      thresholds: thresholds
    }

    props.createManufacturingKpi(newKpi)
  }

  return (
    <DialogModal
      size='50'
      modalID='modal-add-kpi'
      formID='form-add-kpi'
      title={translate('manufacturing.performance.create_kpi_title')}
      msg_success={translate('manufacturing.performance.create_successfully')}
      msg_failure={translate('manufacturing.performance.create_failed')}
      func={save}
      disableSubmit={!isFormValidated()}
    >
      <form id='form-add-kpi'>
        <div className='row'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('manufacturing.performance.kpi_name')}</label>
              <span className='text-red'>*</span>
              <input type='text' name='name' className='form-control' autoComplete='off' value={kpi.name} onChange={handleKpiInputChange} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('manufacturing.performance.kpi_category')}</label>
              <span className='text-red'>*</span>
              <SelectBox
                id={`select-kpi-category`}
                className='form-control select2'
                style={{ width: '100%' }}
                onChange={(value) => handleKpiCategoryChange(value)}
                items={[
                  { value: '1', text: translate('manufacturing.performance.choose_category') },
                  { value: 'efficiency', text: 'Hiệu quả' },
                  { value: 'quality', text: 'Chất lượng' },
                  { value: 'delivery', text: 'Thời gian giao hàng' },
                  { value: 'cost', text: 'Chi phí' }
                ]}
              />
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('manufacturing.performance.target')}</label>
              <span className='text-red'>*</span>
              <input type='text' name='target' className='form-control' value={kpi.target} onChange={handleKpiInputChange} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('manufacturing.performance.unit')}</label>
              <span className='text-red'>*</span>
              <input type='text' name='unit' className='form-control' value={kpi.unit} onChange={handleKpiInputChange} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('manufacturing.performance.formula')}</label>
              <a style={{ cursor: 'pointer' }} title={translate('manufacturing.performance.formula_description')}>
                <i className='fa fa-question-circle' style={{ marginLeft: 5 }} />
              </a>
              <RiskFormula
                formula={formula}
                onFormulaChange={handleFormulaChange}
                listAttributes={manufacturingMetric.listReportElements}
              />
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('manufacturing.performance.threshold')}</label>
              <a style={{ cursor: 'pointer' }} title={translate('manufacturing.performance.threshold_description')}>
                <i className='fa fa-question-circle' style={{ marginLeft: 5 }} />
              </a>
              <table className='table table-hover table-striped table-bordered'>
                <thead>
                  <tr>
                    <th>{translate('manufacturing.performance.threshold_value')}</th>
                    <th>{translate('manufacturing.performance.highValue')}</th>
                    <th>{translate('manufacturing.performance.lowValue')}</th>
                    <th style={{ width: '40px' }} className='text-center'>
                      <a href='#add-threshold' className='text-green' onClick={handleAddThreshold}>
                        <i className='material-icons'>add_box</i>
                      </a>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {thresholds.map((thr, index) => (
                    <tr key={index}>
                      <td>
                        <SelectBox
                          id={`select-threshold-level-${index}`}
                          className='form-control select2'
                          style={{ width: '100%' }}
                          value={thr.level}
                          onChange={(value) => handleThresholdLevelChange(value, index)}
                          items={[
                            { value: 1, text: translate('manufacturing.performance.low') },
                            { value: 2, text: translate('manufacturing.performance.medium') },
                            { value: 3, text: translate('manufacturing.performance.high') }
                          ]}
                        />
                      </td>
                      <td>
                        <input
                          type='text'
                          name='lowValue'
                          className='form-control'
                          value={thr.lowValue}
                          onChange={(e) => handleThresholdInputChange(e, index)}
                        />
                      </td>
                      <td>
                        <input
                          type='text'
                          name='highValue'
                          className='form-control'
                          value={thr.highValue}
                          onChange={(e) => handleThresholdInputChange(e, index)}
                        />
                      </td>
                      <td>
                        <a
                          href='#delete-threshold'
                          className='text-red'
                          style={{ border: 'none' }}
                          onClick={() => handleRemoveThreshold(index)}
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
  )
}

function mapStateToProps(state) {
  const manufacturingMetric = state.manufacturingMetric
  return { manufacturingMetric }
}

const mapDispatchToProps = {
  createManufacturingKpi: manufacturingMetricActions.createManufacturingKpi
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(KpiCreateForm))
