// resend.ts
import { Resend } from 'resend';

export const sendVerificationRequest = async (
  params: any,
) => {
  let { identifier: email, url, provider: { from } } = params;
  try {
    const resend = new Resend( process.env.RESEND_API_KEY! );
    await resend.emails.send({
      from: from,
      to: email,
      subject: `Acesse seu Cardápio Digital no Restaurox`,
      html: html({ url, email }),
    });
  } catch (error) {
    console.log({ error });
  }
};

function html({ url, email }: { url: any; email: any }) {
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  const backgroundColor = "#f4f4f4"
  const textColor = "#444444"
  const mainBackgroundColor = "#ffffff"
  const buttonBackgroundColor = "#b91c1c"
  const buttonBorderColor = "#b91c1c"
  const buttonTextColor = "#ffffff"

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <img src="https://utfs.io/f/0814f9dd-ba26-4a9e-b900-52f7fc5a336f-51kl5c.png" alt="Restaurox Logo" style="max-width: 200px; margin-bottom: 20px;">
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Olá, <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 15px 25px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Acessar Meu Cardápio Digital</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Clique no botão acima para acessar o Restaurox e começar a criar seu cardápio digital!
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 14px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Se você não solicitou este email, pode ignorá-lo com segurança.
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 14px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        © 2023 Restaurox - Seu Parceiro em Cardápios Digitais
      </td>
    </tr>
  </table>
</body>
`
}
