// 画面の要素（部品）を取得
const templateSelect = document.getElementById('template-select');
const roleInput = document.getElementById('role');
const formatInput = document.getElementById('format');
const contextInput = document.getElementById('context');
const rulesInput = document.getElementById('rules');
const notesInput = document.getElementById('notes');
const generateBtn = document.getElementById('generate-btn');
const resultBox = document.getElementById('result-box');

// テンプレートデータ
const templates = {
  minutes: {
    role: "プロの文字起こし・議事録作成アシスタント",
    format: "【日時】【参加者】【決定事項】【ToDo（担当・期限）】【次回決定事項】の箇条書き形式",
    context: "社内ミーティングのメモから、見やすく整理された公式な議事録を作成したい。",
    rules: "事実のみを正確に記載し、曖昧な表現は避けてください。ToDoには担当者を明確に割り振ってください。",
    placeholder: "ここにミーティングのメモや発言録を貼り付けてください"
  },
  report: {
    role: "優秀なビジネスコンサルタント・業務報告アドバイザー",
    format: "1. 今週の成果 2. 課題と対策 3. 来週の予定 の構成",
    context: "上司へ提出する週次（日次）業務報告書を作成したい。",
    rules: "結論ファースト（PREP法）で書くこと。数値で表せる成果は数字を用いてわかりやすく記載してください。",
    placeholder: "今日・今週やった業務内容や成果、困っていることを箇条書きで入力してください"
  },
  email: {
    role: "ビジネスマナーに精通した広報・営業担当",
    format: "件名：\n本文：\n（宛名、挨拶、要件、結びの言葉を含む形式）",
    context: "取引先や社外の相手に送る丁寧なビジネスメールを作成したい。",
    rules: "クッション言葉を適度にお使い、相手に不快感を与えない丁寧な敬語表現（謙譲語・尊敬語）にしてください。",
    placeholder: "メールで伝えたい要件（日時調整、お礼、謝罪、質問など）を入力してください"
  },
  custom: {
    role: "",
    format: "",
    context: "",
    rules: "",
    placeholder: "自由に入力してください"
  }
};

// テンプレート更新
function updateForm() {
  const selectedKey = templateSelect.value;
  const data = templates[selectedKey];
  if (data) {
    roleInput.value = data.role;
    formatInput.value = data.format;
    contextInput.value = data.context;
    rulesInput.value = data.rules;
    notesInput.placeholder = data.placeholder;
  }
}

// AI生成ボタンの挙動（誰でも直接AI回答が得られる仕組み）
generateBtn.addEventListener('click', async () => {
  const promptText = `
以下は指示とデータです。指示に従って丁寧な日本語で回答を作成してください。

# 役割: ${roleInput.value}
# 目的: ${contextInput.value}
# 出力形式: ${formatInput.value}
# ルール: ${rulesInput.value}
# メモ・データ: ${notesInput.value}
`.trim();

  // ローディング表示
  resultBox.textContent = '🤖 AIが回答を作成中...（数秒〜十数秒かかります）';
  generateBtn.disabled = true;

  try {
    // 誰でも無料で使えるフリーAI API (Qwen / DeepSeekモデル) に送信
    const response = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-72B-Instruct",
        messages: [
          { role: "user", content: promptText }
        ],
        max_tokens: 1000,
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0].message) {
      // 画面に直接AIの回答を表示！
      resultBox.textContent = data.choices[0].message.content;
    } else {
      // 万が一混雑している場合のエラーハンドリング
      resultBox.textContent = '⚠️ 現在AIサーバーが混雑しています。もう一度ボタンを押してみてください。';
    }
  } catch (error) {
    resultBox.textContent = '通信エラーが発生しました。ネットワーク接続を確認してください。';
    console.error(error);
  } finally {
    generateBtn.disabled = false;
  }
});

templateSelect.addEventListener('change', updateForm);
updateForm();