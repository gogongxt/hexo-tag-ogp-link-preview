'use strict';

const util = require('hexo-util');
const { newHtmlDivTag, newHtmlAnchorTag, newHtmlImgTag } = require('../lib/htmltag');

describe('htmlTag', () => {
    it('Generate a new html div tag', () => {
        expect(newHtmlDivTag('div-class', 'text', {})).toStrictEqual(util.htmlTag(
            'div',
            { class: 'div-class' },
            'text',
        ));
    });

    it('Generate a new html div tag with class name suffix', () => {
        expect(newHtmlDivTag('div-class', 'text', { classSuffix: 'suffix' })).toStrictEqual(util.htmlTag(
            'div',
            { class: 'div-class-suffix' },
            'text',
        ));
    });

    it('Generate a new html anchor tag with content', () => {
        const href = 'https://example.com/';
        const linkText = 'https://example.com/';
        const content = 'text';
        const config = {
            target: '_blank',
            rel: 'nofollow',
            classSuffix: 'suffix',
            className: { anchor_link: 'anchor-class' },
        };

        expect(newHtmlAnchorTag(href, linkText, config, content)).toStrictEqual(util.htmlTag(
            'a',
            { href, target: config.target, rel: config.rel, class: config.className.anchor_link },
            content,
        ));
    });

    it('Generate a new html anchor tag with URL as fallback text', () => {
        const href = 'https://example.com/';
        const linkText = 'https://example.com/';
        const config = {
            target: '_blank',
            rel: 'nofollow',
            className: { anchor_link: 'anchor-class' },
        };

        const result = newHtmlAnchorTag(href, linkText, config);

        // Fallback should not include class to avoid CSS conflicts
        expect(result).toContain('href="https://example.com/"');
        expect(result).toContain('target="_blank"');
        expect(result).toContain('rel="nofollow"');
        expect(result).not.toContain('class=');
        expect(result).toContain('https://example.com/');
    });

    it('Generate a new html image tag', () => {
        const src = 'https://example.com/';
        const alt = 'alternative text';
        const config = {
            loading: 'lazy',
            classSuffix: 'suffix',
            className: { image: 'image-class' },
        };

        expect(newHtmlImgTag(src, alt, config)).toStrictEqual(util.htmlTag(
            'img',
            { src, alt, class: config.className.image, loading: config.loading },
        ));
    });

    it('Generate a new html image tag without class name', () => {
        const src = 'https://example.com/';
        const alt = 'alternative text';
        const config = {
            loading: 'eager',
        };

        expect(newHtmlImgTag(src, alt, config)).toStrictEqual(util.htmlTag(
            'img',
            { src, alt, loading: config.loading },
        ));
    });

    it('Generate a new html image tag without loading', () => {
        const src = 'https://example.com/';
        const alt = 'alternative text';
        const config = {
            loading: 'none',
            className: { image: 'image-class' },
        };

        expect(newHtmlImgTag(src, alt, config)).toStrictEqual(util.htmlTag(
            'img',
            { src, alt, class: config.className.image },
        ));
    });
});
