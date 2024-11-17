import json
import re

# Read the JSON file
file_path = "notices.json"

with open(file_path, "r", encoding="utf-8") as file:
    raw_data = file.read()

# Replace "][" with ","
processed_data = raw_data.replace("][", ",")

# Remove whitespace around commas and prevent consecutive commas
processed_data = re.sub(r'\s*,\s*', ',', processed_data)
processed_data = re.sub(r',+', ',', processed_data)

# Remove leading and trailing commas
processed_data = re.sub(r'^\s*,\s*', '', processed_data)
processed_data = re.sub(r',\s*$', '', processed_data)
processed_data = re.sub(r'\[\s*,\s*', '[', processed_data)
processed_data = re.sub(r',\s*]', ']', processed_data)

# Wrap the content in a JSON array if not already wrapped
if not processed_data.strip().startswith("["):
    processed_data = f"[{processed_data}]"

# Parse the JSON data
try:
    data = json.loads(processed_data)
    print("JSON data loaded successfully.")
except json.JSONDecodeError as e:
    print(f"JSON parsing error: {e}")
    data = []

# Save the merged data
output_file = "notices.json"
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print(f"The merged data has been saved to {output_file}.")
