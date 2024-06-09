# My own Git

![Git System](https://img.shields.io/badge/Git-System-blue)
![Bun](https://img.shields.io/badge/Bun-v0.1.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-v4.0.0-blue)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

Welcome to the **My own Git** project! This project aims to build a custom version control system similar to Git from scratch using [Bun](https://bun.sh) and [TypeScript](https://www.typescriptlang.org).

## Features

- **Initialization**: Create a new repository.
- **Add**: Add files to the staging area.
- **Commit**: Save changes to the repository.
- **Log**: View commit history.
- **Branch**: Create and manage branches.
- **Merge**: Merge branches.
- **Status**: Check the status of files in the working directory and staging area.

## Installation

Before you begin, ensure you have [Bun](https://bun.sh) and [Node.js](https://nodejs.org) installed on your system.

1.  **Clone the Repository**

    ```sh
    git clone https://github.com/your-username/custom-git-system.git
    cd custom-git-system
    ```

2.  **Install Dependencies**

    ```sh
    bun install
    ```

## Usage

Note: To ensure that the .git file of the repo doesn't get overwritten, test the project in a separate folder, for example:

```sh
$ mkdir test_dir && cd test_dir
$ /path/to/git.sh init # initialize a new git repository
```

After installing the dependencies, you can use the custom Git system by running the following commands:

Initialize a Repository

```sh
git.sh init
```

Read a git repo object

```sh
git.sh cat-file -p <blob_sha>
```

Create a get blob object

```sh
git.sh hash-object -w <filename>
```

### Future commands (not yet implimented)

Add Files

```sh
git.sh add <file-path>
```

Commit Changes

```sh
git.sh commit -m "Commit message"
```

View Commit History

```sh
git.sh log
```

Create a Branch

```sh
git.sh branch <branch-name>
```

Merge Branches

```sh
git.sh merge <branch-name>
```

Check Status

```sh
git.sh status
```
