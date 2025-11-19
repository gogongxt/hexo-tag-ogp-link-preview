# hexo-tag-ogp-link-preview

A Hexo tag plugin for embedding link preview by OpenGraph on article.

## Features

- Generate link preview cards using OpenGraph metadata
- Display URL address within the preview
- **Automatically fetch and display website favicon (browser icon)**
- Support for custom class suffixes
- Fallback to simple anchor link when OpenGraph scraping fails
- Configurable crawler disguise for better scraping success

## Installation

```bash
npm install hexo-tag-ogp-link-preview
```

## Usage

Write like below to your hexo article markdown file:

```
{% link_preview url [target] [rel] [loading] [classSuffix] %}
```

or you are able to use "Named Parameter":

```
{% link_preview url [rel:{rel_value}] [target:{target_value}] [loading:{loading_value}] [classSuffix:{classSuffix_value}] %}
```

### Tag arguments

> [!NOTE]  
> All optionally parameters (except for the required `url` parameter) are able to use "Named Parameter".

| Name          | Required? | Default    | Description                                                                                                                                                    |
| ------------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`         | Yes       |            | This parameter is a target of the link preview.                                                                                                                |
| `target`      | No        | `_blank`   | Specify a `target` attribute of the anchor element.<br>One of `_self`, `_blank`, `_parent`, or `_top`.                                                         |
| `rel`         | No        | `nofollow` | Specify a `rel` attribute of the anchor element.<br>One of `external`, `nofollow`, `noopener`, `noreferrer`, or `opener`.                                      |
| `loading`     | No        | `lazy`     | Specify a `loading` attribute of the image element.<br>One of `lazy`, `eager`, or `none`.<br>If specify a `none`, remove loading attribute from image element. |
| `classSuffix` | No        |            | Specify a suffix of `class` attribute value all of the div elements.                                                                                           |

## Configuration

You write like below to hexo configuration file `_config.yml`:

```yaml
link_preview:
  enable: true
  simple_link: false
  class_name:
    anchor_link: link-preview
    image: not-gallery-item
  description_length: 140
  disguise_crawler: true
  timeout: 10000
```

### Setting values

> [!Note]  
> All setting values are NOT required.

| Name                       | type                 | Default        | Description                                                                                                                                                                                    |
| -------------------------- | -------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enable`                   | `boolean`            | `true`         | Enable or disable the plugin.<br>If set to `false`, the plugin will not generate link preview cards.                                                                                           |
| `simple_link`              | `boolean`            | `false`        | When set to `true`, generates simple anchor links instead of preview cards, regardless of other settings. Useful for fallback behavior when you want links but not full previews.                 |
| `class_name`               | `string` or `object` | `link-preview` | If you are specified `string`, set a `class` attribute of the anchor element only.<br>If you are specified `object`, set each a `class` attribute of the anchor element and the image element. |
| `class_name`.`anchor_link` | `string`             | `link-preview` | Set a `class` attribute of the anchor element.                                                                                                                                                 |
| `class_name`.`image`       | `string`             |                | Set a `class` attribute of the image element.<br>If you are not specify (empty string, etc.), nothing to set.                                                                                  |
| `description_length`       | `number`             | `140`          | It sliced to fit if a number of character of the `og:Description` exceeds the specified number value.                                                                                          |
| `disguise_crawler`         | `boolean`            | `true`         | If scraper for OpenGraph want to disguise to crawler, set `true`.<br>Otherwise, set to `false`.                                                                                                |
| `timeout`                  | `number`             | `10000`        | Set timeout in milliseconds (ms) for OpenGraph scraping. If scraping takes longer than this time, it will be treated as an error and fallback to simple link.                                  |

## Plugin Control Options

### `enable` option

The `enable` option controls whether the plugin is active or not:

- **`enable: true`** (default): Plugin works normally and generates link preview cards
- **`enable: false`**: Plugin is disabled. Depending on `simple_link` setting:
  - If `simple_link: false`: Returns empty string (no content)
  - If `simple_link: true`: Returns simple anchor links

### `simple_link` option

The `simple_link` option provides a fallback mechanism for when you want links but not full preview cards:

- **`simple_link: false`** (default): Generates full OpenGraph preview cards when possible
- **`simple_link: true`**: Always generates simple anchor links, bypassing OpenGraph scraping

### Usage Scenarios

```yaml
# Normal operation (default)
link_preview:
  enable: true
  simple_link: false

# Completely disabled plugin
link_preview:
  enable: false
  simple_link: false

# Fallback to simple links only
link_preview:
  enable: false
  simple_link: true

# Force simple links even when plugin is enabled
link_preview:
  enable: true
  simple_link: true
```

## Example

Write a following to your hexo article markdown file:

```markdown
{% link_preview https://www.example.com/ loading:lazy classSuffix:special %}
```

When scraper get OpenGraph successfully, generated html like blow:

```html
<a
  href="https://www.example.com/"
  target="_blank"
  rel="nofollow"
  class="link-preview"
>
  <div class="og-image-special">
    <img
      src="https://www.example.com/image.png"
      alt="example image"
      class="not-gallery-item"
      loading="lazy"
    />
  </div>
  <div class="og-favicon-special">
    <img
      src="https://www.example.com/favicon.ico"
      alt="favicon"
      class="favicon-icon"
      loading="lazy"
    />
  </div>
  <div class="og-title-special">title text</div>
  <div class="og-description-special">description text</div>
  <div class="og-url-special">https://www.example.com/</div>
</a>
```

When scraper fail to get OpenGraph, generated html like blow:

```html
<a href="https://www.example.com/" target="_blank" rel="nofollow"
  >https://www.example.com/</a
>
```

## Favicon Support

The plugin automatically fetches and displays the website favicon (browser icon) in the link preview cards. The favicon is displayed as a separate element at the same level as all other elements (`og-image`, `og-title`, `og-description`, `og-url`).

### Favicon Detection Strategy

The plugin uses a smart detection strategy to find the best favicon:

1. **OpenGraph Images**: First, it searches through OpenGraph image metadata for URLs containing 'icon' or 'favicon' keywords
2. **Standard Location**: If no favicon is found in OpenGraph data, it falls back to the standard location: `{domain}/favicon.ico`
3. **Error Handling**: If URL parsing fails, the favicon is safely omitted

### CSS Classes

The favicon elements use the following CSS classes:

- **Container**: `og-favicon` (supports `classSuffix` parameter, becomes `og-favicon-{suffix}`)
- **Image**: `favicon-icon` (fixed class name)

### Example HTML Structure

```html
<div class="og-favicon-special">
  <img
    src="https://www.example.com/favicon.ico"
    alt="favicon"
    class="favicon-icon"
    loading="lazy"
  />
</div>
```

The favicon inherits the loading behavior from the plugin configuration and supports the same loading options as main images (`lazy`, `eager`, or `none`).