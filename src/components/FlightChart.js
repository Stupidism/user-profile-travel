import React from 'react';
import { compose, withHandlers } from 'recompose';

import ReactEcharts from 'echarts-for-react';
import 'echarts/map/js/china.js';

import getCoordinatesByCityName from '../utils/getCoordinatesByCityName';

const RelationGraph = ({ getOption }) => (
  <ReactEcharts
    option={getOption()}
    style={{ height: '800px', width: '100%' }}
    notMerge={true}
    lazyUpdate={true}
    theme={"theme_name"}
  />
);

const getOption = ({ level, scores = [] }) => () => {

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
      left: 'left',
      data:['飞机', '火车'],
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
    series: [{
      name: '飞机',
      type: 'map',
      mapType: 'china',
      roam: false,
      label: {
        normal: {
          show: true
        },
        emphasis: {
          show: true
        },
      },
      data: [],
    }],
  };
};

export default compose(
  withHandlers({ getOption }),
)(RelationGraph);
