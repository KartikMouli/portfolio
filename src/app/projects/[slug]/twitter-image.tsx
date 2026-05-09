// Twitter share card — Next.js convention is a separate file, but the
// design is identical to the OG card so we re-export it.
export {
  default,
  alt,
  size,
  contentType,
  generateStaticParams,
} from './opengraph-image';
