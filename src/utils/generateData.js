import _ from 'lodash';

export default function() {

  const tags = _.fill(Array(50), 0).map((v, index) => {
    const positive = Math.round(Math.random() * 500);
    const negative = Math.round(Math.random() * 300);
    const neutral = Math.round(Math.random() * 200);
    const volume = negative + neutral + positive;

    return {
      id: index,
      label: `话题${index}`,
      volume,
      sentimentScore: (positive * 3 + neutral - negative) / volume * 100,
      sentiment: {
        negative,
        neutral,
        positive,
      },
    }
  });

  return {
    tags,
    flights: [{
      "platform": "携程",
      "type": "FlightDomestic",
      "departAt": "2017-09-24 17:30:00",
      "arriveAt": "2017-09-24 19:40:00",
      "departureCity": "北京",
      "arrivalCity": "上海",
    }],
    rides: [{
      "platform": "摩拜",
      "time": 1500548372200,
      "points": [
        [121.604366,31.179999],
        [121.604325,31.180024],
        [121.60425,31.180005],
        [121.604202,31.179984],
        [121.604154,31.179959],
        [121.604086,31.179941],
      ]
    }],
    drives: [{
      "platform": "携程",
      "type": "Car",
      "time": "2017-09-23 05:00:00",
      "fromAddress": "万科金色城市2期悦庭(北蔡镇御水路150弄万科金色城市二期)",
      "toAddress": "虹桥国际机场T2",
    }],
  };
}