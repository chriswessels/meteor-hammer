# chriswessels:hammer

*You are looking at the `rewrite` branch which is slated for the `4.0.0` release. It features a new, more robust API, and rewritten internals. This document is a work in progress!*

A smart-package for integrating with [Hammer.js](https://github.com/hammerjs/hammer.js) for multi-touch gesture support in your Templates.

## Example Usage

```html
<template name="foo">
  {{#HammerTouchArea gestureMap=templateGestures}}
    <ul>
    {{#each someArray}}
      <li>
        {{someField}}
      </li>
    {{/each}}
    </ul>
  {{/HammerTouchArea}}
</template>
```

```javascript
Template.foo.helpers({
  templateGestures: {
    'swipeleft ul li': function (event, templateInstance) {
      /* `event` is the Hammer.js event object */
      /* `templateInstance` is the `Blaze.TemplateInstance` */
      /* `this` is the data context of the element in your template, so in this case the iteree from someArray in the template */
    }
  }
});
```

## Installation

In your Meteor.js project directory, run

    $ meteor add chriswessels:hammer

## HammerTouchArea in your templates

HammerTouchArea is your interface for enabling multi-touch gestures in your templates.

**TODO Block helper usage explanation**

You will need to pass an object into `HammerTouchArea` via the `gestureMap` property that maps selectors to callbacks.

The API for this object, a gesture map, is identical to the event map that you pass into `Template.foo.events`. The object keys should follow the format `gestureName cssSelector` (or multiple strings in this format separated by a comma, e.g. `tap .foo, swiperight .bar`) and the value should be a callback function that is executed when the specified gestures are performed on the element(s) matching the CSS selector(s). Example:

```javascript
{
  'swiperight .foo .bar': function (event, templateInstance) {
    /* `event` is the Hammer.js event object */
    /* `templateInstance` is the `Blaze.TemplateInstance` */
    /* `this` is the data context of the element in your template */
  },
  'doubletap .foo .baz, swipeup .goo': function (event, templateInstance) {
    /* ... */
  }
}
```

The callback function you specify will be passed two arguments: the event object provided by Hammer.js and the `Blaze.TemplateInstance` for your template.

The `this` context of the callback function will be set to the data context of the matching element in your template.

## Configuring Hammer.js

1. You can pass an options object into `HammerTouchArea` for Hammer.js. See below.
1. You can do arbitrary configuration on the `Hammer.Manager` instance in a callback. See below.

### Initialisation Options

There are certain options for Hammer.js that must be set upon object initialisation, for example, [cssProps](http://hammerjs.github.io/jsdoc/Hammer.defaults.cssProps.html). chriswessels:hammer allows you to specify a configuration object that is passed into `Hammer.Manager` when it is initialised. This is done with the `initOptions` property on `HammerTouchArea`. In the parent template, create a helper that returns your options object, and then pass this into `initOptions` in your `HammerTouchArea` inclusion.

#### Example:

In this example, we set `cssProps` to allow text selection in the browser.

```html
<template name="bar">
  {{#HammerTouchArea initOptions=hammerInitOptions gestureMap=templateGestures}}
    <!-- Your HTML that is matched against `templateGestures` -->
  {{/HammerTouchArea}}
</template>
```

```javascript
Template.bar.helpers({
  hammerInitOptions: {
    cssProps: { userSelect: 'all' }
  },
  templateGestures: {
    /* Object mapping selectors to gesture callbacks, see above for example */
  }
});
```

### Configuration Callback

You can do arbitrary configuration on the `Hammer.Manager` instance by specifying a callback. This callback will be passed two arguments:

1. The `Hammer.Manager` instance for that `HammerTouchArea`.
1. The `Blaze.TemplateInstance` for your template if you need to access its state.

Your callback should return the `Hammer.Manager` instance. If it does not do this, a warning will be logged to the console and that instance of `HammerTouchArea` will not be active.

This callback is where you should register attach additional `Hammer.Recognizer`s to that Hammer.js instance.

Using this callback is done with the `configureCallback` property on `HammerTouchArea`. In the parent template, create a helper that returns your a callback function (a function that returns a function), and then pass this into `configureCallback` in your `HammerTouchArea` inclusion.

#### Example:

In this example, we instantiate a new `Hammer.Swipe` recognizer that matches two-finger swipes, and we attach it to the `Hammer.Manager` instance. Note that we return the `hammer` object. We can now also match against two finger swipes in `templateGestures`.

```html
<template name="baz">
  {{#HammerTouchArea configureCallback=configureHammer gestureMap=templateGestures}}
    <!-- Your HTML that is matched against `templateGestures` -->
  {{/HammerTouchArea}}
</template>
```

```javascript
Template.baz.helpers({
  configureHammer: function () {
    return function (hammer, templateInstance) {
      var twoFingerSwipe = new Hammer.Swipe({
        event: '2fingerswipe', /* prefix for custom swipe events, e.g. 2fingerswipeleft, 2fingerswiperight */
        pointers: 2,
        velocity: 0.5
      });
      hammer.add(twoFingerSwipe);
      return hammer;
    }
  },
  templateGestures: {
    '2fingerswiperight ul li': function (event, templateInstance) {
      /* `event` is the Hammer.js event object */
      /* `templateInstance` is the `Blaze.TemplateInstance` */
      /* `this` is the data context of the element in your template */
    },
    'doubletap ul li': function (event, templateInstance) {
      /* ... */
    }
  }
});
```

## How it works

**TODO Explain how `HammerTouchArea` === `instanceof Hammer.Manager`.**

## License

Please see the `LICENSE` file for more information.
