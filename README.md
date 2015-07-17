# chriswessels:hammer

A smart-package for integrating with [Hammer.js](https://github.com/hammerjs/hammer.js) for multi-touch gesture support in your Templates.

Out of the box it supports Panning, Pinching, (Long) Pressing, Rotating, Swiping and Tapping. You can also register and use custom compound gestures.

## Basic Usage

```html
<template name="foo">
  {{#HammerTouchArea gestureMap=templateGestures}}
    <ul>
    {{#each someArray}}
      <li>{{someField}}</li>
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
      /* `this` is the data context of the element in your template, so in this case `someField` from `someArray` in the template */
    }
  }
});
```

See below for extended instructions.

## Installation

In your Meteor.js project directory, run

    $ meteor add chriswessels:hammer

## API

The `HammerTouchArea` template block helper is your interface for enabling gestures in your templates. Generally, you only need one occurrence of `HammerTouchArea` in each template you want to specify gestural behaviour for.

### HammerTouchArea

In order to define which gestures you want to attach behaviour to, you'll need to pass an object into `HammerTouchArea` via the `gestureMap` property.

An instance of `HammerTouchArea` looks like this in your HTML:

```html
  <div class="hello-world">
    <!-- HammerTouchArea start tag below -->
    {{#HammerTouchArea gestureMap=myGestures}}
      <div class="gesture-enabled-html">
        <!-- Gestures on HTML in here will register in your gestureMap. See below. -->
      </div>
    {{/HammerTouchArea}}
    <!-- HammerTouchArea end tag above -->
  </div>
```

### Gesture Maps

A gesture map object ties selector strings to callback functions. It lets you specify which elements inside the `HammerTouchArea` you want to attach behaviour to, and which code should run when those touch gestures are detected. It follows exactly the same format as the object you pass into `Template.fooBar.events`.

The object's keys should follow the format `gestureName cssSelector` (or multiple strings in this format separated by a comma, e.g. `tap .foo, swiperight .bar`) and the value should be a callback function that is executed when the specified gestures are performed on the element(s) matching the CSS selector(s).

Generally you should define your gesture map as a template helper so that you can pass it into the `gestureMap` property of your `HammerTouchArea`.

Example of defining a gesture map object as a helper:

```javascript
/* This is a gesture map being returned by a helper named `templateGestures`: */
Template.foo.helpers({
  templateGestures: {
    'swiperight .foo .bar': function (event, templateInstance) {
      /* `event` is the Hammer.js event object */
      /* `templateInstance` is the `Blaze.TemplateInstance` */
      /* `this` is the data context of the element in your template */
    },
    'doubletap .foo .baz, swipeup .goo': function (event, templateInstance) {
      /* ... */
    }
  }
});
```

The callback function you specify will be passed two arguments: the event object provided by Hammer.js and the `Blaze.TemplateInstance` for your template.

The `this` context of the callback function will be set to the data context of the matching element in your template.

## Configuring Hammer.js

1. You can specify initialisation options for the `Hammer.Manager` instance. See below.
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

To implement this callback, specify the `configureCallback` property on `HammerTouchArea`. The value passed in should be a helper that returns a function (your configuration callback), so this looks like a function that returns a function.

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

## How It Works

For each occurrence of `HammerTouchArea` in your templates, chriswessels:hammer will instantiate a new `Hammer.Manager`. It is instantiated with the options object passed into the `initOptions` property of `HammerTouchArea`.

If you have provided a `configureCallback`, this is callback executed and passed the `Hammer.Manager` instance. The return value of the callback is set to the instance of `Hammer.Manager` attached to the `HammerTouchArea`'s `Blaze.TemplateInstance`.

The gesture map that you pass into `HammerTouchArea` via the `gestureMap` property is parsed, and a series of generic gesture callbacks are attached to the `Hammer.Manager` instance. When these fire (as a result of touch actions being performed on the template DOM), they determine whether any of the current touch behaviour matches the selectors you specified in the gesture map, and if so, your callbacks are fired.

## Migrating from < 4.0.0

From version `4.0.0` onwards, there is a new API. For help migrating your existing implementation over to the new API, see [MIGRATION.md](https://github.com/chriswessels/meteor-hammer/blob/master/MIGRATION.md).

## License

Please see the `LICENSE` file for more information.
