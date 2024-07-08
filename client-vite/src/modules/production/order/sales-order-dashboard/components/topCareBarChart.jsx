import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { QuoteActions } from '../../quote/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';

function TopCareBarChart(props) {
  const topCareBarChart = React.createRef();

  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole')
  });

  useEffect(() => {
    barChart();
  }, [props.quotes]);

  const setDataBarChart = () => {
    let topGoodsCareValue = ['Top sản phẩm được quan tâm theo số lượng'];

    if (props.quotes && props.quotes.topGoodsCare) {
      let topGoodsCareMap = props.quotes.topGoodsCare.map((element) => element.quantity);
      topGoodsCareValue = topGoodsCareValue.concat(topGoodsCareMap);
    }

    let dataBarChart = {
      columns: [topGoodsCareValue && topGoodsCareValue.length ? topGoodsCareValue : []],
      type: 'bar'
    };
    return dataBarChart;
  };

  const removePreviousChart = () => {
    const chart = topCareBarChart.current;
    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild);
      }
    }
  };

  const barChart = () => {
    let dataBarChart = setDataBarChart();

    let topGoodsCareTitle = [];
    if (props.quotes && props.quotes.topGoodsCare) {
      topGoodsCareTitle = props.quotes.topGoodsCare.map((element) => element.name);
    }

    const truncatedTitles = topGoodsCareTitle.map(title => title.length > 20 ? title.slice(0, 20) + '...' : title);

    removePreviousChart();

    let chart = c3.generate({
      bindto: topCareBarChart.current,
      data: dataBarChart,
      bar: {
        width: {
          ratio: 0.5
        }
      },
      axis: {
        rotated: true, // Chuyển trục để biểu đồ nằm ngang
        x: {
          type: 'category',
          categories: truncatedTitles.length ? truncatedTitles : [],
        },
        y: {
          label: {
            text: 'Đơn vị tính',
            position: 'outer-middle'
          }
        }
      },
      tooltip: {
        format: {
          title: function (index) {
            return topGoodsCareTitle[index];
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
  };

  return (
    <div className='box'>
      <div className='box-header with-border'>
        <i className='fa fa-bar-chart-o' />
        <h3 className='box-title'>Top sản phẩm được quan tâm (theo số lượng)</h3>
        <div ref={topCareBarChart} id='topCareBarChart'></div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { quotes } = state;
  return { quotes };
}

const mapDispatchToProps = {
  getTopGoodsCare: QuoteActions.getTopGoodsCare
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TopCareBarChart));
