import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import styles from "./index.module.css";

const SingleValue = ({title, value, trend, customize}) => {
    const trendIcon = trend.direction == "up" ? 'trending_up' : 'trending_down'
    const trendColor = trend.direction == "up" ? '#28a745' : '#dc3545'
    return (
        <div className={styles.single_value}>
            <div className={styles.card_icon} style={{backgroundColor: customize.color}}>
                <i className="material-icons">{customize.icon}</i>
            </div>
            <div className={styles.card_content}>
                <div className={styles.cart_numer}>
                    <span className={styles["card_value-number"]}>{value}</span>
                    <span className={styles["card_value-trend"]} style={{color: trendColor}}>
                        <i className="material-icons">{trendIcon}</i>
                        <span>{trend.value}</span>
                    </span>
                </div>
                <div className={styles.card_title}>{title}</div>
            </div>
        </div>
    )
}
export default connect(null, null)(withTranslate(SingleValue))

