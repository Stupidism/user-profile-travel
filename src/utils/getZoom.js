import 'echarts/extension/bmap/bmap';

function getDistance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lng1) - toRadians(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;

  function toRadians(d) {  return d * Math.PI / 180;}
}

export default function getZoom (maxLng, minLng, maxLat, minLat) {
  var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。

  var distance = getDistance(minLat, minLng, maxLat, maxLng);
  for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {
    if(zoom[i] - distance > 0){
      return 18-i+3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
    }
  };
}