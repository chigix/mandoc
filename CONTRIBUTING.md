# How to Contribute

## Workflow

_Before_ creating new commits or submitting a pull request, please make sure the
following is done...

1. Fork the repo and create your branch from `master`.

    ```sh-session
    $ git clone https://github.com/<your_username>/mandoc
    $ cd mandoc
    $ git checkout -b my_branch
    ```

1. ManDoc uses [Lerna](https://lernajs.io/) for managing and developing multiple
   packages and running development scripts. Run `npm install` will install all
   declared `devDependencies` into the root of this Lerna Repo, where the
   `lerna` command itself is also included.

1. Run `npx lerna bootstrap`. This command will installs all of the packages'
   dependencies and links any cross-dependencies through the `lerna` command
   installed previously.

## Testing

Before you submit pull request, use it yourself manually.

`ManDoc` command could be directly run from TypeScript code base with `lerna`:

```sh-session
$ npx lerna run mandoc:mandoc -- --template=mandoc-template-paper /path/to/md
```

### Unit Tests with Lerna

Currently, Unit tests scripts is conducted within `mandoc`, the main package,
having a `test` directory.

`ManDoc` test scripts are using Facebook `Jest`, which is installed in the root
of this Lerna Repo. Hence, Test Commands needed to be executed through
[`lerna run`](https://github.com/lerna/lerna/tree/master/commands/run#lernarun)

```sh
$ npx lerna run --scope=mandoc test -- stream.test
```

## Commit Message Guidelines

`Commitizen friendly` is applied in this repository, which has very precise
rules over how git commit messages can be formatted and leads to
**more readable message** for **generating the ManDoc change log**. Helper script
`npm run commit` provides command line based wizard to format commit message
easily, powered by `git-cz` from the `commitizen` package.
