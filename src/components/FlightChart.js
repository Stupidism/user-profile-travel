import React from 'react';
import _ from 'lodash';
import { compose, withHandlers } from 'recompose';

import ReactEcharts from 'echarts-for-react';
import 'echarts/map/js/china.js';

import getCoordinatesByCityName from '../utils/getCoordinatesByCityName';
import { planePath, trainPath } from '../constants';

const RelationGraph = ({ getOption }) => (
  <ReactEcharts
    option={getOption()}
    style={{ height: '800px', width: '100%' }}
    notMerge={true}
    lazyUpdate={true}
    theme={"theme_name"}
  />
);

const color = '#ffa022';

const getOption = ({ flights }) => () => {
  let cities = [];
  const data = flights.map(({ departureCity, arrivalCity }) => {
    cities.push(departureCity);
    cities.push(arrivalCity);

    return {
      fromName: departureCity,
      toName: arrivalCity,
      coords: [
        getCoordinatesByCityName(departureCity),
        getCoordinatesByCityName(arrivalCity),
      ]
    };
  });

  cities = _.uniq(cities);

  const series = [{
    name: '飞机',
    type: 'lines',
    zlevel: 1,
    effect: {
      show: true,
      period: 6,
      trailLength: 0.7,
      color: '#fff',
      symbolSize: 3
    },
    lineStyle: {
      normal: {
        color,
        width: 0,
        curveness: 0.2
      }
    },
    data,
  }, {
    name: '飞机',
    type: 'lines',
    zlevel: 2,
    effect: {
      show: true,
      period: 6,
      trailLength: 0,
      symbol: planePath,
      symbolSize: 15
    },
    lineStyle: {
      normal: {
        color,
        width: 1,
        opacity: 0.6,
        curveness: 0.2
      }
    },
    data,
  }, {
    name: '飞机',
    type: 'effectScatter',
    coordinateSystem: 'geo',
    zlevel: 2,
    rippleEffect: {
      brushType: 'stroke'
    },
    label: {
      normal: {
        show: true,
        position: 'right',
        formatter: '{b}'
      }
    },
    itemStyle: {
      normal: {
        color
      }
    },
    data: cities.map(function (name) {
      return {
        name,
        value: getCoordinatesByCityName(name),
      };
    })
  }];

  return {
    title: {
      text: '国内航程轨迹',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      top: 'bottom',
      left: 'right',
      data:['飞机'],
      textStyle: {
        color: '#fff'
      },
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: {readOnly: false},
        restore: {},
        saveAsImage: {}
      }
    },
    backgroundColor: '#404a59',
    geo: {
      map: 'china',
      label: {
        emphasis: {
          show: false
        }
      },
      roam: true,
      itemStyle: {
        normal: {
          areaColor: '#323c48',
          borderColor: '#404a59'
        },
        emphasis: {
          areaColor: '#2a333d'
        }
      }
    },
    series,
  };
};

export default compose(
  withHandlers({ getOption }),
)(RelationGraph);
