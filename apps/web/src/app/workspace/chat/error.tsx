"use client";
export default function ConversationError({reset}: {reset: () => void}) {
  return <main id="main-content" className="workspace-main"><h1>Chưa mở được cuộc trò chuyện</h1><p role="alert">Kết nối bị gián đoạn. Thử tải lại để tiếp tục.</p><button type="button" className="workspace-button workspace-button-primary" onClick={reset}>Thử lại</button></main>;
}
