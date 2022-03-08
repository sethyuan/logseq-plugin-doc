# logseq-plugin-doc

将页面已更加文章化的形式展示，并提供快速导出功能。

Show page in a more document like look and provide quick exporting.

## 使用展示 (Usage)

![demo](./demo.gif)

## 快捷键 (Shortcuts)

通过命令栏可以找到切换文档视图的命令，它的快捷键为 macOS 下 `cmd+shift+d` 或者 Windows 下 `ctrl+shift+d`。

You can toggle the document view with the command palette，It's shortcut key is `cmd+shift+d` on macOS, `ctrl+shift+d` on Windows.

## 关于无序列表 (About bullet lists)

你可以在无序列表的块上加`#.ul`标签，这样插件就知道这是一个无序列表并配合排版了。

You can add a `#.ul` tag to a block that is a bullet list, in this way, the plugin will know to format it accordingly.

示例 (Example)

![Bullet List](./bullets.png)

## 用户配置 (User configs)

```json
{
  "disabled": false,
  "showReferences": false,
  "unindentLevel": 999
}
```

在 Logseq 的插件页面打开插件的配置后，有以下几项配置可供使用，请参照上方代码块进行设置（各项的默认值以体现在代码块中）：

- `showReferences`: 是否在文档视图中显示有关联的页面。
- `unindentLevel`: 设置要在文档视图中去掉多少级的缩进。最小为`1`。

There are a couple of user settings available when you access the plugin settings from Logseq's plugins page. Please refer to the source block above (Default values are given in the source block).

- `showReferences`: It defines whether or not to show the "Linked Reference" section.
- `unindentLevel`: It defines how many levels you want to unindent while in the document view. Mininum is `1`.
