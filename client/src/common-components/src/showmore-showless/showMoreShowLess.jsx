import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import './showMoreShowLess.css';

class ShowMoreShowLess extends Component {
    constructor(props) {
        super(props);

        var translate = this.props.translate;

        this.state = {
            showMore: translate("common_component.showmore_showless.showmore"),
            showLess: translate("common_component.showmore_showless.showless"),
            titleShowMore: translate("common_component.showmore_showless.title_showmore"),
            titleShowLess: translate("common_component.showmore_showless.title_showless"),
        }

    }

    componentDidMount = () => {
        const { isText = true } = this.props;
        if (isText) {
            this.addReadMoreText();
        } else {
            this.addReadMoreComponent();
        }
    }

    componentDidUpdate = () => {
        const { isText = true } = this.props;
        if (isText) {
            this.addReadMoreText();
        } else {
            this.addReadMoreComponent();
        }
    }

    addReadMoreText = () => {
        const { id, characterLimit = 200 } = this.props;

        window.$(`#span${id}`).hide();
        //Traverse all selectors with this class and manupulate HTML part to show Read More
        window.$(`#showmore-showless${id} > .text`).each(function() {
            if (window.$(this).find(".firstSec").length)
                return;

            let allstr = window.$(this).text();
            if (allstr.length > characterLimit) {
                let firstSet = allstr.substring(0, characterLimit);
                let secdHalf = allstr.substring(characterLimit, allstr.length);
                // let strtoadd = firstSet + "<span class='hide-component'>" + secdHalf + `</span><a id='readMore${id}' class='read-more' title='${titleShowMore}'>` + " ... " + showMore + `</a><a id='readLess${id}' class='read-less' title=${titleShowLess}>` + " " + showLess + "</a>";
                let strtoadd = firstSet + "<span class='hide-component'>" + secdHalf + `</span>`;
                window.$(this).html(strtoadd);
                window.$(`#span${id}`).show();
            }

        });
    }

    addReadMoreComponent = () => {
        const { id } = this.props;

        if (!window.$(`#showmore-showless${id} > .hide-component`)[0]) {
            window.$(`#span${id}`).hide();
        } else {
            window.$(`#span${id}`).show();
        }
    }

    handleShowMore = () => {
        const { id } = this.props;

        window.$(`#showmore-showless${id}`).toggleClass("showless-content showmore-content");
    }

    render() {
        const { id, value, isText = true } = this.props;
        const { showMore, showLess, titleShowMore, titleShowLess } = this.state;

        return (
            <React.Fragment>
                {
                    isText
                        ? <span id={`showmore-showless${id}`} className="add-read-more showless-content">
                            <span className='text'>{value}</span>
                            <span id={`span${id}`}><a id={`readMore${id}`} className='read-more' title={titleShowMore} onClick={this.handleShowMore}> ... {showMore} </a><a id={`readLess${id}`} href={`#showmore-showless${id}`} className='read-less' title={titleShowLess} onClick={this.handleShowMore}> {showLess} </a></span>
                        </span>
                        : <section id={`showmore-showless${id}`} className="add-read-more showless-content">
                            {this.props.children}
                            <span id={`span${id}`}><a id={`readMore${id}`} className='read-more' title={titleShowMore} onClick={this.handleShowMore}>{showMore}</a><a id={`readLess${id}`} href={`#showmore-showless${id}`} className='read-less' title={titleShowLess} onClick={this.handleShowMore}>{showLess}</a></span>
                        </section>
                }
            </React.Fragment>
        )
    }
}

const connectedShowMoreShowLess = connect(null, null)(withTranslate(ShowMoreShowLess));
export { connectedShowMoreShowLess as ShowMoreShowLess }