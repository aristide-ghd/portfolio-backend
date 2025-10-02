# Portfolio Backend (Contact Form)

Minimal Node.js + Express backend to receive contact form submissions and forward them by email.

Quick start

1. Copy `.env.example` to `.env` and fill values (if you want to actually send emails, set MAILER to non-"console" and configure SMTP).

2. Install dependencies:

   npm install

3. Run in development mode (auto-reload):

   npm run dev

4. Send POST requests to `POST /api/contact` with JSON body:

   {
     "name": "Your Name",
     "email": "you@example.com",
     "message": "Hello!"
   }

Notes

- By default the mailer is set to `console` in `.env.example` and will only log the outgoing email.
- A rate limiter restricts calls to 5 per hour per IP to avoid abuse.
