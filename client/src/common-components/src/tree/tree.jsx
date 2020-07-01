import React, { Component } from 'react';
import './tree.css';

class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const { id, data, onChanged, onCheckChanged } = this.props;
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
            if (onCheckChanged){
                onCheckChanged(e, data);
            }
        });

        window.$('#' + id).on("uncheck_node.jstree", function (e, data) {
            if (onCheckChanged){
                onCheckChanged(e, data);
            }
        });
    }

    componentDidUpdate() {
        const { id } = this.props;
        window.$("#" + id).jstree(true).refresh(); // Cập nhật lại tree theo data mới
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id ) {
            return {
                id: nextProps.id,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Chỉ render lại khi id thay đổi
        if (nextProps.id !== this.state.id)
            return true;
        return false;
    }

    render() {
        const { id, data } = this.props;
        return (
            <div id={id}/>
        );
    }
}

export { Tree };