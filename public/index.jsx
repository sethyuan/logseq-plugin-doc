import "@logseq/libs"

async function main() {
  logseq.provideStyle(`
    .kef-doc {
    }
  `)

  console.log("#doc loaded")
}

logseq.ready(main).catch(console.error)
