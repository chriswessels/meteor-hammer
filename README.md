# chriswessels:hammer

** Outdated, see `API.md` **

A smart-package for integrating with [Hammer.js](https://github.com/hammerjs/hammer.js) for multi-touch gestures. Bundles Hammer.js and provides `Template.templateName.gestures()` for easy use.

## Example

```javascript
Template.yourTemplate.gestures({
  'swipeleft .item .panel': function (event, template) {
    /* Do something when user swipes left on .item .panel (elements(s) inside the template html) */
    /* `event` is the Hammer.js event object */
    /* `template` is the `Blaze.TemplateInstance` */
    /* `this` is the data context of the element in your template */
  }
});
```

## Installation

In your Meteor.js project directory, run

    $ meteor add chriswessels:hammer

## Template interface

The interface for `Template.templateName.gestures()` is the same as `Template.templateName.events()`.

Specifically, you should pass an object into `Template.templateName.gestures()`. The object keys should follow the format `gestureName cssSelector` (or multiple strings in this format separated by a comma, e.g. `tap .foo, swiperight .bar`) and the value should be a callback function that is executed when the specified gestures are performed on the element(s) matching the CSS selector(s).

## Setting Hammer.js options

You can set Hammer.js options application-wide by using `$('body').data('hammer').set({ /* Hammer Options */ });`.

## Gesture Callback Function

The callback function you specify will be passed two arguments: `event`, the event object provided by Hammer.js and `template`, the `Blaze.TemplateInstance`.

The `this` context of the callback function will be set to the data context of the matching element in your template.

## Using additional Recognizers

This smart package will instantiate a single instance of `Hammer.Manager` with the default set of Recognizers as defined here: [http://hammerjs.github.io/api/#hammer](http://hammerjs.github.io/api/#hammer)

You can register additional Recognizers for custom or compound gestures. Example of registering a `Hammer.Swipe` recognizer for 2 finger swipes:

```javascript
// Instantiating and attaching the Recognizers to the `Hammer.Manager` instance.
// client/app.js
Meteor.startup(function () {
  var manager = $('body').data('hammer');
  var twoFingerSwipe = new Hammer.Swipe({
    event: '2fingerswipe', /* prefix for custom swipe events, e.g. 2fingerswipeleft, 2fingerswiperight */
    pointers: 2,
    velocity: 0.5
  });
  manager.add(twoFingerSwipe);
});

// Using the custom recognizers in your templates
// client/views/foo/foo.js
Template.foo.gestures({
  '2fingerswiperight .bar': function (event, template) {
    /* `event` is the Hammer.js event object */
    /* `template` is the `Blaze.TemplateInstance` */
    /* `this` is the data context of the element in your template */
  }
});
```

## License

Please see the `LICENSE` file for more information.
