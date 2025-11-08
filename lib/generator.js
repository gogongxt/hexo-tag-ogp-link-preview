'use strict';

const { newHtmlDivTag, newHtmlAnchorTag, newHtmlImgTag, newHtmlFaviconTag } = require('./htmltag');
const { getOgTitle, getOgDescription, getOgImage, getFavicon } = require('./opengraph');

function newContent(escapedTitle, escapedDesc, ogImage, favicon, url, generate) {
    const content = [];

    if (ogImage.valid) {
        const imageContent = newHtmlImgTag(ogImage.image, '', generate);
        content.push(newHtmlDivTag('og-image', imageContent, generate));
    }

    // Add favicon as a separate element at the same level as og-image
    if (favicon.valid) {
        const faviconContent = newHtmlFaviconTag(favicon.favicon, generate);
        content.push(newHtmlDivTag('og-favicon', faviconContent, generate));
    }

    // Add title, description, and URL as separate elements at the same level
    content.push(newHtmlDivTag('og-title', escapedTitle, generate));
    content.push(newHtmlDivTag('og-description', escapedDesc, generate));
    content.push(newHtmlDivTag('og-url', url, generate));

    return content.join('');
}

function createTimeoutPromise(timeout) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Scraping timeout after ${timeout}ms`));
        }, timeout);
    });
}

module.exports = (scraper, params) => {
    const timeout = params.scrape.timeout || 10000; // Default 10 seconds

    return Promise.race([
        scraper(params.scrape),
        createTimeoutPromise(timeout),
    ])
        .then((data) => data.result)
        .then((ogp) => {
            const { valid: isTitleValid, title } = getOgTitle(ogp);
            const { valid: isDescValid, description } = getOgDescription(ogp, params.generate.descriptionLength);
            const ogImage = getOgImage(ogp);
            const favicon = getFavicon(ogp, params.scrape.url);

            if (!isTitleValid || !isDescValid) {
                return newHtmlAnchorTag(params.scrape.url, params.scrape.url, params.generate);
            }

            return newHtmlAnchorTag(
                params.scrape.url,
                params.scrape.url,
                params.generate,
                newContent(title, description, ogImage, favicon, params.scrape.url, params.generate),
            );
        })
        .catch((error) => {
            console.error('scraping error:', error);

            return newHtmlAnchorTag(params.scrape.url, params.scrape.url, params.generate);
        });
};
