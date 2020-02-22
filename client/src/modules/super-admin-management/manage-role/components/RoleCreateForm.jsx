import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { Modal } from '../../../../common-components';

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
                <Modal 
                    title={translate('manage_role.add_title')}
                    size='50'
                    button_name={translate('manage_role.add')} 
                    msg_success={translate('manage_role.add_success')}
                    msg_faile={translate('manage_role.add_faile')}
                    func={this.save}
                >
                    <form>
                        <div className="form-group">
                            <label>{ translate('manage_role.name') }<span className="text-red"> * </span></label>
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
                                    role.list !== undefined
                                    ? role.list.map( role => <option key={role._id} value={role._id}>{role.name}</option>)
                                    :null
                                }
                            </select>
                        </div>
                    </form>
                </Modal>
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

    save(){
        let select = this.refs.parents;
        let parents = [].filter.call(select.options, o => o.selected).map(o => o.value);
        const { name } = this.state;
        const role = { name, parents };

        return this.props.create(role);
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    get: RoleActions.get,
    create: RoleActions.create
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleCreateForm) );