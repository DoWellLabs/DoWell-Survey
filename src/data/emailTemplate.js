
export async function getModalEmailTemplate(name, startDate, endDate, numOfParticipant,
  targetLocation, getQrcode) {




  const emailTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Survey Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 1px solid #e0e0e0;
      }
      .email-header {
        background-color: #007bff;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .email-header h1 {
        margin: 0;
        font-size: 24px;
      }
      .email-body {
        padding: 20px;
        color: #333;
        line-height: 1.6;
      }
      .email-body p {
        margin: 0 0 16px;
      }
      .details {
        margin-top: 20px;
        background-color: #f4f4f4;
        padding: 15px;
        border-radius: 8px;
        list-style: none;
        font-size: 14px;
      }
      .details li {
        margin-bottom: 10px;
        color: #555;
      }
      .details strong {
        color: #333;
      }
      .qr-section {
        text-align: center;
        margin-top: 30px;
      }
      .qr-section img {
        max-width: 150px;
        height: auto;
        margin-top: 10px;
      }
      .email-footer {
        background-color: #f9f9f9;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #777;
      }
      .email-footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <h1>Survey Confirmation</h1>
      </div>

      <!-- Body -->
      <div class="email-body">
        <p>Dear User,</p>
        <p>
          This is to confirm that your survey, <strong>${name}</strong>,
          has been successfully created on our platform. Below, you'll find the
          details of your survey. You can share the QR Code/Link with your intended
          participants or platform to start gathering responses.
        </p>

        <ul class="details">
          <li>Start Date: <strong>${startDate}</strong></li>
          <li>End Date: <strong>${endDate}</strong></li>
          <li>Maximum Participants: <strong>${numOfParticipant}</strong></li>
          <li>
            Target Location/Audience:
            <strong>${targetLocation} Regions</strong>
          </li>
          <li>QR Code Link: <a href="${getQrcode}" target="_blank">${getQrcode}</a></li>
        </ul>

        <div class="qr-section">
          <h2>QR Code:</h2>
          <img
            src="${getQrcode}"
            alt="QR Code"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="email-footer">
        <p>
          If you have any questions, feel free to contact us at
          <a href="mailto:support@example.com">support@example.com</a>.
        </p>
      </div>
    </div>
  </body>
</html>
`
  return emailTemplate
}



export async function getEmailTemplate(updatedInfo, startToEnd,
  numOfParticipant, regionValue, getQrcode, surveyLink) {

  const oldEmailTemplate = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Survey Confirmation</title>
          <style>
            body {
              font-family: "Arial", sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            }
            .details {
              font-size: 16px;
              line-height: 1.5;
              color: #333;
              margin-top: 50px;
            }
            .qr-code {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <p>Dear User,</p>
          <p>
            This is to confirm that a survey, <strong>${updatedInfo}</strong>,
            has been successfully created on our platform. Below, you'll find the
            details of the created survey. You can share the QR Code/Link with intended
            participants or on your platforms.
          </p>
          <div class="details">
            <ul>
              ${startToEnd}
              <li>
                Maximum Number of Participants/Responses:
                <strong>${numOfParticipant}</strong>
              </li>
              <li>
                Target Location/Audience:
                <strong>${regionValue} Region's</strong>
              </li>
              <li>QR Code Link: <strong>${getQrcode}</strong></li>
              <li>Click <a href="${surveyLink}">HERE</a> to take the survey</li>
              
            </ul>
          </div>
          <h2>QR Code:</h2>
          <img
            src="${getQrcode}"
            alt="QR Code"
            style="max-width: 200px; height: 200px"
          />
        </body>
      </html>
      `




  const emailTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Survey Confirmation</title>
    <style>
        body {
            font-family: "Arial", sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .title-bar {
            background-color: #0073e6;
            color: #ffffff;
            text-align: center;
            padding: 15px;
            font-size: 20px;
            font-weight: bold;
        }

        h2 {
            color: #444;
            text-align: center;
            margin-top: 30px;
            font-size: 20px;
        }

        p {
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 20px;
            color: #555;
        }

        ul {
            list-style: none;
            padding: 0 20px;
            margin: 0;
        }

        ul li {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
            color: #333;
        }

        ul li strong {
            color: #0073e6;
        }

        a {
            text-decoration: none;
            color: #0073e6;
            font-weight: bold;
        }

        .details {
            margin: 20px;
            padding: 15px;
            background-color: #f4f4f4;
            border-radius: 6px;
            border: 1px solid #ddd;
        }

        .qr-code {
            display: block;
            margin: 20px auto;
            max-width: 150px;
            height: 150px;
        }

        .footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            margin: 20px 0;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Title Bar -->
        <div class="title-bar">Survey Confirmation</div>

        <p>Dear User,</p>
        <p>
            This is to confirm that a survey, <strong>${updatedInfo}</strong>, has
            been successfully created on our platform. Below, you'll find the
            details of the created survey. You can share the QR Code/Link with the
            intended participants or on your platforms.
        </p>

        <div class="details">
            <ul>
                ${startToEnd}
                <li>
                    Maximum Number of Participants/Responses:
                    <strong>${numOfParticipant}</strong>
                </li>
                <li>
                    Target Location/Audience:
                    <strong>${regionValue} Region's</strong>
                </li>
                <li>QR Code Link: <strong>${getQrcode}</strong></li>
                <li>Click <a href="${surveyLink}">HERE</a> to take the survey</li>
            </ul>
        </div>

        <h2>QR Code</h2>
        <img class="qr-code" src="${getQrcode}" alt="QR Code" />

        <div class="footer">
            <p>Thank you for using our platform!</p>
            <p>&copy; ${new Date().getFullYear()} Your Company Name</p>
        </div>
    </div>
</body>

</html>
`
  return oldEmailTemplate
}