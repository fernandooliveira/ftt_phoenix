import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import * as actionCreators from 'redux/modules';

import Loading from 'components/Modules/Loading';
import Header from 'components/Modules/Header';

/* global styles for app */
require('./styles/app.scss');

@connect(
  ({ app }) => ({
    spinnerAsyncPage: app.get('spinnerAsyncPage'),
  }),
  dispatch => bindActionCreators({
    ...actionCreators.app,
  }, dispatch),
)
export default class Root extends Component {

  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.object,
    params: PropTypes.object,
    history: PropTypes.object,
    spinnerAsyncPage: PropTypes.bool,
    hideSpinnerAsyncPage: PropTypes.func,
  };

  componentDidMount() {
    const { hideSpinnerAsyncPage } = this.props;

    // for server-side-rendering (if we open async page)
    // see in /app/redux/modules/app/index.js, this component and /app/route.js
    hideSpinnerAsyncPage();
  }

  componentDidUpdate(prevProps) {
    const { hideSpinnerAsyncPage } = this.props;

    if (prevProps.spinnerAsyncPage === true) {
      hideSpinnerAsyncPage();
    }
  }

  render() {
    const { spinnerAsyncPage } = this.props;

    console.log();

// React.cloneElement(this.props.children, this.props)
    return (
      <section>
        <Helmet
          title="Helmet Title"
        />
        <Header />
        {
          spinnerAsyncPage
            ? <Loading /> // show spinner for async component
            : React.Children.map(
              this.props.children,
              (element, idx) => {
                return React.cloneElement(element, { ref: idx }); 
              }
            )  
        }
      </section>
    );
  }
}
