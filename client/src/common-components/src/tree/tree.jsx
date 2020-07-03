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
        window.$('#' + id).jstree({
            checkbox : {
                whole_node : false,
                three_state: false,
                tie_selection: false
            },
            core:{
                themes:{
                    dots: false,
                    icons: true,
                },
                data: data,
                multiple: false,
            },
            plugins: [ "checkbox" ]
        });

        window.$('#' + id).on("changed.jstree", function (e, data) {
            if (onChanged){
                onChanged(e, data);
            }
        });

        window.$('#' + id).on("check_node.jstree", function (e, data) {
            if (checkNode)
                checkNode(e, data)
        });

        window.$('#' + id).on("uncheck_node.jstree", function (e, data) {
            if (unCheckNode)
                unCheckNode(e, data)
        });
    }

    componentDidUpdate() {
        const { id, data } = this.state;
        window.$("#" + id).jstree({
            checkbox : {
                whole_node : false,
                three_state: false,
                tie_selection: false
            },
            core:{
                themes:{
                    dots: false,
                    icons: true,
                },
                data: data,
                multiple: false,
            },
            plugins: [ "checkbox" ]
        }).refresh(); // Cập nhật lại tree theo data mới
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
        return false;
    }

    render() {
        const { id, data } = this.state;
        console.log("data: ", data)
        return id !== undefined ? <div id={id}/> : null;
    }
}

export { Tree };