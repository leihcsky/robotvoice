import { BranchLanding, branchMetadata } from "@/components/branch-landing";
import { FEMALE_PAGE } from "@/lib/seo/pages";

export const metadata = branchMetadata(FEMALE_PAGE);

export default function FemaleRobotVoiceGeneratorPage() {
  return <BranchLanding page={FEMALE_PAGE} />;
}
