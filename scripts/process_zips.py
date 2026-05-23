import zipfile
import os
import glob
import shutil
import re

seq_dir = r"d:\Coding\Projects\PORTFOLIO\Portfolio-Website\public\sequence"
zips = ["1.zip", "2.zip", "3.zip", "4.zip", "5.zip", "6.zip"]

# 1. Delete old frames (e.g. 0001.jpg to 0241.jpg)
old_jpgs = glob.glob(os.path.join(seq_dir, "[0-9][0-9][0-9][0-9].jpg"))
for f in old_jpgs:
    os.remove(f)
print(f"Deleted {len(old_jpgs)} old frames.")

def extract_number(filename):
    match = re.search(r'\d+', filename)
    return int(match.group()) if match else 0

total_frames = 0

for i, z in enumerate(zips):
    z_path = os.path.join(seq_dir, z)
    temp_dir = os.path.join(seq_dir, f"temp_{i}")
    
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
        
    if os.path.exists(z_path):
        print(f"Extracting {z}...")
        with zipfile.ZipFile(z_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
            
        # Get all jpg files in the temp directory
        extracted_files = glob.glob(os.path.join(temp_dir, "*.jpg"))
        # Sort them numerically based on ezgif-frame-XXX.jpg
        extracted_files.sort(key=lambda x: extract_number(os.path.basename(x)))
        
        for f_path in extracted_files:
            total_frames += 1
            new_name = f"{total_frames:04d}.jpg"
            new_path = os.path.join(seq_dir, new_name)
            shutil.move(f_path, new_path)
            
        # Clean up temp dir
        shutil.rmtree(temp_dir)
        
print(f"Successfully compiled {total_frames} frames seamlessly!")
