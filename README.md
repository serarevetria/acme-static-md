# acme-static-md

## Installation

1. Clone this repository:

```bash
git clone [REPOSITORY_URL]
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:  
   Create a `.env` file (or copy this sample):

```env
PORT=3000
CONTENT_DIR=src/content
```

4. (Optional for testing) Create a `.env.test`:

```env
PORT=3000
NODE_ENV=test
CONTENT_DIR=tmp/content-test
```

---

## Useful Scripts

- Run in development mode:

```bash
npm run dev
```

- Run unit tests:

```bash
npm run test
```

- Run end-to-end tests:

```bash
npm run test:e2e
```

---

## Endpoints

### Create a new page

**POST** `/api/pages`

- Content-Type: `multipart/form-data`
- Fields:
  - `path`: the location where it should be saved (e.g., `about/me`)
  - `file`: markdown file

### List all pages

**GET** `/api/pages`

Returns a list of available page paths.

### Get a page's content as HTML

**GET** `/api/pages/:path`

Returns the HTML content of the specified page.

---

- Content files are stored locally in the directory specified by `CONTENT_DIR`.
- Upload validation ensures only `.md` files are accepted.
