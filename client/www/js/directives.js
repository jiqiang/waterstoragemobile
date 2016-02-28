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
/*
.directive('ionBomBranding', function() {
  return {
    restrict: 'E',
    replace: true,
    template: "<div class='branding'></div>",
    link: function (scope, element, attrs) {
      var footerImg = angular
        .element("<img src='img/footer-logo.png' alt=''>")
        .css('width', 37)
        .css('height', 27)
        .css('margin-right', 10)
        .css('vertical-align', 'middle');

      var footerText = angular
        .element("<span>Australian Government</span> <span>Bureau of Meteorology</span>")

      element
        .css('margin-top', 40)
        .css('border-top', '1px #000 solid')
        .css('padding', '10px 20px')
        .css('font-size', 10)
        .css('background-color', '#ecf0f1')
        .css('text-align', 'center')
        .append(footerImg)
        .append(footerText);
    }
  };
})
*/
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
              height: Math.floor(element.parent().width() / 1.618),
              animation: false
            },
            title: {
              text: 'Percentage % Full in last 18 months',
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
            tooltip: {enabled: false},
            legend: {enabled: false},
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
