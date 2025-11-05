# hexo-tag-ogp-link-preview

A Hexo tag plugin for embedding link preview by OpenGraph on article.

## Features

- Generate link preview cards using OpenGraph metadata
- Display URL address within the preview
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
|---------------|-----------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `url`         | Yes       |            | This parameter is a target of the link preview.                                                                                                                |
| `target`      | No        | `_blank`   | Specify a `target` attribute of the anchor element.<br>One of `_self`, `_blank`, `_parent`, or `_top`.                                                         |
| `rel`         | No        | `nofollow` | Specify a `rel` attribute of the anchor element.<br>One of `external`, `nofollow`, `noopener`, `noreferrer`, or `opener`.                                      |
| `loading`     | No        | `lazy`     | Specify a `loading` attribute of the image element.<br>One of `lazy`, `eager`, or `none`.<br>If specify a `none`, remove loading attribute from image element. |
| `classSuffix` | No        |            | Specify a suffix of `class` attribute value all of the div elements.                                                                                           |


## Configuration

You write like below to hexo configuration file `_config.yml`:

```yaml
link_preview:
  class_name:
    anchor_link: link-preview
    image: not-gallery-item
  description_length: 140
  disguise_crawler: true
```

### Setting values

> [!Note]  
> All setting values are NOT required.
  

| Name                       | type                 | Default        | Description                                                                                                                                                                                    |
|----------------------------|----------------------|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `class_name`               | `string` or `object` | `link-preview` | If you are specified `string`, set a `class` attribute of the anchor element only.<br>If you are specified `object`, set each a `class` attribute of the anchor element and the image element. |
| `class_name`.`anchor_link` | `string`             | `link-preview` | Set a `class` attribute of the anchor element.                                                                                                                                                 |
| `class_name`.`image`       | `string`             |                | Set a `class` attribute of the image element.<br>If you are not specify (empty string, etc.), nothing to set.                                                                                  |
| `description_length`       | `number`             | `140`          | It sliced to fit if a number of character of the `og:Description` exceeds the specified number value.                                                                                          |
| `disguise_crawler`         | `boolean`            | `true`         | If scraper for OpenGraph want to disguise to crawler, set `true`.<br>Otherwise, set to `false`.                                                                                                |

## Example

Write a following to your hexo article markdown file:

```markdown
{% link_preview https://www.example.com/ loading:lazy classSuffix:special %}
```

When scraper get OpenGraph successfully, generated html like blow:
```html
<a href="https://www.example.com/" target="_blank" rel="nofollow" class="link-preview">
    <div class="og-image-special">
        <img src="https://www.example.com/image.png" alt="example image" class="not-gallery-item" loading="lazy">
        <div class="og-url-special">https://www.example.com/</div>
    </div>
    <div class="descriptions-special">
        <div class="og-title-special">title text</div>
        <div class="og-description-special">description text</div>
    </div>
</a>
```

When scraper fail to get OpenGraph, generated html like blow:
```html
<a href="https://www.example.com/" target="_blank" rel="nofollow">https://www.example.com/</a>
```
