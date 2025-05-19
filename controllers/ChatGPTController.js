const axios = require("axios");
const db = require("../configs/db.js");

const chatWithOllama = async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: "Thiếu nội dung tin nhắn" });
  }

  try {
    const response = await axios.post(
      "http://localhost:11434/api/chat",
      {
        model: "codellama:instruct",
        messages: [
          {
            role: "system",
            content:
              "Bạn là trợ lý điện tử của một cửa hàng HTC bán đồ công nghệ tại Việt Nam.Trả lời bằng tiếng Việt",
          },
          { role: "user", content: message },
        ],
        stream: true,
      },
      { responseType: "stream" }
    );

    let reply = "";
    let sent = false;

    response.data.on("data", (chunk) => {
      const lines = chunk
        .toString("utf8")
        .split("\n")
        .filter((line) => line.trim() !== "");

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          const content = json?.message?.content;
          if (content) {
            reply += content;
          }
        } catch (err) {
          console.error("Không parse được JSON:", err.message);
        }
      }
    });

    response.data.on("end", () => {
      if (!sent) {
        sent = true;
        if (reply.trim().length > 0) {
          res.json({ reply });
        } else {
          res.status(500).json({ error: "Không có phản hồi hợp lệ từ Ollama" });
        }
      }
    });

    response.data.on("error", (err) => {
      console.error("Lỗi stream Ollama:", err.message);
      if (!sent) {
        sent = true;
        res.status(500).json({ error: "Lỗi từ máy chủ Ollama" });
      }
    });
  } catch (error) {
    console.error("Lỗi gọi Ollama API:", error.response?.data || error.message);
    res.status(500).json({ error: "Lỗi khi gọi Ollama" });
  }
};

module.exports = { chatWithOllama };
