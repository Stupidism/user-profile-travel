import React from 'react';
import _ from 'lodash';
import { compose, withHandlers } from 'recompose';

import ReactEcharts from 'echarts-for-react';
import 'echarts/extension/bmap/bmap';

import getCoordinatesByCityName from '../utils/getCoordinatesByCityName';
import calcSuitableZoom from '../utils/getZoom';
import { bikePath } from '../constants';

const RelationGraph = ({ getOption }) => (
  <ReactEcharts
    option={getOption()}
    style={{ height: '800px', width: '100%' }}
    notMerge={true}
    lazyUpdate={true}
    theme={"theme_name"}
  />
);


const getOption = ({ rides, city }) => () => {
  let maxLng, minLng, maxLat, minLat;

  const generateSeries = (name, paths) => {
    const data = paths.map(({ points }) => points.map(([lng, lat]) => {
      return [Number(lng) + 0.006557, Number(lat) + 0.005740];
    }));

    data.forEach((path) => path.forEach(([lng, lat]) => {
      if (!maxLat || maxLat < lat) {
        maxLat = lat;
      }
      if (!minLat || minLat > lat) {
        minLat = lat;
      }
      if (!maxLng || maxLng < lng) {
        maxLng = lng;
      }
      if (!minLng || minLng > lng) {
        minLng = lng;
      }
    }));

    return [{
      name,
      type: 'lines',
      coordinateSystem: 'bmap',
      polyline: true,
      data,
      silent: true,
      lineStyle: {
        normal: {
          // color: '#c23531',
          // color: 'rgb(200, 35, 45)',
          opacity: 0.4,
          width: 3
        }
      },
      progressiveThreshold: 500,
      progressive: 200
    }, {
      name,
      type: 'lines',
      coordinateSystem: 'bmap',
      polyline: true,
      data,
      lineStyle: {
        normal: {
          width: 0
        }
      },
      effect: {
        constantSpeed: 20,
        show: true,
        trailLength: 0,
        symbol: bikePath,
        symbolSize: 15
      },
      zlevel: 1
    }]
  };

  let series = [];
  series = series.concat(generateSeries('单车', rides, 0));

  const center = maxLng ? [(maxLng + minLng) / 2, (maxLat + minLat) / 2] : getCoordinatesByCityName(city);
  const zoom = maxLng ? calcSuitableZoom(maxLng, minLng, maxLat, minLat) : 11;

  return {
    title: {
      text: '市内出行轨迹',
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
    bmap: {
      center,
      zoom,
      roam: true,
      mapStyle: {
        styleJson: [
          {
            'featureType': 'railway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'subway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
        ]
      }
    },
    series,
  };
};

export default compose(
  withHandlers({ getOption }),
)(RelationGraph);
