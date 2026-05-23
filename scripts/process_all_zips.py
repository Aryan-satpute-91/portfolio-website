import os
import zipfile
import shutil

# Directory containing zip files and where final frames will live
seq_dir = r"d:\\Coding\\Projects\\PORTFOLIO\\Portfolio-Website\\public\\sequence"

# Temporary folder for extraction
temp_dir = os.path.join(seq_dir, "temp_extracted")
if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)
os.makedirs(temp_dir, exist_ok=True)

# Gather zip files sorted by name (1.zip, 2.zip, ... 7.zip)
zip_files = sorted([f for f in os.listdir(seq_dir) if f.lower().endswith('.zip')])

frame_counter = 1
for zip_name in zip_files:
    zip_path = os.path.join(seq_dir, zip_name)
    with zipfile.ZipFile(zip_path, 'r') as z:
        # Extract to a temporary subfolder for this zip
        extract_path = os.path.join(temp_dir, os.path.splitext(zip_name)[0])
        os.makedirs(extract_path, exist_ok=True)
        z.extractall(extract_path)
        # Find all image files (assuming .jpg or .png) inside extracted folder
        img_files = []
        for root, _, files in os.walk(extract_path):
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                    img_files.append(os.path.join(root, f))
        # Sort them lexicographically (they should be named with leading zeros)
        img_files.sort()
        for img_path in img_files:
            # New filename in the main sequence folder
            new_name = f"{frame_counter:04d}.jpg"
            new_path = os.path.join(seq_dir, new_name)
            shutil.move(img_path, new_path)
            frame_counter += 1
    # Optionally delete the zip after extraction (keep if needed)
    # os.remove(zip_path)

# Clean up temporary folder
shutil.rmtree(temp_dir, ignore_errors=True)
print(f"Extracted and merged {frame_counter-1} frames into {seq_dir}")
