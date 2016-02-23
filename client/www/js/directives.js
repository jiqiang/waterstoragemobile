angular.module('watsto.directives', ['watsto.services'])

.directive('ionPercentageBar', function () {
  return {
    link: function (scope, element, attrs) {
      element.find('a').css('opacity', 0.9);
      element
        .append(
          $('<div></div>')
            .css('position', 'absolute')
            .css('top', 0)
            .css('bottom', 0)
            .css('border', 'none')
            .css('background-color', '#0099ff')
            .css('width', attrs.ionPercentageBar + '%')
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
        else if (typeof(chart) === 'undefined' || value[2] === 'dorefresh') {
          options = {
            chart: {
              type: 'spline',
              reflow: true,
              height: Math.floor(element.parent().width() / 1.418),
              animation: false
            },
            title: {
              text: '',
              margin: 0
            },
            xAxis: {
              categories: value[1],
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
            }],
            series: [{
              type: 'spline',
              name: current_year,
              data: value[0]
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
