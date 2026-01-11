import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

const token = "8441898048:AAGWVUB8EuWnW0RzHV5TB1E3OSvabSofkRE";
const bot = new TelegramBot(token);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const msg = body.message || body.callback_query?.message;

    if (!msg) return new NextResponse("ok", { status: 200 });

    const chatId = msg.chat.id;
    const text = msg.text;

    if (text && text.startsWith("/start")) {
      const args = text.split(" ");
      const referrerId = args[1];

      // Professional Shop Welcome Message
      await bot.sendMessage(
        chatId,
        "Welcome to **SwiftCart**! 🛍️\n\nExperience the fastest Web3 shopping on Telegram. Browse products and pay instantly with TON.",
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🛒 Shop Swiftly",
                  web_app: {
                    url: `https://tma-ecommerce.vercel.app${
                      referrerId ? `?startapp=${referrerId}` : ""
                    }`,
                  },
                },
              ],
              [
                { text: "📦 My Orders", callback_data: "my_orders" },
                { text: "🆘 Support", callback_data: "support" },
              ],
            ],
          },
        }
      );
    }

    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new NextResponse("error", { status: 500 });
  }
}
