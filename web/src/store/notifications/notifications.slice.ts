import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type NotificationItem = {
  id: string;
  title?: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  timestamp: string; // ✅ Date emas, string!
  read: boolean;
  actionText?: string;
  actionUrl?: string;
};

type NotificationsState = {
  notifications: NotificationItem[];
  unreadCount: number;
};

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

function uid() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

function recalcUnread(state: NotificationsState) {
  state.unreadCount = state.notifications.reduce(
    (acc, n) => acc + (n.read ? 0 : 1),
    0
  );
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
        title?: string;
        message: string;
        type?: NotificationItem["type"];
        actionText?: string;
        actionUrl?: string;
        timestamp?: string; // optional
      }>
    ) => {
      state.notifications.unshift({
        id: uid(),
        title: action.payload.title,
        message: action.payload.message,
        type: action.payload.type ?? "info",
        actionText: action.payload.actionText,
        actionUrl: action.payload.actionUrl,
        timestamp: action.payload.timestamp ?? new Date().toISOString(), // ✅ shu joy
        read: false,
      });

      recalcUnread(state);
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find((x) => x.id === action.payload);
      if (n) n.read = true;
      recalcUnread(state);
    },

    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
      recalcUnread(state);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (x) => x.id !== action.payload
      );
      recalcUnread(state);
    },

    clearNotifications: (state) => {
      state.notifications = [];
      recalcUnread(state);
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
