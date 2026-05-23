from PIL import Image
import os

input_path = "public/images/my image.png"
output_path = "public/images/my image.png" # Overwrite

try:
    if os.path.exists(input_path):
        print(f"Compressing {input_path}...")
        img = Image.open(input_path)
        
        # Convert to RGB if it's RGBA but we want to save as JPEG? No, keep it as PNG to preserve transparency.
        # Resize it to a max width of 256px
        img.thumbnail((256, 256), Image.Resampling.LANCZOS)
        
        # Save optimized
        img.save(output_path, "PNG", optimize=True)
        print(f"✅ Successfully compressed {output_path}")
        print(f"New size: {os.path.getsize(output_path) / 1024:.2f} KB")
    else:
        print(f"❌ File not found: {input_path}")
except Exception as e:
    print(f"❌ Error compressing image: {e}")
