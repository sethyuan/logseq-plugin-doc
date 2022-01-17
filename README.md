# logseq-plugin-doc

将页面已更加文章化的形式展示，并提供快速导出功能。

Show page in a more document like look and provide quick exporting.

## 使用展示 (Usage)

![demo](./demo.gif)

## 关于无序列表 (About bullet lists)

你可以在无序列表的块上加`#ul`标签，这样插件就知道这是一个无序列表并配合排版了。

You can add a `#ul` tag to a block that is a bullet list, in this way, the plugin will know to format it accordingly.

示例 (Example)

![Bullet List](./bullets.png)

## 用户配置 (User configs)

```json
{
  "disabled": false,
  "showReferences": false
}
```

在 Logseq 的插件页面打开插件的配置后，有以下几项配置可供使用，请参照上方代码块进行设置（各项的默认值以体现在代码块中）：

- `showReferences`: 是否在文档视图中显示有关联的页面。

There are a couple of user settings available when you access the plugin settings from Logseq's plugins page. Please refer to the source block above (Default values are given in the source block).

- `showReferences`: It defines whether or not to show the "Linked Reference" section.
