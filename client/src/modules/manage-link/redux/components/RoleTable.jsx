import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { get as getUser } from '../../manage-user/redux/actions';
import RoleInfoForm from './RoleInfoForm';

class RoleTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
    }

    componentDidMount(){
        this.props.get();
        this.props.getUser();
    }

    render() { 
        const { role, translate } = this.props;
        return ( 
            <React.Fragment>
                {
                    role.list.length > 0 && 
                    <table className="table table-bordered table-hover" style={{marginTop: '50px'}}>
                        <thead>
                            <tr>
                                <th>{ translate('manageRole.roleName') }</th>
                                <th style={{ width: '110px' }}>{ translate('table.action') }</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                role.list !== undefined ? 
                                role.list.map( role => 
                                    <tr key={ `roleList${role._id}` }>
                                        <td> { role.name } </td>
                                        <td>
                                            <a className="btn btn-sm btn-primary" data-toggle="modal" href={`#role-info-${role._id}`}><i className="fa fa-edit"></i></a>
                                            <button className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                            <RoleInfoForm roleInfo={ role }/>
                                        </td>
                                    </tr>       
                                ): 
                                (
                                    <tr>
                                        <td colSpan={'3'}>no data</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                }
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return{
        get: () => {
            dispatch(get()); 
        },
        getUser: () => {
            dispatch( getUser() );
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleTable) );