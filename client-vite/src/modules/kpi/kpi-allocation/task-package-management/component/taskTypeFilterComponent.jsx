import React, { useEffect, useState } from 'react'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { TextField } from '@mui/material'
import { TaskPackageManagementAction } from '../redux/actions'

const filter = createFilterOptions()

const StyledAutocomplete = styled(Autocomplete)({
  width: '100%!important',
  '& .MuiInputBase-root': {
    height: 34
  }
})

function TaskTypeFilterComponent({ onData }) {
  const [value, setValue] = useState(null)
  const dispatch = useDispatch()
  const configData = useSelector((state) => state.kpiAllocation.taskPackageManagementReducer)
  const { taskTypes } = configData

  useEffect(() => {
    dispatch(TaskPackageManagementAction.getTaskTypeData())
  }, [dispatch])

  const handleValueChange = (event, newValue) => {
    if (newValue && newValue.inputValue) {
      const payload = {
        name: newValue.inputValue
      }
      dispatch(TaskPackageManagementAction.addTaskTypeData(payload))
      onData(newValue.inputValue)
    } else {
      setValue(newValue)
      onData(newValue.name)
    }
  }

  const handleFilterOptions = (options, params) => {
    const filtered = filter(options, params)
    if (params.inputValue !== '') {
      filtered.push({ inputValue: params.inputValue, name: `Add "${params.inputValue}"` })
    }
    return filtered
  }

  const getOptionLabel = (option) => {
    if (typeof option === 'string') {
      return option
    }
    if (option.inputValue) {
      return option.inputValue
    }
    return option.name
  }

  return (
    <StyledAutocomplete
      value={value}
      onChange={handleValueChange}
      filterOptions={handleFilterOptions}
      options={taskTypes}
      getOptionLabel={getOptionLabel}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      renderOption={(props, option) => (
        <li {...props} key={option._id || option.inputValue || option.name}>
          {option.name}
        </li>
      )}
      freeSolo
      renderInput={(params) => <TextField {...params} />}
    />
  )
}

export default TaskTypeFilterComponent
