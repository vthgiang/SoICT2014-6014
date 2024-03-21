import React, { Component } from 'react'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

class MillProductivity extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { translate, listGoods } = this.props
    return (
      <fieldset className='scheduler-border'>
        <legend className='scheduler-border'>{translate('manufacturing.plan.productivity_mill')}</legend>
        <table className='table table-bordered not-sort'>
          <thead>
            <tr>
              <th>{translate('manufacturing.plan.index')}</th>
              <th>{translate('manufacturing.plan.good_code')}</th>
              <th>{translate('manufacturing.plan.good_name')}</th>
              <th>{translate('manufacturing.plan.base_unit')}</th>
              <th>{translate('manufacturing.plan.mill')}</th>
              <th>{translate('manufacturing.plan.productity')}</th>
              <th>{translate('manufacturing.plan.person_number')}</th>
            </tr>
          </thead>
          <tbody>
            {listGoods &&
              listGoods.length &&
              listGoods.map((x, index) =>
                x.good.manufacturingMills.length ? (
                  x.good.manufacturingMills.map((y, index1) =>
                    index1 === 0 ? (
                      <tr key={x.good._id}>
                        <td rowSpan={x.good.manufacturingMills.length}>{index + 1}</td>
                        <td rowSpan={x.good.manufacturingMills.length}>{x.good.code}</td>
                        <td rowSpan={x.good.manufacturingMills.length}>{x.good.name}</td>
                        <td rowSpan={x.good.manufacturingMills.length}>{x.good.baseUnit}</td>
                        <td>{y.manufacturingMill.name}</td>
                        <td>{y.productivity}</td>
                        <td>{y.personNumber}</td>
                      </tr>
                    ) : (
                      <tr key={index1}>
                        <td>{y.manufacturingMill.name}</td>
                        <td>{y.productivity}</td>
                        <td>{y.personNumber}</td>
                      </tr>
                    )
                  )
                ) : (
                  <tr key={x.good._id}>
                    <td>{index + 1}</td>
                    <td>{x.good.code}</td>
                    <td>{x.good.name}</td>
                    <td>{x.good.baseUnit}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </fieldset>
    )
  }
}

export default withTranslate(MillProductivity)
