const { google } = require("googleapis")
const express = require("express")()
const fs = require("fs")
//const opn = require('open')
//const path = require('path')

require("dotenv").config()

const p = process.env

express.get('/api/team/', async (request, response) => {
    const auth = new google.auth.OAuth2(p.CLIENT_ID, p.CLIENT_SECRET)
    auth.setCredentials({ refresh_token: p.REFRESH_TOKEN })

    const sheets = google.sheets({ version: "v4", auth })

    const teamSheet = await sheets.spreadsheets.get({
      spreadsheetId: p.SPREADSHEET_ID,
      includeGridData: true,
    })
    // console.log(teamSheet.data.sheets[0].data[0].rowData)})

    // const teamSheet = teamSheet.data.sheets[0].data[0].rowData

    const rowData = teamSheet.data.sheets[0].data[0].rowData
    const fV = "formattedValue"
    const n = "None"
    const teamData = rowData.reduce((arr, data, i) => {
      const dV = data.values
      if (i > 0 && dV[8][fV] === "Active")
        arr.push({
          fullName: dV[0][fV] || n,
          firstName: dV[1][fV] || n,
          lastName: dV[2][fV] || n,
          image: dV[3][fV] || n,
          title: dV[4][fV] || n,
          bio: dV[5][fV] || n,
          email: dV[6][fV] || n,
          twitter: dV[7][fV] || n,
        })
      return arr
    }, [])

    response.json({
      status: {
        code: teamSheet.status,
        statusText: teamSheet.statusText,
      },
      message: "CMS Entries Sucessfully Retrieved from Google Sheets",
      data: teamData,
    })
    fs.writeFileSync(backupPath, JSON.stringify(teamData))
})
//   } catch (error) {
//     const sheetsError = error.errors[0]
//     sheetsError.code = error.code
//     try {
//       const cachedSheet = JSON.parse(fs.readFileSync(backupPath))
//       res.json({
//         status: sheetsError,
//         message:
//           "Error While Retrieving Google Sheet, Retrieved Latest Cached Sheet Instead",
//         data: cachedSheet,
//       })
//     } catch (nodeError) {
//       res.json({
//         status: {
//           sheetsError,
//           nodeError,
//         },
//         message:
//           "Error While Retrieving Google Sheet and Error Retrieving Cached Sheet",
//         data: null,
//       })
//     }
//   }
// })

express.listen(p.PORT, () =>
  console.log(`Express Server Running on port ${p.PORT}`)
)


// express.get('/api/data/', async (request, response) => {
//   try {
//     const auth = new google.auth.OAuth2(p.CLIENT_ID, p.CLIENT_SECRET)
//     auth.setCredentials({ refresh_token: p.REFRESH_TOKEN })

//     const sheets = google.sheets({ version: "v4", auth })

//     const teamSheet = await sheets.spreadsheets.get({
//       spreadsheetId: p.SPREADSHEET_ID,
//       includeGridData: true,
//     })

//     const rowData = teamSheet.data.sheets[0].data[0].rowData
//     const fV = "formattedValue"
//     const n = "None"
//     const teamData = rowData.reduce((arr, data, i) => {
//       const dV = data.values
//       if (i > 0 && dV[8][fV] === "Active")
//         arr.push({
//           fullName: dV[0][fV] || n,
//           firstName: dV[1][fV] || n,
//           lastName: dV[2][fV] || n,
//           image: dV[3][fV] || n,
//           title: dV[4][fV] || n,
//           bio: dV[5][fV] || n,
//           email: dV[6][fV] || n,
//           twitter: dV[7][fV] || n,
//         })
//       return arr
//     }, [])

//     response.json({
//       status: {
//         code: teamSheet.status,
//         statusText: teamSheet.statusText,
//       },
//       message: "CMS Entries Sucessfully Retrieved from Google Sheets",
//       data: teamData,
//     })
//     fs.writeFileSync(backupPath, JSON.stringify(teamData))
//   } catch (error) {
//     const sheetsError = error.errors[0]
//     sheetsError.code = error.code
//     try {
//       const cachedSheet = JSON.parse(fs.readFileSync(backupPath))
//       res.json({
//         status: sheetsError,
//         message:
//           "Error While Retrieving Google Sheet, Retrieved Latest Cached Sheet Instead",
//         data: cachedSheet,
//       })
//     } catch (nodeError) {
//       res.json({
//         status: {
//           sheetsError,
//           nodeError,
//         },
//         message:
//           "Error While Retrieving Google Sheet and Error Retrieving Cached Sheet",
//         data: null,
//       })
//     }
//   }
// })

// express.listen(p.PORT, () =>
//   console.log(`Express Server Running on port ${p.PORT}`)
// )
