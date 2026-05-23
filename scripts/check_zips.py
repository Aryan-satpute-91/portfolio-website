import zipfile
import os

seq_dir = r"d:\Coding\Projects\PORTFOLIO\Portfolio-Website\public\sequence"
zips = ["1.zip", "2.zip", "3.zip", "4.zip", "5.zip", "6.zip"]

for z in zips:
    z_path = os.path.join(seq_dir, z)
    if os.path.exists(z_path):
        with zipfile.ZipFile(z_path, 'r') as zip_ref:
            file_list = zip_ref.namelist()
            print(f"{z} contains {len(file_list)} files. Example: {file_list[0]}")
