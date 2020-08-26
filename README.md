# Faithful-Mods website
A better version of http://f32.me website

# Add a mod to the [mods-list](https://faithful-mods.github.io/mods-list):
Create a pull request, editing this [file](https://github.com/Faithful-Mods/Faithful-Mods.github.io/blob/master/_data/mods.json):

> The repository doesn't need to be in the Faithful-Mods organization, it can be yours.

```json

[
	{
    "name": [
      "Mod Name",					// name displayed on our website, use capital letters
      "modname"						// name from '/assets' folder
    ],
    "versions": [					// version available for the resource pack
      "1.12.2",								// -> add version for each branch
      "1.11.2",
      "1.10.2"
    ],
		"repository": "Faithful-Mods"			// take it from the repo url: https://github.com/**Faithful-Mods**/modname
  }
]
```