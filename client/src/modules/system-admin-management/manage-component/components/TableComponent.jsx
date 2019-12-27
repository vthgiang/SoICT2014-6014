import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get, destroy } from '../redux/actions';
import ComponentInfoForm from './ComponentInfoForm';
import ComponentDeleteModal from './ComponentDeleteModal';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.deleteComponent = this.deleteComponent.bind(this);
    }

    deleteComponent = (id) => {
        this.props.destroy(id);
    }

    componentDidMount(){
        this.props.getComponents();
    }

    render() { 
        const { component, translate } = this.props;
        return ( 
            <React.Fragment>
                <table 
                    style={{marginTop: '50px'}}
                    className="table table-bordered">
                    <thead>
                        <tr>
                            <th>{ translate('table.name') }</th>
                            <th>{ translate('table.description') }</th>
                            <th style={{width: "15%"}}>{ translate('table.action') }</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            component.list.map( component => 
                                <tr key={component._id}>
                                    <td>{ component.name }</td>
                                    <td>{ component.description }</td>
                                    <td>
                                        <a className="btn btn-sm btn-primary" data-toggle="modal" href={ `#modal-component-${component._id}` }><i className="fa fa-edit"></i></a>
                                        <a className="btn btn-sm btn-danger" data-toggle="modal" href={`#modal-component-delete-${component.id}`}><i className="fa fa-trash"></i></a>
                                        <ComponentDeleteModal componentId={component._id} componentName={ component.name } deleteComponent={this.deleteComponent}/>
                                        <ComponentInfoForm 
                                            componentId={ component._id }
                                            componentName={ component.name }
                                            componentDescription={ component.description }
                                            componentRoles={ component.roles.map(role => role.roleId) }
                                        />
                                        
                                    </td>
                                </tr>
                            )
                        }
                        {
                            component.list.length === 0 &&
                            <tr>
                                <td colSpan={"3"}>No data</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        getComponents: () => {
            dispatch(get());
        },
        destroy: (id) => {
            dispatch(destroy(id));
        },
    }
}
 
export default connect(mapState, getState) (withTranslate(TableComponent));