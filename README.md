<p align="center">
  <a href="https://faithful-mods.github.io/" target="_blank">
    <img src="./image/icon/organization_icon.png" alt="logo">
  </a>
  <h1 align="center">Compliance Mods - Website</h1>

  <p align="center"><i>A massively improved version of the <a href="http://f32.me">http://f32.me</a> website.</i></p>

  <div align="center">
    <a href="https://github.com/Faithful-Mods/faithful-mods.github.io/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/Faithful-Mods/faithful-mods.github.io"></a>
    <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="License" src="https://img.shields.io/badge/license-CC--BY--NC--SA%204.0-lightgray"></a>
    <a href="https://faithful-mods.github.io/help-us"><img alt="GitHub labels" src="https://img.shields.io/github/labels/Faithful-Mods/faithful-mods.github.io/help%20wanted?color=23159818"></a>
    <a href="https://github.com/Faithful-Mods/faithful-mods.github.io/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Faithful-Mods/faithful-mods.github.io?style=social"></a>
  </div>
</p>

## What is this website?
[Faithul Mods](https://faithful-mods.github.io/) was created so that you can download a custom Faithful 32-pixels resource pack for your modded adventure. With the support and help from the Faithful Teams community, more and more mods are supported every day. You can also contribute thanks to the instructions below.

## You want to contribute?
## Contribute to the website

You can create a [fork](https://github.com/Faithful-Mods/faithful-mods.github.io/network/members) of this repository, apply your changes/additions and then create a [pull request](https://github.com/Faithful-Mods/faithful-mods.github.io/compare)

### Installation process

You need a two requirements before developing the website. First you need Ruby ([download page](https://www.ruby-lang.org/en/downloads/)). With Ruby you will need to install [Jekyll](https://jekyllrb.com/) by typing the following command in your favorite terminal:
```
gem install bundler jekyll
```

Then you need to install the bundle provided in the [Gemfile](./Gemfile):
```
bundle install
```

Then you need to build the website with this command:
```
jekyll build
```

Eventually, in order to automatically rebuild the website if an existing file was updated, you can run:
```
jekyll serve
```
After that you can enjoy your website on your local machine at the following address: http://127.0.0.1:4000/. Enjoy!

## Contribute by adding mods
We made a beautiful tutorial that you can read on this page: https://faithful-mods.github.io/help-us
