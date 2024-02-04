// pages/api/hello.ts

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle the request and send the response
  let imageUrl = "https://picsum.photos/400/200";

  res.status(200).send(
    `
    <!DOCTYPE html>
      <html>
        <head>
          <title>Vote Recorded</title>
          <meta property="og:title" content="Vote Recorded">
          <meta property="og:image" content="${imageUrl}">
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${imageUrl} />
          <meta property="fc:frame:button:1" content="Green" />
          <meta property="fc:frame:button:2" content="Purple" />
          <meta property="fc:frame:button:3" content="Red" />
          <meta property="fc:frame:button:4" content="Blue" /> 
        </head> 
        <body>
          <p>THis is a very big body I assume Just seeing if it is working</p>
        </body>
      </html>`
  );
}
