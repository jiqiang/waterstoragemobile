angular.module('watsto.directives', [])

.directive('ionHighcharts', function () {
  return {
    restrict: 'E',
    transclude: false,
    replace: false,
    scope: {timeline: '='},
    link: function (scope, element, attrs) {
      var parentWidth = element.parent().width();
      element.highcharts({
        chart: {
          type: 'column',
          reflow: true,
          width: parentWidth,
          height: Math.floor(parentWidth / 1.618)
        },
        title: {
          text: '',
          margin: 0
        },
        xAxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ],
          crosshair: false
        },
        yAxis: [{
          min: 0,
          title: {
            text: '',
            margin: 0
          }
        }, {
          min: 0,
          title: {
            text: '',
            margin: 0
          }
        }],
        series: [{
          type: 'column',
          name: 'Berlin',
          data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
        }, {
          type: 'spline',
          name: 'Nanjing',
          data: [22.4, 33.2, 25.5, 93.7, 25.6, 57.5, 75.4, 16.4, 74.6, 93.1, 64.8, 15.1]
        }],
        credits: {enabled: false},
        exporting: {enabled: false},
        legend: {enabled: false}
      });
    }
  };
});
