import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DialogModal, SelectBox, DatePicker } from '../../../../../../common-components'
import { manufacturingMetricActions } from '../../redux/actions'
import { UserActions } from '../../../../../super-admin/user/redux/actions'

const ActionCreateForm = (props) => {
    const { translate, user, onKpiChange, actions = [] } = props

    const [action, setAction] = useState({
        name: '',
        description: '',
        target: '',
        responsibles: [],
        startDate: '',
        endDate: '',
    })
    const [milestones, setMilestones] = useState([])

    const getEmployeeArray = () => {
        let employeeArr = []
        user.usercompanys?.map(user => {
            employeeArr.push({
                value: user._id,
                text: user.name
            })
        })

        return employeeArr
    }

    const handleActionInputChange = (e) => {
        const { name, value } = e.target
        setAction({
            ...action,
            [name]: value
        })
    }

    const handleActionSelectChange = (name, value) => {
        setAction({
            ...action,
            [name]: value
        })
    }

    const handleMilestoneInputChange = (e, index) => {
        const { name, value } = e.target
        const newMilestones = [...milestones]
        newMilestones[index] = {
            ...newMilestones[index],
            [name]: value
        }
        setMilestones(newMilestones)
    }

    const handleMilestoneSelectChange = (index, name, value) => {
        const newMilestones = [...milestones]
        newMilestones[index] = {
            ...newMilestones[index],
            [name]: value
        }
        setMilestones(newMilestones)
    }

    const handleAddMileStone = () => {
        setMilestones([...milestones, { name: '', time: '' }])
    }

    const handleRemoveMilestone = (index) => {
        const newMilestones = [...milestones]
        newMilestones.splice(index, 1)  
        setMilestones(newMilestones)
    }

    const isFormValidated = () => {
        if (!action.name 
            || !action.description 
            || !action.target 
            || !action.responsibles
            || !action.startDate 
            || !action.endDate
        ) {
            return false
        }

        return true
    }

    const save = () => {
        const newAction = {
            ...action, // general information
            milestones // milestones
        }

        onKpiChange({ actions: [...actions, newAction] })
    }

    useEffect(() => {
        props.getAllUserOfCompany()
    }, [])

    return (
        <DialogModal
            modalID='modal-create-action'
            isLoading={false}
            formID='form-create-action'
            title={translate('manufacturing.performance.create_action')}
            msg_success={translate('manufacturing.performance.create_action_success')}
            msg_failure={translate('manufacturing.performance.create_action_failure')}
            func={save}
            disableSubmit={!isFormValidated()}
            size={50}
            maxWidth={600}
        >
            <form id='form-create-action'>
                <div className='row'>
                    <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                        <div className='form-group'>
                            <label>
                                {translate('manufacturing.performance.problem')}
                                <span className='text-red'>*</span>
                            </label>
                            <input 
                                type='text' 
                                className='form-control'
                                name='name'
                                value={action.name}
                                onChange={handleActionInputChange}
                            />
                        </div>
                    </div>
                    <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                        <div className='form-group'>
                            <label>
                                {translate('manufacturing.performance.description')}
                                <span className='text-red'>*</span>
                            </label>
                            <input 
                                type='text' 
                                className='form-control'
                                name='description'
                                value={action.description}
                                onChange={handleActionInputChange}
                            />
                        </div>
                    </div>
                    <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                        <div className='form-group'>
                            <label>
                                {translate('manufacturing.performance.responsibles')}
                                <span className='text-red'>*</span>
                            </label>
                            <SelectBox
                                id='select-responsibles'
                                className='form-control select'
                                style={{ width: '100%' }}
                                items={getEmployeeArray()}
                                disabled={false}
                                onChange={(value) => handleActionSelectChange('responsibles', value)}
                                value={action.responsibles}
                                multiple={true}
                            />
                        </div>
                    </div>
                    <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                        <div className='form-group'>
                            <label>
                                {translate('manufacturing.performance.target')}
                                <span className='text-red'>*</span>
                            </label>
                            <input 
                                type='text' 
                                className='form-control'
                                name='target'
                                value={action.target}
                                onChange={handleActionInputChange}
                            />
                        </div>
                    </div>
                    
                    <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                        <div className='form-group'>
                            <label>
                                {translate('manufacturing.performance.startDate')}
                                <span className='text-red'>*</span>
                            </label>
                            <DatePicker
                                id={`action_start_date`}
                                value={action.startDate}
                                onChange={(value) => handleActionSelectChange('startDate', value)}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                        <div className='form-group'>
                            <label>
                                {translate('manufacturing.performance.endDate')}
                                <span className='text-red'>*</span>
                            </label>
                            <DatePicker
                                id={`action_end_date`}
                                value={action.startDate}
                                onChange={(value) => handleActionSelectChange('startDate', value)}
                                disabled={false}
                            />
                        </div>

                    </div>
                </div>
                <div className='form-group'>
                    <label className='form-control-static'>
                        {translate('manufacturing.performance.milestone')}
                    </label>
                    <table className='table table-hover table-striped table-bordered'>
                        <thead>
                            <tr>
                                <th>{translate('manufacturing.performance.name')}</th>
                                <th>{translate('manufacturing.performance.time')}</th>
                                <th style={{ width: '40px' }} className='text-center'>
                                    <a
                                        href='#add-threshold'
                                        className='text-green'
                                        onClick={handleAddMileStone}
                                    >
                                        <i className='material-icons'>add_box</i>
                                    </a>
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {milestones.map((milf, index) => (
                                <tr key={index}>
                                    <td style={{ width: '60%' }}>
                                        <input
                                            type='text'
                                            name='name'
                                            className='form-control'
                                            value={milf.name}
                                            onChange={(e) => handleMilestoneInputChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <DatePicker
                                            id={`milestone_start_time`}
                                            value={milf.time}
                                            onChange={(value) => handleMilestoneSelectChange(index, 'time', value)}
                                            disabled={false}
                                        />
                                    </td>
                                    <td>
                                        <a
                                            href='#delete-milestone'
                                            className='text-red'
                                            style={{ border: 'none' }}
                                            onClick={() => handleRemoveMilestone(index)}
                                        >
                                            <i className='fa fa-trash'></i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
        </DialogModal>
    )
}

function mapStateToProps(state) {
    const { user } = state
    return { user }
}
  
const mapDispatchToProps = {
    getAllUserOfCompany: UserActions.getAllUserOfCompany
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ActionCreateForm))
