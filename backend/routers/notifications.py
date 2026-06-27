from fastapi import APIRouter, HTTPException
from database import get_db
from models import NotificationCreate

router = APIRouter()

@router.post("/send/{user_id}")
def send_notification(user_id: int, notif: NotificationCreate):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            """INSERT INTO notifications (user_id, title, message, type)
            VALUES (%s, %s, %s, %s) RETURNING id""",
            (user_id, notif.title, notif.message, notif.type)
        )
        notif_id = cur.fetchone()[0]
        conn.commit()
        return {"message": "Notification sent", "id": notif_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.get("/all/{user_id}")
def get_notifications(user_id: int):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            """SELECT id, title, message, type, is_read, created_at 
            FROM notifications WHERE user_id = %s 
            ORDER BY created_at DESC""",
            (user_id,)
        )
        rows = cur.fetchall()
        return [
            {
                "id": r[0],
                "title": r[1],
                "message": r[2],
                "type": r[3],
                "is_read": r[4],
                "created_at": r[5]
            }
            for r in rows
        ]
    finally:
        cur.close()
        conn.close()

@router.patch("/read/{notif_id}")
def mark_read(notif_id: int):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE notifications SET is_read = TRUE WHERE id = %s",
            (notif_id,)
        )
        conn.commit()
        return {"message": "Marked as read"}
    finally:
        cur.close()
        conn.close()

@router.delete("/clear/{user_id}")
def clear_notifications(user_id: int):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM notifications WHERE user_id = %s", (user_id,))
        conn.commit()
        return {"message": "All notifications cleared"}
    finally:
        cur.close()
        conn.close()