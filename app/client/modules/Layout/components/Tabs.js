import React, { Component } from 'react';

import { Redirect, withRouter } from 'react-router';

/* material-ui */
import {
  Tabs,
  Tab
} from 'material-ui';

export default class MaterialTabs extends Component {
  loadUrl = (url) => {
    this.props.transitionTo(url);
  }

  render () {
    const pathname = window.location.pathname;

    return (
      <Tabs value={pathname}>
        <Tab label="Dashboard" value="/v1/dashboard" onActive={()=>this.loadUrl("/v1/dashboard")} />
        <Tab label="Calendar" value="/v1/calendar" onActive={()=>this.loadUrl("/v1/calendar")} />
        <Tab label="Members" value="/v1/members" onActive={()=>this.loadUrl("/v1/members")} />
        <Tab label="Family" value="/v1/family" onActive={()=>this.loadUrl("/v1/family")} />
      </Tabs>
    );
  }
}




