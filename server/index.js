const express = require("express");
const app = express();
const port = 3000; // You can choose any available port

// Define a route
app.get("/", (req, res) => {
  let imageUrl = "https://picsum.photos/200/300";

  let button1Text = "IShowSpeed";

  res.status(200).send(`
  <!DOCTYPE html>
      <html>
        <head>
          <title>Vote Recorded</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${imageUrl} />
          <meta property="fc:frame:button:1" content="Green" />
          <meta property="fc:frame:button:2" content="Purple" />
          <meta property="fc:frame:button:3" content="Red" />
          <meta property="fc:frame:button:4" content="Blue" />
        </head>
        <body>
          <p>hello</p>
        </body>
      </html>`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
