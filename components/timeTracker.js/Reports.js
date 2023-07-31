import React from 'react'
import Head from 'next/head';

const Reports = () => {
  return (
    <div>
    <Head>
      <title>Time Tracking</title>
      <meta name="viewport" content="width=device-width" />
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          height: 80%;
          overflow: hidden;
        }

        #iframe-container {
          position: fixed;
          top: 50px;
          left:9rem;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        #iframe-container iframe {
          width: 100%;
          height: 100%;
          border: none;
          overflow: hidden;
        }
      `}</style>
    </Head>

    <div id="iframe-container">
      <iframe
        src="https://app.powerbi.com/view?r=eyJrIjoiYjNjNjVhZmEtMjgwMi00MzM0LWFlOWMtOWVhMGJjOTlhY2JhIiwidCI6ImRmODY3OWNkLWE4MGUtNDVkOC05OWFjLWM4M2VkN2ZmOTVhMCJ9&pageName=ReportSection170d5cc2ea32242ccbba"
      ></iframe>
    </div>
  </div>
  )
}

export default Reports
