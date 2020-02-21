import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

class RoleCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null
        }
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
    }

    render() { 
        const{ translate, role } = this.props;
        return ( 
            <React.Fragment>
                <a className="btn btn-success pull-right" data-toggle="modal" href="#modal-add-role" title={ translate('manage_role.add_title') }>{ translate('manage_role.add') }</a>
                <div className="modal fade" id="modal-add-role">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h4 className="modal-title">{ translate('manage_role.add_title') }</h4>
                        </div>
                        <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label>{ translate('manage_role.name') }</label>
                                <input className="form-control" name="name" onChange={this.inputChange} type="text"/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('manage_role.extends') }</label>
                                <select 
                                    name="parents" 
                                    className="form-control select2" 
                                    multiple="multiple" 
                                    style={{ width: '100%' }} 
                                    ref="parents"
                                >
                                    {
                                        role.list !== undefined ?
                                        (
                                            role.list.map( role => 
                                                    <option key={role._id} value={role._id}>{role.name}</option>
                                                )
                                        ) : (
                                            null
                                        )
                                    }
                                </select>
                            </div>
                        </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal">{ translate('form.close') }</button>
                            <button type="button" className="btn btn-success" 
                                onClick={() => this.save(translate('manage_role.add_success'))} 
                                data-dismiss="modal">{ translate('form.save') }</button>
                        </div>
                    </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
    
    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    componentDidMount(){
        this.props.get();

        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    save(msg){
        let select = this.refs.parents;
        let parents = [].filter.call(select.options, o => o.selected).map(o => o.value);

        const { name } = this.state;
        const role = { name, parents };
        this.props.create(role).then(res => {
            Swal.fire({
                icon: 'success',
                title: msg,
                showConfirmButton: false,
                timer: 5000 //2 giây
            })     
        });
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    get: RoleActions.get,
    create: RoleActions.create
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleCreateForm) );