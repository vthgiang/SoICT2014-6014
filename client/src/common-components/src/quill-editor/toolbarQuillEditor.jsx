import React, { Component } from 'react';
import { connect } from 'react-redux';

class ToolbarQuillEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    render() {
        const { id } = this.props;

        return (
            <React.Fragment>
                <div id={id}>
                    {/* Font */}
                    <select className="ql-font">
                        <option selected></option>
                        <option value="monospace"></option>
                    </select>

                    {/* Heading */}
                    <select className="ql-header">
                        <option selected></option>
                        <option value="1"></option>
                        <option value="2"></option>
                        <option value="3"></option>
                    </select>

                    {/* In đậm, in nghiêng, gạch chân, gạch ngang */}
                    <span class="ql-formats">
                        <button className="ql-bold"></button>
                        <button className="ql-italic"></button>
                        <button className="ql-underline"></button>
                        <button className="ql-strike"></button>
                    </span>

                    {/* Màu chữ, background */}
                    <span class="ql-formats">
                        <select class="ql-color"></select>
                        <select class="ql-background"></select>
                    </span>
                    
                    {/* Đầu mục danh sách, Căn lề */}
                    <span class="ql-formats">
                        <button className="ql-list" value="ordered"></button>
                        <button className="ql-list" value="bullet"></button>
                        <select className="ql-align">
                            <option selected></option>
                            <option value="center"></option>
                            <option value="right"></option>
                            <option value="justify"></option>
                        </select>
                    </span>

                    {/* Chèn ảnh, codeblock, insert table */}
                    <span class="ql-formats">
                        <button className="ql-image"></button>
                        <button className="ql-code-block"></button>
                        <button id="insert-table"><a className="fa fa-table" style={{ color: 'black' }}></a></button>
                    </span>
                </div>
            </React.Fragment>
        )
    }
}

const connectedToolbarQuillEditor = connect(null, null)(ToolbarQuillEditor);
export { connectedToolbarQuillEditor as ToolbarQuillEditor }