import { BranchLanding, branchMetadata } from "@/components/branch-landing";
import { CREEPY_PAGE } from "@/lib/seo/pages";

export const metadata = branchMetadata(CREEPY_PAGE);

export default function CreepyRobotVoiceGeneratorPage() {
  return <BranchLanding page={CREEPY_PAGE} />;
}
