import React from 'react'
import styles from './index.module.css'
import WidgetTitle from './widgetTitle'

const SingleValue = ({ title, values, unit, trend, customize, editMode }) => {
    const trendIcon = trend.direction == 'up' ? 'trending_up' : 'trending_down'
    const trendColor = trend.direction == 'up' ? '#28a745' : '#dc3545'

    return (
        <div className={styles.single_value}>
            <div className={styles.card_icon} style={{ backgroundColor: customize.theme[0] }}>
                <i className='material-icons'>{customize.icon}</i>
            </div>
            <div className={`${styles.card_content} ${editMode? styles["card_content-smaller"] : ""}`}>
                <WidgetTitle title={title} editMode={editMode} />
                <span className={styles['card_value-number']}>{values[values.length - 1]}{unit}</span>
                <span className={styles['card_value-trend']} style={{ color: trendColor }}>
                    <i className='material-icons'>{trendIcon}</i>
                    <span>{trend.value}</span>
                </span>
            </div>
        </div>
    )
}
export default SingleValue
