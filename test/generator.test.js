'use strict';

const getConfig = require('../lib/configure');
const generate = require('../lib/generator');
const getParameters = require('../lib/parameters');

const { mockFullOgValues, mockTextOgValues, mockInvalidOgValues, mockThrowError } = require('./mock/scraper');

describe('generator', () => {
    it('Was able to get all values from OpenGraph', async () => {
        const { scraper, imageUrl, title, description } = mockFullOgValues();
        const params = getParameters(
            ['https://example.com'],
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
            `<div class="og-image"><img src="${imageUrl}" alt="" loading="lazy"></div>`,
            '<div class="descriptions">',
            '<div class="og-title">' + title + '</div>',
            '<div class="og-description">' + description + '</div>',
            '<div class="og-url">https://example.com</div>',
            '</div>',
            '</a>',
        ].join(''));
    });

    it('Was able to get all values from OpenGraph and append class suffix', async () => {
        const { scraper, imageUrl, title, description } = mockFullOgValues();
        const params = getParameters(
            ['https://example.com', 'classSuffix:suffix'],
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
            '<div class="og-url-suffix">https://example.com</div>',
            '</div>',
            '</a>',
        ].join(''));
    });

    it('Was able to get title and description from OpenGraph', async () => {
        const { scraper, title, description } = mockTextOgValues();
        const params = getParameters(
            ['https://example.com'],
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
            '<div class="descriptions">',
            '<div class="og-title">' + title + '</div>',
            '<div class="og-description">' + description + '</div>',
            '<div class="og-url">https://example.com</div>',
            '</div>',
            '</a>',
        ].join(''));
    });

    it('Was able to get title and description from OpenGraph and append class suffix', async () => {
        const { scraper, title, description } = mockTextOgValues();
        const params = getParameters(
            ['https://example.com', 'classSuffix:suffix'],
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
            '<div class="og-url-suffix">https://example.com</div>',
            '</div>',
            '</a>',
        ].join(''));
    });

    it('Neither able to get title nor description from OpenGraph', async () => {
        const { scraper } = mockInvalidOgValues();
        const params = getParameters(
            ['https://example.com'],
            getConfig({
                link_preview: {
                    class_name: { anchor_link: 'link-preview' },
                    description_length: 140,
                    disguise_crawler: true,
                },
            }),
        );

        await expect(generate(scraper, params)).resolves.toStrictEqual(
            '<a href="https://example.com/" target="_blank" rel="nofollow">https://example.com</a>',
        );
    });

    it('Throw error from OpenGraph scraper', async () => {
        const { scraper } = mockThrowError();
        const params = getParameters(
            ['https://example.com'],
            getConfig({
                link_preview: {
                    class_name: { anchor_link: 'link-preview' },
                    description_length: 140,
                    disguise_crawler: true,
                },
            }),
        );

        await expect(generate(scraper, params)).resolves.toStrictEqual(
            '<a href="https://example.com/" target="_blank" rel="nofollow">https://example.com</a>',
        );
    });

    it('Generates HTML structure matching README example with special suffix', async () => {
        const { scraper, imageUrl, title, description } = mockFullOgValues();
        const params = getParameters(
            ['https://www.example.com/', 'classSuffix:special'],
            getConfig({
                link_preview: {
                    class_name: {
                        anchor_link: 'link-preview',
                        image: 'not-gallery-item'
                    },
                    description_length: 140,
                    disguise_crawler: true,
                },
            }),
        );

        const expectedHtml = [
            '<a href="https://www.example.com/" target="_blank" rel="nofollow" class="link-preview">',
            '<div class="og-image-special"><img src="' + imageUrl + '" alt="" class="not-gallery-item" loading="lazy"></div>',
            '<div class="descriptions-special">',
            '<div class="og-title-special">' + title + '</div>',
            '<div class="og-description-special">' + description + '</div>',
            '<div class="og-url-special">https://www.example.com/</div>',
            '</div>',
            '</a>'
        ].join('');

        await expect(generate(scraper, params)).resolves.toStrictEqual(expectedHtml);
    });
});
