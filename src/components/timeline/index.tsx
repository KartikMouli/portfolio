import React from 'react';
import educationData from '@/data/education.json';
import experienceData from '@/data/experience.json';
import { GraduationCap, Briefcase } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EducationSchema, ExperienceSchema } from '@/lib/schemas';
import TimelineItem from './timeline-item';
import { Card, CardContent } from '../ui/card';

const Timeline: React.FC = () => {
  const experience = ExperienceSchema.parse(experienceData.experienceData);
  const education = EducationSchema.parse(educationData.educationData);

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
                {experience.map((item, index) => (
                  <TimelineItem key={index} timelineItem={item} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="education" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <ul className="ml-10 border-l">
                {education.map((item, index) => (
                  <TimelineItem key={index} timelineItem={item} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Timeline;
