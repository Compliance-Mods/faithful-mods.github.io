# Faithful-Mods website
A better version of http://f32.me website

# Add a mod to the [mods-list](https://faithful-mods.github.io/mods-list):
Create a pull request, editing this [file](https://github.com/Faithful-Mods/Faithful-Mods.github.io/blob/master/_data/mods.yml):
```yaml
# Add a new mods following existing ones:
- modname: #need to be the same as the assets file name
  name:
    - Mod Name #Name displayed in the mods list
    - modname #name from the assets file
  versions:
    - 1-12-2 #replace dots with '-'
    - 1.7.10 #wrong name convention
```
Don't forget to make a repository inside this organization, ask an admin.

# Add a mod repository:
Create a repository with the name of the mod, following the name it have in the assets folder, example:
`assets/minecraft` -> use `minecraft`, not Minecraft or Mine craft,
Create a branch for eachs versions supported.
