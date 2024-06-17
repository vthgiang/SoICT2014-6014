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

const MarketingCampaignDetail = (props) => {
  const layout = [
    // { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
    // { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: 'g', x: 0, y: 0, w: 3, h: 6, minW: 2, maxW: 6 },
    { i: 'e', x: 3, y: 0, w: 3, h: 6, minW: 2, maxW: 6 },
    { i: 'd', x: 6, y: 0, w: 3, h: 6, minW: 2, maxW: 6 },
    { i: 'c2', x: 9, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'c1', x: 9, y: 3, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'b', x: 0, y: 9, w: 6, h: 8, minW: 2, maxW: 10 },
    { i: 'a', x: 6, y: 9, w: 6, h: 8, minW: 2, maxW: 10 }
  ]

  const data = {
    labels: ['Positive response', 'Negative response'],
    datasets: [
      {
        label: '# of Votes',
        data: [12211, 19404],
        backgroundColor: ['#ff5252', '#1976d2'],
        borderColor: ['#d50000', '#0d47a1'],
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
        text: 'NEW & RETURNING CUSTOMERS',
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
        text: 'SESSIONS & CONVERSION PERFORMANCE',
        font: {
          size: 20,
          weight: 'bold'
        },
        color: '#000000',

        padding: 10
      }
    }
  }

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  // const labels= ['January', 'February', 'March', 'April', 'May', 'June', 'July']

  const data2 = {
    labels,
    datasets: [
      {
        label: 'New Customers',
        data: [2000, 1200, 3000, 4500, 6000, 2400, 3500],
        backgroundColor: '#ff5252'
      },
      {
        label: 'Returning Customers',
        data: [1200, 3000, 2600, 4320, 5689, 3456, 6730],
        backgroundColor: '#1976d2'
      }
    ]
  }
  const data3 = {
    labels,
    datasets: [
      {
        label: 'Sessions',
        data: [32000, 30500, 39000, 40000, 43000, 42000, 41500],
        borderColor: '#ff5252',
        backgroundColor: '#ff5252'
      },
      {
        label: 'Conversion',
        data: [30500, 28000, 31000, 31200, 38000, 41000, 38500],
        borderColor: '#1976d2',
        backgroundColor: '#1976d2'
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
                '--CircularProgress-progressThickness': '7px'
              }}
            >
              <div className='circular_progress_text_inside'>40%</div>
            </CircularProgress>
          </div>
        </div>
        <div key='e' className='item'>
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
        </div>
        <div key='d' className='item'>
          <Doughnut data={data} />
        </div>
        <div key='c2' className='item'>
          <VisibilityIcon
            sx={{
              color: '#1976d2',
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
              color: '#1976d2',
              fontSize: '48px',
              marginRight: '8px'
            }}
          />
          <div>
            <div className='number_field_title'> Total spent</div>
            <div className='number_field_text'>10.000.000 VND</div>
          </div>
        </div>
        <div key='b' className='item'>
          <Bar options={optionsBar} data={data2} />;
        </div>
        <div key='a' className='item'>
          <Line options={optionsLine} data={data3} />;
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
