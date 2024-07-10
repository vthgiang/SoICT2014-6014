import React from 'react'
import { IconButton } from '@mui/material'

import styles from './index.module.css'

const WidgetTitle = ({ 
	title, 
	editMode, 
	onDelete, 
	onRedirectToDetail 
}) => {
  return (
    <div className={styles.widget_title}>
      <span><i class="fa fa-bar-chart"></i> {title}</span>
      {editMode ? (
        <IconButton 
					sx={{ color: '#dc3545' }} 
					onClick={onDelete} 
					size='small' 
					className='cancelSelectorName'
				>
          <i className='material-icons'>delete</i>
        </IconButton>
      ) : (
        <IconButton 
					onClick={onRedirectToDetail}
				>
          <i className='material-icons'>more_vert</i>
        </IconButton>
      )}
    </div>
  )
}

export default WidgetTitle
