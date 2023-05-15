# TypedUrls

An utility package for creating typed url addresses

## Installation

`npm install @house-of-angular/typed-urls --save-dev`

## Usage

Based on provided value `urlFactory` will indicate whether any params are expected. It will throw an error in case they are.

```ts
import { urlFactory } from '@house-of-angular/typed-urls';

const url = urlFactory('http://api-domain/users/:id');

console.log(url.url({ id: '1234' }));
```
