from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os
from openai import OpenAI

# ------------------------
# App Setup
# ------------------------

app = FastAPI(
    title="Doctor FinAI",
    description="AI-powered financial health assessment platform for SMEs",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# OpenAI Client
# ------------------------

OPENAI_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_KEY) if OPENAI_KEY else None

# ------------------------
# Root Endpoint
# ------------------------

@app.get("/")
def root():
    return {"message": "Doctor FinAI Backend Running 🩺"}

# ------------------------
# Analyze Financial File
# ------------------------

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        # Read file
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            return {"error": "Only CSV or XLSX files are supported"}

        # Required columns check
        if "revenue" not in df.columns or "expenses" not in df.columns:
            return {
                "error": "File must contain 'revenue' and 'expenses' columns"
            }

        # Financial calculations
        revenue = float(df["revenue"].sum())
        expenses = float(df["expenses"].sum())
        profit = revenue - expenses

        # Prompt for AI
        prompt = f"""
You are Doctor FinAI, an AI financial health doctor for SMEs.

Business Financial Snapshot:
- Total Revenue: {revenue}
- Total Expenses: {expenses}
- Net Profit: {profit}

Respond in professional bullet points:
• Financial Health Score (0-100)
• Top Financial Risks
• Cost Optimization Strategies
• Credit Readiness Evaluation
• 30-Day Cash Flow Outlook
"""

        # ------------------------
        # AI Call with Smart Fallback
        # ------------------------

        ai_text = None

        if client:
            try:
                ai = client.chat.completions.create(
                    model="gpt-5",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a professional SME financial advisor."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                )
                ai_text = ai.choices[0].message.content
            except Exception:
                ai_text = None

        # ------------------------
        # Demo / Fallback Intelligence
        # ------------------------

        if not ai_text:
            health_score = round((profit / revenue) * 100, 1) if revenue > 0 else 0

            ai_text = f"""
• Financial Health Score: {health_score}/100

• Top Financial Risks:
  - High operational cost ratio impacting margins
  - Dependence on consistent cash inflows
  - Limited reserve buffer for unexpected expenses

• Cost Optimization Strategies:
  - Renegotiate supplier and vendor contracts
  - Reduce discretionary and non-core spending
  - Improve inventory turnover and receivables collection

• Credit Readiness Evaluation:
  - Moderate
  - Strengthen profitability and maintain consistent monthly cash flows to improve loan eligibility

• 30-Day Cash Flow Outlook:
  - Stable with potential improvement if expenses are controlled and receivables are collected faster
"""

        # ------------------------
        # Response
        # ------------------------

        return {
            "revenue": revenue,
            "expenses": expenses,
            "profit": profit,
            "ai_insights": ai_text
        }

    except Exception as e:
        return {"error": str(e)}

# ------------------------
# Mock Industry Benchmarks
# ------------------------

@app.get("/mock/benchmarks")
def benchmarks():
    return {
        "Manufacturing": {
            "avg_profit_margin": "18%",
            "risk_level": "Medium"
        },
        "Retail": {
            "avg_profit_margin": "12%",
            "risk_level": "High"
        },
        "Services": {
            "avg_profit_margin": "25%",
            "risk_level": "Low"
        },
        "E-commerce": {
            "avg_profit_margin": "20%",
            "risk_level": "Medium"
        },
        "Logistics": {
            "avg_profit_margin": "15%",
            "risk_level": "Medium"
        }
    }

# ------------------------
# Mock Bank Sync
# ------------------------

@app.get("/mock/bank")
def bank_sync():
    return {
        "accounts": [
            {
                "bank": "HDFC Bank",
                "type": "Current Account",
                "balance": 125000
            },
            {
                "bank": "ICICI Bank",
                "type": "Savings Account",
                "balance": 48000
            }
        ],
        "last_sync": "2 minutes ago",
        "status": "Connected"
    }

# ------------------------
# Mock GST Summary
# ------------------------

@app.get("/mock/gst")
def gst_summary():
    return {
        "gst_paid": 18000,
        "gst_due": 4200,
        "last_filed": "2025-12-20",
        "status": "Compliant"
    }
