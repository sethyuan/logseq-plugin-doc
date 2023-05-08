[中文](README.md) | English

# logseq-plugin-doc

Show page in a more document like look and provide quick exporting.

## Usage

https://user-images.githubusercontent.com/3410293/211442242-129978a6-b7a6-41d2-b830-296c814e36e2.mp4

### Inline TOC Generator Support

When exported, links of the inline TOCs will remain usable and all blocks being referenced will also feature an arrow that can go back.

The PDF printed out by using the exported HTML will retain these links.

![toc demo](./toc_demo.gif)

## Shortcuts

You can toggle the document view with the command palette，It's shortcut key is `cmd+shift+d` on macOS, `ctrl+shift+d` on Windows.

## About lists

You can add a `#.ul` tag to a block that is a bullet list, in this way, the plugin will know to format it accordingly. You can also use `#.ul-nested` if it's a nested bullet list what you want.

Similarly, you can use tags that [Ordered Lists plugin](https://github.com/sethyuan/logseq-plugin-ol) can support like `#.ol` or `#.ol-nested` to indicate an ordered list.

Example

![Bullet List](./bullets.png)

## Linked References in newer versions of Logseq

Linked References are dynamically loaded in newer versions of Logseq, be sure to scroll to this part of the page and all its content is loaded and displayed if you want to have this section exported.

## Exporting for complex themes

It's necessary to configure `pluginsDir` in the plugin's settings if you use some complex themes, the style files won't be able to load for exported HTML otherwise.

## Buy me a coffee

If you think the software I have developed is helpful to you and would like to give recognition and support, you may buy me a coffee using following link. Thank you for your support and attention.

<a href="https://www.buymeacoffee.com/sethyuan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
