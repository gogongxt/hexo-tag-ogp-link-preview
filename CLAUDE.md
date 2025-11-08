# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hexo tag plugin that generates link previews using OpenGraph data. It scrapes URLs for OpenGraph metadata and generates HTML preview cards in Hexo articles. The plugin also displays the URL address within the preview card for better user experience.

## Common Development Commands

```bash
# Run all tests with coverage
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Code Architecture

### Main Entry Point
- `index.js` - Hexo tag registration using `hexo.extend.tag.register('link_preview', ...)`

### Core Modules
- `lib/generator.js` - Main logic that orchestrates scraping and HTML generation, includes URL display functionality and flat HTML structure generation
- `lib/configure.js` - Configuration management with defaults for class names, description length, and crawler disguise
- `lib/parameters.js` - Argument parsing for tag parameters (URL, target, rel, loading, classSuffix)
- `lib/opengraph.js` - OpenGraph data extraction (title, description, image)
- `lib/htmltag.js` - HTML generation utilities for anchor, div, and img tags
- `lib/common.js` - Shared utility functions
- `lib/strings.js` - String manipulation utilities

### Tag Syntax
The plugin supports both positional and named parameters:
```
{% link_preview url [target] [rel] [loading] [classSuffix] %}
[Content]
{% endlink_preview %}
```

```
{% link_preview url [rel:{rel_value}] [target:{target_value}] [loading:{loading_value}] [classSuffix:{classSuffix_value}] %}
[Content]
{% endlink_preview %}
```

### Configuration Structure
Configuration is read from `_config.yml` under `link_preview:` key:
- `class_name` - Can be string (anchor only) or object (anchor + image)
- `description_length` - Number (default: 140)
- `disguise_crawler` - Boolean (default: true)

### HTML Structure
The plugin generates a flat HTML structure with all elements at the same level:
- `og-image` - Container for the main OpenGraph image
- `og-favicon` - Container for the website favicon
- `og-title` - OpenGraph title text
- `og-description` - OpenGraph description text
- `og-url` - URL address display

All elements are direct children of the anchor tag, with no nested containers.

### Error Handling
- Generator falls back to simple anchor link if OpenGraph scraping fails
- Invalid URLs throw errors during parameter parsing
- Scraper errors are caught and logged to console

### Testing
- Uses Jest for unit tests with coverage
- Test files follow pattern: `test/*.test.js`
- Mock scraper available in `test/mock/scraper.js`
- Tests cover parameter parsing, configuration, HTML generation, and OpenGraph processing