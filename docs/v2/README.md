# EZHooks v2 - Documentation

Author: Fajar Rizky Hidayat  
Version: 2.0

---

## Table of Contents

- useFetch
- useTable
- useMutation
- Common Patterns
- Event Object
- Best Practices

---

## useFetch

Overview
- Manage multiple fetch operations with caching, error handling, and cancellation.
- Support for service-based fetches or direct URL fetches.
- Can auto-run operations on mount.

Props
- map: identifiers for fetch operations.
- didMount: operations to run on mount.
- disabledOnDidMount: disable auto-run on mount.

Return
- data: cached responses.
- time: timestamps per key.
- fetch(key, options): trigger fetch (service-based or URL-based).
- selector(key): returns state and helpers for that key.

Selector methods and state
- loading, processing, params, data, body
- reload(params?)
- cancel()
- query(key?, default?)
- setQuery(obj)
- value(key?, default?)
- clear(type?: "data" | "params" | "body")
- setBody(obj)
- fetch(options)

Examples

Basic fetch (URL)
```tsx
import useFetch from 'ezhooks';

function UserProfile() {
  const { fetch, selector } = useFetch({ map: ['getUser'] });
  const { data, loading, reload } = selector('getUser');

  const handleFetch = () => {
    fetch('getUser', {
      url: '/api/users/1',
      onJson: (resp, cb) => cb(resp.data)
    });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {data && <p>Hello, {data.name}</p>}
      <button onClick={handleFetch}>Fetch User</button>
      <button onClick={reload}>Reload</button>
    </div>
  );
}
```

Service-based fetch
```tsx
const userService = (event) => fetch(`/api/users/${event.params.id}`).then(r => r.json());

function UserFetch() {
  const { fetch, selector } = useFetch({ map: ['user'] });
  const { data, loading } = selector('user');

  const load = (id) => {
    fetch('user', {
      service: userService,
      params: { id },
      onSuccess: (resp, cb) => cb(resp.data),
      onError: (e) => console.error(e)
    });
  };

  return <button onClick={() => load(1)}>{loading ? 'Loading' : 'Load'}</button>;
}
```

Auto-fetch on mount
```tsx
useFetch({
  map: ['profile'],
  didMount: {
    profile: {
      url: '/api/profile',
      onJson: (resp, cb) => cb(resp.data)
    }
  }
});
```

---

## useTable

Overview
- Manage table data with pagination, sorting, filtering, and local data operations.
- Provides pagination helpers and easy manipulation (add, update, remove).

Props
- service: function to fetch data.
- selector: transform response to table data.
- total: extract total count.
- params, replaceUrl, debounceTime, disabledOnDidMount
- pagination: pagination config (start page, perPage, options, custom calculations)

Return highlights
- isEmpty, loading, total, data
- order, orderBy
- query(key?, default?)
- setQuery(obj or updater)
- onSort(field, sort?)
- reload()
- clear(options)
- remove(paramKey, resetPage?)
- add(item, position?)
- update(condition, newValue)
- destroy(condition)
- has(key)
- cancel()
- pagination helpers: page, perPage, setPage, setPerPage, next/back/first/last buttons, text

Examples

Basic table
```tsx
function UserTable() {
  const table = useTable({
    service: async (event) => {
      const params = new URLSearchParams(event.params);
      return fetch(`/api/users?${params}`).then(r => r.json());
    },
    selector: (resp) => resp.data,
    total: (resp) => resp.total
  });

  return (
    <table>
      <tbody>
        {table.data.map(u => <tr key={u.id}><td>{u.name}</td></tr>)}
      </tbody>
    </table>
  );
}
```

Sorting
```tsx
<th onClick={() => table.onSort('name')}>
  Name {table.orderBy === 'name' ? table.order : null}
</th>
```

Pagination
```tsx
const { pagination } = table;
<button {...pagination.firstButton()}>First</button>
<button {...pagination.backButton()}>Prev</button>
<span>Page {pagination.page}</span>
<button {...pagination.nextButton()}>Next</button>
<button {...pagination.lastButton()}>Last</button>
<select value={pagination.perPage} onChange={pagination.onPerPageChange}>
  {pagination.perPageOptions.map(o => <option key={o} value={o}>{o}</option>)}
</select>
<p>{pagination.text}</p>
```

Data manipulation
```tsx
table.add(newUser, 'start');
table.update(u => u.id === 1, { name: 'Updated' });
table.destroy(u => u.id === 1);
```

---

## useMutation

Overview
- Manage form and mutation state with helpers for arrays, increments, and request lifecycle.
- Supports sending via a service function and canceling pending requests.

Props
- defaultValue: initial form data

Return highlights
- processing, loading, data
- setData(obj)
- increment(obj), decrement(obj)
- send(options): send mutation
- reset(), cancel()
- value(key, default?)
- add(key, value, position?)
- upsert(key, val, attr?, position?)
- remove(key, condition?)
- insertOrRemove(key, value, condition)
- singleReset(key, default?)
- size(key), has(key)

Examples

Basic form
```tsx
function LoginForm() {
  const form = useMutation({ defaultValue: { email: '', password: '' } });

  const submit = () => {
    form.send({
      service: async (event) => fetch('/api/login', { method: 'POST', body: JSON.stringify(event.data) }).then(r => r.json()),
      onSuccess: (resp) => { localStorage.setItem('token', resp.token); window.location.href = '/dashboard'; },
      onError: (e) => console.error(e)
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <input value={form.value('email')} onChange={e => form.setData({ email: e.target.value })} />
      <input value={form.value('password')} onChange={e => form.setData({ password: e.target.value })} />
      <button disabled={form.processing}>{form.processing ? 'Processing...' : 'Login'}</button>
    </form>
  );
}
```

Array fields
```tsx
form.add('emails', { id: Date.now(), value: '' }, 'end');
form.remove('emails', idx);
form.upsert('items', newItem, ['id'], 'start');
```

Increment/decrement
```tsx
form.increment({ quantity: 1 });
form.decrement({ quantity: 1 });
```

---

## Common Patterns

Combined CRUD flow
- useTable for lists and pagination
- useMutation for create/edit forms
- useFetch for single-resource fetches, previews, or auxiliary requests

Example flow
- Load table
- Click edit → fetch details with useFetch → form.setData(...)
- Submit form via form.send → onSuccess refresh table

---

## Event Object

When passed to service/send functions:
- params: query parameters object
- data: request body data

---

## Best Practices

- Use didMount to define initial fetches.
- Debounce expensive table queries.
- Implement onError for user feedback.
- Cancel pending requests on unmount to avoid leaks.
- Provide total extraction for accurate pagination.
- Use upsert for complex array updates.

---