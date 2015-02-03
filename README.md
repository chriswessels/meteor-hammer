meteor-hammer
============

A smart-package for integrating with Hammer.js for multi-touch gestures. Bundles Hammer.js and provides `Template.templateName.gestures()` for easy use.

The interface for `Template.templateName.gestures()` is the same as `Template.templateName.events()`.

##Example

```javascript
Template.yourTemplate.gestures({
  'swipeleft .item .panel': function (event) {
    /* Do something when user swipes left on .item .panel */
  }
});
```

##Installation

In your Meteor.js project directory, run

    $ meteor add chriswessels:hammer

##Setting Hammer.js options

You can set Hammer.js options on a template level by using `Template.templateName.hammerOptions()`. It accepts a single argument, the options object to be passed to Hammer.js.

##Gesture Callback Function

The callback function you specify will be passed a single argument: the `event` object provided by Hammer.js.

The `this` context of the callback function will be set to the `Blaze.TemplateInstance` for your template.

##License

Please see the `LICENSE` file for more information.
