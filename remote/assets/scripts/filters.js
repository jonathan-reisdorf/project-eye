module.exports = function(application) {
  'use strict';

  application
    .filter('rawHtml', ['$sce', function($sce) {
      return function(val) {
        return $sce.trustAsHtml(val);
      };
    }])
    .filter('rawSrc', ['$sce', function($sce) {
      return function(val) {
        return $sce.trustAsResourceUrl(val);
      };
    }]);
};