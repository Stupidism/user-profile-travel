import React, { Component } from 'react';
import { NavBar, WhiteSpace, WingBlank, Button } from 'antd-mobile';

import logo from './logo-maimai.png';
import './App.css';
import generateFakeData from './utils/generateData';
import FlightChart from './components/FlightChart';
import ScoreRadar from './components/ScoreRadar';
import Login from './components/Login';
import WordCloud from './components/WordCloud';
import getData from './utils/getData';

class App extends Component {
  state = {
    tags: [],
    rides: [],
    flights: [],
    trains: [],
    drives: [],
    authenticated: false,
    dataFetching: false,
    dataFetched: false,
  };

  constructor() {
    super();
    this.onAuthenticated = this.onAuthenticated.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    if (!this.state.dataFetched && !this.state.dataFetching) {
      this.fetchData();
    }
  }

  componentDidUpdate() {
    if (!this.state.dataFetched && !this.state.dataFetching) {
      this.fetchData();
    }
  }

  fetchData() {
    const fakeData = generateFakeData();
    this.setState({ ...fakeData, dataFetching: true });
    getData('/api/flights', res => this.setState({ flights: res ? res.flights : fakeData.flights }));
  }

  renderCharts() {
    const { tags, flights, trains } = this.state;

    return (
      <WingBlank>
        <FlightChart flights={flights} trains={trains} />
        <WordCloud topics={tags} />
        <p className="App-intro">
          出行轨迹用户画像-DoraHacks-董先sēng倾情奉献
        </p>
      </WingBlank>
    );
  }

  renderContent() {
    const { error } = this.state;

    if (error) {
      return (
        <span>
          数据加载失败<br/>
          原因:{error}
          <Button onClick={this.fetchData}>重新加载</Button>
        </span>
      );
    }

    return this.renderCharts();
  }

  onAuthenticated() {
    this.setState({ authenticated: true });
  }

  render() {
    const { authenticated } = this.state;

    return (
      <div className="App">
        <NavBar
          iconName={null}
          mode="light"
          leftContent={<img src={logo} className="App-logo" alt="logo" />}
        >
          我的出行知多少?
        </NavBar>
        <WhiteSpace />
        {this.renderContent()}
      </div>
    );
  }
}

export default App;
