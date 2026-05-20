import React, { useMemo } from "react";
import { Dropdown, Badge, List, Button, Avatar, Empty } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
} from "../../store/notifications/notifications.slice";

import {
  DropWrap,
  Header,
  HeaderTitle,
  ListWrap,
  ItemRow,
  ItemAvatar,
  Content,
  Title,
  Message,
  Time,
  Actions,
} from "./NotificationsDropdown.styled";

type NotifType = "success" | "error" | "warning" | "info";

function NotificationIcon({ type }: { type: NotifType }) {
  switch (type) {
    case "success":
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    case "error":
      return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
    case "warning":
      return <WarningOutlined style={{ color: "#faad14" }} />;
    default:
      return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
  }
}

interface NotificationsDropdownProps {
  children: React.ReactNode;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notifications,
  );

  const top10 = useMemo(() => notifications.slice(0, 10), [notifications]);

  const handleMarkAsRead = (id: string) => dispatch(markAsRead(id));
  const handleMarkAllAsRead = () => dispatch(markAllAsRead());
  const handleRemove = (id: string) => dispatch(removeNotification(id));

  const items = [
    {
      key: "header",
      label: (
        <Header onMouseDown={(e) => e.preventDefault()}>
          <HeaderTitle>Notifications</HeaderTitle>

          {unreadCount > 0 ? (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMarkAllAsRead();
              }}
            >
              Mark all read
            </Button>
          ) : null}
        </Header>
      ),
    },
    {
      key: "content",
      label: (
        <DropWrap
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
        >
          <ListWrap>
            {top10.length > 0 ? (
              <List
                dataSource={top10}
                renderItem={(notification: any) => {
                  const type: NotifType =
                    notification?.type === "success" ||
                    notification?.type === "error" ||
                    notification?.type === "warning"
                      ? notification.type
                      : "info";

                  const title = notification?.title || "Notification";
                  const message = notification?.message || "";
                  const ts = notification?.timestamp;

                  const timeText =
                    typeof ts === "string" || typeof ts === "number"
                      ? new Date(ts).toLocaleString()
                      : "";

                  return (
                    <List.Item className={notification?.read ? "" : "unread"}>
                      <ItemRow>
                        <ItemAvatar>
                          <Avatar
                            icon={<NotificationIcon type={type} />}
                            size="small"
                          />
                        </ItemAvatar>

                        <Content>
                          <Title>{title}</Title>
                          <Message>{message}</Message>

                          {timeText ? <Time>{timeText}</Time> : null}

                          {notification?.actionText &&
                          notification?.actionUrl ? (
                            <Button
                              type="link"
                              size="small"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = notification.actionUrl!;
                              }}
                            >
                              {notification.actionText}
                            </Button>
                          ) : null}
                        </Content>

                        <Actions>
                          {!notification?.read ? (
                            <Button
                              type="text"
                              size="small"
                              icon={<CheckOutlined />}
                              title="Mark as read"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                            />
                          ) : null}

                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            title="Remove"
                            danger
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemove(notification.id);
                            }}
                          />
                        </Actions>
                      </ItemRow>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No notifications"
              />
            )}
          </ListWrap>
        </DropWrap>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Badge count={unreadCount} size="small">
        {children}
      </Badge>
    </Dropdown>
  );
};

export default NotificationsDropdown;
