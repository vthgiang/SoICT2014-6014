import React, { Component } from 'react';
import { connect } from 'react-redux';

import './quillEditor.css';

class ToolbarQuillEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    render() {
        const { id, font, header, typography, fontColor, alignAndList, embeds, table } = this.props;

        return (
            <React.Fragment>
                <div id={id}>
                    {/* font */
                        font &&
                            <select className="ql-font">
                                <option></option>
                                <option value="serif"></option>
                                <option value="monospace"></option>
                            </select>
                    }

                    {/* header */
                        header &&
                            <select className="ql-header">
                                <option></option>
                                <option value="1"></option>
                                <option value="2"></option>
                                <option value="3"></option>
                            </select>
                    }

                    {/* typography */
                        typography &&
                            <span className="ql-formats">
                                <button className="ql-bold"></button>
                                <button className="ql-italic"></button>
                                <button className="ql-underline"></button>
                                <button className="ql-strike"></button>
                            </span>
                    }

                    {/* fontColor */
                        fontColor &&
                            <span className="ql-formats">
                                <select className="ql-color"></select>
                                <select className="ql-background"></select>
                            </span>
                    }
                    
                    {/* alignAndList */
                        alignAndList &&
                            <span className="ql-formats">
                                <button className="ql-list" value="ordered"></button>
                                <button className="ql-list" value="bullet"></button>
                                <select className="ql-align">
                                    <option></option>
                                    <option value="center"></option>
                                    <option value="right"></option>
                                    <option value="justify"></option>
                                </select>
                            </span>
                    }

                    {/* embeds */
                        embeds &&
                            <span className="ql-formats">
                                <button className="ql-image"></button>
                                <button className="ql-code-block"></button>
                            </span>
                    }

                    {/* table */
                        table &&
                            <button id={`insert-table${id}`}><a className="fa fa-table insert-table-icon-quill"></a></button>
                    }
                </div>
            </React.Fragment>
        )
    }
}

const connectedToolbarQuillEditor = connect(null, null)(ToolbarQuillEditor);
export { connectedToolbarQuillEditor as ToolbarQuillEditor }