import { currentUser } from "@clerk/nextjs/server";
import { Bell, CheckCircle, Clock, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock notification data - replace with real data from your database
const mockNotifications = [
  {
    id: 1,
    type: "appointment",
    title: "New Appointment Request",
    message:
      "Patient John Doe requested an appointment for tomorrow at 2:00 PM",
    timestamp: "2 hours ago",
    isRead: false,
    priority: "high",
  },
  {
    id: 2,
    type: "lab_result",
    title: "Lab Results Available",
    message: "Blood test results for Patient Jane Smith are ready for review",
    timestamp: "4 hours ago",
    isRead: false,
    priority: "medium",
  },
  {
    id: 3,
    type: "reminder",
    title: "Follow-up Reminder",
    message:
      "Patient Mike Johnson is due for a follow-up appointment next week",
    timestamp: "1 day ago",
    isRead: true,
    priority: "low",
  },
  {
    id: 4,
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight at 2:00 AM",
    timestamp: "2 days ago",
    isRead: true,
    priority: "low",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return <Clock className="h-5 w-5 text-blue-600" />;
    case "lab_result":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "reminder":
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    case "system":
      return <Info className="h-5 w-5 text-gray-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

export default async function NotificationsPage() {
  const user = await currentUser();
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your latest activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-all hover:shadow-md ${
              !notification.isRead
                ? "border-l-4 border-l-blue-500 bg-blue-50/50"
                : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 px-3"
                    >
                      View Details
                    </Button>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 px-3 text-blue-600 hover:text-blue-700"
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockNotifications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600">
              You're all caught up! New notifications will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
