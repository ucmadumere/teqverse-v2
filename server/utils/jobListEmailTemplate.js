const getJobListingsTemplate = (first_name, jobs) => `

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
      /* Your email styles here */
    </style>
  </head>
  <body>
    <!-- Email content -->
    <span class="preheader">Here are the latest job listings matching your interests.</span>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="email-masthead">
                <a href="" class="f-fallback email-masthead_name"></a>
              </td>
            </tr>

            <tr>
              <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell">
                      <div class="f-fallback">
                        <h1>Hi ${first_name},</h1>
                        <p>Here are the latest job listings that match your interests:</p>
                        
                        <!-- Job listings -->
                        ${jobs.map(job => `
                        <h2><a href="http://localhost:5000/jobdetails/${job._id}">${job.title}</a></h2>
                        <p>Description:<br>${job.jobDescription}</p>
                        <p>Location: ${job.location ? job.location : 'Not specified'}</p>
                        <p>Skills required: ${job.skills.join(', ')}</p>
                        <p>Salary: ${job.salary ? job.salary : 'Not specified'}</p>
                        <hr />
                      `).join('')}
                      
                      
                        
                        <p>For more details and to apply, visit our website.</p>
                        <p>Thanks, <br />The TeqVerse team</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell" align="center">
                      <p class="f-fallback sub align-center">TeqVerse</p>
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

module.exports = getJobListingsTemplate;
