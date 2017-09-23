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

const colors = ['#ffa022', '#46bee9'];
const curveness = [0.2, 0.1];

const generateSeries = (name, travels, index) => {
  let cities = [];
  const data = travels.map(({ departureCity, arrivalCity }) => {
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
  return [{
    name,
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
        color: colors[index],
        width: 0,
        curveness: curveness[index],
      }
    },
    data,
  }, {
    name,
    type: 'lines',
    zlevel: 2,
    effect: {
      show: true,
      period: 6,
      trailLength: 0,
      symbol: name === '飞机' ? planePath : trainPath,
      symbolSize: 15
    },
    lineStyle: {
      normal: {
        color: colors[index],
        width: 1,
        opacity: 0.6,
        curveness: curveness[index],
      }
    },
    data,
  }, {
    name,
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
        color: colors[index]
      }
    },
    data: cities.map(function (name) {
      return {
        name,
        value: getCoordinatesByCityName(name),
      };
    })
  }]
};

const getOption = ({ flights, trains }) => () => {
  let series = [];
  series = series.concat(generateSeries('飞机', flights, 0));
  series = series.concat(generateSeries('火车', trains, 1));

  console.log(series);

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
      data:['飞机', '火车'],
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
