# Northcoders News API

[Hosted version](https://beeps-nc-news.herokuapp.com/api)

---

## Description

News API

Containing:

- `Articles`
- `Comments`
- `users`
- `topics`

## Dependencies

- `node.js` (`v16.13.2`)
- `Postgres` (`v12.9`)

---

## Setup

### Insataling Dependencies

```bash
npm install
```

### Create ENV files

Create two new files

- `.env.development`
- `.env.test`

using the `.env-example` for a reference

### Creating and seeding databases

To create the databases use the `setup-dbs` script

```bash
npm run setup-dbs
```

To seed the development database use the `seed` script

```bash
npm run seed
```

The test database is seeded before every test

### Running tests

Run the tests using the `test` script

```bash
npm test
```
