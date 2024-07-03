import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, Button, DialogContent, DialogContentText, Grid, TextField } from '@mui/material'

function EditFormKpiUnit({ isOpenModal, tabSelectedUnitKpiTree, handleSetTabSelectedUnitKpiTree, handleCloseModal }) {
  const [localData, setLocalData] = useState(tabSelectedUnitKpiTree)
  const [stateIsOpenModal, setStateIsOpenModal] = useState(isOpenModal)

  useEffect(() => {
    setLocalData(tabSelectedUnitKpiTree)
  }, [tabSelectedUnitKpiTree])

  useEffect(() => {
    setStateIsOpenModal(isOpenModal)
  }, [isOpenModal])

  const handleValueChange = (index, value) => {
    const updatedUnits = localData?.units?.map((unit, i) => (i === index ? { ...unit, planed_value: value } : unit))
    setLocalData({ ...localData, units: updatedUnits })
  }

  const handleClose = () => {
    handleCloseModal()
  }

  const handleSave = () => {
    handleSetTabSelectedUnitKpiTree(localData)
  }

  return (
    <Dialog open={stateIsOpenModal} fullWidth onClose={handleClose} id='213123'>
      <DialogTitle>Thay đổi giá trị KPI</DialogTitle>
      <DialogContent>
        <DialogContentText>Bạn hãy nhập giá trị KPI {localData?.description} mới bạn muốn thay đổi</DialogContentText>
        <Box sx={{ padding: 4 }}>
          <Grid container spacing={2}>
            {localData?.units?.map((unit, index) => (
              <Grid item xs={12} key={unit?.unit_id}>
                <TextField
                  label={unit?.unit_name}
                  value={unit?.planed_value}
                  onChange={(e) => handleValueChange(index, parseFloat(e.target.value))}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type='submit' onClick={() => handleSave()}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditFormKpiUnit
