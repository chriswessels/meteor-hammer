# chriswessels:meteor-hammer@4.0.0-rc1 API

## Introduction

4.0.0 is largely a rewrite of the code base to address a number of issues identified.

Read this: [https://forums.meteor.com/t/guidance-needed-for-chriswessels-hammer-hammer-js-blaze-integration/3532](https://forums.meteor.com/t/guidance-needed-for-chriswessels-hammer-hammer-js-blaze-integration/3532)
Associated GitHub issue: [https://github.com/chriswessels/meteor-hammer/issues/14](https://github.com/chriswessels/meteor-hammer/issues/14)

## New API

The new API includes the introduction of a `HammerTouchArea` Spacebars block helper. An instance of Hammer.js will be attached to any occurrence of this block helper.

### HammerTouchArea

You can pass the following options into the `HammerTouchArea` block helper:

- initOptions: Provide an object that will be passed into `Hammer.Manager` upon `Blaze.TemplateInstance` creation. Use this to disable CSS props or configure default `Hammer.Recognizer`s.
- configureCallback: Provide a callback that will be passed the Hammer.js instance (and `TemplateInstance`), allowing you to register additional `Hammer.Recognizer`s or do any additional configuration.
- gestureMap: Provide an object that maps selectors to callbacks.

### Examples

First, simple usage:

#### simple.html:

```html
<template name="simple">
  {{#HammerTouchArea gestureMap=templateGestures}}
    <ul>
    {{#each contactList}}
      <li>
        {{name}}
      </li>
    {{/each}}
    </ul>
  {{/HammerTouchArea}}
</template>
```

#### simple.js:

```javascript
Template.simple.helpers({
  templateGestures: {
    'doubletap ul li': function (event, templateInstance) {
      /* `event` is the Hammer.js event object */
      /* `templateInstance` is the `Blaze.TemplateInstance` */
      /* `this` is the data context of the element in your template, so in this case the iteree from contactList in the template */
    }
  }
});
```

Next, extended usage (including setting CSS props and attaching a custom recognizer):

#### extended.html:

```html
<template name="extended">
  {{#HammerTouchArea initOptions=hammerInitOptions configureCallback=configureHammer gestureMap=templateGestures}}
    <ul>
    {{#each contactList}}
      <li>
        {{name}}
      </li>
    {{/each}}
    </ul>
  {{/HammerTouchArea}}
</template>
```

#### extended.js:

```javascript
Template.extended.helpers({
  hammerInitOptions: {
    cssProps: { userSelect: 'all' }
  },
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
      /* `this` is the data context of the element in your template, so in this case the iteree from contactList in the template */
    },
    'doubletap ul li': function (event, templateInstance) {
      /* `event` is the Hammer.js event object */
      /* `templateInstance` is the `Blaze.TemplateInstance` */
      /* `this` is the data context of the element in your template, so in this case the iteree from contactList in the template */
    }
  }
});
```

## Backwards compat.

4.0.0 will not be backwards compatible. Points of interest:

- Hammer.js jQuery plugin will no longer be bundled in the package (any user calls to `$(element).hammer(...)` will fail).
- No more `Template.foo.gestures`. See `gestureMap` option for `HammerTouchArea` above.
- No more `Template.foo.hammerOptions`. See `configureCallback` option for `HammerTouchArea` above.

## TODO

- Add tests
