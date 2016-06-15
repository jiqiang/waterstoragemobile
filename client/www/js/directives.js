angular.module('watsto.directives', ['watsto.services'])

.directive('waterStorageSummary', function () {
  var directiveDefinitionObject = {
    restrict: 'AE',
    transclude: false,
    replace: true,
    templateUrl: 'templates/water-storage-summary.html',
    scope: true,
    link: function (scope, element, attrs) {

    }
  };
  return directiveDefinitionObject;
})

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
    template: "<div style='text-align: center;'><h3>{{chartMessage}}</h3></div>",
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
          var options = getOptions(scope.data);
          options.chart.width = element.parent().width();
          options.chart.height = Math.floor(element.parent().width() / 1.418);
          element.highcharts(options);
        }
      });

      function getOptions(value) {
        return {
          chart: {
            type: 'area',
            reflow: true,
            height: Math.floor(element.parent().width() / 1.618),
            animation: false,
            backgroundColor: '#2c3e50'
          },
          title: {
            text: 'WATER STORAGE CAPACITY (% FULL)',
            style: {
              "fontSize": "12px",
              color: '#a3c0dd'
            },
            margin: 10
          },
          xAxis: {
            categories: value[1],
            crosshair: false,
            labels: {
              style: {
                "fontSize": "12px",
                color: '#a3c0dd'
              }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
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
              style: {
                "fontSize": "12px",
                color: '#a3c0dd'
              }
            },
            gridLineWidth: 1,
            gridLineColor: '#707073',
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            lineWidth: 1
          }],
          series: [{
            type: 'area',
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
            area: {
              marker: {
                enabled: false
              }
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
