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
    scope: {data: '='},
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

      function getOptions(value) {
        return {
          chart: {
            type: 'spline',
            reflow: true,
            height: Math.floor(element.parent().width() / 1.618),
            animation: false
          },
          title: {
            text: 'WATER STORAGE CAPACITY (% FULL)',
            style: {"fontSize": "10px"},
            margin: 10
          },
          xAxis: {
            categories: value[1],
            crosshair: false,
            labels: {
              style: {"fontSize": "8px"}
            },
            gridLineWidth: 1,
            lineColor: '#000000',
            lineWidth: 1
          },
          yAxis: [{
            min: 0,
            max: 100,
            title: {
              text: '',
              margin: 0,
              style: {"fontSize": "8px"}
            },
            labels: {
              format: '{value}%',
              style: {"fontSize": "8px"}
            },
            gridLineWidth: 1,
            lineColor: '#000000',
            lineWidth: 1
          }],
          series: [{
            type: 'spline',
            name: current_year,
            data: value[0]
            //data: ChartDataService.random()
          }],
          credits: {enabled: false},
          exporting: {enabled: false},
          tooltip: {
            enabled: true,
            headerFormat: '',
            pointFormat: '{point.y:.2f} %'
          },
          legend: {enabled: false},
          plotOptions: {
            spline: {
              animation: false,
              allowPointSelect: true
            }
          }
        };
      }

      chart = new Highcharts.Chart(element[0], getOptions(scope.data));
      //chart.container.onclick = null;
      //chart.container.onmousemove = null;
      //chart.container.onmousedown = null;

      scope.$watch("data", function (newValue, oldValue) {
        chart = new Highcharts.Chart(element[0], getOptions(scope.data));
      });
    }
  };
});
