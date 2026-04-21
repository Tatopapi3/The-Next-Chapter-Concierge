/* ============================================================
   Netlify Function: subscribe
   - Adds contact to Mailchimp audience
   - Sends the free guide PDF via Resend
   ============================================================ */

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let name, email;
  try {
    ({ name, email } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
  }

  const [firstName = '', ...rest] = (name || '').trim().split(' ');
  const lastName = rest.join(' ');

  const mcKey      = process.env.MAILCHIMP_API_KEY;
  const mcAudience = process.env.MAILCHIMP_AUDIENCE_ID;
  const mcServer   = mcKey.split('-')[1]; // e.g. "us20"
  const resendKey  = process.env.RESEND_API_KEY;
  const guideUrl   = process.env.GUIDE_PDF_URL;
  const siteUrl    = process.env.URL || 'https://thenextchapterconcierge.co';

  // ── 1. Add to Mailchimp ──────────────────────────────────────
  try {
    const mcRes = await fetch(
      `https://${mcServer}.api.mailchimp.com/3.0/lists/${mcAudience}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`anystring:${mcKey}`).toString('base64')}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: { FNAME: firstName, LNAME: lastName },
        }),
      }
    );

    const mcData = await mcRes.json();
    // 400 with "Member Exists" is fine — they're already subscribed
    if (!mcRes.ok && mcData.title !== 'Member Exists') {
      console.error('Mailchimp error:', mcData);
    }
  } catch (err) {
    console.error('Mailchimp fetch failed:', err);
  }

  // ── 2. Send guide email via Resend ───────────────────────────
  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Lillya at The Next Chapter Concierge <Lillya@thenextchapterconcierge.co>',
        to: email,
        subject: "Your Free Guide Is Here 💛",
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c2c2c;">
            <div style="background: #2d4a2d; padding: 32px 40px; border-radius: 8px 8px 0 0;">
              <p style="color: #c9a84c; font-family: Arial, sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px;">The Next Chapter Concierge</p>
              <h1 style="color: white; font-size: 24px; margin: 0; line-height: 1.3;">
                The Daughter's Guide to Helping a Parent Through a Major Life Transition
              </h1>
            </div>

            <div style="background: #faf8f5; padding: 40px; border-radius: 0 0 8px 8px; border: 1px solid #e8e0d5; border-top: none;">
              <p style="font-size: 17px; line-height: 1.7; margin: 0 0 20px;">
                Hi ${firstName || 'there'},
              </p>
              <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a; margin: 0 0 24px;">
                Thank you for reaching out. Your free guide is ready — click the button below to download it.
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${guideUrl}"
                   style="background: #2d4a2d; color: white; text-decoration: none; padding: 16px 36px; border-radius: 4px; font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; display: inline-block;">
                  Download Your Free Guide
                </a>
              </div>

              <p style="font-size: 14px; line-height: 1.7; color: #7a7a7a; margin: 24px 0 0;">
                If you have any questions or would like to talk through your family's situation,
                I'm always here. You can reply directly to this email or
                <a href="${siteUrl}/contact.html" style="color: #2d4a2d;">schedule a free consultation</a>.
              </p>

              <hr style="border: none; border-top: 1px solid #e8e0d5; margin: 32px 0;" />

              <p style="font-size: 13px; color: #aaa; margin: 0; text-align: center;">
                With care,<br/>
                <strong style="color: #4a4a4a;">Lillya</strong><br/>
                The Next Chapter Concierge<br/>
                <a href="tel:+19175727257" style="color: #aaa;">(917) 572-7257</a>
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.json();
      console.error('Resend error:', err);
      return { statusCode: 500, body: JSON.stringify({ error: 'Email send failed' }) };
    }
  } catch (err) {
    console.error('Resend fetch failed:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Email send failed' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
};
