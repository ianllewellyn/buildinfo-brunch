# buildinfo-brunch

<img src="https://img.shields.io/npm/v/buildinfo-brunch.svg" alt="npm version" height="18">
<img src="https://img.shields.io/npm/dt/buildinfo-brunc.svg" alt="npm downloads" height="18">

Appends build information to your brunch project.

## Installation

`npm install --save buildinfo-brunch`

## Configuration

Configuration is handled using brunch config plugin options.

#### `target` (string, optional)

Where do you want to put the info Object? Either 'commonjs' or 'window'.
'commonjs' will add as a commonjs module called `nameSpace` property.
'window' will add a property called `nameSpace` to the window.

Default: `commonjs`.

#### `nameSpace` (string, optional)

The namespace to add the info Object to.

Default: `{bower.name}/info`.

#### `info` (function, optional)

Function to use to customize the information that is appended to your files.
The default info Object is passed into this method, so add properties to it,
or replace it completely.

Default: `function(info){ return info }`.

## Example brunch-config.coffee

```coffee
	plugins:
		buildinfo:
			target: 'commonjs'
			nameSpace: 'my_module_name'
			info: (info) ->
				info.version = '1.0.0'
				return info
````
