import React, { Component } from 'react';
import { NavBar, WhiteSpace, WingBlank, Button } from 'antd-mobile';

import logo from './logo-maimai.png';
import './App.css';
import generateFakeData from './utils/generateData';
import FlightChart from './components/FlightChart';
import CityChart from './components/CityChart';
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
    scores: [],
    pointsDetails: [],
    authenticating: false,
    authenticated: false,
    dataScrawling: false,
    dataScrawed: false,
    dataFetching: false,
    dataFetched: false,
  };

  constructor() {
    super();
    this.onAuthenticated = this.onAuthenticated.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidUpdate() {
    if (!this.interval && this.state.dataScrawling) {
      this.keepAskingUntilDataIsScawled();
    }

    if (this.state.authenticated && this.state.dataScrawled && !this.state.dataFetching && !this.state.dataFetched) {
      this.fetchData();
    }
  }

  keepAskingUntilDataIsScawled() {
    this.interval = setInterval(() => {
      getData('/api/logins', (res) => {
        if(!res.logins.length) {
          this.setState({ dataScrawled: true, dataScrawling: false });
          clearInterval(this.interval);
          this.interval = null;
        }
      })
    }, 1000);
  }

  fetchData() {
    const fakeData = generateFakeData();
    this.setState({ ...fakeData, dataFetching: true });
    getData('/api/flights', res => this.setState({ flights: res ? res.flights : fakeData.flights }));
    getData('/api/trains', res => this.setState({ trains: res ? res.trains : fakeData.trains }));
    getData('/api/pointsDetails', res => this.setState({ pointsDetails: res ? res.pointsDetails : fakeData.pointsDetails }));
  }

  renderCharts() {
    const { tags, flights, trains, rides, pointsDetails, scores } = this.state;

    return (
      <WingBlank>
        <FlightChart flights={flights} trains={trains} pointsDetails={pointsDetails} />
        <WhiteSpace />
        <CityChart city="上海" rides={rides} />
        <WhiteSpace />
        <WordCloud topics={tags} />
        <ScoreRadar scores={scores} />
        <p className="App-intro">
          出行轨迹用户画像-DoraHacks-董先sēng倾情奉献
        </p>
      </WingBlank>
    );
  }

  renderContent() {
    const { error, dataScrawling } = this.state;

    if (dataScrawling) {
      return '爬虫正在努力工作,请耐心等待...';
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
    this.setState({ authenticated: true, dataScrawling: true });
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
        {authenticated ? this.renderContent() : <Login onQrcodeScanned={this.onAuthenticated} />}
      </div>
    );
  }
}

export default App;
