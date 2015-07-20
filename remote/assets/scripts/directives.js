module.exports = function(application) {
  'use strict';

  application
    .directive('stopPropagation', function () {
      return {
        restrict : 'A',
        link : function (scope, element, attr) {
          element.bind(attr.stopPropagation, function (e) {
            e.stopPropagation();
          });
        }
      };
    })
    .directive('preventDefault', function () {
      return {
        restrict : 'A',
        link : function (scope, element, attr) {
          element.bind(attr.preventDefault, function (e) {
            e.preventDefault();
          });
        }
      };
    })
    .directive('autofocus', ['$timeout', function($timeout) {
      return {
        restrict : 'A',
        link : function(scope, elements) {
          $timeout(function() {
            elements[0].focus();
          }, 0);
        }
      };
    }])
    .directive('heatmap', function() {
      return {
        restrict : 'A',
        scope : { getData : '&heatmap' },
        link : function (scope, elements, attr) {
          var
            target = elements[0],
            heat,
            animationFrame,
            radius,
            blur,
            render = function() {
              heat.draw();
              animationFrame = null;
            },
            adjust = function() {
              if (!radius || !blur) { return; }
              heat.radius(+radius, +blur);
              animationFrame = animationFrame || window.requestAnimationFrame(render);
            },
            updatedData = function(data) {
              heat.data(data.accumulated).max(data.accumulated_depth > 1 ? data.accumulated_depth : 2);
              adjust();
            };

          scope.$watch('getData().active', function(data) {
            target.setAttribute('width', data.screen_width);
            target.setAttribute('height', data.screen_height);
            heat = simpleheat(target);
            updatedData(data);
          });
          scope.$watch('getData().config.radius', function(newRadius) {
            radius = newRadius;
            adjust();
          });
          scope.$watch('getData().config.blur', function(newBlur) {
            blur = newBlur;
            adjust();
          });
        }
      };
    });
};