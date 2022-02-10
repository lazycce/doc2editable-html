<template>
  <div class="hello">
    <button @click="handleSubmit">获取值b1的值</button>
    <h1>doc2html</h1>
    <div class="doc-preview" >
      <div v-html="html" />
    </div>
  </div>
</template>
<script>
import axios from 'axios'
var mammoth = require("mammoth");
export default {
  name: 'HelloWorld',
  props: {
  },
  data() {
    return {
      // contenteditable="true" // \{\{([\w*|\s*]*)}\}
      html: null
    }
  },
  created() {
    axios({
      url: '/api/download',
      method: 'get',
      responseType: 'blob'
    }).then(async res => {
      let doc = await  this.doc2Html(res)
      // console.log(doc)
      const pattern = /\{\{([@|\w*|\s*]*)}\}/g;
      const keyAtrr =  doc.match(pattern)
      console.log('res', keyAtrr)
      keyAtrr.forEach(key => {
        console.log(doc.search(key))
        let docArr = doc.split("")
        console.log(doc.slice(doc.search(key)-1, doc.search(key)))
        if(doc.slice(doc.search(key)-1, doc.search(key)) === '>') {
          docArr.splice(doc.search(key) - 1, 0, ` contenteditable="true" id="${key.replace(/{{|}}|@/g, '')}"`)
          doc = docArr.join('')
        } else {
          docArr.splice(doc.search(key) - 1, 0, `<span contenteditable="true" id="${key.replace(/{{|}}|@/g, '')}">${key}</span>`)
          doc = docArr.join('')
          doc.replace('{{' + key + '}}', '')
        }
      })
      console.log('after', doc)
      this.html = doc
    })
  },
  methods: {
    doc2Html (content) {
      return new Promise((resolve, reject) => {
        try {
          const file = content.data
          console.log(file)
          const reader = new FileReader()
          reader.onloadend = async () => {
            const arrayBuffer = reader.result
            const result = await this.readWordArrayBufferToHtml(arrayBuffer).catch(e => reject(e))
            resolve(result)
          }
          reader.readAsArrayBuffer(file)
        } catch(e) {
          reject(e)
        }
      })
    },
    readWordArrayBufferToHtml (arrayBuffer) {
      return new Promise((resolve, reject) => {
        mammoth.convertToHtml({arrayBuffer: arrayBuffer}).then(resultObject => {
          resolve(resultObject.value)
        }).catch(e => reject(e))
      })
    },
    replaceKey() {
    },
    handleClick(e) {
      console.log(e)
    },
    handleSubmit () {
      const dom = document.getElementById('b1')
      alert(dom.innerText)
    }
  }
}
</script>
<style >
td {
  border: 1px solid red;
}
</style>
