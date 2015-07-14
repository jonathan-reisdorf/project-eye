var _hardware = require('./_hardware'),
    _control  = require('./_control')(_hardware),
    _tests    = require('./_tests')(_control),
    _events   = require('./_events')(_control, _tests);