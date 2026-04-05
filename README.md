This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Production Setup

This repository is ready for a standard Vercel deployment with the default Next.js build settings.

### Required environment variables

Set these in your Vercel project before deploying:

- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` for the contact form.
- `NEXT_PUBLIC_APP_ID` for the Dify client configuration.
- `DIFY_APP_KEY` for server-side Dify requests.
- `NEXT_PUBLIC_API_URL` for the Dify API base URL.
- `GOOGLE_VERIFICATION_CODE` for Google Search Console verification.

The template file [`.env.example`](.env.example) lists the expected values and which ones are client-side versus server-side.

### Vercel deployment

1. Import the repository into Vercel.
2. Add the required environment variables in the Vercel project settings.
3. Leave the build command as `npm run build`; Vercel will detect the Next.js app automatically.
4. Deploy from the main branch after confirming the production build passes.

### Local verification

Run the same checks locally before pushing changes:

```bash
npm run lint
npm run build
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
