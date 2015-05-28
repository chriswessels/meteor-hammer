var defaultHammerInitOptions = {};

// Ripped from https://github.com/aldeed/meteor-template-extension/blob/master/template-extension.js
// Access parent template instance. "height" is the number of levels beyond the
// current template instance to look. By default block helper template instances
// are skipped, but if "includeBlockHelpers" is set to true, they are not.
// See https://github.com/meteor/meteor/issues/3071
function getParentTemplateInstance (currentInstance, height, includeBlockHelpers) {
  function parentView(view, includeBlockHelpers) {
    if (includeBlockHelpers) {
      return view.originalParentView || view.parentView;
    }
    else {
      return view.parentView;
    }
  }

  // If height is null or undefined, we default to 1, the first parent.
  if (height == null) {
    height = 1;
  }

  var i = 0;
  var template = currentInstance;
  while (i < height && template) {
    var view = parentView(template.view, includeBlockHelpers);
    // We skip contentBlock views which are injected by Meteor when using
    // block helpers (in addition to block helper view). This matches more
    // the visual structure of templates and not the internal implementation.
    while (view && (!view.template || view.name === '(contentBlock)' || view.name === '(elseBlock)')) {
      view = parentView(view, includeBlockHelpers);
    }
    if (!view) {
      return null;
    }
    // Body view has template field, but not templateInstance,
    // which more or less signals that we reached the top.
    template = typeof view.templateInstance === 'function' ? view.templateInstance() : null;
    i++;
  }
  return template;
}

// Return boolean as to whether the provided gesture map is valid or not
function checkGestureMap (gestureMap) {
  if (gestureMap && typeof gestureMap === 'object' && Object.keys(gestureMap).length > 0) {
    return _.every(Object.keys(gestureMap), function (actionString) {
      return !!extractActions(actionString) && typeof gestureMap[actionString] === 'function';
    });
  } else {
    return false;
  }
}
// Extract an array of actions, where an action is defined as an object containing
// the gesture name and CSS-based element selector
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

// Fire the necessary user-defined callbacks when Hammer.js fires associated gesture events
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

// Basic setup on template creation
// Add _hammer object to template instance, containing a unique selector ID,
// merged initialisation options (defaults + HammerTouchArea.initOptions),
// and an object of gesture handlers, grouped by gesture event (for handling by handleGestureEvent function)
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
            return handler.call(this, event, getParentTemplateInstance(templateInstance, 1, false));
          };
        });
      });
    }
  } else {
    console.warn('You haven\'t passed a gesture map into HammerTouchArea using gestureMap property.')
  }
});

// Initialise Hammer.js instance on template on render (and re-render)
// Attach event handlers to Hammer.js instance for registered gesture events
Template.HammerTouchArea.onRendered(function () {
  var templateInstance = this,
      tagOptions = templateInstance.data || {};

  templateInstance._hammer.instance = new Hammer(this.$('#' + this._hammer.instanceId).get(0), this._hammer.mergedInitOptions);
  if (tagOptions.configureCallback) {
    templateInstance._hammer.instance = tagOptions.configureCallback(templateInstance._hammer.instance, getParentTemplateInstance(templateInstance, 1, false));
    if (!templateInstance._hammer.instance) {
      console.warn('You forgot to return the Hammer.js instance in your configureCallback passed into HammerTouchArea.');
      return;
    }
  }
  _.each(Object.keys(templateInstance._hammer.gestureHandlers), function (gestureName, index) {
    templateInstance._hammer.instance.on(gestureName, _.partial(handleGestureEvent, templateInstance, gestureName));
  });
});

// Destroy Hammer.js instance on template teardown
Template.HammerTouchArea.onDestroyed(function () {
  this._hammer.instance && this._hammer.instance.destroy();
});

Template.HammerTouchArea.helpers({
  touchAreaId: function () {
    var templateInstance = Template.instance();
    return templateInstance._hammer.instanceId;
  }
});
