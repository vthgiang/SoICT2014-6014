import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

class RoleCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null
        }
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
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

    save(e){
        e.preventDefault();
        let select = this.refs.abstract;
        let abstract = [].filter.call(select.options, o => o.selected).map(o => o.value);

        const { name } = this.state;
        const role = { name, abstract };
        this.props.create(role);
    }

    render() { 
        const{ translate, role } = this.props;
        return ( 
            <React.Fragment>
                <a className="btn btn-success pull-right" data-toggle="modal" href="#modal-add-role" title={ translate('manageRole.add') }>{ translate('add') }</a>
                <div className="modal fade" id="modal-add-role">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h4 className="modal-title">{ translate('manageRole.create') }</h4>
                        </div>
                        <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label>{ translate('manageRole.roleName') }</label>
                                <input className="form-control" name="name" onChange={this.inputChange} type="text"/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('manageRole.abstract') }</label>
                                <select 
                                    name="abstract" 
                                    className="form-control select2" 
                                    multiple="multiple" 
                                    style={{ width: '100%' }} 
                                    ref="abstract"
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
                            <button type="button" className="btn btn-default" data-dismiss="modal">{ translate('table.close') }</button>
                            <button type="button" className="btn btn-primary" onClick={this.save} data-dismiss="modal">{ translate('table.save') }</button>
                        </div>
                    </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    get: RoleActions.get,
    create: RoleActions.create
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleCreateForm) );