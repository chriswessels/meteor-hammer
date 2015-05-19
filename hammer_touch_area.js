var defaultHammerInitOptions = {};

function checkGestureMap (gestureMap) {
  if (gestureMap && typeof gestureMap === 'object' && Object.keys(gestureMap).length > 0) {
    return _.every(Object.keys(gestureMap), function (actionString) {
      return !!extractActions(actionString) && typeof gestureMap[actionString] === 'function';
    });
  } else {
    return false;
  }
}
function extractActions (actionString) {
  var output = [];
  function extractSubAction (subActionString) {
    var pieces = subActionString.split(' ');
    if (pieces.length > 1) {
      output.push({
        gestureName: pieces[0],
        elementSelector: pieces.slice(1, pieces.length).join(' ')
      });
      return true;
    } else {
      return false;
    }
  }
  if (actionString.indexOf(',') !== -1) {
    var subActionStrings = actionString.split(',');
    _.each(subActionStrings, function (subActionString) {
      extractSubAction(subActionString.trim());
    });
    if (output.length > 0) {
      return output;
    } else {
      return false;
    }
  } else if (extractSubAction(actionString)) {
    return output;
  } else {
    return false;
  }
}

function handleGestureEvent (templateInstance, gestureName, event) {
  _.each(Object.keys(templateInstance._hammer.gestureHandlers[gestureName]), function (selector, index) {
    var eventElem = $(event.target).get(0);
    if ($(eventElem).is(selector)) {
      templateInstance._hammer.gestureHandlers[gestureName][selector].call(Blaze.getData(eventElem), event);
    } else {
      var done = false;
      _.each($(selector), function(selectorElem, index) {
        if (!done && selectorElem && $.contains(selectorElem, eventElem)) {
          templateInstance._hammer.gestureHandlers[gestureName][selector].call(Blaze.getData(eventElem), event);
          done = true;
        }
      });
    }
  });
  return true;
}

Template.HammerTouchArea.onCreated(function () {
  var templateInstance = this,
      tagOptions = templateInstance.data || {};

  templateInstance._hammer = {
    instanceId: 'touch-' + Random.hexString(6),
    instance: null,
    gestureHandlers: {},
    mergedInitOptions: _.extend({}, defaultHammerInitOptions, tagOptions.initOptions)
  };

  if (tagOptions.gestureMap) {
    if (checkGestureMap(tagOptions.gestureMap)) {
      _.each(tagOptions.gestureMap, function (handler, actionString) {
        var actions = extractActions(actionString);
        _.each(actions, function (action) {
          if (!templateInstance._hammer.gestureHandlers[action.gestureName]) {
            templateInstance._hammer.gestureHandlers[action.gestureName] = {};
          }
          templateInstance._hammer.gestureHandlers[action.gestureName][action.elementSelector] = function (event) {
            return handler.call(this, event, templateInstance);
          };
        });
      });
    }
  }
});

Template.HammerTouchArea.onRendered(function () {
  var templateInstance = this,
      tagOptions = templateInstance.data || {};

  templateInstance._hammer.instance = new Hammer(this.$('#' + this._hammer.instanceId).get(0), this._hammer.mergedInitOptions);
  if (tagOptions.configureCallback) {
    templateInstance._hammer.instance = tagOptions.configureCallback(templateInstance._hammer.instance, templateInstance);
    if (!templateInstance._hammer.instance) {
      console.log('You forgot to return the Hammer.js instance in your configureCallback passed into HammerTouchArea.');
      return;
    }
  }
  _.each(Object.keys(templateInstance._hammer.gestureHandlers), function (gestureName, index) {
    templateInstance._hammer.instance.on(gestureName, _.partial(handleGestureEvent, templateInstance, gestureName));
  });
});

Template.HammerTouchArea.helpers({
  touchAreaId: function () {
    var templateInstance = Template.instance();
    return templateInstance._hammer.instanceId;
  }
});
