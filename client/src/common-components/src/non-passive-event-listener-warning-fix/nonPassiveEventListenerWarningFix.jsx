import { Component } from 'react';
import { defaultPassiveEventScript } from './default.passive.events';

class NonPassiveEventListenerWarningFix extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        if (document.getElementById("script-default-passive-event") === null){
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-default-passive-event";
            script.innerHTML = defaultPassiveEventScript
            document.body.appendChild(script);
        }
    }
    render() {
        return null;
    }
}

export { NonPassiveEventListenerWarningFix }