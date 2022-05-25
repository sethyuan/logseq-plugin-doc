import "@logseq/libs"

const docSvg = `<svg class="kef-doc-svg" viewBox="0 0 20 20">
<path fill="none" d="M19.471,8.934L18.883,8.34c-2.096-2.14-4.707-4.804-8.903-4.804c-4.171,0-6.959,2.83-8.996,4.897L0.488,8.934c-0.307,0.307-0.307,0.803,0,1.109l0.401,0.403c2.052,2.072,4.862,4.909,9.091,4.909c4.25,0,6.88-2.666,8.988-4.807l0.503-0.506C19.778,9.737,19.778,9.241,19.471,8.934z M9.98,13.787c-3.493,0-5.804-2.254-7.833-4.3C4.182,7.424,6.493,5.105,9.98,5.105c3.536,0,5.792,2.301,7.784,4.332l0.049,0.051C15.818,11.511,13.551,13.787,9.98,13.787z"></path>
<circle fill="none" cx="9.98" cy="9.446" r="1.629"></circle>
</svg>`

const downloadSvg = `<svg class="kef-doc-svg" viewBox="0 0 20 20">
<path fill="none" d="M9.634,10.633c0.116,0.113,0.265,0.168,0.414,0.168c0.153,0,0.308-0.06,0.422-0.177l4.015-4.111c0.229-0.235,0.225-0.608-0.009-0.836c-0.232-0.229-0.606-0.222-0.836,0.009l-3.604,3.689L6.35,5.772C6.115,5.543,5.744,5.55,5.514,5.781C5.285,6.015,5.29,6.39,5.522,6.617L9.634,10.633z"></path>
<path fill="none" d="M17.737,9.815c-0.327,0-0.592,0.265-0.592,0.591v2.903H2.855v-2.903c0-0.327-0.264-0.591-0.591-0.591c-0.327,0-0.591,0.265-0.591,0.591V13.9c0,0.328,0.264,0.592,0.591,0.592h15.473c0.327,0,0.591-0.264,0.591-0.592v-3.494C18.328,10.08,18.064,9.815,17.737,9.815z"></path>
</svg>`

const EVENTS_TO_PREVENT = [
  "mousedown",
  "mousemove",
  "mouseup",
  "click",
  "keydown",
]

const KEYS_TO_PREVENT = new Set([
  "Enter",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Backspace",
])

let uiModalOverlay = null

function preventEditing(e) {
  // keydown
  if (e.type === "keydown") {
    if (
      KEYS_TO_PREVENT.has(e.key) &&
      uiModalOverlay?.classList.contains("opacity-0")
    ) {
      e.stopPropagation()
    }
    return
  }

  // mouse and click
  const path = e.composedPath()

  // Let go of any links.
  if (path[0]?.tagName.toLowerCase() === "a") return

  for (let i = 0; i < path.length; i++) {
    // Let go of block refs.
    if (path[i].classList?.contains("block-ref")) return
    // Let go of tocgen links.
    if (path[i].classList?.contains("kef-tocgen-page")) return
    if (path[i].classList?.contains("kef-tocgen-block")) return
    // Let go of CodeMirror code blocks.
    if (path[i].classList?.contains("CodeMirror")) return

    if (path[i].id === "left-container") {
      if (path[i - 1]?.id === "main-container") {
        if (parent.document.querySelector(".cp__plugins-page") == null) {
          // Stop if in main container but in plugins page.
          e.stopPropagation()
        }
      }
      return
    }
  }
}

function prepareDoc() {
  const mainContent = parent.document.getElementById("main-content-container")

  const html = parent.document.documentElement.cloneNode()
  const head = parent.document.head.cloneNode(true)
  const body = parent.document.body.cloneNode()
  const rootDiv = parent.document.body.firstElementChild.cloneNode()
  const themeDiv =
    parent.document.body.firstElementChild.firstElementChild.cloneNode()
  const themeInnerDiv =
    parent.document.body.firstElementChild.firstElementChild.firstElementChild.cloneNode()
  const appDiv = parent.document.getElementById("app-container").cloneNode()
  const mainDiv = mainContent.cloneNode()

  for (const node of head.children) {
    if (
      node.rel === "stylesheet" &&
      node.attributes.href.value.startsWith(".")
    ) {
      node.attributes.href.value = node.href
    } else if (
      node.rel === "stylesheet" &&
      node.attributes.href.value.startsWith("assets://")
    ) {
      node.attributes.href.value = node.attributes.href.value.replace(
        "assets://",
        "file://",
      )
    } else if (
      node.nodeName.toLowerCase() === "script" &&
      node.attributes.src.value.startsWith(".")
    ) {
      node.attributes.src.value = node.src
    }
  }
  html.appendChild(head)
  html.appendChild(body)
  body.appendChild(rootDiv)
  rootDiv.appendChild(themeDiv)
  themeDiv.appendChild(themeInnerDiv)
  themeInnerDiv.appendChild(appDiv)
  appDiv.appendChild(mainDiv)

  // Generate static images for canvases.
  const canvases = mainContent.querySelectorAll("canvas")
  for (const canvas of canvases) {
    const img = parent.document.createElement("img")
    img.src = canvas.toDataURL()
    img.style.transform = "translateX(-100%)"
    canvas.parentElement.parentElement.append(img)
  }

  mainDiv.innerHTML = parent.document.getElementById(
    "main-content-container",
  ).innerHTML

  // Remove static images generated for canvases.
  for (const canvas of canvases) {
    canvas.parentElement.parentElement.lastElementChild.remove()
  }

  const imgs = mainDiv.querySelectorAll("img")
  for (const img of imgs) {
    if (img.src.startsWith("assets://")) {
      img.src = img.src.replace("assets://", "file://")
    }
  }

  return `<!DOCTYPE html>\n${html.outerHTML}`
}

function saveDoc(doc) {
  const blob = new Blob([doc], { type: "text/plain" })
  const link = document.createElement("a")
  link.download = "doc.html"
  link.href = URL.createObjectURL(blob)
  link.onclick = () => URL.revokeObjectURL(blob)
  link.click()
}

function injectStyles() {
  // Unindent all blocks by default.
  const unindentLevel =
    +logseq.settings?.unindentLevel === 0
      ? 0
      : Math.max(0, +logseq.settings?.unindentLevel || 999)

  logseq.provideStyle({
    key: "kef-doc-base",
    style: `
      .kef-doc-container {
        margin: 0 5px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      }
      .kef-doc-icon {
        display: block;
        width: 30px;
        height: 30px;
        padding: 7px 5px 4px;
        border-radius: 4px;
      }
      .kef-doc-svg {
        width: 20px;
        height: 20px;
      }
      .kef-doc-svg path,
      .kef-doc-svg polygon,
      .kef-doc-svg rect {
        fill: var(--ls-icon-color);
      }
      .kef-doc-svg circle {
        stroke: var(--ls-icon-color);
        stroke-width: 1;
      }
      .kef-doc-icon:hover {
        background: var(--ls-tertiary-background-color);
      }
      .kef-doc-icon:hover .kef-doc-svg path,
      .kef-doc-icon:hover .kef-doc-svg polygon,
      .kef-doc-icon:hover .kef-doc-svg rect {
        fill: var(--ls-primary-text-color);
      }
      .kef-doc-icon:hover .kef-doc-svg circle {
        stroke: var(--ls-primary-text-color);
      }
      .kef-doc .kef-doc-icon:not(.kef-doc-download) path,
      .kef-doc .kef-doc-icon:not(.kef-doc-download) polygon,
      .kef-doc .kef-doc-icon:not(.kef-doc-download) react {
        fill: var(--ls-link-ref-text-color);
      }
      .kef-doc .kef-doc-icon:not(.kef-doc-download) circle {
        stroke: var(--ls-link-ref-text-color);
      }
      .kef-doc .kef-doc-icon:hover:not(.kef-doc-download) path,
      .kef-doc .kef-doc-icon:hover:not(.kef-doc-download) polygon,
      .kef-doc .kef-doc-icon:hover:not(.kef-doc-download) react {
        fill: var(--ls-link-ref-text-color);
      }
      .kef-doc .kef-doc-icon:hover:not(.kef-doc-download) circle {
        stroke: var(--ls-link-ref-text-color);
      }
      .kef-doc-download {
        margin-right: 6px;
        display: none;
      }
      .kef-doc .kef-doc-download {
        display: inline-block;
      }

      .kef-doc ~ .cp__sidebar-help-btn {
        display: none;
      }
      .kef-doc.kef-doc-show-refs #main-content-container .page.relative .references {
        display: block;
      }
      .kef-doc .open-block-ref-link {
        display: none;
      }
      .kef-doc .draw .my-1 {
        display: none;
      }
      .kef-doc .excalidraw > .layer-ui__wrapper {
        display: none;
      }
      .kef-doc .excalidraw > .excalidraw-textEditorContainer {
        display: none;
      }
      .kef-doc #main-content-container .page.relative .references,
      .kef-doc #main-content-container .page.relative .page-hierarchy {
        display: none;
      }
      .kef-doc #main-content-container .block-children-left-border {
        display: none;
      }
      .kef-doc #main-content-container .block-children {
        border-left: 0 !important;
      }
    `,
  })
  if (unindentLevel > 0) {
    logseq.provideStyle({
      key: "kef-doc-unindent",
      style: `
        .kef-doc .ls-page-title {
          padding-left: 0;
        }
        .kef-doc #main-content-container .page-blocks-inner {
          margin-left: 0 !important;
        }
        .kef-doc #main-content-container .page.relative > .relative:first-child > div:first-child > div.mb-4 {
          display: none;
        }
        .kef-doc #main-content-container .block-content {
          margin-bottom: 0.4em;
        }
        .kef-doc #main-content-container span.inline {
          line-height: 1.6;
        }
        .kef-doc #main-content-container .tag {
          display: none !important;
        }
        .kef-doc #main-content-container div[blockid][haschild] > div:first-child > div:first-child {
          display: none;
        }
        .kef-doc #main-content-container .block-children-container {
          margin-left: 0 !important;
        }
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ul"'] > .block-children-container > .block-children > div[blockid] > div:first-child > div:first-child > .block-control,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ul"'] > .block-children-container > .block-children > div[blockid] > div:first-child > div:first-child > .block-control,
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ol"'] > .block-children-container > .block-children > div[blockid] > div:first-child > div:first-child > .block-control,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ol'] > .block-children-container > .block-children > div[blockid] > div:first-child > div:first-child > .block-control {
          display: none;
        }
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ul"'] > .block-children-container > .block-children > div[blockid] > div:first-child > div:first-child,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ul"'] > .block-children-container > .block-children > div[blockid] > div:first-child > div:first-child,
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ol"'] > .block-children-container > .block-children > div[blockid] > div:first-child > div:first-child,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ol'] > .block-children-container > .block-children > div[blockid] > div:first-child > div:first-child,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ol-nested'] div[blockid] > .block-children-container > .block-children > div[blockid] > div:first-child > div:first-child {
          display: flex;
        }
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ul"'] div[blockid] > .block-children-container,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ul"'] div[blockid] > .block-children-container {
          margin-left: 22px !important;
        }
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ol"'] > .block-children-container > .block-children > div[blockid] > .block-children-container,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ol'] > .block-children-container > .block-children > div[blockid] > .block-children-container {
          margin-left: 29px !important;
        }
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ol-nested'] > .block-children-container > .block-children > div[blockid] > .block-children-container {
          margin-left: 0 !important;
        }
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ul"'] div[blockid] .block-control,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ul"'] div[blockid] .block-control,
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ol"'] div[blockid] .block-control,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ol'] div[blockid] .block-control {
          min-width: 0;
        }
        .kef-doc #main-content-container div[level="${unindentLevel}"] > .block-children-container .block-children-container {
          margin-left: 29px !important;
        }
        .kef-doc #main-content-container div[level="${unindentLevel}"] > .block-children-container div[blockid] > div:first-child > div:first-child {
          display: flex;
        }
        .kef-doc #main-content-container div[level="${unindentLevel}"] div[blockid] .block-control {
          min-width: 11px;
        }
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ul"'] div[blockid] .control-show,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ul"'] div[blockid] .control-show,
        .kef-doc #main-content-container div[blockid][data-refs-self*='"ol"'] div[blockid] .control-show,
        .kef-doc #main-content-container div[blockid][data-refs-self*='".ol'] div[blockid] .control-show {
          display: none;
        }
      `,
    })
  } else {
    logseq.provideStyle({ key: "kef-doc-unindent", style: "/**/" })
  }
}

const model = {
  async toggleDocView() {
    const appContainer = parent.document.getElementById("app-container")

    if (appContainer.classList.contains("kef-doc")) {
      for (const event of EVENTS_TO_PREVENT) {
        parent.document.body.removeEventListener(event, preventEditing, {
          capture: true,
        })
      }
      appContainer.classList.remove("kef-doc", "kef-doc-show-refs")
      parent.document.body.style.height = null
    } else {
      await logseq.Editor.exitEditingMode()
      parent.document.body.style.height = "auto"
      appContainer.classList.add(
        ...[
          "kef-doc",
          ...(logseq.settings?.showReferences ? ["kef-doc-show-refs"] : []),
        ],
      )
      for (const event of EVENTS_TO_PREVENT) {
        parent.document.body.addEventListener(event, preventEditing, {
          capture: true,
          passive: true,
        })
      }
    }
  },

  startDownload() {
    const doc = prepareDoc()
    saveDoc(doc)
  },
}

async function main() {
  uiModalOverlay = parent.document.querySelector(".ui__modal-overlay")

  const { preferredLanguage: lang } = await logseq.App.getUserConfigs()

  injectStyles()

  logseq.App.registerUIItem("toolbar", {
    key: `kef-doc-doc`,
    template: `<div class="kef-doc-container"><a class="kef-doc-icon kef-doc-download" data-on-click="startDownload" title="${
      lang === "zh-CN" ? "导出页面" : "Export page"
    }">${downloadSvg}</a>
    <a class="kef-doc-icon" data-on-click="toggleDocView" title="${
      lang === "zh-CN" ? "开启关闭文档视图" : "Toggle document view"
    }">${docSvg}</a></div>`,
  })

  logseq.App.registerCommandPalette(
    {
      key: "toggle-doc-view",
      label: lang === "zh-CN" ? "切换文档视图模式" : "Toggle document view",
      ...(logseq.settings?.shortcut && {
        keybinding: {
          binding: logseq.settings.shortcut,
        },
      }),
    },
    (e) => {
      model.toggleDocView()
    },
  )

  logseq.beforeunload(() => {
    for (const event of EVENTS_TO_PREVENT) {
      parent.document.body.removeEventListener(event, preventEditing, {
        capture: true,
      })
    }
    const appContainer = parent.document.getElementById("app-container")
    appContainer.classList.remove("kef-doc")
    parent.document.body.style.overflow = null
  })

  logseq.useSettingsSchema([
    {
      key: "showReferences",
      type: "boolean",
      default: false,
      description:
        lang === "zh-CN"
          ? "是否在文档视图中显示有关联的页面。"
          : 'It defines whether or not to show the "Linked Reference" section.',
    },
    {
      key: "unindentLevel",
      type: "number",
      default: 999,
      description:
        lang == "zh-CN"
          ? "设置要在文档视图中去掉多少级的缩进。最小为0。"
          : "It defines how many levels you want to unindent while in the document view. Mininum is 0.",
    },
    {
      key: "shortcut",
      type: "string",
      default: "mod+shift+d",
      description:
        lang == "zh-CN"
          ? "设置切换文档视图状态的快捷键。"
          : "It defines a shortcut for toggling the document view.",
    },
  ])

  logseq.onSettingsChanged((current, old) => {
    injectStyles()
  })

  console.log("#doc loaded")
}

logseq.ready(model, main).catch(console.error)
