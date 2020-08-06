import React, { Component } from 'react';
import Draggable from 'react-draggable';

import './pinnedPanel.css';

class PinnedPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static panels = {};
    static addPanel = (id, panel) => {
        PinnedPanel.panels[id] = panel;
    }


    render() {
        return (
            <React.Fragment>
                {
                    Object.keys(PinnedPanel.panels).map(id =>
                        <Draggable
                            cancel="textarea, a, i, button"
                            handle={`#${id}`}
                            key={id}
                            defaultPosition={{ x: 0, y: 0 }}
                            position={null}
                            allowAnyClick={true}
                            grid={[1, 1]}
                            onStart={this.handleStart}
                            onDrag={this.handleDrag}
                            onStop={this.handleStop}>
                            <div id={id} className="pinned-panel">
                                {PinnedPanel.panels[id]}
                            </div>
                        </Draggable>
                    )
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export { PinnedPanel };