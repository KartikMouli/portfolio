import certificationsJson from '@/data/certifications.json';
import { CertificationsSchema } from '@/lib/schemas';

export function getCertifications() {
  return CertificationsSchema.parse(certificationsJson.certificationsData);
}
