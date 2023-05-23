# TypedUrls

A utility package for creating typed url addresses.

## Installation

`npm install @house-of-angular/typed-urls --save-dev`

## Features

- Supports route urls
- Supports query parameters
- Allows to specify the type of the query parameters
- Allows marking query parameters as required/optional

## Usage

You can create an instance of typed url with `urlFactory`. Url factory will return an instance of class with `url`
method that allows you to create an url based on provided blueprint.

```ts
import { urlFactory } from '@house-of-angular/typed-urls';

const url = urlFactory('http://api-domain/users');

// Logs "http://api-domain/users"
console.log(url.url());
```

### Route Parameters

Based on provided value `urlFactory` will indicate whether any params in the url are expected. It will throw an error in
case they are.

Example:

```ts
import { urlFactory } from '@house-of-angular/typed-urls';

const url = urlFactory('http://api-domain/users/:id');

// Logs "http://api-domain/users/1234"
console.log(url.url({ id: '1234' }));


const multipleParamsUrl = urlFactory('http://api-domain/users/:id/achievements/:achievementId');

// Logs "http://api-domain/users/1234/achievements/533"
console.log(multipleParamsUrl.url({ id: '1234', achievementId: '533' }));
```

### Query Parameters

Url factory automatically retrieves expected query parameters from the url. The value of the parameter should be set to
its type.

List of Available Types:

- string
- number
- boolean
- array\<type\> (e.g. array\<string\>, array\<array\<number\>\>)
- object
- any

Example:

```ts
import { urlFactory } from '@house-of-angular/typed-urls';

const url = urlFactory('http://api-domain/products?limit=number&sorting=string');

// Logs "http://api-domain/products?limit=5&sorting=asc"
console.log(url.url({ limit: 5, sorting: 'asc' }));
```

All query parameters are optional by default. To mark param as required add an exclamation mark after parameter type.

Example:

```ts
const url = urlFactory('http://api-domain/products?limit=number&sorting=string!')
```

In the example above:
- `limit` parameter is optional
- `sorting` parameter is required

### Combination of Parameters

Library allows combination of both parameter types in single url.

Example:

```ts
import { urlFactory } from '@house-of-angular/typed-urls';

const url = urlFactory('http://api-domain/users/:id/achievements?limit=number&sorting=string');

// Logs "http://api-domain/users/1/achievements?limit=5&sorting=asc"
console.log(url.url({ id: 1 }, { limit: 5, sorting: 'asc' }));
```
