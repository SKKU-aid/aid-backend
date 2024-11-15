import json

# Read the JSON file
with open("notices.json", "r", encoding="utf-8") as file:
    raw_data = file.read()

# Replace "][" with "," to merge separate JSON arrays into one
corrected_data = raw_data.replace("][", ",")

# Load the merged JSON data into a Python list
data = json.loads(corrected_data)

# Use a dictionary to remove duplicates based on the 'title' field
unique_data = {}
for item in data:
    title = item['title']
    if title not in unique_data:
        unique_data[title] = item  # Add the item only if the title is not already in the dictionary

# Convert the dictionary values back to a list
merged_data = list(unique_data.values())

# Save the deduplicated data back to the JSON file
with open("notices.json", "w", encoding="utf-8") as file:
    json.dump(merged_data, file, ensure_ascii=False, indent=4)