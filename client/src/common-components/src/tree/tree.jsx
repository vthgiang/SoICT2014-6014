import React, { Component } from 'react';
import './tree.css';

/**
 * Nguồn: https://www.jstree.com/
 */
class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        const { id, data } = this.state;
        const { onChanged, checkNode, unCheckNode, plugins = true } = this.props;
        window.$(`#${id}`).jstree({
            checkbox: {
                whole_node: false,
                three_state: false,
                tie_selection: false,
                deselect_all: false
            },
            core: {
                themes: {
                    dots: false,
                    icons: true,
                },
                data: data,
                multiple: false,
            },
            plugins: plugins ? ["checkbox"] : null,
        });

        window.$(`#${id}`).on("changed.jstree", (e, data) => {
            if (onChanged) {
                this.props.onChanged(e, data);
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

    componentDidUpdate(prevProps, prevState) {
        const { id, data } = this.state;
        if (prevState.data.length !== 0 && JSON.stringify(prevState.data) !== JSON.stringify(data)) {
            window.$(`#${id}`).jstree(true).settings.core.data = data;
        }
        window.$(`#${id}`).jstree(true).refresh();

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || JSON.stringify(nextProps.data) !== JSON.stringify(prevState.data)) {
            return {
                id: nextProps.id,
                data: nextProps.data,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id || JSON.stringify(nextProps.data) !== JSON.stringify(this.state.data)) {
            return true;
        } else return false;
    }

    render() {
        const { className, style } = this.props;
        const { id, data } = this.state;

        return <React.Fragment>
            {id !== undefined ? <div id={`${id}`} className={className} style={style} /> : null}
        </React.Fragment>;
    }
}

export { Tree };