import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get, show } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import RoleEditForm from './RoleEditForm';

class RoleTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            roleID: null
        }
        this.setModal = this.setModal.bind(this);
    }

    setModal = (id, abstract) => {
        this.setState({
            roleID: id,
            abstract: abstract
        });
        this.props.show(id);
    }

    componentDidMount(){
        this.props.get();
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
                                {/* <th>{ translate('manageRole.abstract') }</th> */}
                                <th style={{ textAlign: 'center'}}>{ translate('table.action') }</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                role.list !== undefined ? 
                                role.list.map( role => 
                                    <tr key={ `roleList${role._id}` }>
                                        <td> { role.name } </td>
                                        {/* <td>
                                            {
                                                role.abstract.map( item => 
                                                    <React.Fragment key={item._id}>
                                                        <span className="badge">{ item.name }</span>
                                                        <span>{" "}</span>
                                                    </React.Fragment>
                                                )
                                            }
                                        </td> */}
                                        <td style={{ textAlign: 'center'}}>
                                            <div className="dropdown">
                                                <i className="fa fa-gear dropdown-toggle" data-toggle="dropdown" onClick={() => this.setModal(role._id, role.abstract) }>
                                                </i>
                                                <div className="dropdown-menu bg bg-gray" style={{marginLeft: '-25px', minWidth: '100px'}}>
                                                    <a className="btn btn-sm btn-primary" data-toggle="modal" href={`#${role._id}`}><i className="fa fa-edit"></i></a>
                                                    <button className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                                </div>
                                            </div>
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
                <RoleEditForm   
                    roleID={ this.state.roleID } 
                />
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
        show: (id) => {
            dispatch(show(id));
        },
        // destroy: (id) => {
        //     dispatch(destroy(id));
        // }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleTable) );