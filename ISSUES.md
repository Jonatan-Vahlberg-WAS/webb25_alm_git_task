# Issues for the Individual Repo

Balanced mix of basic, intermediate, and advanced tasks for Git workflow practice.

## Easy / Foundational

### Issue 1 - Add required validation for product name

**Type:** `good first issue`

The Product model should require `name`.

**Tasks**

- Add validation in the Mongoose schema.
- Return a clear error message when `name` is missing.
- Add or update a test.

**Acceptance criteria**

- Creating a product without `name` fails validation.
- The user gets a readable error message.
- Tests cover the behavior.

---

### Issue 2 - Fix incorrect price test expectation

**Type:** `bug`

A test currently expects incorrect behavior for price validation.

**Tasks**

- Find the failing test.
- Fix the expectation.
- Make sure the test reflects actual app behavior.

**Acceptance criteria**

- The corrected test matches current schema logic.
- Test suite results are predictable.

---

### Issue 3 - Add clear server startup log

**Type:** `good first issue`

Improve startup logging when the server begins running.

**Tasks**

- Log the port number.
- Use a clear message.

**Example**
`Server running on port 3000`

**Acceptance criteria**

- Startup log includes actual runtime port.
- Message is easy for beginners to understand.

---

### Issue 4 - Add product name filter

**Type:** `enhancement`

Extend `GET /products` with optional filtering by name.

**Example**
`GET /products?name=shoe`

**Tasks**

- Use `req.query.name`.
- Return only matching products.

**Acceptance criteria**

- Endpoint still returns all products when no filter is passed.
- Filtered requests return only matching items.

---

## Intermediate

### Issue 5 - Improve error handling in product controller

**Type:** `enhancement`

Controller error handling is currently inconsistent.

**Tasks**

- Ensure `try/catch` where needed.
- Return meaningful status codes.
- Avoid leaking raw internal error objects.

**Acceptance criteria**

- `400` for validation/input problems.
- `404` when product does not exist.
- `500` for unexpected server failures.

---

### Issue 6 - Add test for missing product name

**Type:** `test`

Add a focused test that verifies a product cannot be created without `name`.

**Tasks**

- Check that validation fails.
- Assert that returned error is reasonable.
- Keep test isolated and readable.

**Acceptance criteria**

- Test fails before fix (if behavior is broken) and passes after fix.
- Assertions clearly describe expected behavior.

---

### Issue 7 - Add minimum price validation

**Type:** `enhancement`

Products should not allow negative prices.

**Tasks**

- Update Product schema.
- Add validation for `price >= 0`.
- Add tests for valid and invalid prices.

**Acceptance criteria**

- Negative price is rejected.
- `0` and positive values are accepted.

---

### Issue 8 - Support price range filtering

**Type:** `enhancement`

Extend `GET /products` with `minPrice` and `maxPrice`.

**Examples**

- `GET /products?minPrice=100`
- `GET /products?maxPrice=500`
- `GET /products?minPrice=100&maxPrice=500`

**Tasks**

- Parse query params safely.
- Return filtered products.
- Add tests.

**Acceptance criteria**

- Filters work independently and together.
- Invalid query values return a clear client error (or are handled consistently).

---

## More Advanced

### Issue 9 - Add sorting to GET /products

**Type:** `enhancement`

Support sorting by `price` or `name`.

**Examples**

- `GET /products?sort=price`
- `GET /products?sort=-price`
- `GET /products?sort=name`

**Tasks**

- Interpret ascending and descending sort.
- Reject unsupported sort fields gracefully.
- Add tests.

**Acceptance criteria**

- Supported fields sort correctly.
- Unsupported sort field produces predictable response.

---

### Issue 10 - Add pagination to GET /products

**Type:** `enhancement`

Add pagination support.

**Examples**

- `GET /products?page=1&limit=5`
- `GET /products?page=2&limit=5`

**Tasks**

- Add defaults for `page` and `limit`.
- Validate invalid input.
- Return paginated results only.
- Add tests.

**Optional**

- Return metadata such as `page`, `limit`, `total`.

**Acceptance criteria**

- Pagination works for valid input.
- Invalid input handled clearly.

---

### Issue 11 - Refactor controller logic into a service layer

**Type:** `refactor`

Controller currently handles most logic directly.

**Tasks**

- Extract product business logic into a service module.
- Keep routes/controllers thin.
- Preserve external API behavior.
- Keep tests passing.

**Acceptance criteria**

- No endpoint contract changes.
- Code organization is clearer and easier to maintain.

---

### Issue 12 - Add case-insensitive partial search

**Type:** `enhancement`

Improve name filtering with partial and case-insensitive matching.

**Example**
`GET /products?name=shoe`

Should match:

- `Running Shoe`
- `shoe cleaner`
- `SHOE BOX`

**Tasks**

- Use Mongoose/MongoDB query features appropriately.
- Keep behavior predictable.
- Add tests.

**Acceptance criteria**

- Search works for partial/case-insensitive input.
- Matching rules are consistent and documented.

---

### Issue 13 - Add validation test suite structure

**Type:** `test/refactor`

Improve organization of validation tests.

**Tasks**

- Group tests using `describe` blocks.
- Improve test naming.
- Keep setup readable.
- Add at least one missing edge case.

**Acceptance criteria**

- Validation tests are easy to scan and extend.
- Edge case is covered by an explicit test.

---

### Issue 14 - Add category field with simple enum validation

**Type:** `enhancement`

Add optional `category` to Product.

**Allowed values (example)**

- `electronics`
- `clothing`
- `home`

**Tasks**

- Add `category` to schema.
- Keep field optional.
- Restrict values with enum.
- Update tests.

**Acceptance criteria**

- Valid categories are accepted.
- Invalid categories fail validation with clear message.

---

## Scope Check for Current Base Repo

All 14 issues are feasible within the current project without major architecture changes.

**In-scope as-is**

- Issues 1-10, 12-14 can be implemented directly in the existing model/controller/routes/tests structure.

**Stretch but still in-scope**

- Issue 11 (service layer refactor) is more architectural, but still fully possible without changing external API behavior.

**Notes**

- For endpoint-focused testing, adding `supertest` is recommended but optional.
- Current project already contains intentionally imperfect behavior that maps well to several issues.
