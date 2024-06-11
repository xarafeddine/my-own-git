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

This Git implementation is capable of initializing a repository, creating commits and cloning a public repository.

Building this project, I gained insights into the .git directory, Git objects (such as blobs, commits, and trees), Git's transfer protocols, and more.

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

The `mygit.sh` script is expected to operate on the `.git` folder inside the
current working directory. If you're running this inside the root of this
repository, you might end up accidentally damaging your repository's `.git`
folder.

We suggest executing `git.sh` in a different folder when testing locally.
For example:

```sh
mkdir -p /tmp/testing && cd /tmp/testing
/path/to/your/repo/mygit.sh init
```

To make this easier to type out, you could add a
[shell alias](https://shapeshed.com/unix-alias/):

```sh
alias mygit=/path/to/your/repo/mygit.sh

mkdir -p /tmp/testing && cd /tmp/testing
mygit init
```

After installing the dependencies, you can use the custom Git system by running the following commands:

Initialize a Repository

```sh
mygit init
```

Read a git blob object

```sh
mygit cat-file -p <blob_sha>
```

Create a git blob object

```sh
mygit hash-object -w <filename>
```

Read a git tree object

```sh
mygit ls-tree <tree-sha>
```

Create a git tree object

```sh
mygit write-tree <tree-sha>
```

Create a git commit object

```sh
mygit commit-tree <tree_sha> -p <commit_sha> -m <message>
```

### Future commands (not yet implimented)

Add Files

```sh
mygit add <file-path>
```

Commit Changes

```sh
mygit commit -m "Commit message"
```

View Commit History

```sh
mygit log
```

Create a Branch

```sh
mygit branch <branch-name>
```

Merge Branches

```sh
mygit merge <branch-name>
```

Check Status

```sh
mygit status
```
