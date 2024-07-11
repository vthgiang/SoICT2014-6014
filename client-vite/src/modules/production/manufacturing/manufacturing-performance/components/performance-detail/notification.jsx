import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import styles from './index.module.css'
import { formatFullDate } from '../../../../../../helpers/formatDate'

const Notification = (props) => {
    const { translate, alerts = [], thresholds = [], kpiUnit } = props

    const thresholdLevels = {
        "1": 'bad',
        "2": 'medium',
        "3": 'good'
    }

    const thresholdIcons = {
        "1": 'priority_high',
        "2": 'warning',
        "3": 'check'
    }

    return (
        <div className='chart-wrapper' style={{ overflowY: 'auto' }}>
            <span className={styles['noti_list-header']}>
                {translate('manufacturing.performance.noti_history')}
            </span>
            <div className={styles['noti_list']}>
                {alerts.map((alert, index) => (
                    <div
                        key={index} 
                        className={
                            `${styles['noti_item']} 
                            ${styles[thresholdLevels[alert.thresholdLevel]]}`
                        }
                    >
                        <div className={styles['noti_icon']}>
                            <i className='material-icons'>{thresholdIcons[alert.thresholdLevel]}</i>
                        </div>
                        <div className={styles['noti_wrapper']}>
                            <div className={styles['noti_header']}>
                                Hiệu suất KPI ở mức kém 
                            </div>
                            <div className={styles['noti_content']}>
                                Tỉ lệ lỗi sản phẩm: {alert.value}{kpiUnit}
                            </div>
                            <div className={styles['noti_content']}>
                                Ngưỡng kém: {`${thresholds[alert.thresholdLevel].lowValue}${kpiUnit} - 
                                ${thresholds[alert.thresholdLevel].highValue}${kpiUnit}`}
                            </div>
                            <div className={styles['noti_date']}>
                                {formatFullDate(alert.recordTime)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default connect(null, null)(withTranslate(Notification))
