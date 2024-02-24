const getEmailVerificationTemplate = (first_name, token, req) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title></title>
    <style type="text/css" rel="stylesheet" media="all">
      /* Your CSS styles here */
      body {
        background-color: #f2f4f6;
        color: #51545e;
        font-family: Arial, sans-serif;
      }
      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .email-content {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .email-body {
        width: 570px;
        margin: 0 auto;
        padding: 0;
      }
      .email-body_inner {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .content-cell {
        padding: 45px;
      }
      h1 {
        color: #333333;
        font-size: 22px;
        font-weight: bold;
        margin-top: 0;
      }
      p {
        font-size: 16px;
        margin: 0 0 20px;
      }
      a {
        color: #3869d4;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <span class="preheader">Please verify your email.</span>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell" style="text-align: center;">
                      <div class="f-fallback">
                        <h1>Hello ${first_name},</h1>
                        <p>Please verify your email by clicking the following link:</p>
                        <p style="text-align: center;">
                          <a href="http://${req.headers.host}/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #3869d4; color: white; text-decoration: none; border-radius: 25px;">Verify Email</a>
                        </p>
                        <p style="text-align: center; margin-top: 20px;">
                          If the button did not work, copy this link and paste it in your browser:<br>
                          <a href="http://${req.headers.host}/verify-email?token=${token}" style="color: #3869d4; text-decoration: underline;">http://${req.headers.host}/verify-email?token=${token}</a>
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = getEmailVerificationTemplate;
