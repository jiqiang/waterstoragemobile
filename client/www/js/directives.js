angular.module('watsto.directives', ['watsto.services'])

.directive('ionHighcharts', function (ChartDataService, ConfigService) {
  return {
    restrict: 'AE',
    transclude: false,
    replace: false,
    scope: {},
    template: "<div style='text-align: center; margin: 5px;'><ion-spinner></ion-spinner><h5>loading chart...</h5></div>",
    link: function (scope, element, attrs) {
      scope.$on('viewisready', function (event, value) {
        ChartDataService.fetch(value.grouptype, value.groupvalue).then(function (response) {
        var timeline = response.data;
        var parentWidth = element.parent().width(),
                current_year = new Date().getFullYear(),
                last_year = current_year - 1,
                last_year_before = current_year - 2;
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
                max: 100,
                title: {
                  text: 'Proportion Full',
                  margin: 0
                },
                labels: {
                  format: '{value}%'
                }
              }, {
                min: 0,
                title: {
                  text: '',
                  margin: 0
                }
              } , {
                min: 0,
                title: {
                  text: '',
                  margin: 0
                }
              }],
              series: [{
                type: 'column',
                name: current_year,
                //data: timeline[current_year].proportions
                data: ChartDataService.random()
              }, {
                type: 'spline',
                name: last_year,
                //data: timeline[last_year].proportions
                data: ChartDataService.random()
              }, {
                type: 'spline',
                name: last_year_before,
                //data: timeline[last_year_before].proportions
                data: ChartDataService.random()
              }],
              credits: {enabled: false},
              exporting: {enabled: false}
            });

      });
      });
    }
  };
});
