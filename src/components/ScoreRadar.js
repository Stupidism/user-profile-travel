import React from 'react';
import { compose, withHandlers } from 'recompose';

import ReactEcharts from 'echarts-for-react';

const RelationGraph = ({ getOption }) => (
  <div style={{ padding: 10 }}>
    <ReactEcharts
      option={getOption()}
      style={{ height: '800px', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
    />
  </div>
);

const getOption = ({ level, scores }) => () => {
  return {
    title: {
      text: `用户评分`
    },
    tooltip: {},
    radar: {
      // shape: 'circle',
      name: {
        textStyle: {
          color: '#fff',
          backgroundColor: '#999',
          borderRadius: 3,
          padding: [3, 5]
        }
      },
      splitNumber: 8,
      indicator: scores.map(({ name }) => ({ name, max: 8 })),
    },
    series: [{
      type: 'radar',
      // areaStyle: {normal: {}},
      data : [
        {
          value : scores.map(({ value }) => value),
        }
      ],
      areaStyle: {
        normal: {
          opacity: 0.1
        }
      }
    }]
  };
};

export default compose(
  withHandlers({ getOption }),
)(RelationGraph);
