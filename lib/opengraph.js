'use strict';

const URL = require('url');
const util = require('hexo-util');
const { hasProperty, hasTypeOfProperty, getObjectValueFrom } = require('./common');
const { stringLength, stringSlice } = require('./strings');

function getOgTitle(ogp) {
    if (!hasTypeOfProperty(ogp, 'ogTitle', 'string')) {
        return { valid: false, title: '' };
    }

    const escapedTitle = util.escapeHTML(ogp.ogTitle);

    return { valid: escapedTitle !== '', title: escapedTitle };
}

function getOgDescription(ogp, maxLength) {
    if (!hasTypeOfProperty(ogp, 'ogDescription', 'string')) {
        return { valid: false, description: '' };
    }

    const escapedDescription = util.escapeHTML(ogp.ogDescription);
    const descriptionText = maxLength && stringLength(escapedDescription) > maxLength
        ? stringSlice(escapedDescription, 0, maxLength) + '...'
        : escapedDescription;

    return { valid: descriptionText !== '', description: descriptionText };
}

function getOgImage(ogp, selectIndex = 0) {
    if (!hasProperty(ogp, 'ogImage') || ogp.ogImage.length === 0) {
        return { valid: false, image: '' };
    }

    const index = selectIndex >= ogp.ogImage.length ? ogp.ogImage.length - 1 : 0;
    const imageUrl = getObjectValueFrom(ogp.ogImage[index], 'url', 'string', '');

    return { valid: imageUrl !== '', image: imageUrl };
}

function getFavicon(ogp, requestUrl) {
    // Try to get favicon from OpenGraph data first
    if (hasTypeOfProperty(ogp, 'ogImage', 'object') && ogp.ogImage.length > 0) {
        const faviconImage = ogp.ogImage.find((image) => {
            const imageUrl = getObjectValueFrom(image, 'url', 'string', '');
            return imageUrl && (imageUrl.includes('icon') || imageUrl.includes('favicon'));
        });

        if (faviconImage) {
            const imageUrl = getObjectValueFrom(faviconImage, 'url', 'string', '');
            return { valid: true, favicon: imageUrl };
        }
    }

    // If no favicon in OpenGraph data, construct default favicon URL
    try {
        const parsedUrl = new URL.URL(requestUrl);
        const faviconUrl = `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`;
        return { valid: true, favicon: faviconUrl };
    }
    catch {
        return { valid: false, favicon: '' };
    }
}

module.exports = {
    getOgTitle,
    getOgDescription,
    getOgImage,
    getFavicon,
};
