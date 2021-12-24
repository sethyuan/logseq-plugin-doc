import "@logseq/libs"

const docSvg = `<svg class="kef-doc-svg" viewBox="0 0 20 20">
<path fill="none" d="M19.471,8.934L18.883,8.34c-2.096-2.14-4.707-4.804-8.903-4.804c-4.171,0-6.959,2.83-8.996,4.897L0.488,8.934c-0.307,0.307-0.307,0.803,0,1.109l0.401,0.403c2.052,2.072,4.862,4.909,9.091,4.909c4.25,0,6.88-2.666,8.988-4.807l0.503-0.506C19.778,9.737,19.778,9.241,19.471,8.934z M9.98,13.787c-3.493,0-5.804-2.254-7.833-4.3C4.182,7.424,6.493,5.105,9.98,5.105c3.536,0,5.792,2.301,7.784,4.332l0.049,0.051C15.818,11.511,13.551,13.787,9.98,13.787z"></path>
<circle fill="none" cx="9.98" cy="9.446" r="1.629"></circle>
</svg>`

const downloadSvg = `<svg class="kef-doc-svg" viewBox="0 0 20 20">
<path fill="none" d="M9.634,10.633c0.116,0.113,0.265,0.168,0.414,0.168c0.153,0,0.308-0.06,0.422-0.177l4.015-4.111c0.229-0.235,0.225-0.608-0.009-0.836c-0.232-0.229-0.606-0.222-0.836,0.009l-3.604,3.689L6.35,5.772C6.115,5.543,5.744,5.55,5.514,5.781C5.285,6.015,5.29,6.39,5.522,6.617L9.634,10.633z"></path>
<path fill="none" d="M17.737,9.815c-0.327,0-0.592,0.265-0.592,0.591v2.903H2.855v-2.903c0-0.327-0.264-0.591-0.591-0.591c-0.327,0-0.591,0.265-0.591,0.591V13.9c0,0.328,0.264,0.592,0.591,0.592h15.473c0.327,0,0.591-0.264,0.591-0.592v-3.494C18.328,10.08,18.064,9.815,17.737,9.815z"></path>
</svg>`

function preventEditing(e) {
  e.stopPropagation()
}

function prepareDoc() {
  const html = parent.document.documentElement.cloneNode()
  const head = parent.document.head.cloneNode(true)
  const body = parent.document.body.cloneNode()
  const rootDiv = parent.document.body.firstElementChild.cloneNode()
  const themeDiv =
    parent.document.body.firstElementChild.firstElementChild.cloneNode()
  const appDiv = parent.document.getElementById("app-container").cloneNode()
  const mainDiv = parent.document
    .getElementById("main-content-container")
    .cloneNode()

  for (const node of head.children) {
    if (
      node.rel === "stylesheet" &&
      node.attributes.href.value.startsWith(".")
    ) {
      node.attributes.href.value = node.href
    }
  }
  body.appendChild(rootDiv)
  rootDiv.appendChild(themeDiv)
  themeDiv.appendChild(appDiv)
  appDiv.appendChild(mainDiv)
  mainDiv.innerHTML = parent.document.getElementById(
    "main-content-container",
  ).innerHTML

  html.appendChild(head)
  html.appendChild(body)

  return html.outerHTML
}

function saveDoc(doc) {
  const blob = new Blob([doc], { type: "text/plain" })
  const link = document.createElement("a")
  link.download = "doc.html"
  link.href = URL.createObjectURL(blob)
  link.onclick = () => URL.revokeObjectURL(blob)
  link.style.display = "none"
  link.click()
}

function createModel() {
  return {
    async toggleDocView() {
      const appContainer = parent.document.getElementById("app-container")
      const pageContainer = parent.document.querySelector(".page.relative")

      if (appContainer.classList.contains("kef-doc")) {
        if (pageContainer) {
          for (const event of ["mousedown", "click"]) {
            pageContainer.removeEventListener(event, preventEditing, {
              capture: true,
            })
          }
        }
        appContainer.classList.remove("kef-doc")
        parent.document.body.style.overflow = null
      } else {
        if (pageContainer == null) {
          const { preferredLanguage: lang } = await logseq.App.getUserConfigs()
          logseq.App.showMsg(
            lang === "zh-CN"
              ? "您需要进入到页面或块中方可预览！"
              : "You must be within a page or block to preview!",
            "warn",
          )
          return
        }
        parent.document.body.style.overflow = "auto"
        appContainer.classList.add("kef-doc")
        for (const event of ["mousedown", "click"]) {
          pageContainer.addEventListener(event, preventEditing, {
            capture: true,
          })
        }
      }
    },

    startDownload() {
      const doc = prepareDoc()
      saveDoc(doc)
    },
  }
}

function main() {
  logseq.provideStyle(`
    .kef-doc-icon {
      display: inline-block;
      width: 30px;
      height: 30px;
      padding: 4px 5px;
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
      display: none;
    }
    .kef-doc .kef-doc-download {
      display: inline-block;
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
    .kef-doc #main-content-container span.inline div[data-tooltipped] .tag {
      display: none !important;
    }
    .kef-doc #main-content-container div[blockid] > div:first-child > div:first-child {
      display: none;
    }
    .kef-doc #main-content-container .block-children {
      margin-left: 0 !important;
      border-left: 0 !important;
    }
    .kef-doc #main-content-container div[blockid][data-refs-self*='"ul"'] .block-children div[blockid] > div:first-child > div:first-child {
      display: flex;
    }
    .kef-doc #main-content-container div[blockid][data-refs-self*='"ul"'] .block-children span.inline {
      padding-left: 0;
    }
    .kef-doc #main-content-container .page.relative .references {
      display: none;
    }
  `)

  logseq.App.registerUIItem("toolbar", {
    key: `kef-doc-doc`,
    template: `<div style="margin: 0 5px;"><a class="kef-doc-icon" data-on-click="toggleDocView">${docSvg}</a>
    <a class="kef-doc-icon kef-doc-download" data-on-click="startDownload">${downloadSvg}</a></div>`,
  })

  logseq.beforeunload(() => {
    const appContainer = parent.document.getElementById("app-container")
    const pageContainer = parent.document.querySelector(".page.relative")
    appContainer.classList.remove("kef-doc")
    parent.document.body.style.overflow = null
    if (pageContainer) {
      for (const event of ["mousedown", "click"]) {
        pageContainer.removeEventListener(event, preventEditing, {
          capture: true,
        })
      }
    }
  })

  console.log("#doc loaded")
}

logseq.ready(createModel(), main).catch(console.error)
