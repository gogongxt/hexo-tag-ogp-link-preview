'use strict';

const { newHtmlDivTag, newHtmlAnchorTag, newHtmlImgTag } = require('./htmltag');
const { getOgTitle, getOgDescription, getOgImage } = require('./opengraph');

function newContent(escapedTitle, escapedDesc, ogImage, generate) {
    const content = [];

    if (ogImage.valid) {
        content.push(newHtmlDivTag('og-image', newHtmlImgTag(ogImage.image, '', generate), generate));
    }

    const descriptions = [
        newHtmlDivTag('og-title', escapedTitle, generate),
        newHtmlDivTag('og-description', escapedDesc, generate),
    ];
    content.push(newHtmlDivTag('descriptions', descriptions.join(''), generate));

    return content.join('');
}

module.exports = (scraper, params) => {
    return scraper(params.scrape)
        .then((data) => data.result)
        .then((ogp) => {
            const { valid: isTitleValid, title } = getOgTitle(ogp);
            const { valid: isDescValid, description } = getOgDescription(ogp, params.generate.descriptionLength);

            if (!isTitleValid || !isDescValid) {
                return newHtmlAnchorTag(params.scrape.url, params.generate);
            }

            return newHtmlAnchorTag(
                params.scrape.url,
                params.generate,
                newContent(title, description, getOgImage(ogp), params.generate),
            );
        })
        .catch((error) => {
            console.error('scraping error:', error);

            return newHtmlAnchorTag(params.scrape.url, params.generate);
        });
};
