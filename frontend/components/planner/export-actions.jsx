import { CalendarPlus2, Download, Share2, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  { label: "Download itinerary as PDF", icon: Download },
  { label: "Share trip link", icon: Share2 },
  { label: "Add to Google Calendar", icon: CalendarPlus2 },
  { label: "Export route to Google Maps", icon: Waypoints }
];

export function ExportActions() {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Export & Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 p-6 sm:grid-cols-2">
        {actions.map((action, index) => (
          <Button
            key={action.label}
            variant={index % 2 ? "secondary" : "default"}
            className="h-auto justify-start gap-2 rounded-2xl px-4 py-3 text-left"
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
