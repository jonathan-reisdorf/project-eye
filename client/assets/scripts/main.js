'use strict';

var $ = require('jquery');

$(function() {
  var steps = {
    items : {
      calibrate : function() {
        $.get('//localhost:7777/tools/calibrate');
        // @todo: un-hardcode this
        window.setTimeout(function() {
          steps.next();
        }, 10000);
      }
    },
    current : 'welcome',
    queue : ['welcome', 'calibrate', 'user', 'prepare', 'start', 'exit'],
    init : function() {
      steps.next(steps.current);

      $('body').on('click', '[data-action="next"]', function() {
        steps.next();
      });
    },
    apply : function(step) {
      this.current = step;
      var $container = $('.step').hide().filter('[data-step="' + this.current + '"]').show();
      (this.items[this.current] || function(){})($container);
    },
    next : function(step) {
      step = step || this.queue[this.queue.indexOf(this.current) + 1];
      this.apply(step);
    }
  };

  steps.init();
});