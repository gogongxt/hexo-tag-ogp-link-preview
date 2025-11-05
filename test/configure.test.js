'use strict';

const getConfig = require('../lib/configure');

describe('configure', () => {
    it('Nothing specified values', () => {
        const hexoCfg = {};

        expect(getConfig(hexoCfg)).toStrictEqual({
            class_name: { anchor_link: 'link-preview' },
            description_length: 140,
            disguise_crawler: true,
            timeout: 10000,
        });
    });

    it('Specify all values', () => {
        const hexoCfg = {
            link_preview: {
                class_name: { anchor_link: 'link-preview-2', image: 'not-gallery-item' },
                description_length: 100,
                disguise_crawler: false,
            },
        };

        expect(getConfig(hexoCfg)).toStrictEqual({
            class_name: { anchor_link: 'link-preview-2', image: 'not-gallery-item' },
            description_length: 100,
            disguise_crawler: false,
            timeout: 10000,
        });
    });

    it('Specify a valid string value at class_name', () => {
        const hexoCfg = {
            link_preview: {
                class_name: 'link-preview-2',
            },
        };

        expect(getConfig(hexoCfg)).toStrictEqual({
            class_name: { anchor_link: 'link-preview-2' },
            description_length: 140,
            disguise_crawler: true,
            timeout: 10000,
        });
    });

    it('Specify a invalid string value at class_name', () => {
        const hexoCfg = {
            link_preview: {
                class_name: '',
            },
        };

        expect(getConfig(hexoCfg)).toStrictEqual({
            class_name: { anchor_link: 'link-preview' },
            description_length: 140,
            disguise_crawler: true,
            timeout: 10000,
        });
    });

    it('Specify a object which has valid anchor_link only at class_name', () => {
        const hexoCfg = {
            link_preview: {
                class_name: { anchor_link: 'link-preview-2' },
            },
        };

        expect(getConfig(hexoCfg)).toStrictEqual({
            class_name: {
                anchor_link: 'link-preview-2',
            },
            description_length: 140,
            disguise_crawler: true,
            timeout: 10000,
        });
    });

    it('Specify a object which has invalid anchor_link only at class_name', () => {
        const hexoCfg = {
            link_preview: {
                class_name: { anchor_link: '' },
            },
        };

        expect(getConfig(hexoCfg)).toStrictEqual({
            class_name: {
                anchor_link: 'link-preview',
            },
            description_length: 140,
            disguise_crawler: true,
            timeout: 10000,
        });
    });

    it('Specify a object which has image only at class_name', () => {
        const hexoCfg = {
            link_preview: {
                class_name: { image: 'not-gallery-item' },
            },
        };

        expect(getConfig(hexoCfg)).toStrictEqual({
            class_name: { anchor_link: 'link-preview', image: 'not-gallery-item' },
            description_length: 140,
            disguise_crawler: true,
            timeout: 10000,
        });
    });

    it('Specify a something except for string or object at class_name', () => {
        const hexoCfg = {
            link_preview: {
                class_name: 0,
            },
        };

        expect(getConfig(hexoCfg)).toStrictEqual({
            class_name: { anchor_link: 'link-preview' },
            description_length: 140,
            disguise_crawler: true,
            timeout: 10000,
        });
    });

    it('Specify custom timeout value', () => {
        const hexoCfg = {
            link_preview: {
                timeout: 5000,
            },
        };

        expect(getConfig(hexoCfg)).toStrictEqual({
            class_name: { anchor_link: 'link-preview' },
            description_length: 140,
            disguise_crawler: true,
            timeout: 5000,
        });
    });

    it('Specify a invalid number value at description_length', () => {
        const hexoCfg = {
            link_preview: {
                description_length: 0,
            },
        };

        expect(getConfig(hexoCfg)).toEqual({
            class_name: { anchor_link: 'link-preview' },
            description_length: 140,
            disguise_crawler: true,
            timeout: 10000,
        });
    });
});
