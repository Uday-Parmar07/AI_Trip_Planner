import { PlannerWorkspace } from "@/components/planner/planner-workspace";

export default async function PlannerPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  return <PlannerWorkspace searchParams={resolvedSearchParams} />;
}
