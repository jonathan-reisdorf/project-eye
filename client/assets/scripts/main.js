'use strict';

var $ = require('jquery');

$(function() {
  var steps = {
    testData : {},
    items : {
      calibrate : function() {
        $.get('//localhost:7777/tools/calibrate');
        // @todo: un-hardcode this
        window.setTimeout(function() {
          steps.next();
        }, 10000);
      },
      user : function($container) {
        $container.find('input').off('keydown keyup change').on('keydown keyup change', function(e) {
          $(this).siblings('button').attr('disabled', !$(this).val());
        });

        $container.find('form').off('submit').on('submit', function(e) {
          e.preventDefault();
          $(this).find('button').click();
        });
      },
      prepare : function($container) {
        $container.find('button').off('click').on('click', function() {
          var frame = $('#test_frame').get(0);

          if (frame.requestFullscreen) {
            frame.requestFullscreen();
          } else if (frame.msRequestFullscreen) {
            frame.msRequestFullscreen();
          } else if (frame.mozRequestFullScreen) {
            frame.mozRequestFullScreen();
          } else if (frame.webkitRequestFullscreen) {
            frame.webkitRequestFullscreen();
          }
        });
      },
      start : function() {
        $(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange').on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
          var isFullScreen = document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
          if (!isFullScreen) {
            steps.next('exit');
          }
        });
      }
    },
    current : 'user',
    queue : ['welcome', 'calibrate', 'user', 'prepare', 'start', 'exit'],
    init : function() {
      steps.next(steps.current);

      $('body').on('click', '[data-action="next"]', function() {
        if ($(this).is(':disabled')) { return; }
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