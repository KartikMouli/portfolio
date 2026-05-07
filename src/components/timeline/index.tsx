import { GraduationCap, Briefcase } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getExperience } from '@/lib/data/experience';
import { getEducation } from '@/lib/data/education';
import TimelineItem from './timeline-item';
import { Card, CardContent } from '../ui/card';

export default function Timeline() {
  const experience = getExperience();
  const education = getEducation();

  return (
    <div className="w-full">
      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
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
          <Card>
            <CardContent className="p-0">
              <ul className="ml-10 border-l">
                {experience.map((item) => (
                  <TimelineItem
                    key={`${item.name}::${item.start}`}
                    timelineItem={item}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="education" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <ul className="ml-10 border-l">
                {education.map((item) => (
                  <TimelineItem
                    key={`${item.name}::${item.start}`}
                    timelineItem={item}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
