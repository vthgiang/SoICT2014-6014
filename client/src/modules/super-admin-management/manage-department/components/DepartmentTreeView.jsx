import React, { Component } from 'react';
// import './css/TreeView.css';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get } from '../redux/actions';

class DepartmentTreeView extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            zoom: 14.8
        }
        this.displayTreeView = this.displayTreeView.bind(this);
        this.showNodeContent = this.showNodeContent.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
    }

    zoomIn = () => {
        if(this.state.zoom < 24)
        this.setState({ zoom : this.state.zoom + 0.2});
    }

    zoomOut = () => {
        if(this.state.zoom > 0)
            this.setState({ zoom : this.state.zoom - 0.2});
    }

    showNodeContent = (data) => {
        return (
            <span className="tf-nc bg-gray" style={{ borderRadius: '2px'}}>
                <p style={{ marginBottom: '10px'}}>{ data.name }</p>
                <a className="pull-right" data-toggle="modal" href={`#department-detail-${data.id}`}><i className="fa fa-edit"></i></a>
            </span>
        )
    }

    displayTreeView = (data) => {
        if(data !== undefined){
            if(typeof(data.children) === 'undefined') 
                return (
                    <li key={data.id}>
                        { this.showNodeContent(data) }
                    </li>
                )
            return (
                <li key={data.id}>
                    { this.showNodeContent(data) }
                    <ul>
                        {
                            data.children.map( tag => this.displayTreeView(tag))
                        }
                    </ul>  
                </li>
            )
        }
        else return null
    } 

    render() { 
        const { tree } = this.props.department;

        return ( 
            <React.Fragment>
                <i className="btn btn-sm btn-default fa fa-plus" onClick={ this.zoomIn }></i>
                <i className="btn btn-sm btn-default fa fa-minus" onClick={ this.zoomOut }></i>
                <div className="tf-tree example" style={{ textAlign: 'center', fontSize: `${this.state.zoom}px` }}>
                    <ul>
                        {tree !== null && this.displayTreeView(tree[0])}
                    </ul>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        get: () => {
            dispatch(get());
        },
    }
}
 
export default connect(mapState, getState) (withTranslate(DepartmentTreeView)); 