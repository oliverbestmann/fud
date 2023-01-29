# FUD

```
Fear, uncertainty and doubt (often shortened to FUD) is a propaganda tactic used in sales, marketing,
public relations, politics, polling and cults. FUD is generally a strategy to influence perception
by disseminating negative and dubious or false information and a manifestation of the appeal to fear.
```

## What?

This package provides a lightweight alternative to [zod](https://www.npmjs.com/package/zod).
You can easily build up runtype types in typescript and validate your unsafe input against those types.
You can also derive static typescript types from your runtime types.

Compared to `zod`, you don't pay for what you don't use: Almost everything is treeshakable.

```ts
const personType = object({
    age: number().pipe(min(18)),
    name: string(),
    gender: nullable(string()),
});

// static type
type Person = TypeOf<typeof personType>;

// parse and validate
const p: Person = personType.parse(input);
console.log(`${p.name} is ${p.age} years old.`);

```

## Source type

The system also tracks the source type to each transformed type.

```ts
const dateType = string().pipe(toDate());

// SourceType is 'string'
type SourceType = SourceOf<typeof dateType>;

// TargetType is 'Date'
type TargetType = TypeOf<typeof dateType>;
```
