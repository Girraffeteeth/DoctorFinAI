import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

/* ---------------- TRANSLATIONS ---------------- */

const translations = {
  English: {
    title: "Doctor FinAI",
    subtitle: "AI Financial Health Platform for SMEs",
    upload: "Upload Financial File",
    scan: "Run Financial Scan",
    revenue: "Revenue",
    expenses: "Expenses",
    profit: "Profit",
    health: "Health Score",
    insights: "AI Insights",
    benchmark: "Industry Benchmarks",
    bank: "Bank Sync (Demo)",
    gst: "GST Summary",
    download: "Download Investor Report"
  },

  Hindi: {
    title: "डॉक्टर FinAI",
    subtitle: "SMEs के लिए AI वित्तीय स्वास्थ्य प्लेटफॉर्म",
    upload: "वित्तीय फ़ाइल अपलोड करें",
    scan: "फाइनेंशियल स्कैन चलाएं",
    revenue: "राजस्व",
    expenses: "खर्च",
    profit: "लाभ",
    health: "स्वास्थ्य स्कोर",
    insights: "AI सुझाव",
    benchmark: "उद्योग तुलना",
    bank: "बैंक सिंक",
    gst: "GST सारांश",
    download: "PDF डाउनलोड करें"
  },

  Bengali: {
    title: "ডাক্তার FinAI",
    subtitle: "SME-এর জন্য AI আর্থিক স্বাস্থ্য প্ল্যাটফর্ম",
    upload: "ফাইনান্স ফাইল আপলোড করুন",
    scan: "ফাইনান্স স্ক্যান চালু করুন",
    revenue: "রাজস্ব",
    expenses: "ব্যয়",
    profit: "লাভ",
    health: "স্বাস্থ্য স্কোর",
    insights: "AI পরামর্শ",
    benchmark: "ইন্ডাস্ট্রি তুলনা",
    bank: "ব্যাংক সিঙ্ক",
    gst: "GST সারাংশ",
    download: "PDF ডাউনলোড করুন"
  },

  Tamil: {
    title: "டாக்டர் FinAI",
    subtitle: "SMEs க்கான AI நிதி ஆரோக்கிய தளம்",
    upload: "நிதி கோப்பை பதிவேற்றவும்",
    scan: "நிதி ஸ்கேன் தொடங்கு",
    revenue: "வருமானம்",
    expenses: "செலவுகள்",
    profit: "லாபம்",
    health: "ஆரோக்கிய மதிப்பெண்",
    insights: "AI ஆலோசனைகள்",
    benchmark: "தொழில் ஒப்பீடு",
    bank: "வங்கி சிங்க்",
    gst: "GST சுருக்கம்",
    download: "PDF பதிவிறக்கம்"
  },

  Telugu: {
    title: "డాక్టర్ FinAI",
    subtitle: "SMEs కోసం AI ఆర్థిక ఆరోగ్య వేదిక",
    upload: "ఫైనాన్షియల్ ఫైల్ అప్లోడ్ చేయండి",
    scan: "ఫైనాన్షియల్ స్కాన్",
    revenue: "ఆదాయం",
    expenses: "ఖర్చులు",
    profit: "లాభం",
    health: "హెల్త్ స్కోర్",
    insights: "AI సూచనలు",
    benchmark: "ఇండస్ట్రీ బెంచ్‌మార్క్",
    bank: "బ్యాంక్ సింక్",
    gst: "GST సారాంశం",
    download: "PDF డౌన్‌లోడ్"
  }
}

/* ---------------- MAIN APP ---------------- */

export default function App() {
  const [file, setFile] = useState(null)
  const [data, setData] = useState(null)
  const [lang, setLang] = useState("English")

  const t = translations[lang]

  /* ---------------- BACKEND CALL ---------------- */

  const analyze = async () => {
    if (!file) return
    const form = new FormData()
    form.append("file", file)

    const res = await axios.post("http://127.0.0.1:8000/analyze", form)
    setData(res.data)
  }

  /* ---------------- PDF EXPORT ---------------- */

  const downloadPDF = async () => {
    const dashboard = document.body

    const canvas = await html2canvas(dashboard, {
      scale: 2,
      useCORS: true
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")

    const width = pdf.internal.pageSize.getWidth()
    const height = (canvas.height * width) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, width, height)
    pdf.save("Doctor_FinAI_Investor_Report.pdf")
  }

  /* ---------------- DATA ---------------- */

  const chartData = data
    ? [
        { name: "Revenue", value: data.revenue },
        { name: "Expenses", value: data.expenses },
        { name: "Profit", value: data.profit }
      ]
    : []

  const score = data
    ? Math.min(100, Math.round((data.profit / data.revenue) * 100))
    : 0

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen p-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-10"
      >
        <h1 className="text-4xl font-bold text-cyan-300">
          🩺 {t.title}
        </h1>

        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          className="bg-black text-white border border-cyan-400 px-3 py-1 rounded"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Bengali</option>
          <option>Tamil</option>
          <option>Telugu</option>
        </select>
      </motion.div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass p-8 text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">{t.subtitle}</h2>
        <p className="text-gray-300">
          Diagnose your business finances using AI, banking simulation, and GST intelligence.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            className="text-white"
          />

          <button onClick={analyze} className="neon-btn">
            {t.scan}
          </button>

         
        </div>
      </motion.div>

      {/* DASHBOARD */}
      {data && (
        <>
          {/* KPI CARDS */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <KPI title={t.revenue} value={`₹${data.revenue}`} />
            <KPI title={t.expenses} value={`₹${data.expenses}`} />
            <KPI title={t.profit} value={`₹${data.profit}`} />
            <KPI title={t.health} value={`${score}/100`} />
          </div>

          {/* GRAPHS */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <GlassCard title="Financial Overview">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#00f5ff" />
                  <YAxis stroke="#00f5ff" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00f5ff" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard title="Growth Trend (Simulated)">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={[
                    { month: "Jan", value: data.revenue * 0.6 },
                    { month: "Feb", value: data.revenue * 0.7 },
                    { month: "Mar", value: data.revenue * 0.8 },
                    { month: "Apr", value: data.revenue }
                  ]}
                >
                  <XAxis dataKey="month" stroke="#7c3aed" />
                  <YAxis stroke="#7c3aed" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7c3aed"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* AI INSIGHTS */}
          <GlassCard title={t.insights}>
            <pre className="whitespace-pre-wrap text-gray-300">
              {data.ai_insights}
            </pre>
          </GlassCard>

          {/* BANK + GST */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <GlassCard title={t.bank}>
              🏦 HDFC: ₹1,25,000
              <br />
              🏦 ICICI: ₹48,000
              <br />
              ⏱ Last Sync: 2 mins ago
            </GlassCard>

            <GlassCard title={t.gst}>
              ✅ GST Paid: ₹18,000
              <br />
              ⚠ GST Due: ₹4,200
              <br />
              📄 Status: Compliant
            </GlassCard>
          </div>
          <div className="text-center mt-10">
            <button onClick={downloadPDF} className="neon-btn">
              📄 {t.download}
              </button>
              </div>

        </>
      )}
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function KPI({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass p-6 text-center"
    >
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-3xl font-bold text-cyan-300">{value}</p>
    </motion.div>
  )
}

function GlassCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6"
    >
      <h3 className="text-xl font-bold text-purple-300 mb-3">
        {title}
      </h3>
      {children}
    </motion.div>
  )
}
