import os

# SCRIPT TO REMOVE UGLY COLLAPSE BUTTON THAT OBSIDIAN HTML EXPORT ADDS

snippet = '<button class="clickable-icon collapse-tree-button is-collapsed" aria-label="Collapse All"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg></button>'

current_directory = os.path.dirname(os.path.abspath(__file__))

for filename in os.listdir(current_directory):
    if filename.endswith(".html"):
        file_path = os.path.join(current_directory, filename)
        
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()

        new_content = content.replace(snippet, "", 1)

        with open(file_path, "w", encoding="utf-8") as file:
            file.write(new_content)

        print(f"Snippet removed successfully from {filename}")