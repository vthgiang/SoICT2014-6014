import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../common-components';
import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';
import { NotificationActions } from '../redux/actions';

class NotificationCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.props.getDepartment();
        this.props.getUser();
    }

    save = () => {
        var title = this.refs.title.value;
        var icon = this.refs.icon.value;
        var content = this.refs.content.value;
        var departments = [].filter.call(this.refs.departments.options, o => o.selected).map(o => o.value);
        var users = [].filter.call(this.refs.users.options, o => o.selected).map(o => o.value);
        var data = {title, icon, content, departments, users};
        console.log("data notification: ",data);

        return this.props.create(data);
    }

    render() { 
        const {translate, department, user} = this.props;
        return ( 
            <React.Fragment>
                <a style={{width: '100%', marginBottom: '15px'}} className="btn btn-success" title={translate('notification.add_title')} data-toggle="modal" href='#modal-create-notification'>{translate('notification.add')}</a>
                <DialogModal
                    modalID="modal-create-notification"
                    formID="form-create-notification" size="50"
                    title={translate('notification.add_title')}
                    msg_success={translate('notification.add_success')}
                    msg_faile={translate('notification.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-notification">
                        <div className="row">
                            <div className="form-group col-sm-9">
                                <label>Tiêu đề<span className="text-red">*</span></label>
                                <input type="text" ref="title" className="form-control"/>
                            </div>
                            <div className="form-group col-sm-3">
                                <label>Loại thông báo<span className="text-red">*</span></label>
                                <select className="form-control" ref="icon" defaultValue='info'>
                                    <option key={1} value={'info'}>info</option>
                                    <option key={2} value={'normal'}>normal</option>
                                    <option key={3} value={'warning'}>warning</option>
                                    <option key={4} value={'error'}>error</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Nội dung<span className="text-red">*</span></label>
                            <textarea type="text" ref="content" className="form-control" style={{height:'150px'}}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('notification.departments') }</label>
                            <select 
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                value={this.state.user_list}
                                ref="departments"
                            >
                                {
                                    department.list.map( d => <option key={d._id} value={d._id}>{d.name}</option>)
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{ translate('notification.users') }</label>
                            <select 
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                value={this.state.user_list}
                                ref="users"
                            >
                                {
                                    user.list.map( user => <option key={user._id} value={user._id}>{`${user.email} (${user.name})`}</option>)
                                }
                            </select>
                        </div>
                    </form>
                </DialogModal>
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