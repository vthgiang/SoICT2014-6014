import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { formatCurrency } from '../../../../../helpers/formatCurrency';

import c3 from 'c3';
import 'c3/c3.css';

class SalesOrderStatusChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 1
    };
  }

  componentDidMount() {
    this.pieChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.salesOrders !== this.props.salesOrders || prevState.type !== this.state.type) {
      this.pieChart();
    }
  }

  handleChangeType = (type) => {
    this.setState({
      type
    });
  }

  setDataPieChart = () => {
    const { type } = this.state;
    let salesOrdersCounter = {};

    if (this.props.salesOrders) {
      salesOrdersCounter = this.props.salesOrders.salesOrdersCounter;
    }

    let dataPieChart = [];

    if (salesOrdersCounter && salesOrdersCounter.totalNumberWithStatus && type === 1) {
      dataPieChart = [
        ['Chờ phê duyệt', salesOrdersCounter.totalNumberWithStatus[1] || 0],
        ['Đã phê duyệt', salesOrdersCounter.totalNumberWithStatus[2] || 0],
        ['Yêu cầu sản xuất', salesOrdersCounter.totalNumberWithStatus[3] || 0],
        ['Đã lập kế hoạch sản xuất', salesOrdersCounter.totalNumberWithStatus[4] || 0],
        ['Đã yêu cầu sản xuất', salesOrdersCounter.totalNumberWithStatus[5] || 0],
        ['Đang giao hàng', salesOrdersCounter.totalNumberWithStatus[6] || 0],
        ['Đã giao hàng', salesOrdersCounter.totalNumberWithStatus[7] || 0],
        ['Đã hủy', salesOrdersCounter.totalNumberWithStatus[8] || 0]
      ];
    }

    if (salesOrdersCounter && salesOrdersCounter.totalMoneyWithStatus && type === 2) {
      dataPieChart = [
        ['Chờ phê duyệt', salesOrdersCounter.totalMoneyWithStatus[1] || 0],
        ['Đã phê duyệt', salesOrdersCounter.totalMoneyWithStatus[2] || 0],
        ['Yêu cầu sản xuất', salesOrdersCounter.totalMoneyWithStatus[3] || 0],
        ['Đã lập kế hoạch sản xuất', salesOrdersCounter.totalMoneyWithStatus[4] || 0],
        ['Đã yêu cầu sản xuất', salesOrdersCounter.totalMoneyWithStatus[5] || 0],
        ['Đang giao hàng', salesOrdersCounter.totalMoneyWithStatus[6] || 0],
        ['Đã giao hàng', salesOrdersCounter.totalMoneyWithStatus[7] || 0],
        ['Đã hủy', salesOrdersCounter.totalMoneyWithStatus[8] || 0]
      ];
    }
    return dataPieChart;
  }

  removePreviousChart() {
    const chart = this.refs.amountPieChart;
    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild);
      }
    }
  }

  // Khởi tạo PieChart bằng C3
  pieChart = () => {
    let dataPieChart = this.setDataPieChart();
    this.removePreviousChart();
    c3.generate({
      bindto: this.refs.amountPieChart,

      data: {
        columns: dataPieChart,
        type: 'pie'
      },

      pie: {
        label: {
          format: function (value, ratio, id) {
            return value ? formatCurrency(value) : '';
          }
        }
      },

      tooltip: {
        format: {
          title: function (d) {
            return d;
          },
          value: function (value) {
            return value;
          }
        }
      },

      legend: {
        show: true
      }
    });
  }

  render() {
    return (
      <div className='box'>
        <div className='box-header with-border'>
          <i className='fa fa-bar-chart-o' />
          <h3 className='box-title'>Số lượng, doanh số đơn bán hàng theo trạng thái</h3>
          <div className='box-tools pull-right'>
            <div
              className='btn-group pull-rigth'
              style={{
                position: 'absolute',
                right: '5px',
                top: '5px'
              }}
            >
              <button
                type='button'
                className={`btn btn-xs ${this.state.type === 2 ? 'active' : 'btn-danger'}`}
                onClick={() => this.handleChangeType(1)}
              >
                Số lượng
              </button>
              <button
                type='button'
                className={`btn btn-xs ${this.state.type === 2 ? 'btn-danger' : 'active'}`}
                onClick={() => this.handleChangeType(2)}
              >
                Doanh số
              </button>
            </div>
          </div>
          <div ref='amountPieChart'></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { salesOrders } = state;
  return { salesOrders };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderStatusChart));
