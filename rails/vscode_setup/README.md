https://medium.com/@sulmanweb/setting-up-visual-studio-code-for-ruby-on-rails-development-beb0cb8c3749

extensions:
- Ruby
- Rufo (Ruby Formatter)

gems: 
- Rufo
- Rubocop


```
{
    "rubocop": {
        "lint": true, //enable all lint cops.
        "only": [/* array: Run only the specified cop(s) and/or cops in the specified departments. */],
        "except": [/* array: Run all cops enabled by configuration except the specified cop(s) and/or departments. */],
        "forceExclusion": true, //Add --force-exclusion option
        "require": [/* array: Require Ruby files. */],
        "rails": true //Run extra rails cops
    },
    "ruby.lint": {
        "rubocop": true
    },
    "[ruby]": {
        "editor.formatOnSave": true
    },
    "ruby.format": "rubocop",
    "ruby.intellisense": "rubyLocate",
    "editor.formatOnSaveTimeout": 1500,
    "editor.tabSize": 2,
}
```

