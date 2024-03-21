import React, { Component } from 'react'
import c3 from 'c3'
import 'c3/c3.css'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { manufacturingPlanActions } from '../../manufacturing-plan/redux/actions'
import { connect } from 'react-redux'
class PlanPieChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentRole: localStorage.getItem('currentRole')
    }
  }

  componentDidMount() {
    const data = {
      currentRole: this.state.currentRole
    }
    this.props.getNumberPlansByStatus(data)
  }

  pieChart = (translate, planNumberStatus) => {
    let chart = c3.generate({
      bindto: this.refs.quantityPlanByStatus,
      data: {
        columns: [
          [translate('manufacturing.plan.1.content'), planNumberStatus.plan1 ? planNumberStatus.plan1 : 0],
          [translate('manufacturing.plan.2.content'), planNumberStatus.plan2 ? planNumberStatus.plan2 : 0],
          [translate('manufacturing.plan.3.content'), planNumberStatus.plan3 ? planNumberStatus.plan3 : 0],
          [translate('manufacturing.plan.4.content'), planNumberStatus.plan4 ? planNumberStatus.plan4 : 0],
          [translate('manufacturing.plan.5.content'), planNumberStatus.plan5 ? planNumberStatus.plan5 : 0]
        ],
        type: 'pie'
      },

      color: {
        pattern: [
          translate('manufacturing.plan.1.color'),
          translate('manufacturing.plan.2.color'),
          translate('manufacturing.plan.3.color'),
          translate('manufacturing.plan.4.color'),
          translate('manufacturing.plan.5.color')
        ]
      },

      pie: {
        label: {
          format: function (value, ratio, id) {
            return value
          }
        }
      },

      padding: {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20
      },

      tooltip: {
        format: {
          title: function (d) {
            return d
          },
          value: function (value) {
            return value
          }
        }
      },

      legend: {
        show: true
      }
    })
  }

  render() {
    const { translate, manufacturingPlan } = this.props
    let planNumberStatus = {}
    if (manufacturingPlan.planNumberStatus && manufacturingPlan.isLoading === false) {
      planNumberStatus = manufacturingPlan.planNumberStatus
    }
    this.pieChart(translate, planNumberStatus)
    return (
      <React.Fragment>
        <div className='box'>
          <div className='box-header with-border'>
            <i className='fa fa-bar-chart-o' />
            <h3 className='box-title'>{translate('manufacturing.plan.quantity_by_status')}</h3>
            <div ref='quantityPlanByStatus'></div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { manufacturingPlan } = state
  return { manufacturingPlan }
}

const mapDispatchToProps = {
  getNumberPlansByStatus: manufacturingPlanActions.getNumberPlansByStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PlanPieChart))
