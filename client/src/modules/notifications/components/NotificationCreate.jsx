import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalButton, ModalDialog } from '../../../common-components';
import { DepartmentActions } from '../../super-admin-management/manage-department/redux/actions';
import { UserActions } from '../../super-admin-management/manage-user/redux/actions';
import { NotificationActions } from '../redux/actions';

class NotificationCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            department_list: [],
            user_list: [],
            icon: 'info', //icon của thông báo
            title: '', //tiêu đề của thông báo
            content: '', //nội dung của thông báo,
        }
    }

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    setDepartment = (e, all=false) => {
        const target = e.target;
        const name = target.name;
        const checked = target.checked;
        if(!all){
            const index = this.state.department_list.indexOf(name);
            if(checked && index === -1){ //chưa tồn tại phần tử thì thêm vào mảng
                this.setState({
                    ...this.state,
                    department_list: [name, ...this.state.department_list]
                });
            }else if(!checked && index !== -1){
                const newArr = this.state.department_list;
                newArr.splice(index, 1);
                this.setState({
                    department_list: newArr
                })
            }
        }else{
            if(checked){
                const departmentArr = this.props.department.list.map(d => d._id);
                this.setState({
                    department_list: departmentArr
                });
            }else{
                this.setState({
                    department_list: []
                });
            }
        }
        
    }

    setUser = (e, all=false) => {
        const target = e.target;
        const name = target.name;
        const checked = target.checked;
        if(!all){
            const index = this.state.user_list.indexOf(name);
            if(checked && index === -1){ //chưa tồn tại phần tử thì thêm vào mảng
                this.setState({
                    ...this.state,
                    user_list: [name, ...this.state.user_list]
                });
            }else if(!checked && index !== -1){
                const newArr = this.state.user_list;
                newArr.splice(index, 1);
                this.setState({
                    user_list: newArr
                })
            }
        }else{
            if(checked){
                const userArr = this.props.user.list.map(user => user._id);
                this.setState({
                    user_list: userArr
                });
            }else{
                this.setState({
                    user_list: []
                });
            }
        }
        
    }

    componentDidMount(){
        this.props.getDepartment();
        this.props.getUser();
    }

    save = () => {
        const {title, icon, content} = this.state;
        return this.props.create({title, icon, content});
    }

    render() { 
        const {department_list, user_list}=this.state;
        const {translate, department, user} = this.props;
        console.log(this.state)
        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-notification" button_name={translate('notification.add')} title={translate('notification.add_title')}></ModalButton>
                <ModalDialog
                    modalID="modal-create-notification"
                    formID="form-create-notification" size="75"
                    title={translate('notification.add_title')}
                    msg_success={translate('notification.add_success')}
                    msg_faile={translate('notification.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-notification">
                        <div className="row">
                            <div className="form-group col-sm-8">
                                <label>Tiêu đề<span className="text-red">*</span></label>
                                <input type="text" name="title" className="form-control" onChange={this.handleChange}/>
                            </div>
                            <div className="form-group col-sm-4">
                                <label>Loại thông báo<span className="text-red">*</span></label>
                                <select className="form-control" onChange={this.handleChange} name="icon">
                                    <option key={1} value={'info'}>info</option>
                                    <option key={2} value={'normal'}>normal</option>
                                    <option key={3} value={'warning'}>warning</option>
                                    <option key={4} value={'error'}>error</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Nội dung<span className="text-red">*</span></label>
                            <textarea type="text" name="content" className="form-control" onChange={this.handleChange} style={{height:'200px'}}/>
                        </div>
                        <div className="form-group">
                            <label>{translate('notification.departments')}</label>
                            <div style={{border: '1px solid #D2D6DE', padding: '10px', marginBottom: '20px'}}>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                                        <div className="checkbox">
                                            <label>
                                                <input checked={department_list.length === department.list.length ? true : false} type="checkbox" name='allDepartment' onChange={(e) => this.setDepartment(e, true)}/> Tất cả
                                            </label>
                                        </div>
                                    </div>
                                    {
                                        department.list.map(department => 
                                            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3" key={department._id}>
                                                <div className="checkbox">
                                                    <label>
                                                        <input checked={department_list.indexOf(department._id) !== -1 ? true : false} type="checkbox" name={department._id} onChange={this.setDepartment}/> {department.name}
                                                    </label>
                                                </div>
                                            </div>  
                                        )
                                    }
                                </div>
                            </div>
                            <label>{translate('notification.users')}</label>
                            <div style={{border: '1px solid #D2D6DE', padding: '10px'}}>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                                        <div className="checkbox">
                                            <label>
                                                <input checked={user_list.length === user.list.length ? true : false} type="checkbox" name='allUser' onChange={(e) => this.setUser(e, true)}/> Tất cả
                                            </label>
                                        </div>
                                    </div>
                                    {
                                        user.list.map(user => 
                                            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3" key={user._id}>
                                                <div className="checkbox">
                                                    <label>
                                                        <input checked={user_list.indexOf(user._id) !== -1 ? true : false} type="checkbox" name={user._id} onChange={this.setUser}/> {user.name}
                                                    </label>
                                                </div>
                                            </div>  
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;
const actions = {
    getDepartment: DepartmentActions.get,
    getUser: UserActions.get,
    create: NotificationActions.create
}

export default connect( mapStateToProps, actions )( withTranslate(NotificationCreate) );