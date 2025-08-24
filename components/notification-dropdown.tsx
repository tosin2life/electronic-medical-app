"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Clock, AlertCircle, Info } from "lucide-react";
import Link from "next/link";

// Mock recent notifications - replace with real data
const recentNotifications = [
  {
    id: 1,
    type: "appointment",
    title: "New Appointment",
    message: "Patient requested appointment",
    timestamp: "2 min ago",
    isRead: false,
  },
  {
    id: 2,
    type: "lab_result",
    title: "Lab Results Ready",
    message: "Blood test results available",
    timestamp: "1 hour ago",
    isRead: true,
  },
  {
    id: 3,
    type: "reminder",
    title: "Follow-up Due",
    message: "Patient follow-up reminder",
    timestamp: "3 hours ago",
    isRead: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "lab_result":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "reminder":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case "system":
      return <Info className="h-4 w-4 text-gray-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
};

export const NotificationDropdown = () => {
  const unreadCount = recentNotifications.filter((n) => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-medium leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <Link
              href="/notifications"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
        </div>

        <ScrollArea className="h-80">
          <div className="p-2">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-500 mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No notifications</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
