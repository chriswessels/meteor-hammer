var gestureHandlers = {};

function getTopSelector (element) {
    var path = element.parents().addBack();
    var quickCss = path.get().map(function (item) {
        var self = $(item),
            id = item.id ? '#' + item.id : '',
            clss = item.classList.length ? item.classList.toString().split(' ').map(function (c) {
                return '.' + c;
            }).join('') : '',
            name = item.nodeName.toLowerCase(),
            index = self.siblings(name).length ? ':nth-child(' + (self.index() + 1) + ')' : '';

        if (name === 'html' || name === 'body') {
            return name;
        }
        return name + index + id + clss;

    }).join(' > ');

    return quickCss;
};

function checkGestureMap (gestureMap) {
  if (gestureMap && typeof gestureMap === 'object' && Object.keys(gestureMap).length > 0) {
    return _.every(Object.keys(gestureMap), function (actionString) {
      return !!extractAction(actionString) && typeof gestureMap[actionString] === 'function';
    });
  } else {
    return false;
  }
}
function extractAction (actionString) {
  var pieces = actionString.split(' ');
  if (pieces.length > 1) {
    return {
      gestureName: pieces[0],
      elementSelector: pieces.slice(1, pieces.length).join(' ')
    };
  } else {
    return false;
  }
}
function handleGestureEvent (gestureName, event) {
  _.each(Object.keys(gestureHandlers[gestureName]), function (selector, index) {
    _.each($(selector), function(selectorElem, index) {
      var eventElem = $(event.target).get(0);

      if (selectorElem && ($(eventElem).is(selector) || $.contains(selectorElem, eventElem))) {
          gestureHandlers[gestureName][selector].call(Blaze.getData(eventElem), event);
      }
    });
  });
  return true;
}
function setupTemplateGestures () {
  var templateInstance = this,
      template = templateInstance.view.template;

  if (checkGestureMap(template._gestures)) {
    _.each(template._gestures, function (handler, actionString) {
      var action = extractAction(actionString),
          fullSelector = getTopSelector(templateInstance.$(action.elementSelector).parent()) + ' ' + action.elementSelector;


      /* Keep track of gesture handlers specific to this template instance */
      if (!templateInstance._activeGestureHandlers) {
        templateInstance._activeGestureHandlers = [];
      }
      templateInstance._activeGestureHandlers.push([action.gestureName, fullSelector]);

      if (!gestureHandlers[action.gestureName]) {
        gestureHandlers[action.gestureName] = {};
        $('body').data('hammer').on(action.gestureName, _.partial(handleGestureEvent, action.gestureName));
      }
      gestureHandlers[action.gestureName][fullSelector] = function (event) {
        return handler.call(this, event, templateInstance);
      }
    });
  }
}
function teardownTemplateGestures () {
  var templateInstance = this,
    template = templateInstance.view.template;

  if (templateInstance._activeGestureHandlers) {
    _.each(templateInstance._activeGestureHandlers, function (val, index) {
      var gestureName = val[0],
          handlerId = val[1];

      /* Clean up active gesture handlers for current template instance */
      gestureHandlers[gestureName][handlerId] = null;
      delete gestureHandlers[gestureName][handlerId];
      if (Object.keys(gestureHandlers[gestureName]) === 0) {
        gestureHandlers[gestureName] = null;
        delete gestureHandlers[gestureName];
      }
    });
    templateInstance._activeGestureHandlers = null;
  }
}
Template.prototype.hammerOptions = function (hammerOptions) {
  console.log('Template.templateName.hammerOptions has been deprecated! Please use $("body").data("hammer").set({ /* Options */}) instead, but note these options are application-wide! Your call has been proxied and your options set, but please update your code!');
  Meteor.startup(function () {
    $('body').data('hammer').set(hammerOptions);
  });
}
Template.prototype.gestures = function (gestureMap) {
  if (checkGestureMap(gestureMap)) {
    this._gestures = gestureMap;
  }
}
Meteor.startup(function () {
  $('body').hammer({});
  Template.onRendered(setupTemplateGestures);
  Template.onDestroyed(teardownTemplateGestures);
});
