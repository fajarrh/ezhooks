# ezhooks Usage Guide

Complete guide for all hooks in ezhooks library with best practices and real-world examples.

## Table of Contents

- [useRefMutation](#userefmutation)
- [useArray](#usearray)
- [useFetch](#usefetch)
- [useMutation](#usemutation)
- [useTable](#usetable)

---

## useRefMutation

**Purpose**: Form handling with built-in store, async operations, and data validation/transformation via resolver.

### Basic Usage

Simple form with controlled inputs and async submission. This example shows how to use `handleSubmit` to process form data and `send` for API calls.

```typescript
import { useRefMutation } from 'ezhooks';

function LoginForm() {
  const form = useRefMutation({
    defaultValue: {
      email: '',
      password: ''
    }
  });

  return (
    <form onSubmit={form.handleSubmit((result) => {
      form.send({
        service: async () => api.login(result),
        onSuccess: (response) => {
          console.log('Login successful:', response);
        },
        onError: (error) => {
          console.error('Login failed:', error);
        }
      });
    })}>
      <input
        type="email"
        value={form.value('email')}
        onChange={(e) => form.setValue({ email: e.target.value })}
      />
      <input
        type="password"
        value={form.value('password')}
        onChange={(e) => form.setValue({ password: e.target.value })}
      />
      <button type="submit" disabled={form.processing}>
        {form.processing ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### With Zod Validation

Integrate Zod schema validation with `resolver` prop. The resolver receives form data, validates it, and returns a result that can be checked in `handleSubmit`. Error messages are accessible via `resolverResult`.

```typescript
import { z } from 'zod';
import { useRefMutation } from 'ezhooks';

const schema = z.object({
  email: z.string().email('Invalid email').transform(v => v.toLowerCase()),
  password: z.string().min(8, 'Min 8 characters'),
  age: z.string().transform(v => parseInt(v))
});

type FormData = z.input<typeof schema>;
type ValidatedData = z.output<typeof schema>;

function RegisterForm() {
  const form = useRefMutation<FormData, z.SafeParseReturnType<FormData, ValidatedData>>({
    defaultValue: {
      email: '',
      password: '',
      age: ''
    },
    resolver: (data) => schema.safeParse(data)
  });

  return (
    <form onSubmit={form.handleSubmit((result) => {
      if (result.success) {
        form.send({
          service: async () => api.register(result.data),
          onSuccess: () => console.log('Registered!')
        });
      }
    })}>
      <input
        type="email"
        value={form.value('email')}
        onChange={(e) => form.setValue({ email: e.target.value })}
      />
      {form.resolverResult?.error?.issues.find(i => i.path[0] === 'email') && (
        <span className="error">
          {form.resolverResult.error.issues.find(i => i.path[0] === 'email')?.message}
        </span>
      )}
      
      <input
        type="password"
        value={form.value('password')}
        onChange={(e) => form.setValue({ password: e.target.value })}
      />
      
      <input
        type="number"
        value={form.value('age')}
        onChange={(e) => form.setValue({ age: e.target.value })}
      />
      
      <button type="submit" disabled={form.processing}>
        Register
      </button>
    </form>
  );
}
```

### Custom Validation with Resolver

Implement custom validation logic using a resolver function. This approach is useful when you need full control over validation without external libraries.

```typescript
type FormErrors = Record<string, string>;

interface ValidationResult {
  valid: boolean;
  errors: FormErrors;
  cleanData?: any;
}

function ContactForm() {
  const form = useRefMutation<
    { name: string; email: string; message: string },
    ValidationResult
  >({
    defaultValue: {
      name: '',
      email: '',
      message: ''
    },
    resolver: (data) => {
      const errors: FormErrors = {};
      
      if (!data.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!data.email.includes('@')) {
        errors.email = 'Invalid email format';
      }
      
      if (data.message.length < 10) {
        errors.message = 'Message must be at least 10 characters';
      }
      
      return {
        valid: Object.keys(errors).length === 0,
        errors,
        cleanData: {
          name: data.name.trim(),
          email: data.email.toLowerCase(),
          message: data.message.trim()
        }
      };
    }
  });

  const handleSubmit = form.handleSubmit((result) => {
    if (result.valid) {
      form.send({
        service: async () => api.sendMessage(result.cleanData),
        onSuccess: () => {
          alert('Message sent!');
          form.reset();
        }
      });
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={form.value('name')}
          onChange={(e) => form.setValue({ name: e.target.value })}
          placeholder="Your name"
        />
        {form.resolverResult?.errors.name && (
          <span className="error">{form.resolverResult.errors.name}</span>
        )}
      </div>
      
      <div>
        <input
          type="email"
          value={form.value('email')}
          onChange={(e) => form.setValue({ email: e.target.value })}
          placeholder="your@email.com"
        />
        {form.resolverResult?.errors.email && (
          <span className="error">{form.resolverResult.errors.email}</span>
        )}
      </div>
      
      <div>
        <textarea
          value={form.value('message')}
          onChange={(e) => form.setValue({ message: e.target.value })}
          placeholder="Your message"
        />
        {form.resolverResult?.errors.message && (
          <span className="error">{form.resolverResult.errors.message}</span>
        )}
      </div>
      
      <button type="submit" disabled={form.processing}>
        {form.processing ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

### Array Operations

Manage array fields with built-in operations like `add`, `remove`, and `array`. Perfect for dynamic form fields like tags, todos, or multi-select options.

```typescript
function TodoForm() {
  const form = useRefMutation({
    defaultValue: {
      title: '',
      tags: [] as string[]
    }
  });

  const addTag = () => {
    const tagInput = prompt('Enter tag:');
    if (tagInput) {
      form.add('tags', tagInput, 'end');
    }
  };

  const removeTag = (tag: string) => {
    form.remove('tags', (item) => item === tag);
  };

  return (
    <div>
      <input
        value={form.value('title')}
        onChange={(e) => form.setValue({ title: e.target.value })}
        placeholder="Todo title"
      />
      
      <button onClick={addTag}>Add Tag</button>
      
      <div className="tags">
        {form.array('tags').map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
      </div>
      
      <button onClick={() => {
        form.send({
          service: async () => api.createTodo(form.data()),
          onSuccess: () => form.reset()
        });
      }}>
        Create Todo
      </button>
    </div>
  );
}
```

### API Reference

| Property/Method | Type | Description |
|----------------|------|-------------|
| `setValue(obj)` | `(value: Partial<T>) => void` | Set multiple values |
| `value(path)` | `(path: string) => any` | Get value at path |
| `deleteValue(path)` | `(path: string) => void` | Delete value at path |
| `add(path, value, position?)` | `(path, value, position?) => void` | Add item to array |
| `remove(path, condition)` | `(path, condition) => void` | Remove from array |
| `increment(path, amount?)` | `(path, amount?) => void` | Increment number |
| `decrement(path, amount?)` | `(path, amount?) => void` | Decrement number |
| `reset()` | `() => void` | Reset to default values |
| `data()` | `() => T` | Get all data |
| `handleSubmit(callback)` | `(callback) => handler` | Form submit handler |
| `send(options)` | `(options) => Promise<void>` | Async operation |
| `cancel()` | `() => void` | Cancel ongoing request |
| `processing` | `boolean` | Is processing state |
| `loading` | `boolean` | Is loading state |
| `resolverResult` | `R \| null` | Latest resolver result |
| `store` | `FlattenStore<T>` | Direct store access |

---

## useArray

**Purpose**: Reactive array operations on a specific path in FlattenStore with automatic re-rendering.

### Basic Usage

Manage arrays with reactive operations. The `useArray` hook subscribes to a specific path in the store and provides optimized array manipulation methods.

```typescript
import { useRefMutation, useArray } from 'ezhooks';

function ShoppingCart() {
  const mutation = useRefMutation({
    defaultValue: {
      items: [] as Array<{ id: number; name: string; qty: number }>
    }
  });

  const { array: items, add, remove, upsert } = useArray({
    store: mutation.store,
    name: 'items'
  });

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: 'New Item',
      qty: 1
    };
    add(newItem, 'end');
  };

  const updateQuantity = (item: { id: number; name: string; qty: number }) => {
    upsert(
      { ...item, qty: item.qty + 1 },
      (i) => i.id === item.id,
      'end'
    );
  };

  const removeItem = (id: number) => {
    remove((item) => item.id === id);
  };

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - Qty: {item.qty}
            <button onClick={() => updateQuantity(item)}>+</button>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      
      <p>Total Items: {items.length}</p>
    </div>
  );
}
```

### Nested Arrays

Access and manipulate arrays in nested objects using dot notation paths. This example shows working with arrays deep in your data structure.

```typescript
function UserProfile() {
  const mutation = useRefMutation({
    defaultValue: {
      user: {
        name: 'John',
        hobbies: [] as string[]
      }
    }
  });

  const { array: hobbies, add, remove } = useArray({
    store: mutation.store,
    name: 'user.hobbies'
  });

  return (
    <div>
      <h3>Hobbies</h3>
      {hobbies.map((hobby, index) => (
        <div key={index}>
          {hobby}
          <button onClick={() => remove((h) => h === hobby)}>Remove</button>
        </div>
      ))}
      
      <button onClick={() => {
        const newHobby = prompt('Enter hobby:');
        if (newHobby) add(newHobby, 'end');
      }}>
        Add Hobby
      </button>
    </div>
  );
}
```

### Replace Entire Array

Use `setValue` to replace the entire array with new data. Ideal for loading data from API responses or resetting array state.

```typescript
function TaskList() {
  const mutation = useRefMutation({
    defaultValue: {
      tasks: [] as string[]
    }
  });

  const { array: tasks, setValue } = useArray({
    store: mutation.store,
    name: 'tasks'
  });

  const loadTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setValue(data.tasks);
  };

  return (
    <div>
      <button onClick={loadTasks}>Load Tasks</button>
      {tasks.map((task, i) => (
        <div key={i}>{task}</div>
      ))}
    </div>
  );
}
```

### API Reference

| Property/Method | Type | Description |
|----------------|------|-------------|
| `array` | `T[]` | Reactive array data |
| `setValue(value)` | `(value: T[]) => void` | Replace entire array |
| `add(value, position?)` | `(value, position?) => void` | Add item |
| `remove(condition?)` | `(condition?) => void` | Remove item(s) |
| `upsert(value, func, position?)` | `(value, func, position?) => void` | Update or insert |
| `insertOrRemove(value, condition, position?)` | `(value, condition, position?) => void` | Toggle item |
| `size()` | `() => number` | Get array length |

---

## useFetch

**Purpose**: Multi-key fetch management with loading states, params, and automatic request cancellation.

### Basic Usage

Fetch data from a single endpoint with loading state management. The `service` function receives params and abort controller for cancellation support.

```typescript
import { useFetch } from 'ezhooks';

function UserList() {
  const fetch = useFetch({
    map: ['users'],
    service: {
      users: async ({ params, ctr }) => {
        const response = await fetch(`/api/users?page=${params.page}`, {
          signal: ctr.signal
        });
        return response.json();
      }
    }
  });

  useEffect(() => {
    fetch.call('users', { params: { page: 1 } });
  }, []);

  if (fetch.loading('users')) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {fetch.selector('users', (data) => data?.users || []).map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Multiple Endpoints

Manage multiple API endpoints independently with separate loading states. Each endpoint has its own key and can be called independently.

```typescript
function Dashboard() {
  const fetch = useFetch({
    map: ['users', 'posts', 'stats'],
    service: {
      users: async () => {
        const res = await fetch('/api/users');
        return res.json();
      },
      posts: async ({ params }) => {
        const res = await fetch(`/api/posts?limit=${params.limit}`);
        return res.json();
      },
      stats: async () => {
        const res = await fetch('/api/stats');
        return res.json();
      }
    }
  });

  useEffect(() => {
    fetch.call('users');
    fetch.call('posts', { params: { limit: 10 } });
    fetch.call('stats');
  }, []);

  return (
    <div>
      <section>
        <h2>Users</h2>
        {fetch.loading('users') ? (
          <div>Loading users...</div>
        ) : (
          fetch.selector('users', (data) => data?.users || []).map(user => (
            <div key={user.id}>{user.name}</div>
          ))
        )}
      </section>

      <section>
        <h2>Posts</h2>
        {fetch.loading('posts') ? (
          <div>Loading posts...</div>
        ) : (
          fetch.selector('posts', (data) => data?.posts || []).map(post => (
            <div key={post.id}>{post.title}</div>
          ))
        )}
      </section>

      <section>
        <h2>Statistics</h2>
        {fetch.loading('stats') ? (
          <div>Loading...</div>
        ) : (
          <div>{fetch.selector('stats', (data) => data?.total || 0)}</div>
        )}
      </section>
    </div>
  );
}
```

### With Params Management

Dynamically manage request parameters with `setParams` and `getParams`. Perfect for implementing search, filters, or pagination.

```typescript
function SearchResults() {
  const fetch = useFetch({
    map: ['search'],
    service: {
      search: async ({ params, ctr }) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`/api/search?${query}`, {
          signal: ctr.signal
        });
        return res.json();
      }
    }
  });

  const handleSearch = (query: string) => {
    fetch.setParams('search', { q: query, page: 1 });
    fetch.call('search');
  };

  const loadMore = () => {
    const currentPage = fetch.getParams('search').page || 1;
    fetch.setParams('search', { page: currentPage + 1 });
    fetch.call('search');
  };

  return (
    <div>
      <input
        type="search"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      
      {fetch.loading('search') && <div>Searching...</div>}
      
      <div>
        {fetch.selector('search', (data) => data?.results || []).map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
      
      <button onClick={loadMore} disabled={fetch.processing('search')}>
        Load More
      </button>
    </div>
  );
}
```

### API Reference

| Method | Type | Description |
|--------|------|-------------|
| `call(key, options?)` | `(key, options?) => Promise<void>` | Execute fetch |
| `loading(key)` | `(key) => boolean` | Get loading state |
| `processing(key)` | `(key) => boolean` | Get processing state |
| `selector(key, fn)` | `(key, fn) => any` | Select data with function |
| `setParams(key, params)` | `(key, params) => void` | Set request params |
| `getParams(key)` | `(key) => object` | Get current params |
| `clearParams(key, type?)` | `(key, type?) => void` | Clear params |
| `cancel(key)` | `(key) => void` | Cancel request |

---

## useMutation

**Purpose**: State management with mutation operations and async actions.

### Basic Usage

Simple state management with built-in increment/decrement operations. Great for counters, toggles, and numeric state.

```typescript
import { useMutation } from 'ezhooks';

function Counter() {
  const mutation = useMutation({
    defaultValue: {
      count: 0
    }
  });

  return (
    <div>
      <p>Count: {mutation.data().count}</p>
      <button onClick={() => mutation.increment({ count: 1 })}>
        Increment
      </button>
      <button onClick={() => mutation.decrement({ count: 1 })}>
        Decrement
      </button>
      <button onClick={() => mutation.reset()}>
        Reset
      </button>
    </div>
  );
}
```

### CRUD Operations

Full CRUD operations for managing lists of items. Use `add`, `upsert`, and `remove` to manipulate array data reactively.

```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function TodoApp() {
  const mutation = useMutation<{ todos: Todo[] }>({
    defaultValue: {
      todos: []
    }
  });

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false
    };
    mutation.add('todos', newTodo, 'end');
  };

  const toggleTodo = (id: number) => {
    const todo = mutation.data().todos.find(t => t.id === id);
    if (todo) {
      mutation.upsert(
        'todos',
        { ...todo, completed: !todo.completed },
        (t) => t.id === id,
        'end'
      );
    }
  };

  const removeTodo = (id: number) => {
    mutation.remove('todos', (todo) => todo.id === id);
  };

  return (
    <div>
      <button onClick={() => {
        const title = prompt('Todo title:');
        if (title) addTodo(title);
      }}>
        Add Todo
      </button>

      <ul>
        {mutation.data().todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### With Async Send

Perform async operations with error handling and loading states. The `send` method provides a clean way to handle API calls.

```typescript
function UserProfile() {
  const mutation = useMutation({
    defaultValue: {
      name: '',
      email: '',
      bio: ''
    }
  });

  const saveProfile = () => {
    mutation.send({
      service: async () => {
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mutation.data())
        });
        return response.json();
      },
      onSuccess: (data) => {
        alert('Profile saved!');
      },
      onError: (error) => {
        alert('Failed to save profile');
      },
      loading: true
    });
  };

  return (
    <div>
      <input
        value={mutation.value('name')}
        onChange={(e) => mutation.setData({ name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={mutation.value('email')}
        onChange={(e) => mutation.setData({ email: e.target.value })}
        placeholder="Email"
      />
      <textarea
        value={mutation.value('bio')}
        onChange={(e) => mutation.setData({ bio: e.target.value })}
        placeholder="Bio"
      />
      
      <button onClick={saveProfile} disabled={mutation.loading}>
        {mutation.loading ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );
}
```

### API Reference

| Property/Method | Type | Description |
|----------------|------|-------------|
| `data()` | `() => T` | Get all data |
| `setData(obj)` | `(value: Partial<T>) => void` | Set data |
| `value(key)` | `(key) => any` | Get value by key |
| `add(key, value, position?)` | `(key, value, position?) => void` | Add to array |
| `remove(key, condition)` | `(key, condition) => void` | Remove from array |
| `increment(obj)` | `(value) => void` | Increment numbers |
| `decrement(obj)` | `(value) => void` | Decrement numbers |
| `reset()` | `() => void` | Reset to default |
| `send(options)` | `(options) => void` | Async operation |
| `cancel()` | `() => void` | Cancel request |
| `processing` | `boolean` | Processing state |
| `loading` | `boolean` | Loading state |

---

## useTable

**Purpose**: Advanced table management with pagination, sorting, search, and data operations.

### Basic Usage

Basic table with pagination. The `selector` extracts data from response, while `total` provides the total count for pagination calculation.

```typescript
import { useTable } from 'ezhooks';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function UsersTable() {
  const table = useTable<User>({
    defaultValue: {
      page: 1,
      limit: 10
    },
    selector: (response) => response.data,
    total: (response) => response.total,
    service: async ({ params }) => {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`/api/users?${query}`);
      return response.json();
    }
  });

  useEffect(() => {
    table.call();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {table.processing && (
            <tr>
              <td colSpan={4}>Loading...</td>
            </tr>
          )}
          {table.data.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={table.pagination.prev}
          disabled={!table.pagination.hasPrev}
        >
          Previous
        </button>
        <span>
          Page {table.pagination.page} of {table.pagination.totalPages}
        </span>
        <button
          onClick={table.pagination.next}
          disabled={!table.pagination.hasNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### With Search and Filters

Add search and filtering capabilities to your table. Dynamic params update triggers automatic re-fetching with new criteria.

```typescript
function ProductsTable() {
  const table = useTable({
    defaultValue: {
      page: 1,
      limit: 20,
      search: '',
      category: 'all'
    },
    selector: (response) => response.products,
    total: (response) => response.total,
    service: async ({ params }) => {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`/api/products?${query}`);
      return response.json();
    }
  });

  useEffect(() => {
    table.call();
  }, []);

  const handleSearch = (value: string) => {
    table.setParams({ search: value, page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    table.setParams({ category, page: 1 });
  };

  return (
    <div>
      <div className="filters">
        <input
          type="search"
          placeholder="Search products..."
          value={table.params.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        
        <select
          value={table.params.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {table.data.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={table.pagination.prev} disabled={!table.pagination.hasPrev}>
          Previous
        </button>
        <span>Page {table.pagination.page} of {table.pagination.totalPages}</span>
        <button onClick={table.pagination.next} disabled={!table.pagination.hasNext}>
          Next
        </button>
        
        <select
          value={table.params.limit}
          onChange={(e) => table.setParams({ limit: parseInt(e.target.value), page: 1 })}
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
    </div>
  );
}
```

### With Sorting

Implement sortable columns with ascending/descending order. The table automatically refetches when sort parameters change.

```typescript
function SortableTable() {
  const table = useTable({
    defaultValue: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    },
    selector: (response) => response.data,
    total: (response) => response.total,
    service: async ({ params }) => {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`/api/users?${query}`);
      return response.json();
    }
  });

  const handleSort = (column: string) => {
    const newOrder = 
      table.params.sortBy === column && table.params.sortOrder === 'asc'
        ? 'desc'
        : 'asc';
    
    table.setParams({ sortBy: column, sortOrder: newOrder, page: 1 });
  };

  const getSortIcon = (column: string) => {
    if (table.params.sortBy !== column) return '↕️';
    return table.params.sortOrder === 'asc' ? '↑' : '↓';
  };

  useEffect(() => {
    table.call();
  }, [table.params.sortBy, table.params.sortOrder]);

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>
            Name {getSortIcon('name')}
          </th>
          <th onClick={() => handleSort('email')}>
            Email {getSortIcon('email')}
          </th>
          <th onClick={() => handleSort('created')}>
            Created {getSortIcon('created')}
          </th>
        </tr>
      </thead>
      <tbody>
        {table.data.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{new Date(user.created).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### API Reference

| Property/Method | Type | Description |
|----------------|------|-------------|
| `data` | `T[]` | Current page data |
| `params` | `object` | Current params |
| `processing` | `boolean` | Loading state |
| `call()` | `() => Promise<void>` | Fetch data |
| `setParams(params)` | `(params) => void` | Set params |
| `clearParams(keys?)` | `(keys?) => void` | Clear params |
| `pagination.page` | `number` | Current page |
| `pagination.totalPages` | `number` | Total pages |
| `pagination.hasNext` | `boolean` | Has next page |
| `pagination.hasPrev` | `boolean` | Has previous page |
| `pagination.next()` | `() => void` | Go to next page |
| `pagination.prev()` | `() => void` | Go to previous page |
| `pagination.goTo(page)` | `(page) => void` | Go to specific page |

---

## License

MIT © Fajar Rizky Hidayat
