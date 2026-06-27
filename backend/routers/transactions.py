from fastapi import APIRouter, HTTPException
from database import get_db
from models import TransactionCreate
from datetime import datetime

router = APIRouter()

def analyze_fraud(receiver_upi: str, amount: float, device_id: str, user_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT AVG(amount) FROM transactions WHERE user_id = %s", (user_id,))
    result = cur.fetchone()[0]
    avg = float(result) if result else 500
    if amount > avg * 2:
        layer1 = min(int((amount / avg) * 20), 100)
    else:
        layer1 = 20
    hour = datetime.now().hour
    layer2 = 75 if (hour >= 22 or hour <= 6) else 30
    cur.execute("SELECT trust_score FROM devices WHERE device_fingerprint = %s AND user_id = %s", (device_id, user_id))
    device = cur.fetchone()
    if device:
        layer3 = 100 - device[0]
    else:
        layer3 = 75
        cur.execute("INSERT INTO devices (user_id, device_fingerprint, trust_score) VALUES (%s, %s, %s)", (user_id, device_id, 25))
    cur.execute("SELECT COUNT(*) FROM transactions WHERE receiver_upi = %s AND status = 'blocked'", (receiver_upi,))
    flags = cur.fetchone()[0]
    layer4 = min(flags * 30, 100)
    risk_score = int((layer1 * 0.4) + (layer2 * 0.2) + (layer3 * 0.2) + (layer4 * 0.2))
    reasons = []
    if layer1 > 50: reasons.append(f"Amount {int(amount/avg)}x higher than normal")
    if layer2 > 50: reasons.append("Unusual transaction time")
    if layer3 > 50: reasons.append("Untrusted device")
    if layer4 > 50: reasons.append(f"Receiver flagged {flags} times before")
    fraud_reason = " and ".join(reasons) if reasons else None
    status = "blocked" if risk_score > 35 else "safe"
    conn.commit()
    cur.close()
    conn.close()
    return {"layer1": layer1, "layer2": layer2, "layer3": layer3, "layer4": layer4, "risk_score": risk_score, "status": status, "fraud_reason": fraud_reason}

@router.post("/analyze/{user_id}")
def analyze_transaction(user_id: int, txn: TransactionCreate):
    result = analyze_fraud(txn.receiver_upi, txn.amount, txn.device_id or "unknown", user_id)
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            """INSERT INTO transactions (user_id, receiver_upi, amount, device_id, risk_score, status, fraud_reason)
            VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (user_id, txn.receiver_upi, txn.amount, txn.device_id, result["risk_score"], result["status"], result["fraud_reason"])
        )
        txn_id = cur.fetchone()[0]
        if result["status"] == "blocked":
            cur.execute(
                """INSERT INTO fraud_logs (transaction_id, layer1_score, layer2_score, layer3_score, layer4_score, explanation)
                VALUES (%s, %s, %s, %s, %s, %s)""",
                (txn_id, result["layer1"], result["layer2"], result["layer3"], result["layer4"], result["fraud_reason"])
            )
        conn.commit()
        return {"transaction_id": txn_id, **result}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.get("/history/{user_id}")
def get_history(user_id: int):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, receiver_upi, amount, risk_score, status, fraud_reason, transaction_time FROM transactions WHERE user_id = %s ORDER BY transaction_time DESC", (user_id,))
        rows = cur.fetchall()
        return [{"id": r[0], "receiver_upi": r[1], "amount": float(r[2]), "risk_score": r[3], "status": r[4], "fraud_reason": r[5], "transaction_time": r[6]} for r in rows]
    finally:
        cur.close()
        conn.close()

@router.get("/stats/{user_id}")
def get_stats(user_id: int):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT COUNT(*) FROM transactions WHERE user_id = %s", (user_id,))
        total = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM transactions WHERE user_id = %s AND status = 'blocked'", (user_id,))
        blocked = cur.fetchone()[0]
        cur.execute("SELECT SUM(amount) FROM transactions WHERE user_id = %s AND status = 'blocked'", (user_id,))
        saved = cur.fetchone()[0] or 0
        return {"total_transactions": total, "frauds_blocked": blocked, "amount_saved": float(saved)}
    finally:
        cur.close()
        conn.close()