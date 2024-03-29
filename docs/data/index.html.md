---
title: Docs

language_tabs:
  - python
  - go
  - typescript

footer:
  - <a href="https://www.github.com/featureguards/featureguards-python" class="sdk">Python SDK</a>
  - <a href="https://www.github.com/featureguards/featureguards-go" class="sdk">Go SDK</a>
  - <a href="https://www.github.com/featureguards/featureguards-js" class="sdk">Javascript SDK</a>
  - <a href='https://app.featureguards.com/register'>Sign up</a>

includes:
  - errors

search: true

attachments:
  - "./logo.png"
---

# Introduction

Welcome to the FeatureGuards API! We have built SDKs for using FeatureGuards in Go, Javascript, and Typescript. You only need to add a few lines of code to get started. Below are descriptions of various operations and examples in each
programming language.

# Getting Started

First, create [a new account](https://app.featureguards.com/register) to use our dashboard. The dashboard
is used to define new feature flags, what rules to use for targeting/rollouts, creating API keys...etc.
Go through the sign up wizard and create a feature flag (either on/off or percentage). The dashboard
can be used to manage your feature flags.

Once you've created a feature flag in the dashboard, then it only takes a few minutes to add FeatureGuards to your codebase. Please, follow the examples below
for each language.

| Language             | Package                                                            | Example                                                                                           |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Python               | `python3 -m pip install --upgrade featureguards`                   | [Python](https://github.com/featureguards/featureguards-python/blob/main/examples)                |
| Go                   | `go get -u github.com/featureguards/featureguards-go/v2`           | [Go](https://github.com/featureguards/featureguards-go/blob/main/examples_test.go)                |
| Javascript (NodeJS)  | `yarn add featureguards-node` or `npm i --save featureguards-node` | [NodeJS](https://github.com/featureguards/featureguards-js/tree/main/examples/node/src/index.ts)  |
| Javascript (Browser) | `yarn add featureguards-web` or `npm i --save featureguards-web`   | [Browser](https://github.com/featureguards/featureguards-js/tree/main/examples/web/src/index.tsx) |

# Authentication

> To authenticate with FeatureGuards, use this code:

```python
from featureguards.feature_flags import feature_flags
from os import getenv
fg = feature_flags(api_key=getenv('MY_API_KEY'))
```

```go

import (
	"context"
	featureguards "github.com/featureguards/featureguards-go/v2"
)
ctx, cancel := context.WithCancel(context.Background())
defer cancel()
fg := featureguards.New(ctx, featureguards.WithApiKey("MY_API_KEY"))
```

```typescript
// For NodeJS
import featureguards from "featureguards-node";
// For Browser/Web
import featureguards from "featureguards-web";

const featureGuards = await featureguards({
  apiKey: "MY_API_KEY",
});
```

> Make sure to replace `MY_API_KEY` with your API key based on the platform.

FeatureGuards uses API keys to allow access to the APIs. You can generate a new FeatureGuards API key at our [dashboard](https://app.featureguards.com/project/settings).
An API key is associated with a particular platform (i.e., web, server). Only feature flags that
belong to the given platform are accessed via the corresponding API key. For example, a web API key
can only access web/browser feature flags.

<aside class="notice">
You must replace <code>MY_API_KEY</code> with your platform's API key.
</aside>

# Feature Flags

## Default Values

It's possible to specify default values. This is useful in cases where the defaults might be on
and not off and the exceptional cases where FeatureGuards is down. The SDK will return the default
value provided for each feature flag. This is sometimes useful after a feature has been released
and the feature-toggle is used as a kill switch, hence it's desirable to keep the feature flag
check in code even after the feature is released. To pass defaults, here are examples in each
language.

```python
fg = feature_flags(api_key='...', defaults={'MY_FEATURE': True, 'MY_FEATURE_2': True})
```

```go
fg := featureguards.New(ctx,
		featureguards.WithDefaults(map[string]bool{
      "MY_FEATURE": true,
      "MY_FEATURE_2": true,
      /* ...etc */
      }),
      /* Other options */)
```

```typescript
const featureGuards = await featureguards({
  defaults: {
    MY_FEATURE: true,
    MY_FEATURE_2: true,
  },
  // Other options below.
});
```

## Check If A Feature Is On

FeatureGuards does **NOT** do any networking IO for _IsOn_. Therefore, it's safe to call it million
times a second without any caching. It internally keeps a synced copy of all the features defined
in FeatureGuard for the given API key.

```python
fg.is_on('MY_FEATURE')
```

```go
// Using fg obtained from the SDK.
on, err := fg.IsOn("MY_FEATURE")
```

```typescript
// Using fg obtained from the SDK.
const on = await fg.isOn("MY_FEATURE");
```

<aside class="warning">
Errors are thrown/returned if a feature flag doesn't exist or at the rare occasions the SDK
failing to fetch/refresh its synced copy of feature flags due to FeatureGuards being down.
</aside>

## Percentage Feature Flags

FeatureGuards evaluates whether a feature is on or off based on provided attributes (if any).
For example, if a feature is turn on at 10%, it can consistently return on/off for the same _userId_,
_companyId_ or any other attribute provided. If multiple attributes are provided for evaluation,
they will be checked in order based on the attributes provided to the call for `IsOn`. So, if the
feature flag definition includes both _userId_ and _companyId_ in that order, the _user_id_ will
be used if both values are passed to `IsOn`. Below are examples for passing attributes to be used
for evaluating on/off.

```python
fg.is_on('MY_FEATURE', attrs={'user_id': 123, 'company_slug': 'acme'})
```

```go
// Using fg obtained from the SDK.
on, err := fg.IsOn("MY_FEATURE", featureguards.WithAttributes(
		featureguards.Attributes{}.Int64("user_id", 123).String("company_slug", "acme")))
```

```typescript
// Using fg obtained from the SDK.
const on = await fg.isOn("MY_FEATURE", {
  attrs: {
    user_id: BigInt(123),
    company_slug: "acme",
  },
});
```

<aside class="warning">
The types of the attributes passed must match what's defined in FeatureGuards.
For example, if an attribute such as <code>user_Id</code> is passed with type string, it must be 
defined in FeatureGuards as a string too.
</aside>

## Allow/Disallow List

FeatureGuards allows specifying additional constraints as part of evaluating whether a feature is
on or off. Even if a feature flag evaluates to off based on the percentage or if it was actually
turned off, it can still be on for a subset of the population based on the allow list rules defined
on the feature and the attributes passed in. This is useful in scenarios where the feature is off
by default, but is only turned on for certain users based on their _userId_.

<aside class="warning">
Disallow lists are processed last. If an attribute matches both an allow list and a disallow list,
it will be evaluated as off since disallow lists are processed last.
</aside>

## Attribute Types

| Type      | Python        | Go          | Javascript/Typescript |
| --------- | ------------- | ----------- | --------------------- |
| String    | `str`         | `string`    | `string`              |
| Boolean   | `bool`        | `bool`      | `boolean`             |
| Float     | `float`/`int` | `float32`   | `number`              |
| Integer   | `float`/`int` | `int64`     | `bigint`              |
| Date/Time | `datetime`    | `time.Time` | `Date`                |
