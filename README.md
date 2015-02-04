meteor-hammer
============

A smart-package for integrating with Hammer.js for multi-touch gestures. Bundles Hammer.js and provides `Template.templateName.gestures()` for easy use.

The interface for `Template.templateName.gestures()` is the same as `Template.templateName.events()`.

Specifically, you should pass an object into `Template.templateName.events()`. The object keys should follow the format `gestureName cssSelector` and the value should be a callback function that is executed when the specified gesture is performed on the element(s) matching the CSS selector.

The CSS selector is automatically namespaced by the template, so it won't match any elements outside of the template's HTML.

##Example

```javascript
Template.yourTemplate.gestures({
  'swipeleft .item .panel': function (event) {
    /* Do something when user swipes left on .item .panel (elements(s) inside the template html) */
    /* The `this` context is the `Blaze.TemplateInstance` */
  }
});
```

##Installation

In your Meteor.js project directory, run

    $ meteor add chriswessels:hammer

##Setting Hammer.js options

You can set Hammer.js options at a template level by using `Template.templateName.hammerOptions()`. It accepts a single argument, the options object to be passed to Hammer.js.

##Gesture Callback Function

The callback function you specify will be passed a single argument: the `event` object provided by Hammer.js.

The `this` context of the callback function will be set to the `Blaze.TemplateInstance` for your template.

##License

Please see the `LICENSE` file for more information.
