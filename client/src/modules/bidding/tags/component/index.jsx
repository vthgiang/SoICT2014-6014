import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { TagActions } from '../redux/actions';
import "./tag.css";

import TagTable from './tagTable';

class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <TagTable />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getListTag: TagActions.getListTag,
    deleteTag: TagActions.deleteTag
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Tag));