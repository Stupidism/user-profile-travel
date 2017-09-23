import React, { Component } from 'react';
import { NavBar, WhiteSpace, WingBlank, Button } from 'antd-mobile';

import logo from './logo-maimai.png';
import './App.css';
import generateFakeData from './utils/generateData';
import FlightChart from './components/FlightChart';
import ScoreRadar from './components/ScoreRadar';
import Login from './components/Login';
import WordCloud from './components/WordCloud';

class App extends Component {
  state = {
    authenticated: false,
    dataFetching: false,
    dataFetched: false,
    data: {
      tags: [],
      rides: [],
      flights: [],
      trains: [],
      drives: [],
    },
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
    this.setState({ dataFetching: true });
    fetch('/data', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
    }).then(res => {
      const fakeData = generateFakeData();
      if (res.status >= 200 && res.status < 300) {
        res.json().then(data => {
          this.setState({ data: {
            ...fakeData,
            ...data,
          }, dataFetched: true, dataFetching: false, error: '' });
        });
      } else {
        this.setState({ data: fakeData, dataFetched: true, dataFetching: false, error: '' });
        // this.setState({ dataFetched: true, error: '获取数据失败', dataFetching: false });
      }
    });
  }

  renderCharts() {
    const { tags, flights } = this.state.data;

    return (
      <WingBlank>
        <FlightChart flights={flights} />
        <WordCloud topics={tags} />
        <p className="App-intro">
          出行轨迹用户画像-DoraHacks-董先sēng倾情奉献
        </p>
      </WingBlank>
    );
  }

  renderContent() {
    const { dataFetching, error } = this.state;

    if (dataFetching) {
      return <span>正在加载数据...</span>;
    }

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
