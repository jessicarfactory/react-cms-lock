require("dotenv").config()
const { GoogleSpreadsheet } = require("google-spreadsheet")
const { OAuth2Client } = require('google-auth-library');
const express = require("express")()

// process.env global var is injected by Node at runtime
// Represents the state of the sys environment
const p = process.env

// Set up GET route in Express
express.get('/api/team/', async (request, response) => {
  // Set up what we want to allow, method-wise (security, etc)
  const authorisedMethods = ["GET"]
  // First we want to make sure this is a GET request before we do anything
  // (If the authorisedMethods does *not* include our listed methods, bail out)
  if (!authorisedMethods.includes(request.method)) {
    response.json({
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      status: {
        "code": "405",
        "text": "HTTP Method not allowed.",
      },
      msg: "This route doesn't accept that method. Maybe you meant to GET?",
    });
  }

  // Otherwise we run our main op
  else {
    // Set up auth object
    //console.log('p==>>>', p)
    // const oauthClient = new OAuth2Client({
    // clientId: p.CLIENT_ID,
    // clientSecret: p.CLIENT_SECRET,
   //  });

    // Initialise a new Spreadsheet object
    const doc = new GoogleSpreadsheet(p.SPREADSHEET_ID)
    // Use the API key to authorise the request
    try {
      await doc.useApiKey(p.API_KEY)

      await doc.loadInfo();
      console.log('doc titt==>>', doc.title)

      // Get the specific sheet from the document, as well as the row data
      const targetSheet = doc.sheetsByIndex[0];
      const sheetRows = await targetSheet.getRows();

      // Initialise a new array to store the data we want to pull out
      let teamDataArray = []
      const n = 'No data returned from CMS field.'

      // Use for-of to add each field in the row to a new array, otherwise 'n'
      for (const [key, value] of Object.entries(sheetRows)) {
        teamDataArray.push({
          fullName: value.fullName || n,
          firstName: value.firstName || n,
          lastName: value.lastName || n,
          image: value.image || n,
          title: value.title || n,
          email: value.email || n,
          twitter: value.twitter || n,
        })
      }
      // We return a JSON response with a status, message and the data we built
      // In our system, if we made it this far, everything's OK, so we tell 'em
      response.json({
        status: {
          "code": "200",
          "text": "OK",
        },
        msg: "Entries successfully retrieved from Google Sheets.",
        data: teamDataArray,

      })
    }
    // Catch and log errors if it fails
    catch (e) {
      console.log('Unghgffortunately an error occurred:', e)
    }
  }
})

// Express listener, on port specified in .env file
express.listen(p.PORT, () =>
  console.log(`Express Server Running on port ${p.PORT}. Nice.`)
)