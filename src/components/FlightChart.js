import React from 'react';
import _ from 'lodash';
import { compose, withHandlers } from 'recompose';

import ReactEcharts from 'echarts-for-react';
import 'echarts/map/js/china.js';
import 'echarts-liquidfill';

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

const getOption = ({ flights, trains, pointsDetails }) => () => {
  let series = [{
    min:0,
    max:5000,
    splitNumber: 5,
    axisLabel: {            // 坐标轴小标记
      textStyle: {       // 属性lineStyle控制线条样式
        fontWeight: 'bolder',
        color: '#fff',
        shadowColor : '#fff', //默认透明
        shadowBlur: 10
      }
    },
    axisTick: {            // 坐标轴小标记
      length :15,        // 属性length控制线长
      lineStyle: {       // 属性lineStyle控制线条样式
        color: 'auto',
        shadowColor : '#fff', //默认透明
        shadowBlur: 10
      }
    },
    splitLine: {           // 分隔线
      length :25,         // 属性length控制线长
      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
        width:3,
        color: '#fff',
        shadowColor : '#fff', //默认透明
        shadowBlur: 10
      }
    },
    pointer: {           // 分隔线
      shadowColor : '#fff', //默认透明
      shadowBlur: 5
    },
    title : {
      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'bolder',
        fontSize: 20,
        color: '#fff',
        shadowColor : '#fff', //默认透明
        shadowBlur: 10
      }
    },
    detail : {
      backgroundColor: 'rgba(30,144,255,0.8)',
      borderWidth: 1,
      borderColor: '#fff',
      shadowColor : '#fff', //默认透明
      shadowBlur: 5,
      offsetCenter: [0, '50%'],       // x, y，单位px
      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'bolder',
        color: '#fff'
      }
    },
    name: '用户积分',
    type: 'gauge',
    center: [180, 650],
    radius: 150,
    axisLine: {
      lineStyle: {
        color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
        width: 3,
        shadowColor : '#fff', //默认透明
        shadowBlur: 10
      }
    },
    data: [{value: _.sum(_.map(pointsDetails, 'balance')), name: '积分', label: { normal: { color: 'white' } }}]
  }];
  console.log(pointsDetails, _.map(pointsDetails, 'balance'));
  series = series.concat(generateSeries('飞机', flights, 0));
  series = series.concat(generateSeries('火车', trains, 1));

  return {
    title: {
      text: '国内航程轨迹',
      textStyle: {
        color: 'white',
      },
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
