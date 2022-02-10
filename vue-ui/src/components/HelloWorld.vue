<template>
  <div class="hello">
    <button @click="handleSubmit">获取值b1的值</button>
    <h1>doc2html</h1>
    <div class="doc-preview" >
      <div class="doc-preview" v-html="html" />
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
        if(doc.slice(doc.search(key)-1, doc.search(key)) === '>') {
          docArr.splice(doc.search(key) - 1, 0, ` style="display:inline-block;min-width: 30px;border-bottom: 1px solid red" contenteditable="true" id="${key.replace(/{{|}}|@/g, '')}"`)
          doc = docArr.join('')
        } else {
          docArr.splice(doc.search(key), 0, `<span style="display:inline-block;min-width: 30px;border-bottom: 1px solid red" contenteditable="true" id="${key.replace(/{{|}}|@/g, '')}">${key}</span>`)
          doc = docArr.join('')
          doc.replace('{{' + key + '}}', '')
        }
      })
      this.html = doc
    })
  },
  methods: {
    doc2Html (content) {
      return new Promise((resolve, reject) => {
        try {
          const file = content.data
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
    handleSubmit () {
      const dom = document.getElementById('a01')
      alert(dom.innerText)
    }
  }
}
</script>
<style>
.doc-preview {
  border-radius: 8px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.doc-preview table {
  margin-bottom: 20px;
}
.doc-preview img {
  max-width: 150px;
}
.doc-preview tr:nth-child(2n) {
  background-color: #f6f8fa;
}
.doc-preview td,
.doc-preview th {
  border: 1px solid #dfe2e5;
  padding: .6em 1em;
}
.doc-preview tr {
  border-top: 1px solid #dfe2e5;
}
.doc-preview table {
  border-collapse: collapse;
}
</style>
