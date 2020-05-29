import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './selectTree.css';
import TreeSelect from 'rc-tree-select';

class SelectTree extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
 
    render() { 
        const {tree, translate} = this.props;
        return (
            <div>
            <TreeSelect
                getPopupContainer={triggerNode => triggerNode.parentNode}
                style={{ width: '100%' }}
                transitionName="rc-tree-select-dropdown-slide-up"
                choiceTransitionName="rc-tree-select-selection__choice-zoom"
                placeholder={<i>{translate('document.administration.domains.select_parent')}</i>}
                showSearch
                allowClear
                treeLine
                value={documentParent}
                treeData={domains}
                treeNodeFilterProp="label"
                filterTreeNode={false}
                onSearch={this.onSearch}
                onChange={this.handleParent}
                onSelect={this.onSelect}
            />
            </div>
        );
    }
}
 

const mapState = state => state;
const SelectTreeExport = connect(mapState, null)(withTranslate(SelectTree));
export { SelectTreeExport as SelectTree }