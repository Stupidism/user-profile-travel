import mobikeRides from './mobike.json';

export default function() {

  const tags = ['东方航空',
    '国航',
    '北京',
    '上海',
    '深圳',
    '经济舱',
    '国内',
    '普通会员',
    '积分新人',
    '去过6个城市',
    '出行达人',
    '活跃分子',
    '90后',
    'IT行业',
    '性别男'].map((name, index) => {
    const positive = Math.round(Math.random() * 500);
    const negative = Math.round(Math.random() * 300);
    const neutral = Math.round(Math.random() * 200);
    const volume = negative + neutral + positive;

    return {
      id: index,
      label: name,
      volume,
      sentimentScore: (positive * 3 + neutral - negative) / volume * 100,
      sentiment: {
        negative,
        neutral,
        positive,
      },
    }
  });

  const scores = ['总里程', '出行频率', '平均花费', '总花费', '出行范围']
    .map(name => ({ name, value: Math.floor(Math.random() * 6) + 2 }));

  return {
    tags,
    scores,
    flights: [{
      "departureCity": "北京",
      "arrivalCity": "上海",
    }, {
      "departureCity": "上海",
      "arrivalCity": "北京",
    }, {
      "departureCity": "上海",
      "arrivalCity": "兰州",
    }, {
      "departureCity": "兰州",
      "arrivalCity": "上海",
    }, {
      "departureCity": "深圳",
      "arrivalCity": "上海",
    }, {
      "departureCity": "上海",
      "arrivalCity": "深圳",
    }, {
      "departureCity": "三亚",
      "arrivalCity": "上海",
    }, {
      "departureCity": "上海",
      "arrivalCity": "海口",
    }],
    trains: [{
      "platform": "12306",
      "type": "FlightDomestic",
      "departAt": "2017-09-24 17:30:00",
      "arriveAt": "2017-09-24 19:40:00",
      "departureCity": "上海",
      "arrivalCity": "南京",
    }, {
      "departureCity": "北京",
      "arrivalCity": "上海",
    }, {
      "departureCity": "上海",
      "arrivalCity": "北京",
    }, {
      "platform": "12306",
      "type": "FlightDomestic",
      "departAt": "2017-09-24 17:30:00",
      "arriveAt": "2017-09-24 19:40:00",
      "departureCity": "南京",
      "arrivalCity": "上海",
    }],
    rides: mobikeRides.map(ride => ({
      time: ride.data.time,
      points: ride.data.points.split('#').map(point => point.split(',')),
    })),
    drives: [{
      "platform": "携程",
      "type": "Car",
      "time": "2017-09-23 05:00:00",
      "fromAddress": "万科金色城市2期悦庭(北蔡镇御水路150弄万科金色城市二期)",
      "toAddress": "虹桥国际机场T2",
    }],
    pointsDetails: [{
      balance: 888,
    }, {
      balance: 1000,
    }, {
      balance: 178,
    }, {
      balance: 222,
    }]
  };
}