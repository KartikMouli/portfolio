import { FileDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { siteConfig } from '@/config/site';

export default function ResumeButton() {
  return (
    <Link
      href={siteConfig.links.resume}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button
        variant="outline"
        className="px-3 py-1 hover:cursor-pointer justify-center items-center"
      >
        <span>Resume</span>
        <FileDown className="ml-2 size-5" />
      </Button>
    </Link>
  );
}
