import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

const token = "8441898048:AAGWVUB8EuWnW0RzHV5TB1E3OSvabSofkRE";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bot = new TelegramBot(token);

    // 1. Handle "Shop" (Initial /start message)
    const msg = body.message;
    if (msg && msg.text?.startsWith("/start")) {
      await bot.sendMessage(
        msg.chat.id,
        "Welcome to **SwiftCart**! 🛍️\n\nExperience the fastest Web3 shopping on Telegram. Browse products and pay instantly with TON.",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🛒 Shop Swiftly",
                  web_app: { url: "https://tma-ecommerce.vercel.app" },
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
      return new NextResponse("ok", { status: 200 });
    }

    // 2. Handle "My Orders" and "Support" clicks (Callback Queries)
    const callbackQuery = body.callback_query;
    if (callbackQuery) {
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;

      if (data === "my_orders") {
        await bot.sendMessage(
          chatId,
          "📋 **Your Recent Orders:**\nYou haven't placed any orders yet. Start shopping now!",
          { parse_mode: "Markdown" }
        );
      }

      if (data === "support") {
        await bot.sendMessage(
          chatId,
          "👋 **SwiftCart Support**\nNeed help? Contact our team at @YourSupportUsername or email support@swiftcart.app",
          { parse_mode: "Markdown" }
        );
      }

      // Answer the callback to stop the loading spinner in Telegram
      await bot.answerCallbackQuery(callbackQuery.id);
    }

    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new NextResponse("ok", { status: 200 });
  }
}
