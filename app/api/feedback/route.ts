import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json(
      { error: "Сервер не настроен для отправки сообщений" },
      { status: 500 }
    );
  }
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Неверный формат данных" },
      { status: 400 }
    );
  }
  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json(
      { error: "Сообщение обязательно" },
      { status: 400 }
    );
  }
  const name = body.name?.trim() || "—";
  const email = body.email?.trim() || "—";
  const text = [
    "📬 Обратная связь BP Tracker",
    "",
    `👤 Имя: ${name}`,
    `📧 Email: ${email}`,
    "",
    "💬 Сообщение:",
    message,
  ].join("\n");
  const url = `${TELEGRAM_API}/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) {
    return NextResponse.json(
      { error: "Не удалось отправить сообщение в Telegram" },
      { status: 502 }
    );
  }
  return NextResponse.json({ success: true });
}
