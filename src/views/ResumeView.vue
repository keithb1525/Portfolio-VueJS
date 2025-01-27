<script>
import PDFViewer from 'pdf-viewer-vue'

// OR THE FOLLOWING IMPORT FOR VUE 2
// import PDFViewer from 'pdf-viewer-vue/dist/vue2-pdf-viewer'

export default {
  components: {
    PDFViewer,
  },

  data() {
    return {
      url: '/assets/resume2025.pdf',
      base64: '<BASE64_ENCODED_PDF>',
    }
  },
}
</script>

<template>
    <div class="fade-in" >
      <h1>Resume</h1>
      <div class="pdf">
        <PDFViewer :source="url" @download="handleDownload"/>
      </div>
    </div>
  </template>
  
  <style scoped>
  .pdf{
    height: 100vh;
  }
  </style>
  