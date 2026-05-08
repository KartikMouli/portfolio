import { Suspense } from 'react';
import { GraduationCap, Briefcase } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '../ui/card';
import { WorkExperience } from '@/components/work-experience';
import {
  getWorkExperienceForComponent,
  getEducationForComponent,
} from '@/lib/data/work-experience';

// The @ncdai/work-experience component is a Client Component that calls
// `new Date()` for ongoing positions to compute durations. With Next 16
// `cacheComponents: true`, that requires a Suspense boundary so the
// non-deterministic time stays out of the prerender output.
function TimelineFallback() {
  return <div className="h-40 animate-pulse rounded bg-muted/30" />;
}

/**
 * Wraps the @ncdai/work-experience component in the existing
 * Experience / Education tabs. Data is adapted in
 * `lib/data/work-experience.ts` from our local JSON files.
 */
export default function Timeline() {
  const experiences = getWorkExperienceForComponent();
  const education = getEducationForComponent();

  return (
    <div className="w-full">
      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="size-4" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="size-4" />
            Education
          </TabsTrigger>
        </TabsList>
        <TabsContent value="experience" className="mt-0">
          <Card className="p-0">
            <CardContent className="p-0">
              <Suspense fallback={<TimelineFallback />}>
                <WorkExperience
                  experiences={experiences}
                  className="px-6 py-2"
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="education" className="mt-0">
          <Card className="p-0">
            <CardContent className="p-0">
              <Suspense fallback={<TimelineFallback />}>
                <WorkExperience experiences={education} className="px-6 py-2" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
