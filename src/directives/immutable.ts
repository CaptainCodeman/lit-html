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

import {directive, Part} from '../lit-html.js';

const previousValues = new WeakMap<Part, unknown>();

/**
 * Prevents re-render of a template value until the value or an array of
 * values changes.
 *
 * Example:
 *
 * ```js
 * html`
 *   <my-user .user=${immutable(userObj)}></my-user>
 * ```
 *
 * In this case, the my-user component's user property is only set if userObj
 * changes.
 *
 * immutable() is useful with immutable data patterns, by preventing expensive work
 * until data updates.
 *
 * @param value the immutable value to check before re-rendering
 */
export const immutable =
    directive((value: unknown) => (part: Part): void => {
      const previousValue = previousValues.get(part);
      if (Array.isArray(value)) {
        // Dirty-check arrays by item
        if (Array.isArray(previousValue) &&
            previousValue.length === value.length &&
            value.every((v, i) => v === previousValue[i])) {
          return;
        }
      } else if (
          previousValue === value &&
          (value !== undefined || previousValues.has(part))) {
        // Dirty-check non-arrays by identity
        return;
      }

      part.setValue(value);
      // Copy the value if it's an array so that if it's mutated we don't forget
      // what the previous values were.
      previousValues.set(
          part, Array.isArray(value) ? Array.from(value) : value);
    });
