var _hardware = require('./_hardware'),
    _control  = require('./_control')(_hardware),
    _tests    = require('./_tests')(_control),
    _heatmaps = require('./_heatmaps')(_control, _tests),
    _events   = require('./_events')(_control, _tests, _heatmaps);