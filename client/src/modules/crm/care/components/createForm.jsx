import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DatePicker, DialogModal, SelectBox, QuillEditor } from '../../../../common-components';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { CrmCareTypeActions } from '../../careType/redux/action';
import { CrmCareActions } from '../redux/action';


function CreateCareForm  (props) {
    const [newCare, setNewCare] = useState ({});
    const [role, setRole]= useState (localStorage.getItem('currentRole'))
    

    /**
     * Hàm xử lý khi người chăm sóc khách hàng thay đổi
     * @param {*} value 
     */
    const handleChangeCaregiver = (value) => {
           const  newCareInput =  {
                ...newCare,
                customerCareStaffs: value,
            }
            setNewCare (newCareInput)
        }
    

    /**
     * Hàm xử lý khi khách hàng được chăm sóc thay đổi
     * @param {*} value 
     */
    const handleChangeCustomer = (value) => {
        const  newCareInput =  {
            ...newCare,
            customer: value[0],
        }
        setNewCare (newCareInput)
       
    }

    /**
     * Hàm xử lý khi tên công việc chăm sóc khách hàng thay đổi
     * @param {*} e 
     */
    const handleChangeName = (e) => {
        const { value } = e.target;
        const  newCareInput =  {
            ...newCare,
            name: value,
        }
        setNewCare (newCareInput)
       
    }

    /**
     * Hàm xử lý khi mô tả công việc chăm sóc khách  hàng thay đổi
     * @param {*} data
     */
    const handleChangeDescription = (data, imgs) => {
        const  newCareInput =  {
            ...newCare,
            description: data,
        }
        setNewCare (newCareInput)
       
    }

    /**
     * Hàm xử lý khi hình thức chăm sóc thay đổi
     * @param {*} value 
     */
    const handleChangeCareType = (value) => {
        const  newCareInput =  {
            ...newCare,
            customerCareTypes: value,
        }
        setNewCare (newCareInput)
       
    }


    /**
     * Hàm xử lý khi trạng thái công việc chăm sóc thay đổi
     * @param {*} value 
     */
    const handleChangeStatus = value => {
        const  newCareInput =  {
            ...newCare,
            status: value[0],
        }
        setNewCare (newCareInput)
       
        
    }
    /**
     * Hàm xử lý khi độ ưu tiên thay đổi
     * @param {*} value 
     */
const handleChangePriority = (value) =>{
    const  newCareInput =  {
        ...newCare,
        priority: value[0],
    }
    setNewCare (newCareInput)
   
}
    /**
     * Hàm xử lý khi ngày bắt đầu thực hiện công việc thay đổi
     * @param {*} value 
     */
    const handleChangeStartDate = value => {
        const  newCareInput =  {
            ...newCare,
            startDate: value,
        }
        setNewCare (newCareInput)
       
    }


    /**
     * Hàm xử lý khi ngày kết thúc công việc thay đổi
     * @param {*} value 
     */
    const handleChangeEndDate = value => {
        const  newCareInput =  {
            ...newCare,
            endDate: value,
        }
        setNewCare (newCareInput)
       
    }

    

    const save = () => {
    props.createCare(newCare);
    }

    
        const { translate, user, crm } = props;
        const { careTypes, customers } = crm;
      

        // Lấy nhân viên trong đơn vị hiện tại
        let employees;
        if (user.employees) {
            employees = user.employees.map(o => (
                { value: o.userId._id, text: o.userId.name }
            ))
        }

        let listCareTypes;
        // Lấy hình thức chắm sóc khách hàng
        if (careTypes) {
            listCareTypes = careTypes.list.map(o => (
                { value: o._id, text: o.name }
            ))
        }

        let listCustomers;
        if (customers) {
            listCustomers = customers.list.map(o => (
                { value: o._id, text: o.name }
            ))
        }
        console.log('Caretype',careTypes);
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-crm-care-create" button_name={translate('general.add')} title={translate('crm.care.add')} />
                <DialogModal
                    modalID="modal-crm-care-create"
                    formID="form-crm-care-create"
                    title={translate('crm.care.add')}
                    func={save}
                    size={75}
                 //disableSubmit={!isFormValidated()}
                >
                    <form id="form-crm-care-create">
                        {/* Nhân viên phụ trách */}
                        <div className={`form-group`}>
                            <label>{translate('crm.care.caregiver')}</label>
                            {
                                employees &&
                                <SelectBox
                                    id={`caregiver-care`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        employees
                                    }
                                   // value={newCare.caregiver ? newCare.caregiver : []}
                                    onChange={handleChangeCaregiver}
                                    multiple={true}
                                    options={{ placeholder: translate('crm.care.caregiver') }}
                                />
                            }
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>

                        {/* Khách hàng được chăm sóc */}
                        <div className={`form-group`}>
                            <label>{translate('crm.care.customer')}</label>
                            {
                                listCustomers &&
                                <SelectBox
                                    id={`customer-care`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listCustomers
                                    }
                                  //  value={newCare.customer ? newCare.customer : []}
                                    onChange={handleChangeCustomer}
                                    multiple={true}
                                    options={{ placeholder: translate('crm.care.customer') }}
                                />
                            }
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>

                        {/* Tên công việc */}
                        <div className={`form-group`}>
                            <label>{translate('crm.care.name')}</label>
                            <input type="text" className="form-control" onChange={handleChangeName} />
                            {/* <ErrorLabel content={groupNameError} /> */}
                        </div>

                        {/* Mô tả công việc chăm sóc */}
                        <div className="form-group">
                            <label>{translate('crm.care.description')}</label>
                            <QuillEditor
                                id={'createCare'}
                                getTextData={handleChangeDescription}
                                table={false}
                            />
                        </div>

                        {/* Loại hình chăm sóc khách hàng */}
                        <div className="form-group">
                            <label>{translate('crm.care.careType')}</label>
                            {
                                careTypes &&
                                <SelectBox
                                    id={`customer-careType`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listCareTypes
                                    }
                                    value={newCare.careType ? newCare.careType : []}
                                    onChange={handleChangeCareType}
                                    multiple={true}
                                    options={{ placeholder: translate('crm.care.careType') }}
                                />
                            }
                        </div>
                        {/* Độ ưu tiên */}
                        <div className="form-group">
                            <label>{'Độ ưu tiên: '}</label>
                            <SelectBox
                                id={`status-care`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    [
                                        { value: '', text: '---Chọn---' },
                                        { value: 1, text: 'Ưu tiên thấp' },
                                        { value: 2, text: 'Ưu tiên tiêu chuẩn' },
                                        { value: 3, text: 'Ưu tiên cao' },
                                    ]
                                }
                                value={newCare.status ? newCare.status : ''}
                                onChange={handleChangePriority}
                                multiple={false}
                            />
                        </div>

                        {/* Thời gian thực hiện */}
                        <div className="form-group">
                            <label>{translate('crm.care.startDate')}</label>
                            <DatePicker
                                id="startDate-form-care"
                                value={newCare.startDate ? newCare.startDate : ''}
                                onChange={handleChangeStartDate}
                                disabled={false}
                            />
                        </div>

                        {/* Thời gian kết thúc */}
                        <div className="form-group">
                            <label>{translate('crm.care.endDate')}</label>
                            <DatePicker
                                id="endDate-form-care"
                                value={newCare.endDate ? newCare.endDate : ''}
                                onChange={handleChangeEndDate}
                                disabled={false}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }


function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
    getCareTypes: CrmCareTypeActions.getCareTypes,
    createCare: CrmCareActions.createCare,
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateCareForm));