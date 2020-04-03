import { Component } from 'react';
import { slimScrollScript } from './jquery.slimscroll.min';

class SlimScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        if (document.getElementById("script-slim-scroll") === null){
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-slim-scroll";
            script.innerHTML = slimScrollScript
            document.body.appendChild(script);
        }
    }
    
    componentDidUpdate(){
        const { id, active, options = {
                    axis: 'x',
                    width: '100%',
                    height: '100%',
                    disableFadeOut: false,
                    allowPageScroll: true
                }
        } = this.props;

        if (active) {
            window.$(`#${id}`).slimscroll(options);
        } else {
            window.$(`#${id}`)[0].style= "";
        }
    }

    render() {
        return null;
    }
}

export { SlimScroll }