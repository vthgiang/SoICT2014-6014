import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import * as React from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import './style.css'
import CircularProgress from '@mui/joy/CircularProgress'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { Doughnut } from 'react-chartjs-2'
import LinearProgress from '@mui/material/LinearProgress'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
// import faker from 'faker'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const MarketingCampaignDetail = ({marketingCampaignDetail}) => {
  const layout = [
    // { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
    // { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: 'g', x: 0, y: 0, w: 3, h: 6, minW: 2, maxW: 6 },
    { i: 'd', x: 3, y: 0, w: 3, h: 6, minW: 2, maxW: 6 },
    // { i: 'e1', x: 6, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    // { i: 'e2', x: 6, y: 3, w: 3, h: 3, minW: 2, maxW: 6 },
    // { i: 'c2', x: 9, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    // { i: 'c1', x: 9, y: 3, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'c', x: 6, y: 0, w: 6, h: 6, minW: 2, maxW: 10 },
    { i: 'b', x: 0, y: 9, w: 6, h: 8, minW: 2, maxW: 10 },
    { i: 'a', x: 6, y: 9, w: 6, h: 8, minW: 2, maxW: 10 }
  ]

  const data = {
    labels: ['Phản hồi tích cực', 'Phản hồi tiêu cực'],
    datasets: [
      {
        label: '# of Votes',
        data: [marketingCampaignDetail?.totalPositiveRes, marketingCampaignDetail?.totalNegativeRes],
        backgroundColor: ['#1f77b4', '#d62728'],
        borderColor: ['#0d47a1', '#d50000'],
        borderWidth: 1
      }
    ]
  }

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Khách hàng mới và Khách hàng quay lại',
        font: {
          size: 20,
          weight: 'bold'
        },
        color: '#000000'
      }
    }
  }

  const optionsBar2 = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Doanh thu theo nhóm tuổi',
        font: {
          size: 20,
          weight: 'bold'
        },
        color: '#000000'
      }
    }
  }

  const optionsLine = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Hiệu quả tỉ lệ chuyển đổi và phiên truy cập',
        font: {
          size: 20,
          weight: 'bold'
        },
        color: '#000000',

        padding: 10
      }
    }
  }

  const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7']
  // const labels= ['January', 'February', 'March', 'April', 'May', 'June', 'July']

  const labels_age = ['>65', '55-64', '45-54', '35-44', '25-34', '18-24', '<18']

  const data2 = {
    labels,
    datasets: [
      {
        label: 'Khách hàng mới',
        data: [2000, 1200, 3000, 4500, 6000, 2400, 3500],
        backgroundColor: '#d62728'
      },
      {
        label: 'Khách hàng quay lại',
        data: [1200, 3000, 2600, 4320, 5689, 3456, 6730],
        backgroundColor: '#1f77b4'
      }
    ]
  }

  const data3 = {
    labels,
    datasets: [
      {
        label: 'Phiên truy cập',
        data: [32000, 30500, 39000, 40000, 43000, 42000, 41500],
        borderColor: '#d62728',
        backgroundColor: '#d62728'
      },
      {
        label: 'Lượt chuyển đổi mục tiêu',
        data: [30500, 28000, 31000, 31200, 38000, 41000, 38500],
        borderColor: '#1f77b4',
        backgroundColor: '#1f77b4'
      }
    ]
  }

  const data4 = {
    labels: labels_age,
    datasets: [
      {
        label: 'Khách hàng mới',
        data: [2000, 1200, 3000, 4500, 6000, 2400, 3500],
        backgroundColor: '#1f77b4'
      }
    ]
  }

  return (
    <>
      <GridLayout className='layout' layout={layout} cols={12} rowHeight={30} width={1200} compactType={'vertical'}>
        <div key='g' className='item'>
          <div>
            <div className='card_title'>ROIM</div>
            <CircularProgress
              determinate
              value={80}
              sx={{
                '--CircularProgress-size': '160px',
                '--CircularProgress-trackThickness': '10px',
                '--CircularProgress-progressThickness': '7px',
                '--CircularProgress-progressColor': '#1f77b4',
              }}
            >
              <div className='circular_progress_text_inside'>40%</div>
            </CircularProgress>
          </div>
        </div>
        {/* <div key='e2' className='item'>
          <VisibilityIcon
            sx={{
              color: '#1f77b4',
              fontSize: '40px',
              marginLeft: '-12px',
              marginRight: '4px'
            }}
          />
          <div>
            <div className='number_field_title'> Total impressions</div>
            <div className='number_field_text'>15.500</div>
          </div>
        </div>
        <div key='e1' className='item'>
          <AttachMoneyIcon
            sx={{
              color: '#1f77b4',
              fontSize: '48px',
              marginRight: '8px'
            }}
          />
          <div>
            <div className='number_field_title'> Total spent</div>
            <div className='number_field_text'>10.000.000 VND</div>
          </div>
        </div> */}
        {/* <div key='e' className='item'>
          <div>
            <div className='card_title '> TARGETS </div>
            <div className='linear_progress linear_progress-first'>
              <div className='linear_progress-title'> Time passed </div>
              <LinearProgress
                variant='determinate'
                value={45}
                sx={{
                  height: '12px',
                  width: '248px',
                  borderRadius: '4px'
                }}
              ></LinearProgress>
            </div>
            <div className='linear_progress'>
              <div className='linear_progress-title'> Customers </div>
              <LinearProgress
                variant='determinate'
                value={36}
                sx={{
                  height: '12px',
                  width: '248px',
                  borderRadius: '4px'
                }}
              ></LinearProgress>
            </div>

            <div className='linear_progress'>
              <div className='linear_progress-title'> Revenue </div>
              <LinearProgress
                variant='determinate'
                value={39}
                sx={{
                  height: '12px',
                  width: '248px',
                  borderRadius: '4px'
                }}
              ></LinearProgress>
            </div>
          </div>
        </div> */}
        <div key='d' className='item'>
          <Doughnut data={data} />
        </div>
        {/* <div key='c2' className='item'>
          <VisibilityIcon
            sx={{
              color: '#1f77b4',
              fontSize: '40px',
              marginLeft: '-12px',
              marginRight: '4px'
            }}
          />
          <div>
            <div className='number_field_title'> Total impressions</div>
            <div className='number_field_text'>15.500</div>
          </div>
        </div>
        <div key='c1' className='item'>
          <AttachMoneyIcon
            sx={{
              color: '#1f77b4',
              fontSize: '48px',
              marginRight: '8px'
            }}
          />
          <div>
            <div className='number_field_title'> Total spent</div>
            <div className='number_field_text'>10.000.000 VND</div>
          </div>
        </div> */}
         <div key='c' className='item'>
         <Bar options={optionsBar2} data={data4} />
        </div>
        <div key='b' className='item'>
          <Bar options={optionsBar} data={data2} />
        </div>
        <div key='a' className='item'>
          <Line options={optionsLine} data={data3} />
        </div>
      </GridLayout>
    </>
  )
}

const mapState = (state) => {
  const { department, createEmployeeKpiSet, user, createKpiUnit, auth } = state
  return { department, createEmployeeKpiSet, user, createKpiUnit, auth }
}

export default connect(mapState)(withTranslate(MarketingCampaignDetail))
