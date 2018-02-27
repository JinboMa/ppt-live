let fs = require('fs')
let marked = require('marked')
let highlight = require('highlight.js')
let Prism = require('prismjs')
let path = require('path')
let mdPath = path.join(__dirname, '../docs/show.md')

marked.setOptions({
  highlight: function (code) {
    // return highlight.highlightAuto(code).value
    return Prism.highlight(code, Prism.languages.javascript)
  }
})

function markdown() {
  let res = { con: '', page: 'home', children: [] }
  let str = fs.readFileSync(mdPath, 'utf-8')
  let children = str.split(/[\n\r\s]##\s/)
  res.con = marked(children.shift())
  children.forEach((child, index) => {
    let second_res = { con: '', page: '', children: [] }
    let seconds = child.split(/[\n\r\s]###\s/)
    let childrenData = []
    second_res.con = marked(`## ${seconds.shift()}`)
    second_res.page = `${index + 1}`
    seconds.forEach((item, num) => {
      childrenData.push({
        con: marked(`### ${item}`),
        page: `${index + 1}-${num + 1}`
      })
    })
    second_res.children = childrenData
    res.children.push(second_res)
  })
  return res
}
markdown()
module.exports = markdown