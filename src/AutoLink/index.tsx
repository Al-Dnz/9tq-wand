// @ts-nocheck
import React from 'react';
import nl2br from '../utils/nl2br';

import matchParser from './match_parser';

class AutoLink extends React.Component {
  prepareElements(matches, text) {
    let elements = [];
    let lastIndex = 0;

    matches.forEach((match) => {
      if (match.position.start !== 0) {
        elements.push(
          React.createElement('span', {}, nl2br(text.slice(lastIndex, match.position.start), true)),
        );
      }
      elements.push(
        React.createElement(
          'a',
          Object.assign({}, { href: match.getAnchorHref() }, this.props.linkProps),
          nl2br(match.getAnchorText(), true),
        ),
      );
      lastIndex = match.position.end;
    });

    if (lastIndex < text.length) {
      elements.push(React.createElement('span', {}, nl2br(text.slice(lastIndex), true)));
    }

    return elements;
  }

  truncate(items) {
    if (!this.props.maxLength) return items;

    let elements = [];
    let length = 0;

    items.some((el) => {
      length += el.props.children.length;

      if (length > this.props.maxLength) {
        const truncatedText = el.props.children.slice(0, -(length - this.props.maxLength));
        elements.push(React.cloneElement(el, {}, truncatedText));
        return true; // stop iterating through the elements
      }

      elements.push(el);
    });

    return elements;
  }

  /*
   * Generate unique keys for each of the elements.
   * The key will be based on the index of the element.
   */
  keyElements(elements) {
    return elements.map((el, index) => {
      return React.cloneElement(el, { key: index });
    });
  }

  render() {
    const text = this.props.text || '';

    const keyedElements = this.keyElements(
      this.truncate(this.prepareElements(matchParser(text, this.props.disableUrlStripping), text)),
    );

    return React.createElement('span', {}, keyedElements);
  }
}

export default AutoLink;
