'use strict';

var $ = require('jquery'),
  server = '//localhost:7777/';
  // @todo: un-hardcode this

$(function() {
  var steps = {
    testData : {},
    items : {
      index : function($container) {
        $.get(server + 'tests', function(tests) {
          var $select = $container.find('select');
          $.each(tests, function() {
            $select.append('<option value="' + this._id + '">' + this.name + '</option>');
          });

          $select.on('change', function() {
            document.location.href = '/test/' + $(this).val();
          });
        });
      },
      welcome : function($container) {
        var urlParts = document.location.href.split('/');
        var testId = urlParts[urlParts.length - 1];

        $.get(server + 'tests/' + testId, function(test) {
          steps.testData = test;
          $container.find('.text').html(test.description);
        });
      },
      calibrate : function() {
        $.get(server + 'tools/calibrate');
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
        $.post(server + 'users', {
          name : $('#user_name').val(),
          test_id : steps.testData._id,
          is_running : true,
          last_page_url : steps.testData.url
        }, function(data) {
          if (data._id) {
            steps.testData.userId = data._id;
          } else {
            window.alert('Something went wrong here :/ Reloading the test...');
            return document.location.reload();
          }

          $('#test_frame').attr('src', steps.testData.url);
          $container.find('.text').html(steps.testData.intro);

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
    current : $('[data-step-initial]').data('step-initial') || 'welcome',
    queue : ['index', 'welcome', 'calibrate', 'user', 'prepare', 'start', 'exit'],
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