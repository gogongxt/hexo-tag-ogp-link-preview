'use strict';

const getConfig = require('../lib/configure');
const generate = require('../lib/generator');
const getParameters = require('../lib/parameters');

const { mockFullOgValues, mockTextOgValues, mockInvalidOgValues, mockThrowError } = require('./mock/scraper');

describe('generator', () => {
    it('Was able to get all values from OpenGraph', async () => {
        const { scraper, imageUrl, title, description } = mockFullOgValues();
        const params = getParameters(
            ['https://example.com', 'classSuffix:suffix'],
            'fallbackText',
            getConfig({
                link_preview: {
                    class_name: { anchor_link: 'link-preview' },
                    description_length: 140,
                    disguise_crawler: true,
                },
            }),
        );

        await expect(generate(scraper, params)).resolves.toStrictEqual([
            '<a href="https://example.com/" target="_blank" rel="nofollow" class="link-preview">',
            `<div class="og-image-suffix"><img src="${imageUrl}" alt="" loading="lazy"></div>`,
            '<div class="descriptions-suffix">',
            '<div class="og-title-suffix">' + title + '</div>',
            '<div class="og-description-suffix">' + description + '</div>',
            '</div>',
            '</a>',
        ].join(''));
    });

    it('Was able to get title and description from OpenGraph', async () => {
        const { scraper, title, description } = mockTextOgValues();
        const params = getParameters(
            ['https://example.com', 'classSuffix:suffix'],
            'fallbackText',
            getConfig({
                link_preview: {
                    class_name: { anchor_link: 'link-preview' },
                    description_length: 140,
                    disguise_crawler: true,
                },
            }),
        );

        await expect(generate(scraper, params)).resolves.toStrictEqual([
            '<a href="https://example.com/" target="_blank" rel="nofollow" class="link-preview">',
            '<div class="descriptions-suffix">',
            '<div class="og-title-suffix">' + title + '</div>',
            '<div class="og-description-suffix">' + description + '</div>',
            '</div>',
            '</a>',
        ].join(''));
    });

    it('Neither able to get title nor description from OpenGraph', async () => {
        const { scraper } = mockInvalidOgValues();
        const params = getParameters(
            ['https://example.com'],
            'fallbackText',
            getConfig({
                link_preview: {
                    class_name: { anchor_link: 'link-preview' },
                    description_length: 140,
                    disguise_crawler: true,
                },
            }),
        );

        await expect(generate(scraper, params)).resolves.toStrictEqual(
            `<a href="${params.scrape.url}/" target="_blank" rel="nofollow">${params.generate.fallbackText}</a>`,
        );
    });

    it('Throw error from OpenGraph scraper', async () => {
        const { scraper } = mockThrowError();
        const params = getParameters(
            ['https://example.com'],
            'fallbackText',
            getConfig({
                link_preview: {
                    class_name: { anchor_link: 'link-preview' },
                    description_length: 140,
                    disguise_crawler: true,
                },
            }),
        );

        await expect(generate(scraper, params)).resolves.toStrictEqual(
            `<a href="${params.scrape.url}/" target="_blank" rel="nofollow">${params.generate.fallbackText}</a>`,
        );
    });
});
