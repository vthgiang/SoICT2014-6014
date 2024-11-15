import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ErrorLabel, SelectBox } from '../../../../../../common-components'
import { worksActions } from '../../../manufacturing-works/redux/actions'
import { GoodActions } from '../../../../common-production/good-management/redux/actions'

const GeneralForm = (props) => {
  const { translate, routing, onInputChange, onSelectChange, errorMsg, manufacturingWorks, goods } = props

  const getWorksArr = () => {
    let worksArr = [{ value: '1', text: `---${translate('manufacturing.routing.choose_works')}---` }]
    manufacturingWorks?.listWorks.forEach((works) => {
      worksArr.push({ value: works._id, text: works.name })
    })
    return worksArr
  }

  const getGoodsArr = () => {
    const { listGoodsByRole } = goods
    let goodsArr = []
    listGoodsByRole?.forEach((goods) => {
      goodsArr.push({ value: goods._id, text: goods.name })
    })
    return goodsArr
  }

  /* Handle manufacturingWorks select change */
  const handleWorksChange = (value) => {
    const selectedWorks = manufacturingWorks.listWorks.find((works) => works._id === value[0])
    onSelectChange('works', selectedWorks._id)
    onSelectChange('organizationalUnit', selectedWorks.organizationalUnit._id)
  }

  useEffect(() => {
    const getData = async () => {
      const currentRole = localStorage.getItem('currentRole')
      const data = {
        currentRole: localStorage.getItem('currentRole')
      }
      await props.getAllManufacturingWorks(data)
      await props.getGoodByManageWorkRole(currentRole)
    }
    getData()
  }, [])

  return (
    <form id='form-create-new-routing'>
      <div className='row'>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <div className='form-group'>
            <label>{translate('manufacturing.routing.code')}</label>
            <input type='text' value={routing.code} disabled={true} className='form-control' />
          </div>
          <div className={`form-group ${!errorMsg.name ? '' : 'has-error'}`}>
            <label>
              {translate('manufacturing.routing.name')}
              <span className='text-red'>*</span>
            </label>
            <input className='form-control' type='text' name='name' value={routing.name} onChange={onInputChange} />
            <ErrorLabel content={errorMsg.name} />
          </div>
          <div className={`form-group ${!errorMsg.products ? '' : 'has-error'}`}>
            <label>
              {translate('manufacturing.routing.product')}
              <span className='text-red'> * </span>
            </label>
            <SelectBox
              id='select-product'
              className='form-control select2'
              style={{ width: '100%' }}
              value={routing.products}
              onChange={(value) => onSelectChange('products', value)}
              multiple={true}
              items={getGoodsArr()}
            />
            <ErrorLabel content={errorMsg.products} />
          </div>
          <div className={`form-group ${!errorMsg.works ? '' : 'has-error'}`}>
            <label>
              {translate('manufacturing.routing.choose_works')}
              <span className='text-red'> * </span>
            </label>
            <SelectBox
              id='select-works'
              className='form-control select2'
              style={{ width: '100%' }}
              value={routing.works}
              onChange={(value) => handleWorksChange(value)}
              items={getWorksArr()}
            />
            <ErrorLabel content={errorMsg.manufacturingWorks} />
          </div>
          <div className='form-group'>
            <label>{translate('manufacturing.routing.description')}</label>
            <textarea type='text' className='form-control' name='description' value={routing.description} onChange={onInputChange} />
          </div>
        </div>
      </div>
    </form>
  )
}

const mapStateToProps = (state) => {
  const { manufacturingWorks, goods } = state
  return { manufacturingWorks, goods }
}

const mapDispatchToProps = {
  getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
  getGoodByManageWorkRole: GoodActions.getGoodByManageWorkRole
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GeneralForm))
