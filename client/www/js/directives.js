angular.module('watsto.directives', ['watsto.services'])

.directive('ionPercentageBar', function () {
  return {
    restrict: 'AE',
    transclude: false,
    replace: false,
    scope: {percentage: "="},
    link: function (scope, element, attrs) {
      var height = 3;

      element
        .append(
          $("<div></div>")
          .css('height', height)
          .css('background-color', '#cccccc')
          .css('margin-top', 10)
          .append(
            $("<div></div>")
            .css('height', height)
            .css('width', scope.percentage + '%')
            .css('background-color', '#0099ff')
          )
        );
    }
  };
})

.directive('ionHighcharts', function ($window, ChartDataService, ConfigService) {
  return {
    restrict: 'AE',
    transclude: false,
    replace: true,
    template: "<div style='text-align: center; margin: 10px;'><h3>{{chartMessage}}</h3></div>",
    link: function (scope, element, attrs) {
      var current_year = new Date().getFullYear(),
          last_year = current_year - 1,
          last_year_before = current_year - 2,
          options = {},
          chart;

      scope.chartMessage = "Loading chart data...";

      angular.element($window).bind('resize', function() {
        if (element.highcharts()) {
          element.highcharts().destroy();
          options.chart.width = element.parent().width();
          options.chart.height = Math.floor(element.parent().width() / 1.418);
          element.highcharts(options);
        }
      });

      scope.$on('viewisready', function (event, value) {
        if (value.length === 0) {
          scope.chartMessage = "No chart data";
        }
        else if (typeof(chart) === 'undefined' || value[3] === 'dorefresh') {
          options = {
            chart: {
              type: 'column',
              reflow: true,
              //width: element.parent().width(),
              height: Math.floor(element.parent().width() / 1.418),
              animation: false,
              events: {
                click: function(e) {

                },
                selection: function(e) {

                }
              }
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
                text: 'Percentage % Full',
                margin: 0,
                style: {"fontSize": "10px"}
              },
              labels: {
                format: '{value}%',
                style: {"fontSize": "10px"}
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
              data: value[0]
              //data: ChartDataService.random()
            }, {
              type: 'spline',
              name: last_year,
              data: value[1]
              //data: ChartDataService.random()
            }, {
              type: 'spline',
              name: last_year_before,
              data: value[2]
              //data: ChartDataService.random()
            }],
            credits: {enabled: false},
            exporting: {enabled: false},
            tooltip: {enabled: false},
            plotOptions: {
              column: {
                animation: false,
                allowPointSelect: false,
                events: {
                  legendItemClick: function() {
                    return false;
                  }
                }
              },
              spline: {
                animation: false,
                allowPointSelect: false,
                events: {
                  legendItemClick: function() {
                    return false;
                  }
                }
              }
            }
          };

          //chart = element.highcharts(options);
          chart = new Highcharts.Chart(element[0], options);
          chart.container.onclick = null;
          chart.container.onmousemove = null;
          chart.container.onmousedown = null;
        }
      });
    }
  };
});
