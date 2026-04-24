import cv2
import numpy as np
import datetime
import os
import time
import math
from flask import Flask, render_template, Response, jsonify

# Conditional imports
try:
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing.image import img_to_array
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
    HAS_ML = True
except ImportError:
    HAS_ML = False

# Initialize Flask with custom paths to match new structure
app = Flask(__name__, 
            template_folder='../frontend/templates', 
            static_folder='../frontend/static')

# --- Configuration & Model Loading ---
BASE_PATH = os.path.dirname(os.path.abspath(__file__))
FACE_PROTO = os.path.join(BASE_PATH, "face_detector/deploy.prototxt")
FACE_MODEL = os.path.join(BASE_PATH, "face_detector/res10_300x300_ssd_iter_140000.caffemodel")
MASK_MODEL = os.path.join(BASE_PATH, "mask_detector.model")

# Global state
stats = {
    "total_people": 0,
    "with_mask": 0,
    "without_mask": 0,
    "safety_score": 100,
    "start_time": datetime.datetime.now(),
    "uptime": "00:00:00"
}

# Load Models
faceNet = None
maskNet = None
# Fallback Cascade Detector
haarNet = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

if HAS_ML:
    try:
        if os.path.exists(FACE_PROTO) and os.path.exists(FACE_MODEL):
            faceNet = cv2.dnn.readNet(FACE_PROTO, FACE_MODEL)
            print("Successfully loaded Caffe Face Detector")
        else:
            print("Warning: Caffe Face Detector files missing. Using Haar Cascade fallback.")
            
        if os.path.exists(MASK_MODEL):
            maskNet = load_model(MASK_MODEL)
            print("Successfully loaded Mask Classifier")
        else:
            print("Warning: Mask Classifier model missing. Classification will be simulated.")
    except Exception as e:
        print(f"Error loading models: {e}")

def calculate_safety_score():
    if stats["total_people"] == 0:
        return 100
    return int((stats["with_mask"] / stats["total_people"]) * 100)

def detect_and_predict_mask(frame):
    (h, w) = frame.shape[:2]
    locs = []
    preds = []

    # Try Caffe Detector first
    if faceNet is not None:
        blob = cv2.dnn.blobFromImage(frame, 1.0, (224, 224), (104.0, 177.0, 123.0))
        faceNet.setInput(blob)
        detections = faceNet.forward()
        for i in range(detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > 0.5:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                locs.append((max(0, startX), max(0, startY), min(w - 1, endX), min(h - 1, endY)))
    
    # Fallback to Haar Cascade if no faces found with Caffe or Caffe is missing
    if len(locs) == 0:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # Higher sensitivity for masked faces (smaller scaleFactor, fewer neighbors)
        faces = haarNet.detectMultiScale(gray, 1.08, 3, minSize=(50, 50))
        for (x, y, fw, fh) in faces:
            locs.append((x, y, x + fw, y + fh))

    # Process faces for mask prediction
    for (startX, startY, endX, endY) in locs:
        if maskNet is not None:
            try:
                face = frame[startY:endY, startX:endX]
                face = cv2.resize(face, (224, 224))
                face = img_to_array(cv2.cvtColor(face, cv2.COLOR_BGR2RGB))
                face = preprocess_input(face)
                pred = maskNet.predict(np.expand_dims(face, axis=0))[0]
                preds.append(pred)
            except:
                preds.append([0.5, 0.5])
        else:
            # --- IMPROVED SIMULATION FOR DEMO ---
            # We look at the lower half of the detected face area.
            # If it's mostly "white/light" (like a medical mask), we simulate 'Masked'
            face_roi = frame[startY:endY, startX:endX]
            lower_half = face_roi[int(face_roi.shape[0]/2):, :]
            avg_color = np.mean(lower_half)
            
            # If the bottom of the face is very bright (white mask) or significantly different
            if avg_color > 180: # Light colored mask
                preds.append([0.95, 0.05]) # High probability of mask
            else:
                preds.append([0.05, 0.95]) # No mask

    return (locs, preds)

def generate_frames():
    cap = cv2.VideoCapture(0)
    
    while True:
        success, frame = cap.read()
        if not success:
            # Simulation loop if camera fails
            sim_frame = np.zeros((450, 600, 3), dtype=np.uint8)
            cv2.putText(sim_frame, "OFFLINE: Webcam Not Found", (50, 225), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            ret, buffer = cv2.imencode('.jpg', sim_frame)
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            time.sleep(0.1)
            continue
        
        frame = cv2.resize(frame, (600, 450))
        (locs, preds) = detect_and_predict_mask(frame)

        stats["total_people"] = len(locs)
        stats["with_mask"] = 0
        no_mask_count = 0

        for (box, pred) in zip(locs, preds):
            (startX, startY, endX, endY) = box
            (mask, withoutMask) = pred

            if mask > withoutMask:
                label = "Masked"
                color = (0, 255, 0)
                stats["with_mask"] += 1
            else:
                label = "No Mask"
                color = (0, 0, 255)
                no_mask_count += 1

            # Draw bounding box + label
            cv2.rectangle(frame, (startX, startY), (endX, endY), color, 2)
            cv2.putText(frame, label, (startX, startY - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        stats["without_mask"] = no_mask_count
        stats["safety_score"] = calculate_safety_score()
        stats["uptime"] = str(datetime.datetime.now() - stats["start_time"]).split(".")[0]

        # --- Dynamic Count-Based Alert Message ---
        if stats["total_people"] == 0:
            alert_msg = None
        elif no_mask_count == 0:
            alert_msg = None
        elif no_mask_count == 1:
            alert_msg = "ALERT: 1 person not wearing mask!"
        else:
            alert_msg = f"ALERT: {no_mask_count} persons not wearing mask!"

        stats["alert_message"] = alert_msg if alert_msg else ""

        # Render alert on video frame
        if alert_msg:
            # Blinking background strip
            current_time = time.time()
            if int(current_time * 2) % 2:
                cv2.rectangle(frame, (0, 405), (600, 450), (0, 0, 180), -1)
            cv2.putText(frame, alert_msg, (10, 440),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)

        # Dashboard Status Overlay (top bar)
        overlay = frame.copy()
        cv2.rectangle(overlay, (5, 5), (590, 105), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.45, frame, 0.55, 0, frame)

        current_time = time.time()
        safety_score = stats["safety_score"]
        status = "SAFE ZONE" if safety_score >= 90 else "CAUTION" if safety_score >= 70 else "DANGER"
        status_color = (0, 255, 0) if safety_score >= 90 else (0, 200, 200) if safety_score >= 70 else (0, 0, 255)

        if status == "DANGER" and int(current_time * 2) % 2:
            status_color = (255, 255, 255)

        cv2.putText(frame, f"STATUS: {status}  ({safety_score}%)", (15, 45),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, status_color, 2)
        cv2.putText(frame,
                    f"Total: {stats['total_people']}  |  Masked: {stats['with_mask']}  |  No Mask: {no_mask_count}",
                    (15, 88),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stats')
def get_stats():
    stats["uptime"] = str(datetime.datetime.now() - stats["start_time"]).split(".")[0]
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
