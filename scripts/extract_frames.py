import cv2
import os

video_path = r"C:\Users\HP\Downloads\grok-video-7ce79caf-0592-4dd6-a176-e8f99d211fea.mp4"
output_dir = r"d:\Coding\Projects\PORTFOLIO\Portfolio-Website\public\sequence"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print(f"Opening video: {video_path}")
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("Error opening video stream or file")
    exit()

frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Total frames: {frame_count}")

# We will limit to 300 frames to keep it reasonable for the web, or use all if less
limit = min(300, frame_count)

# Extract frames
count = 0
while cap.isOpened() and count < limit:
    ret, frame = cap.read()
    if not ret:
        break

    # Save frame as JPEG for smaller file size than PNG/WebP (since cv2 webp support is sometimes wonky)
    frame_name = f"{(count + 1):04d}.jpg"
    out_path = os.path.join(output_dir, frame_name)
    
    # We resize it to 1920x1080 if it isn't already to save size
    frame_resized = cv2.resize(frame, (1920, 1080))
    
    # Save with 70% quality
    cv2.imwrite(out_path, frame_resized, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
    
    count += 1
    if count % 50 == 0:
        print(f"Processed {count} frames...")

cap.release()
print(f"Successfully extracted {count} frames to {output_dir}")
