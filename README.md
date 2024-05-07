# ezhooks

This is a custom hook for data processing from the frontend

## Installation

```
npm install ezhooks
```

or

```
yarn add ezhooks
```

- [useMutation](#usemutation)
- [useTable](#usetable)
- [useFetch](#usefetch)
- [useSValidation](#usesvalidation)

### useMutation

Hook form data mutation

#### Generic Props

| Name                | Type         | Description                          |
| ------------------- | ------------ | ------------------------------------ |
| **defaultValue`*`** | `T`          | Default values for the form.         |
| **scenario**        | `Object`     | Divide data in the form of scenarios |
| **format**          | `ObjectFunc` | Provides the format value when input |

#### Usage

```javascript
import useMutation from 'ezhooks/lib/useMutation';

const App = () => {
    const form = useMutation({
        defaultValue: {
            title: '',
            contact: {
                phone: '',
                office: ''
            },
            item: [],
            rating: 0
        }
    })
    ...
}
```

### Props

#### processing

| Name           | Type   | Description                                     |
| :------------- | :----- | :---------------------------------------------- |
| **processing** | `bool` | Gives an indication of the process in progress. |

```javascript
form.processing ? "loading...." : <div>...</div>;
```

#### scenario

| Name         | Type     | Description       |
| :----------- | :------- | :---------------- |
| **scenario** | `string` | current scenario. |

```javascript
console.log("scenario", form.scenario);
```

#### data(scenario)

| Name     | Type   | Description    |
| :------- | :----- | :------------- |
| **data** | `func` | Show all data. |

```javascript
console.log("Data", form.data());
```

_OR with scenario_

```javascript
console.log("Data", form.data("create"));
```

#### setData(value`*`)

| Name        | Type   | Description    |
| :---------- | :----- | :------------- |
| **setData** | `func` | Show all data. |

```javascript
...
return <div>
    <input type='text' name='title' onChange={e => form.setData({[e.target.name]: e.target.value})} />
</div>
```

**Nested Value**

> for nested values we break them down using dots

_set value if object nested (object)_

```javascript
...
return <div>
    <input type='text' onChange={e => form.setData({'contact.phone': e.target.value})} />
    <input type='text' onChange={e => form.setData({'contact.office': e.target.value})} />
</div>
```

_set value value if array object_

```javascript
...
return <div>
    <input type='text' onChange={e => form.setData({'item.0.label': e.target.value})} />
    <input type='text' onChange={e => form.setData({'item.0.item.1.label': e.target.value})} />
</div>
```

#### value(key`*`, defaultValue = '')

| Name      | Type   | Description       |
| :-------- | :----- | :---------------- |
| **value** | `func` | Get value by key. |

```javascript
...
return <div>
    <input ... value={form.value('title')}/>
    <input ... value={form.value('contact.phone')}/>
    <input ... value={form.value('item.0.label')}/>
</div>
```

**Nested Get Value**

> for get values we break them down using dots

#### increment(value`*`)

| Name          | Type   | Description     |
| :------------ | :----- | :-------------- |
| **increment** | `func` | increase value. |

```javascript
...
return <div>
   <input type='text' onChange={e => form.increment({'rating': 1})} />
</div
```

**Nested Increment**

> for nested values we break them down using dots

#### decrement(value`*`)

| Name          | Type   | Description     |
| :------------ | :----- | :-------------- |
| **decrement** | `func` | decrease value. |

```javascript
...
return <div>
   <input type='text' onChange={e => form.decrease({'rating': 1})} />
</div
```

**Nested Decrement**

> for nested values we break them down using dots

#### addItem(key`*`, value`*`, position)

| Name         | Type             | Description            |
| :----------- | :--------------- | :--------------------- |
| **addItem**  | `func`           | add array value.       |
| **position** | `string, number` | `start, end`or`number` |

```javascript
...
form.addItem('item', {label: ''}) //default position:end
form.addItem('item', {label: ''}, 1) //position by number:index start by 0
```

**Nested Decrement**

> for nested values we break them down using dots

#### removeItem(key`*`, condition)

| Name           | Type          | Description                             |
| :------------- | :------------ | :-------------------------------------- |
| **removeItem** | `func`        | add array value.                        |
| **conditionn** | `number,func` | number of index data or func(condition) |

```javascript
...
form.removeItem('item', 0)
form.removeItem('item', (item) => item.label === 'test') //condition with function
```

**Nested Decrement**

> for nested values we break them down using dots

#### reset()

| Name      | Type   | Description  |
| :-------- | :----- | :----------- |
| **reset** | `func` | clear value. |

```javascript
...
form.reset()
```

#### keys(scenario)

| Name     | Type   | Description  |
| :------- | :----- | :----------- |
| **keys** | `func` | get key data |

> if scenario `true` will display all key from scenario then if scenario set `string` key from props.scenario will display from prop.scenario with spesifik key and scenario `false` will display all key data. default `false`

#### setScenario(scenario`*`)

| Name            | Type   | Description                                  |
| :-------------- | :----- | :------------------------------------------- |
| **setScenario** | `func` | set scenario form the list in props.scenario |

```javascript
...
form.setScenario('create')
```

#### send(props`*`)

| Name           | Type     | Description                                              |
| :------------- | :------- | :------------------------------------------------------- |
| **service`*`** | `func`   | service.                                                 |
| **scenario**   | `string` | choose a scenario for the data directly.                 |
| **onSuccess**  | `func`   | The function callback on success and returns a response. |
| **onError**    | `func`   | The function calls back on failure and returns a error.  |
| **onAlways**   | `func`   | function calls back same 'finally' on promise            |

#### EventProps

| Name         | Type     | Description       |
| :----------- | :------- | :---------------- |
| **ctr**      | `class`  | AbortController.  |
| **scenario** | `string` | [scenario](#sce). |
| **data**     | `func`   | [data](#data).    |
| **keys**     | `func`   | [keys](#keys).    |

> `event.data(...)` If the scenario has been set, it will automatically retrieve data based on the scenario key. If you want to reset it, fill it with the value `true`, if no scenario is set, it will return all data.

```javascript
...

function onSubmit(){
    form.send({
        service: (event) => fetch('http:example.com', {
            method: 'post',
            body: JSON.stringify(event.data()),
            signal: event.ctr.signal
        }),
        onSuccess: (resp) => {

        },
        onError: (err) => {},
        onAlways: () => {}
    })
}
```

_[TS EventProps](#eventprops)_

```javascript
// import { EventSend } from 'ezhooks/lib/useMutation' if typescripts
const addExample = async (event: EventSend) => {
  return fetch("http:example.com", {
    method: "post",
    body: JSON.stringify(event.data()),
    signal: event.ctr.signal,
  }).then((resp) => resp.json());
};

function onSubmit() {
  form.send({
    service: addExample,
    onSuccess: (resp) => {},
    onError: (err) => {},
    onAlways: () => {},
  });
}
```

> the service can use another method request: GET, PUT, POST, DELETE or PATH

_with scenario_

```javascript
const form = useMutation({
    ...
    scenario: {
        create: ['title'],
        update: ['id', 'title']
    }
}
```

```javascript
...
const addExample = async (event: EventSend) => {

  const data = event.data() // or event.data(true) // or event.data('create') // or event.data(event.scenario)

  return fetch("http:example.com", {
    method: "post",
    body: JSON.stringify(data),
    signal: event.ctr.signal,
  }).then((resp) => resp.json());
};

function onSubmit(){
    form.send({
        ...
       scenario: 'create'
    })
}
```

_parsing param_

```javascript
...

const param = {
  isUpdate: true
}

const addExample = (param) => async (event: EventSend) => {

  const data = event.data()

  return fetch("http:example.com", {
    method: param.isUpdate ? "put" : "post",
    body: JSON.stringify(data),
    signal: event.ctr.signal,
  }).then((resp) => resp.json());
};

function onSubmit(){
    form.send({
        ...
        service: addExample(param)

    })
}
```

### useFetch

Hook for get data

#### Generic Props

| Name                   | Type     | Description                                |
| ---------------------- | -------- | ------------------------------------------ |
| **service`*`**         | `func`   | default values for the form.               |
| **selector**           | `func`   | divide data in the form of scenarios       |
| **defaultValue**       | `T`      | default values for the data                |
| **disabledOnDidMount** | `bool`   | disable call request for first time render |
| **debounceTime**       | `number` | delay time request in milliseconds         |
| **deps**               | `array`  | dependcies                                 |
| **getData**            | `func`   | function callback for get data             |

#### Usage

```javascript
import useFetch from 'ezhooks/lib/useFetch';

const App = () => {
    const fetch = useFetch({
        service: () => fetch('http://example.com').then(resp => resp.json())
        selector: (resp) => resp.products,
        defaultValue: [] //or {}
    })
    ...
}
```

> for service can use another service request like fetch, axios ..etc

### Props

#### loading

| Name        | Type   | Description                                     |
| :---------- | :----- | :---------------------------------------------- |
| **loading** | `bool` | Gives an indication of the process in progress. |

```javascript
form.loading ? "loading...." : <div>...</div>;
```

#### isEmpty

| Name        | Type   | Description                           |
| :---------- | :----- | :------------------------------------ |
| **isEmpty** | `bool` | Gives an indication of if empty data. |

```javascript
form.isEmpty ? "Data not available" : <div>...</div>;
```

#### data

| Name     | Type | Description |
| :------- | :--- | :---------- |
| **data** | `T`  | value.      |

```javascript
form.data;
```

#### query

| Name      | Type     | Description      |
| :-------- | :------- | :--------------- |
| **query** | `object` | query parameters |

```javascript
form.query;
```

#### setQuery(value`*`)

| Name         | Type   | Description            |
| :----------- | :----- | :--------------------- |
| **setQuery** | `func` | function for set query |

```javascript
<input
  type="search"
  name="keywords"
  onChange={(e) => fetch.setQuery({ [e.target.name]: fetch.target.value })}
/>
```

#### getQuery(key`*`, defaultValue = '')

| Name         | Type   | Description            |
| :----------- | :----- | :--------------------- |
| **setQuery** | `func` | function for set query |

```javascript
<input type='search' name='keywords' ... value={fecth.getQuery('keywords')}) />
```

#### refresh()

| Name        | Type   | Description    |
| :---------- | :----- | :------------- |
| **refresh** | `func` | recall request |

```javascript
<button onClick={fetch.refresh}>Reload</button>
```

#### clear(fields?: {except, only})

| Name      | Type   | Description                                       |
| :-------- | :----- | :------------------------------------------------ |
| **clear** | `func` | function for clear all query or some query by key |

```javascript
<button onClick={ ()=> fetch.clear()}>Reset All</button>
<button onClick={ ()=> fetch.clear({only: ['keywords']})}>Reset only keywords</button>
<button onClick={ ()=> fetch.clear({except: ['keywords']})}>Reset excpet keywords</button>
```

#### has(key`*`)

| Name    | Type   | Description                            |
| :------ | :----- | :------------------------------------- |
| **has** | `func` | function for check query key is exists |

```javascript
if (fetch.has("keywords")) {
  console.log("exists");
}
```

#### cancel()

| Name       | Type   | Description            |
| :--------- | :----- | :--------------------- |
| **cancel** | `func` | cancel request pending |

```javascript
<button onClick={fetch.cancel}>Cancel</button>
```

### useTable

Hook for get request with pagination

#### Generic Props

| Props                  | Type   | Description                                 |
| ---------------------- | ------ | ------------------------------------------- |
| **service`*`**         | `func` | service                                     |
| **selector`*`**        | `func` | function for select data from response API  |
| **total`*`**           | `func` | function for select total from response API |
| **disabledOnDidMount** | `bool` | disable for first time render               |
| **replaceUrl**         | `bool` | include replace url                         |
| **sort**               | `obj`  | set object for sort in url                  |
| **pagination**         | `obj`  | pagination for data                         |

#### Props

| Props                          | Type       | Description                                   |
| ------------------------------ | ---------- | --------------------------------------------- |
| **loading**                    | `bool`     | loading indication                            |
| **total**                      | `number`   | total                                         |
| **data**                       | `T`        | data                                          |
| **orderBy**                    | `string`   | displays sorting by column                    |
| **order**                      | `asc,desc` | displays sort by                              |
| **query(?key, ?defaultValue)** | `func`     | get all parameters or based on key            |
| **setTotal(value`*`)**         | `func`     | give the total value manually                 |
| **setQuery(value`*`)**         | `func`     | set parameter                                 |
| **onSort(key`*`)**             | `func`     | function to sort by key                       |
| **clear(?{except, only})**     | `func`     | function to clear parameters                  |
| **remove(?key, ?resetPage)**   | `func`     | remove key parameter and reset page to number |
| **reload()**                   | `func`     | reload                                        |
| **isEmpty**                    | `bool`     | get an empty data indication                  |
| **has(key`*`)**                | `bool`     | function to check key parameters              |
| **pagination**                 | `obj`      | ...                                           |

#### Pagination Props

| Props                    | Type       | Description                                     |
| ------------------------ | ---------- | ----------------------------------------------- |
| **page**                 | `number`   | number of page                                  |
| **from**                 | `number`   | ...                                             |
| **to**                   | `number`   | ...                                             |
| **lastPage**             | `number`   | get the page number of the last available page. |
| **perPageOptions**       | `number[]` | get the page size options                       |
| **perPage**              | `number`   | the number of items to be shown per page        |
| **setPage(value`*`)**    | `func`     | set page manual                                 |
| **setPerPage(value`*`)** | `func`     | set size page manual                            |
| **nextButton()**         | `func`     | ...                                             |
| **backButton()**         | `func`     | ...                                             |
| **firstButton()**        | `func`     | ...                                             |
| **lastButton()**         | `func`     | ...                                             |
| **onPerPageChange**      | `func`     | function for size per page                      |
| **text**                 | `string`   | summary                                         |

```javascript
import {useTable} from 'frhooks'
const App = () => {
  const table = useTable({
   ...
    // this option for custom sort
    sort: {
      params: {
        order: "order",
        orderBy: "orderBy",
      },
      order: "desc", // Note: default order, default: desc
      orderBy: "id", // Note: default orderBy, default: id
    },
    // this option for custom pagination
    pagination: {
      params: {
        page: "page",
        perPage: "perPage",
      },
      startPage: 1,// default page, default: 1 or 0
      perPage: 10,// default perPage, default: 10,
      perPageOptions: [5, 10, 15, 25],
      from: (total, page, size, df) => page - 1 + (df === 0 ? 1 : 0)) * size +
      (total === 0 ? 0 : df === 0 ? 1 : df),
      to: (total, page, size, df) =>  Math.min(total, (page + (df === 0 ? 1 : 0)) * size),
      lastPage: (total, size) => Math.max(0, Math.ceil(total / size)), // formula
      disableFirst: (total, page, df) => total !== 0 && page === df,
      disableLast: (total, page, lp) => total !== 0 && page === lp,
    },
  })

  render <div>
      <div>
      <input type="text" value={table.query('title', '')} onChange={e => table.setQuery({title: e.target.value})} />
          {table.pagination.text} //summary

          <button {...table.pagination.firstButton()}>prev</button>
          <button {...table.pagination.backButton()}>prev</button>
          {table.pagination.page}
          <button {...table.pagination.nextButton()}>next</button>
          <button {...table.pagination.lastButton()}>next</button>

        <button onClick={() => table.onOrder("name")}>
            {table.order}-{table.orderBy}
        </button>

        <button onClick={table.clear}>Clear</button>
        <button onClick={table.reload}>Reload</button>
     </div>

      <table>
        <thead>
          <tr>
            <td>No</td>
            <td>Title</td>
          </tr>
        </thead>

        <tbody>
          {table.loading ? 'loading...' : null}

          {table.data.map((v: any, i) => (
            <tr key={i}>
              <td>{table.data.from + (i+1)}</td>
              <td>{v.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>
}
```

#### useFetch & useTable

additional props array data for manipulation data

| Props                                             | Type                              | Description           |
| ------------------------------------------------- | --------------------------------- | --------------------- |
| **add(value`*`, ?position)**                      | `func, position:end,start,number` | add data,             |
| **update(index or (value) => boolean, value`*`)** | `func`                            | update value by index |
| **destroy(index or (value) => boolean)**          | `func`                            | delete data by index  |

#### useSValidation

server validation

#### Generic Props

| Name           | Type      | Description              |
| -------------- | --------- | ------------------------ |
| **service`*`** | `func`    | service.                 |
| **data`*`**    | `object`  | data                     |
| **message`*`** | `ObjFunc` | function for set message |
| **param`*`**   | `obj`     | param field              |

#### Usage

```
//API Response
error: [
    {field: "title", type: "required"},
]

or

error: {
    field: 'title',
    type: 'required
}
```

```javascript
import useSValidation from 'ezhooks/lib/useSValidation';

const App = () => {
    const server = useSValidation({
       service: (event) => {
        fetch("http://example/validation", {method: 'post', body: event.data})
        .then((resp) => resp.json())
        .then((resp) => {
          event.parser(resp.error);
        });
    },
    data: {
        title: "",
    },
    message: {
      required: (resp) => "this field is required",
    },
    param: {
        path: "field",
        type: "type"
    }
    })
    ...
}
```

### Props

#### processing

| Name           | Type   | Description                                     |
| :------------- | :----- | :---------------------------------------------- |
| **processing** | `bool` | gives an indication of the process in progress. |

```javascript
server.processing ? "loading...." : <div>...</div>;
```

#### error(?key)

| Name      | Type   | Description                         |
| :-------- | :----- | :---------------------------------- |
| **error** | `bool` | get indication error by all or key. |

```javascript
...
server.error()
//
server.error('key')
```

#### message(key`*`)

| Name        | Type     | Description |
| :---------- | :------- | :---------- |
| **message** | `string` | get message |

```javascript
...
server.message('key')
```

#### clear()

| Name      | Type   | Description  |
| :-------- | :----- | :----------- |
| **clear** | `func` | clear error. |

```javascript
...
server.clear()
```

#### cancel()

| Name       | Type   | Description             |
| :--------- | :----- | :---------------------- |
| **cancel** | `func` | cancel request pending. |

```javascript
...
server.cancel()
```

#### validate(?option)

| Name         | Type   | Description       |
| :----------- | :----- | :---------------- |
| **validate** | `func` | check validation. |

```javascript
...
server.validate()
//or
server.validate({
    service: (event) => {
         fetch("http://example/validation", {method: 'post', body: event.data})
            .then((resp) => resp.json())
            .then((resp) => {
        event.parser(resp.error);
        });
    }
})
//or
server.validate({
    service: (data) =>  (event) => {
         fetch("http://example/validation", {method: 'post', body:data})
            .then((resp) => resp.json())
            .then((resp) => {
        event.parser(resp.error);
        });
    }
})
```
