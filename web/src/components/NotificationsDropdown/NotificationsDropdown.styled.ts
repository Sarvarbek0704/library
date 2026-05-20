import styled from "styled-components";

export const DropWrap = styled.div`
  width: 400px;
  max-height: 500px;
  overflow-y: auto;
`;

export const Header = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fafafa;
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const HeaderTitle = styled.span`
  font-weight: 800;
`;

export const ListWrap = styled.div`
  .ant-list-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-list-item:hover {
    background-color: #f5f5f5;
  }

  .ant-list-item.unread {
    background-color: #e6f7ff;
    border-left: 3px solid #1890ff;
  }
`;

export const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
`;

export const ItemAvatar = styled.div`
  margin-right: 12px;
  margin-top: 2px;
`;

export const Content = styled.div`
  flex: 1;
  margin-right: 8px;
  min-width: 0;
`;

export const Title = styled.div`
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Message = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;

  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Time = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;

  ${ItemRow}:hover & {
    opacity: 1;
  }
`;
