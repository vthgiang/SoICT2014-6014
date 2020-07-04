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
        window.$(`#${id}`).jstree({
            checkbox : {
                whole_node : false,
                three_state: false,
                tie_selection: false,
                deselect_all: false
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

        window.$(`#${id}`).on("changed.jstree", function (e, data) {
            if (onChanged){
                onChanged(e, data);
            }
        });

        window.$(`#${id}`).on("check_node.jstree", function (e, data) {
            if (checkNode)
                checkNode(e, data)
        });

        window.$(`#${id}`).on("uncheck_node.jstree", function (e, data) {
            if (unCheckNode)
                unCheckNode(e, data)
        });
    }

    componentDidUpdate() {
        const { id,data } = this.state;
        window.$(`#${id}`).jstree(true).settings.core.data = data;
        window.$(`#${id}`).jstree(true).refresh();

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || JSON.stringify(nextProps.data) !== JSON.stringify(prevState.data)) {
            return {
                id: nextProps.id,
                data: nextProps.data
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id || JSON.stringify(nextProps.data) !== JSON.stringify(this.state.data)){
            return true;
        }else return false;
    }

    render() {
        const { id, data } = this.state;

        return <React.Fragment>
            {id !== undefined ? <div id={`${id}`}/> : null}
        </React.Fragment>;
    }
}

export { Tree };