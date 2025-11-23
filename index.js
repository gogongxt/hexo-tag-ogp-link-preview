'use strict';

const ogs = require('open-graph-scraper');

const getConfig = require('./lib/configure');
const generate = require('./lib/generator');
const getParameters = require('./lib/parameters');

hexo.extend.tag.register(
    'link_preview',
    (args) => {
        const config = getConfig(hexo.config);

        // If plugin is disabled and simple_link is false, return empty string
        if (!config.enable && !config.simple_link) {
            return '';
        }

        // If simple_link is true, return simple anchor tag immediately
        if (config.simple_link) {
            const params = getParameters(args, config);
            return `<div><a href="${params.scrape.url}" target="${params.scrape.target || '_blank'}" rel="${params.scrape.rel || 'nofollow'}">${params.scrape.url}</a></div>`;
        }

        // Normal link preview generation
        return generate(ogs, getParameters(args, config))
            .then((tag) => tag)
            .catch((error) => {
                console.log('generate error:', error);
                return '';
            });
    },
    {
        async: true,
        ends: false,
    },
);
