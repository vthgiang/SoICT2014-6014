import React, { Component } from 'react';
import './tree.css';

class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        const {id, data} = this.state;
        const { onChanged, checkNode, unCheckNode } = this.props;
        window.$(`#tree-${id}`).jstree({
            checkbox : {
                whole_node : false,
                three_state: false,
                tie_selection: false
            },
            core:{
                themes:{
                    dots: true,
                    icons: true,
                },
                data: data,
                multiple: false,
            },
            plugins: [ "checkbox" ]
        });

        window.$(`#tree-${id}`).on("changed.jstree", function (e, data) {
            if (onChanged){
                onChanged(e, data);
            }
        });

        window.$(`#tree-${id}`).on("check_node.jstree", function (e, data) {
            if (checkNode)
                checkNode(e, data)
        });

        window.$(`#tree-${id}`).on("uncheck_node.jstree", function (e, data) {
            if (unCheckNode)
                unCheckNode(e, data)
        });
    }

    componentDidUpdate() {
        console.log("Refresh data tree")
        const { id,data } = this.state;
        console.log("data-tree-update: ", data)
        window.$(`#tree-${id}`).jstree(true).settings.core.data = data;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.data.length !== prevState.data.length) {
            return {
                id: nextProps.id,
                data: nextProps.data
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Chỉ render lại khi id thay đổi
        if (nextProps.id !== this.state.id || nextProps.data.length !== this.state.data.length){
            return true;
        }
        return true;
    }

    render() {
        const { id, data } = this.state;
        return id !== undefined ? <div id={`tree-${id}`}/> : null;
    }
}

export { Tree };