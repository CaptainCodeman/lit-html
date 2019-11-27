/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import {immutable} from '../../directives/immutable.js';
import {render} from '../../lib/render.js';
import {html} from '../../lit-html.js';

const assert = chai.assert;

// tslint:disable:no-any OK in test code.

suite('immutable', () => {
  let container: HTMLDivElement;
  let callCount: number;

  class ImmutableTesterElement extends HTMLElement {
    private _value?: any = {};

    public get value(): any|undefined {
      return this._value;
    }

    public set value(value: any|undefined) {
      callCount += 1;
      this._value = value;
    }
  }
  customElements.define('immutable-tester', ImmutableTesterElement);

  function renderImmutabled(value: any) {
    render(html`<immutable-tester .value=${immutable(value)}></immutable-tester>`, container);
  }

  setup(() => {
    container = document.createElement('div');
    callCount = 0;
  });

  test('re-renders only on identity changes', () => {
    const one = {a:1}
    const two = {a:2}

    renderImmutabled(one);
    assert.equal(callCount, 1);

    renderImmutabled(one);
    assert.equal(callCount, 1);

    renderImmutabled(two);
    assert.equal(callCount, 2);
  });

  test('renders with undefined the first time', () => {
    renderImmutabled(undefined);
    assert.equal(callCount, 1);

    renderImmutabled({});
    assert.equal(callCount, 2);
  });

  test('doesnt dirty check array values', () => {
    let items = ['foo', 'bar'];

    renderImmutabled([items]);
    assert.equal(callCount, 1);

    items.push('baz');
    renderImmutabled([items]);
    assert.equal(callCount, 1);
  });

  test('dirty checks arrays of values', () => {
    const items = ['foo', 'bar'];

    renderImmutabled(items);
    assert.equal(callCount, 1);

    renderImmutabled([...items, 'baz']);
    assert.equal(callCount, 2);
  });
});
