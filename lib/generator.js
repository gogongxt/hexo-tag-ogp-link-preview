'use strict';

const { newHtmlDivTag, newHtmlAnchorTag, newHtmlImgTag } = require('./htmltag');
const { getOgTitle, getOgDescription, getOgImage } = require('./opengraph');

function newContent(escapedTitle, escapedDesc, ogImage, url, generate) {
    const content = [];

    if (ogImage.valid) {
        const imageContent = newHtmlImgTag(ogImage.image, '', generate);
        content.push(newHtmlDivTag('og-image', imageContent, generate));
    }

    const descriptions = [
        newHtmlDivTag('og-title', escapedTitle, generate),
        newHtmlDivTag('og-description', escapedDesc, generate),
        newHtmlDivTag('og-url', url, generate),
    ];
    content.push(newHtmlDivTag('descriptions', descriptions.join(''), generate));

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

            if (!isTitleValid || !isDescValid) {
                return newHtmlAnchorTag(params.scrape.url, params.scrape.url, params.generate);
            }

            return newHtmlAnchorTag(
                params.scrape.url,
                params.scrape.url,
                params.generate,
                newContent(title, description, getOgImage(ogp), params.scrape.url, params.generate),
            );
        })
        .catch((error) => {
            console.error('scraping error:', error);

            return newHtmlAnchorTag(params.scrape.url, params.scrape.url, params.generate);
        });
};
